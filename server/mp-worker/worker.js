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
  const { amount, description, payerEmail, tenantId, externalReference, backUrls } = await request.json();
  const accessToken = await getTenantToken(env, tenantId);

  const prefBody = {
    items: [{ title: description, quantity: 1, unit_price: Number(amount), currency_id: 'ARS' }],
    payer: { email: payerEmail },
  };

  if (externalReference) prefBody.external_reference = externalReference;

  if (backUrls) {
    prefBody.back_urls = {
      success: backUrls.success,
      failure: backUrls.failure,
      pending: backUrls.pending ?? backUrls.failure,
    };
    prefBody.auto_return = 'approved';
  }

  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(prefBody),
  });
  const data = await mpRes.json();
  if (!mpRes.ok) return json({ error: data.message ?? 'Error al crear preferencia' }, 500);
  return json({ preferenceId: data.id, initPoint: data.init_point, sandboxInitPoint: data.sandbox_init_point });
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

// ── Suscripciones recurrentes (Preapproval) ─────────────────────────────────

async function crearSuscripcion(request, env) {
  const { reason, amount, frequency, frequencyType, payerEmail, externalReference, backUrl } = await request.json();
  const accessToken = env.MP_ACCESS_TOKEN;

  const body = {
    reason,
    external_reference: externalReference,
    payer_email: payerEmail,
    auto_recurring: {
      frequency:          Number(frequency),
      frequency_type:     frequencyType || 'months',
      transaction_amount: Number(amount),
      currency_id:        'ARS',
    },
    back_url: backUrl,
    status:   'pending',
  };

  const mpRes = await fetch('https://api.mercadopago.com/preapproval', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await mpRes.json();
  if (!mpRes.ok) {
    console.error('MP /preapproval error', mpRes.status, JSON.stringify(data));
    return json({ error: data.message ?? 'Error al crear suscripción' }, 500);
  }

  if (data.id && externalReference) {
    await env.MP_TENANTS.put(`sub:${data.id}`, JSON.stringify({
      externalReference,
      status: data.status,
      createdAt: new Date().toISOString(),
    }));
  }

  return json({
    preapprovalId: data.id,
    initPoint:     data.init_point,
    status:        data.status,
  });
}

async function verificarSuscripcion(request, env) {
  const { searchParams } = new URL(request.url);
  const preapprovalId = searchParams.get('preapprovalId');
  if (!preapprovalId) return json({ error: 'Missing preapprovalId' }, 400);

  const accessToken = env.MP_ACCESS_TOKEN;
  const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  const data = await mpRes.json();
  if (!mpRes.ok) return json({ error: data.message ?? 'Error al verificar suscripción' }, 500);

  return json({
    preapprovalId: data.id,
    status:        data.status,
    payerEmail:    data.payer_email,
    reason:        data.reason,
    externalReference: data.external_reference,
    nextPaymentDate:   data.next_payment_date,
  });
}

async function webhookHandler(request, env) {
  const body = await request.json();
  console.log('Webhook received', JSON.stringify(body));

  if (body.type === 'subscription_preapproval' && body.data?.id) {
    const accessToken = env.MP_ACCESS_TOKEN;
    const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${body.data.id}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (mpRes.ok) {
      const sub = await mpRes.json();
      await env.MP_TENANTS.put(`sub:${sub.id}`, JSON.stringify({
        externalReference: sub.external_reference,
        status:            sub.status,
        payerEmail:        sub.payer_email,
        nextPaymentDate:   sub.next_payment_date,
        updatedAt:         new Date().toISOString(),
      }));
      console.log(`Subscription ${sub.id} updated to ${sub.status}`);
    }
  }

  return new Response('OK', { status: 200 });
}

// ── Debug ────────────────────────────────────────────────────────────────────

async function debugCredentials(request, env) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  const tenantData = tenantId
    ? await env.MP_TENANTS.get(`tenant:${tenantId}`, 'json')
    : null;

  const accessToken = tenantData?.accessToken ?? env.MP_ACCESS_TOKEN;
  const source = tenantData?.accessToken ? 'OAUTH_KV' : 'ENV';

  let mpUserInfo = null;
  try {
    const meRes = await fetch('https://api.mercadopago.com/users/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const me = await meRes.json();
    mpUserInfo = meRes.ok
      ? { id: me.id, nickname: me.nickname, site_id: me.site_id, tags: me.tags, status: me.status }
      : { error: me.message };
  } catch (e) {
    mpUserInfo = { error: e.message };
  }

  let testPaymentResult = null;
  try {
    const testRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ title: 'Debug test', quantity: 1, unit_price: 100, currency_id: 'ARS' }],
        payer: { email: 'test_debug@testuser.com' },
      }),
    });
    const testData = await testRes.json();
    testPaymentResult = testRes.ok
      ? { ok: true, sandbox_init_point: testData.sandbox_init_point ? 'present' : 'absent', init_point: testData.init_point ? 'present' : 'absent' }
      : { ok: false, error: testData.message, status: testRes.status };
  } catch (e) {
    testPaymentResult = { error: e.message };
  }

  const tokenPrefix = accessToken?.substring(0, 20) + '...';
  const isTestToken = accessToken?.startsWith('TEST-');
  const isAppToken  = accessToken?.startsWith('APP_USR-');

  return json({
    tenantId,
    tokenSource: source,
    hasOAuthInKV: !!tenantData,
    oauthConnectedAt: tenantData?.connectedAt ?? null,
    mpUser: mpUserInfo,
    tokenAnalysis: { prefix: tokenPrefix, isTestPrefix: isTestToken, isAppUsrPrefix: isAppToken },
    testPreference: testPaymentResult,
    envTokenPrefix: env.MP_ACCESS_TOKEN?.substring(0, 15) + '...',
  });
}

// ── Router ────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const { pathname } = new URL(request.url);

    // GET routes
    if (request.method === 'GET') {
      if (pathname === '/oauth/connect')        return oauthConnect(request, env);
      if (pathname === '/oauth/callback')       return oauthCallback(request, env);
      if (pathname === '/tenant-mp-config')     return getTenantMpConfig(request, env);
      if (pathname === '/suscripcion-status')   return verificarSuscripcion(request, env);
      if (pathname === '/debug')                return debugCredentials(request, env);
    }

    // POST routes
    if (request.method === 'POST') {
      if (pathname === '/crear-preferencia')    return crearPreferencia(request, env);
      if (pathname === '/crear-suscripcion')    return crearSuscripcion(request, env);
      if (pathname === '/procesar-pago')        return procesarPago(request, env);
      if (pathname === '/tenant-mp-disconnect') return desconectarTenant(request, env);
      if (pathname === '/webhook')              return webhookHandler(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};
