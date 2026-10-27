// Runtime: Node 22 · firebase-functions v7 · firebase-admin v14 (upgrade 2026-10-28)
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

const smtpPass    = defineSecret('SMTP_PASS');
const vercelToken = defineSecret('VERCEL_TOKEN');
const SMTP_USER = 'frivasv2388@gmail.com';
const VERCEL_PROJECT_ID = 'prj_AvXKwQeIypelwMX7lSYtZ95zP1F9';
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 587;
const LOGO_URL  = 'https://www.antologico.app/logo-antologico.png';
const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutos
const COLLECTION = 'verification_codes';

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: { user: SMTP_USER, pass: smtpPass.value() },
  });
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function buildBookingEmailHtml({ tenantName, clientName, workshopName, clientEmail, clientPhone, metodoPago, cantidad, fecha }) {
  const metodoLabel = metodoPago === 'MERCADO_PAGO' ? 'Mercado Pago' : 'Efectivo';
  const cuposText = cantidad > 1 ? `${cantidad} cupos` : '1 cupo';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #E5DDD0;overflow:hidden;">
        <tr><td style="background:#E85D4A;padding:16px 32px;text-align:center;">
          <img src="${LOGO_URL}" alt="Antológico" width="260" style="display:block;margin:0 auto;max-width:100%;height:auto;" />
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:16px;color:#2C2416;">Hola${tenantName ? ` ${tenantName}` : ''},</p>
          <p style="margin:0 0 20px;font-size:14px;color:#6B5D4D;line-height:1.5;">
            ¡Tenés una nueva reserva! Acá están los detalles:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;border-radius:8px;border:1px solid #E5DDD0;overflow:hidden;">
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #E5DDD0;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#9C8E7A;">Taller</span><br/>
                <span style="font-size:14px;font-weight:600;color:#2C2416;">${workshopName}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #E5DDD0;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#9C8E7A;">Cliente</span><br/>
                <span style="font-size:14px;font-weight:600;color:#2C2416;">${clientName}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #E5DDD0;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#9C8E7A;">Email</span><br/>
                <a href="mailto:${clientEmail}" style="font-size:14px;color:#E85D4A;text-decoration:none;">${clientEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #E5DDD0;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#9C8E7A;">Teléfono</span><br/>
                <span style="font-size:14px;color:#2C2416;">${clientPhone || '—'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #E5DDD0;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#9C8E7A;">Cupos</span><br/>
                <span style="font-size:14px;font-weight:600;color:#2C2416;">${cuposText}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #E5DDD0;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#9C8E7A;">Método de pago</span><br/>
                <span style="font-size:14px;color:#2C2416;">${metodoLabel}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#9C8E7A;">Fecha de reserva</span><br/>
                <span style="font-size:14px;color:#2C2416;">${fecha}</span>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-size:12px;color:#9C8E7A;line-height:1.5;">
            Podés ver todas tus reservas desde tu panel en Antológico.
          </p>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #E5DDD0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9C8E7A;">© ${new Date().getFullYear()} Antológico · Hecho en Argentina</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmailHtml(code, name) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:40px 20px;">
    <tr><td align="center">
      <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #E5DDD0;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:#E85D4A;padding:16px 32px;text-align:center;">
          <img src="${LOGO_URL}" alt="Antológico" width="260" style="display:block;margin:0 auto;max-width:100%;height:auto;" />
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:16px;color:#2C2416;">Hola${name ? ` ${name}` : ''},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#6B5D4D;line-height:1.5;">
            Usá este código para verificar tu dirección de email. El código expira en 10 minutos.
          </p>
          <!-- Code -->
          <div style="background:#FAF7F2;border:2px dashed #E5DDD0;border-radius:8px;padding:20px;text-align:center;margin:0 0 24px;">
            <span style="font-family:'Courier New',monospace;font-size:36px;font-weight:700;color:#E85D4A;letter-spacing:8px;">${code}</span>
          </div>
          <p style="margin:0;font-size:12px;color:#9C8E7A;line-height:1.5;">
            Si no solicitaste este código, podés ignorar este email.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 32px;border-top:1px solid #E5DDD0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9C8E7A;">© ${new Date().getFullYear()} Antológico · Hecho en Argentina</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Enviar código de verificación ────────────────────────────────────────────
exports.sendVerificationCode = onCall(
  { secrets: [smtpPass], region: 'us-central1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debés estar autenticado.');
    }

    const uid = request.auth.uid;
    const user = await admin.auth().getUser(uid);

    if (user.emailVerified) {
      throw new HttpsError('already-exists', 'El email ya está verificado.');
    }

    const existing = await db.collection(COLLECTION).doc(uid).get();
    if (existing.exists) {
      const data = existing.data();
      const elapsed = Date.now() - data.createdAt;
      if (elapsed < 60000) {
        throw new HttpsError(
          'resource-exhausted',
          'Esperá un minuto antes de solicitar otro código.'
        );
      }
    }

    const code = generateCode();

    await db.collection(COLLECTION).doc(uid).set({
      code,
      email: user.email,
      createdAt: Date.now(),
      attempts: 0,
    });

    await createTransporter().sendMail({
      from: `"Antológico" <${SMTP_USER}>`,
      to: user.email,
      subject: 'Tu código de verificación — Antológico',
      html: buildEmailHtml(code, user.displayName),
    });

    return { success: true };
  }
);

// ── Verificar código ────────────────────────────────────────────────────────
exports.verifyCode = onCall(
  { region: 'us-central1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debés estar autenticado.');
    }

    const { code } = request.data || {};
    if (!code || typeof code !== 'string' || code.length !== 6) {
      throw new HttpsError('invalid-argument', 'Código inválido.');
    }

    const uid = request.auth.uid;
    const ref = db.collection(COLLECTION).doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new HttpsError('not-found', 'No hay código pendiente. Solicitá uno nuevo.');
    }

    const data = snap.data();

    if (Date.now() - data.createdAt > CODE_EXPIRY_MS) {
      await ref.delete();
      throw new HttpsError('deadline-exceeded', 'El código expiró. Solicitá uno nuevo.');
    }

    if (data.attempts >= 5) {
      await ref.delete();
      throw new HttpsError('resource-exhausted', 'Demasiados intentos. Solicitá un código nuevo.');
    }

    if (data.code !== code) {
      await ref.update({ attempts: admin.firestore.FieldValue.increment(1) });
      throw new HttpsError('permission-denied', 'Código incorrecto.');
    }

    await admin.auth().updateUser(uid, { emailVerified: true });
    await ref.delete();

    return { success: true, verified: true };
  }
);

// ── Reenviar código ─────────────────────────────────────────────────────────
exports.resendVerificationCode = onCall(
  { secrets: [smtpPass], region: 'us-central1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debés estar autenticado.');
    }

    const uid = request.auth.uid;
    const ref = db.collection(COLLECTION).doc(uid);
    await ref.delete().catch(() => {});

    const user = await admin.auth().getUser(uid);
    if (user.emailVerified) {
      throw new HttpsError('already-exists', 'El email ya está verificado.');
    }

    const code = generateCode();

    await ref.set({
      code,
      email: user.email,
      createdAt: Date.now(),
      attempts: 0,
    });

    await createTransporter().sendMail({
      from: `"Antológico" <${SMTP_USER}>`,
      to: user.email,
      subject: 'Tu código de verificación — Antológico',
      html: buildEmailHtml(code, user.displayName),
    });

    return { success: true };
  }
);

// ── Super Admin: generar custom token para entrar al Panel Tenant ───────────
// El super admin apreta "Abrir Panel Tenant" en Mi Espacio y necesita loguearse
// en antologico.app con su mismo uid, sin tener que escribir contraseña.
// Esta funcion verifica que sea super admin y le devuelve un custom token de
// Firebase Auth que el frontend consume via signInWithCustomToken.
exports.createTenantSessionToken = onCall(
  { region: 'us-central1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debés estar autenticado.');
    }
    const uid = request.auth.uid;
    const adminSnap = await db.collection('sa_admins').doc(uid).get();
    if (!adminSnap.exists) {
      throw new HttpsError('permission-denied', 'Solo super admins pueden hacer esto.');
    }
    // Marcamos la cuenta como verificada (es un super admin confirmado) para
    // que al entrar al Panel Tenant AuthContext cree su documento profesional.
    try {
      const u = await admin.auth().getUser(uid);
      if (!u.emailVerified) {
        await admin.auth().updateUser(uid, { emailVerified: true });
      }
    } catch (e) {
      console.warn('createTenantSessionToken: no se pudo marcar emailVerified', e);
    }
    try {
      const token = await admin.auth().createCustomToken(uid);
      return { token };
    } catch (err) {
      console.error('createTenantSessionToken createCustomToken error', err);
      throw new HttpsError('internal', err.message || 'No se pudo generar el token.');
    }
  }
);

// ── Super Admin: eliminar cuenta de Firebase Auth de un tenant ──────────────
// Llamada desde el panel de Super Admin cuando elimina un tenant. Verifica que
// quien llama sea super admin (existe en sa_admins) y luego borra la cuenta
// Firebase Auth del uid indicado, liberando el email para re-registro.
exports.deleteTenantAuth = onCall(
  { region: 'us-central1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debés estar autenticado.');
    }

    const callerUid = request.auth.uid;
    const adminSnap = await db.collection('sa_admins').doc(callerUid).get();
    if (!adminSnap.exists) {
      throw new HttpsError('permission-denied', 'Solo super admins pueden hacer esto.');
    }

    const { uid } = request.data || {};
    if (!uid || typeof uid !== 'string') {
      throw new HttpsError('invalid-argument', 'Falta el uid del tenant.');
    }

    try {
      await admin.auth().deleteUser(uid);
      return { success: true };
    } catch (err) {
      if (err && err.code === 'auth/user-not-found') {
        // Ya no estaba en Auth: lo tomamos como éxito.
        return { success: true, alreadyGone: true };
      }
      console.error('deleteTenantAuth error', uid, err);
      throw new HttpsError('internal', err.message || 'No se pudo eliminar la cuenta.');
    }
  }
);

// ── Limpieza automática de cuentas no verificadas ───────────────────────────
// Corre cada 6 horas y elimina cuentas de Firebase Auth creadas hace más de 24h
// que todavía no verificaron el email. Esto evita acumular "basura" cuando el
// usuario abandona el flujo de registro sin confirmar.
const UNVERIFIED_TTL_MS = 24 * 60 * 60 * 1000;

exports.purgeUnverifiedUsers = onSchedule(
  { schedule: 'every 6 hours', region: 'us-central1', timeoutSeconds: 540 },
  async () => {
    const now = Date.now();
    let deleted = 0;
    let scanned = 0;
    let pageToken;
    do {
      const page = await admin.auth().listUsers(1000, pageToken);
      pageToken = page.pageToken;
      for (const user of page.users) {
        scanned++;
        if (user.emailVerified) continue;
        // Google/Apple vienen con emailVerified=true por defecto, por eso
        // los que llegan acá son solo cuentas email+password abandonadas.
        const createdAt = Date.parse(user.metadata.creationTime);
        if (!Number.isFinite(createdAt)) continue;
        if (now - createdAt < UNVERIFIED_TTL_MS) continue;
        try {
          await admin.auth().deleteUser(user.uid);
          await db.collection(COLLECTION).doc(user.uid).delete().catch(() => {});
          deleted++;
        } catch (e) {
          console.error('purgeUnverifiedUsers deleteUser error', user.uid, e);
        }
      }
    } while (pageToken);
    console.log(`purgeUnverifiedUsers: scanned=${scanned} deleted=${deleted}`);
  }
);

// ── Notificar al tenant cuando recibe una reserva ───────────────────────────
exports.notifyTenantNewBooking = onCall(
  { secrets: [smtpPass], region: 'us-central1' },
  async (request) => {
    const { espacioId, workshopName, clientName, clientEmail, clientPhone, metodoPago, cantidad } = request.data || {};
    console.log('notifyTenantNewBooking called', { espacioId, workshopName, clientName, clientEmail, metodoPago, cantidad });

    if (!espacioId || !workshopName || !clientName || !clientEmail) {
      console.error('Missing required fields');
      throw new HttpsError('invalid-argument', 'Faltan datos de la reserva.');
    }

    const espSnap = await db.collection('demo_espacios').doc(espacioId).get();
    console.log('espacio exists:', espSnap.exists, 'id:', espacioId);
    if (!espSnap.exists) {
      throw new HttpsError('not-found', 'Espacio no encontrado.');
    }

    const espacio = espSnap.data();
    const tenantUid = espacio.userId;
    console.log('tenantUid:', tenantUid);
    if (!tenantUid) {
      throw new HttpsError('not-found', 'El espacio no tiene dueño asignado.');
    }

    let tenantEmail;
    let tenantName;
    try {
      const tenantUser = await admin.auth().getUser(tenantUid);
      tenantEmail = tenantUser.email;
      tenantName = tenantUser.displayName;
      console.log('tenant email:', tenantEmail);
    } catch (err) {
      console.error('Failed to get tenant user:', err.message);
      throw new HttpsError('not-found', 'No se pudo obtener el email del tenant.');
    }

    const now = new Date();
    const fecha = now.toLocaleDateString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    try {
      await createTransporter().sendMail({
        from: `"Antológico" <${SMTP_USER}>`,
        to: tenantEmail,
        subject: `Nueva reserva: ${clientName} — ${workshopName}`,
        html: buildBookingEmailHtml({
          tenantName,
          clientName,
          workshopName,
          clientEmail,
          clientPhone: clientPhone || '',
          metodoPago: metodoPago || 'EFECTIVO',
          cantidad: cantidad || 1,
          fecha,
        }),
      });
      console.log('Email sent successfully to', tenantEmail);
    } catch (err) {
      console.error('Failed to send email:', err.message);
      throw new HttpsError('internal', 'Error al enviar el email.');
    }

    return { success: true };
  }
);

// ── Registrar/eliminar subdominio en Vercel ────────────────────────────────
exports.registerSubdomain = onCall(
  { secrets: [vercelToken], region: 'us-central1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debés estar autenticado.');
    }

    const { slug, oldSlug } = request.data || {};
    if (!slug || typeof slug !== 'string') {
      throw new HttpsError('invalid-argument', 'Slug inválido.');
    }

    const headers = {
      Authorization: `Bearer ${vercelToken.value()}`,
      'Content-Type': 'application/json',
    };

    if (oldSlug && oldSlug !== slug) {
      try {
        await fetch(
          `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${oldSlug}.antologico.app`,
          { method: 'DELETE', headers }
        );
      } catch (err) {
        console.warn('Failed to remove old subdomain:', err.message);
      }
    }

    const domain = `${slug}.antologico.app`;
    const res = await fetch(
      `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`,
      { method: 'POST', headers, body: JSON.stringify({ name: domain }) }
    );

    const body = await res.json();
    if (!res.ok && body.error?.code !== 'domain_already_exists') {
      console.error('Vercel API error:', body);
      throw new HttpsError('internal', 'No se pudo registrar el subdominio.');
    }

    return { success: true, domain };
  }
);
