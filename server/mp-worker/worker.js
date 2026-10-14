const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const REDIRECT_URI = 'https://antologico-mp.franriv2388.workers.dev/oauth/callback';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getTenantToken(env, tenantId) {
  if (!tenantId) return env.MP_ACCESS_TOKEN;
  const data = await env.MP_TENANTS.get(`tenant:${tenantId}`, 'json');
  return data?.accessToken ?? env.MP_ACCESS_TOKEN;
}

// ── OAuth ─────────────────────────────────────────────────────────────────────

function oauthConnect(request, env) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  if (!tenantId) return new Response('Missing tenantId', { status: 400 });

  const authUrl = new URL('https://auth.mercadopago.com/authorization');
  authUrl.searchParams.set('client_id',     env.MP_APP_ID);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('platform_id',   'mp');
  authUrl.searchParams.set('redirect_uri',  REDIRECT_URI);
  authUrl.searchParams.set('state',         tenantId);

  return Response.redirect(authUrl.toString(), 302);
}

async function oauthCallback(request, env) {
  const { searchParams } = new URL(request.url);
  const code     = searchParams.get('code');
  const tenantId = searchParams.get('state');
  const errorUrl = `${env.TENANT_APP_URL}/config?mp=error`;

  if (!code || !tenantId) return Response.redirect(errorUrl, 302);

  const tokenRes = await fetch('https://api.mercadopago.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_secret: env.MP_CLIENT_SECRET,
      client_id:     env.MP_APP_ID,
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    console.error('OAuth token exchange failed', JSON.stringify(tokenData));
    const detail = encodeURIComponent(tokenData.message || tokenData.error || tokenData.error_description || JSON.stringify(tokenData));
    return Response.redirect(`${errorUrl}&detail=${detail}`, 302);
  }

  await env.MP_TENANTS.put(`tenant:${tenantId}`, JSON.stringify({
    accessToken: tokenData.access_token,
    publicKey:   tokenData.public_key,
    userId:      tokenData.user_id,
    connectedAt: new Date().toISOString(),
  }));

  return Response.redirect(`${env.TENANT_APP_URL}/config?mp=connected`, 302);
}

async function getTenantMpConfig(request, env) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  if (!tenantId) return json({ connected: false });
  const data = await env.MP_TENANTS.get(`tenant:${tenantId}`, 'json');
  return json({ connected: !!data, publicKey: data?.publicKey ?? null });
}

// ── Pagos ─────────────────────────────────────────────────────────────────────

async function crearPreferencia(request, env) {
  const { amount, description, payerEmail, tenantId } = await request.json();
  const accessToken = await getTenantToken(env, tenantId);

  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      items: [{ title: description, quantity: 1, unit_price: Number(amount), currency_id: 'ARS' }],
      payer: { email: payerEmail },
    }),
  });
  const data = await mpRes.json();
  if (!mpRes.ok) return json({ error: data.message ?? 'Error al crear preferencia' }, 500);
  return json({ preferenceId: data.id });
}

async function desconectarTenant(request, env) {
  const { tenantId } = await request.json();
  if (!tenantId) return json({ error: 'Missing tenantId' }, 400);
  await env.MP_TENANTS.delete(`tenant:${tenantId}`);
  return json({ ok: true });
}

async function procesarPago(request, env) {
  const body = await request.json();
  const { token, paymentMethodId, issuerId, installments, transactionAmount, description, payer, tenantId } = body;
  const accessToken = await getTenantToken(env, tenantId);

  const paymentData = {
    transaction_amount: Number(transactionAmount),
    description,
    payment_method_id:  paymentMethodId,
    payer: { email: payer.email, identification: payer.identification },
  };

  if (token) {
    paymentData.token        = token;
    paymentData.installments = Number(installments ?? 1);
    if (issuerId) paymentData.issuer_id = Number(issuerId);
  }

  const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Authorization':    `Bearer ${accessToken}`,
      'Content-Type':     'application/json',
      'X-Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify(paymentData),
  });
  const data = await mpRes.json();
  if (!mpRes.ok) console.error('MP /v1/payments error', mpRes.status, JSON.stringify(data));
  return json(data);
}

// ── Router ────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const { pathname } = new URL(request.url);

    // GET routes
    if (request.method === 'GET') {
      if (pathname === '/oauth/connect')     return oauthConnect(request, env);
      if (pathname === '/oauth/callback')    return oauthCallback(request, env);
      if (pathname === '/tenant-mp-config')  return getTenantMpConfig(request, env);
    }

    // POST routes
    if (request.method === 'POST') {
      if (pathname === '/crear-preferencia')    return crearPreferencia(request, env);
      if (pathname === '/procesar-pago')        return procesarPago(request, env);
      if (pathname === '/tenant-mp-disconnect') return desconectarTenant(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};
