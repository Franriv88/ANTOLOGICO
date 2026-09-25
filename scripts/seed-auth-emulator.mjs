/**
 * Seeds the Firebase Auth emulator with a fixed-UID dev user.
 * Run with: pnpm seed
 *
 * The dev user always gets UID "dev-antologico-001" so that the
 * DataConnect (pglite) records linked to profesionalUid are stable
 * across emulator restarts.
 */

const PROJECT_ID  = 'antologico';
const AUTH_BASE   = 'http://127.0.0.1:9099';
const DEV_UID     = 'dev-antologico-001';
const DEV_EMAIL   = 'dev@antologico.app';
const DEV_PASS    = 'dev123456';
const DEV_NAME    = 'Dev User';

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForEmulator(retries = 30) {
  process.stdout.write('Waiting for Auth emulator');
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${AUTH_BASE}/`);
      if (res.status < 500) { process.stdout.write(' ✓\n'); return; }
    } catch {}
    process.stdout.write('.');
    await wait(1000);
  }
  throw new Error('\nAuth emulator not reachable at ' + AUTH_BASE);
}

async function getUserByEmail(email) {
  const res = await fetch(
    `${AUTH_BASE}/emulator/v1/projects/${PROJECT_ID}/accounts`,
    { headers: { Authorization: 'Bearer owner' } }
  );
  if (!res.ok) return null;
  const body = await res.json();
  return body.users?.find(u => u.email === email) ?? null;
}

async function createOrUpdateUser() {
  await waitForEmulator();

  const existing = await getUserByEmail(DEV_EMAIL);

  if (existing) {
    if (existing.localId === DEV_UID) {
      console.log(`Dev user already exists with correct UID (${DEV_UID}) ✓`);
      return;
    }
    // Wrong UID — delete and recreate with fixed UID
    console.log(`Dev user exists but with wrong UID (${existing.localId}) — recreating…`);
    await fetch(
      `${AUTH_BASE}/emulator/v1/projects/${PROJECT_ID}/accounts/${existing.localId}`,
      { method: 'DELETE', headers: { Authorization: 'Bearer owner' } }
    );
  }

  const res = await fetch(
    `${AUTH_BASE}/identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer owner',
      },
      body: JSON.stringify({
        localId:       DEV_UID,
        email:         DEV_EMAIL,
        rawPassword:   DEV_PASS,
        displayName:   DEV_NAME,
        emailVerified: true,
      }),
    }
  );

  if (res.ok) {
    console.log(`Dev user created → UID: ${DEV_UID} | ${DEV_EMAIL} / ${DEV_PASS} ✓`);
  } else {
    const body = await res.text();
    throw new Error(`Failed to create dev user: ${body}`);
  }
}

createOrUpdateUser().catch(e => { console.error(e.message); process.exit(1); });
