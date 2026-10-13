const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

async function crearPreferencia(request, env) {
  const { amount, description, payerEmail } = await request.json();
  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
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

async function procesarPago(request, env) {
  const body = await request.json();
  const { token, paymentMethodId, issuerId, installments, transactionAmount, description, payer } = body;

  const paymentData = {
    transaction_amount: Number(transactionAmount),
    description,
    payment_method_id: paymentMethodId,
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
      'Authorization': `Bearer ${env.MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify(paymentData),
  });
  const data = await mpRes.json();
  return json(data);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const { pathname } = new URL(request.url);
    if (pathname === '/crear-preferencia') return crearPreferencia(request, env);
    if (pathname === '/procesar-pago')     return procesarPago(request, env);

    return new Response('Not found', { status: 404 });
  },
};
