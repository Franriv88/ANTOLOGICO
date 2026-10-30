#!/usr/bin/env node
/**
 * reset-prod.mjs
 * Borra TODOS los usuarios de Firebase Auth (excepto el super admin) y limpia
 * las tablas SQL de Data Connect (reservas → workshops → dominios → espacios →
 * profesionales → usuarios).
 * También limpia la colección demo_usuarios de Firestore.
 *
 * USO (desde la raíz del repo):
 *   node scripts/reset-prod.mjs
 *
 * REQUISITO: estar autenticado con `firebase login` (ADC),
 * o tener GOOGLE_APPLICATION_CREDENTIALS apuntando a un service account key.
 * firebase-admin se resuelve desde functions/node_modules automáticamente.
 */

import { createRequire } from 'module';
import { fileURLToPath }  from 'url';
import path               from 'path';

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const functionsDir = path.join(__dirname, '..', 'functions');

// Resolver firebase-admin desde functions/node_modules
const requireFromFunctions = createRequire(path.join(functionsDir, 'package.json'));

const PROJECT_ID       = 'antologico';
const SUPERADMIN_EMAIL = 'superadmin@antologico.app';

// ─── Colores ──────────────────────────────────────────────────────────────────
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const cyan   = (s) => `\x1b[36m${s}\x1b[0m`;

// ─── Cargar firebase-admin (v14 modular API) ─────────────────────────────────
let initializeApp, getApps, getAuth, getFirestore;
try {
  ({ initializeApp, getApps } = requireFromFunctions('firebase-admin/app'));
  ({ getAuth }                = requireFromFunctions('firebase-admin/auth'));
  ({ getFirestore }           = requireFromFunctions('firebase-admin/firestore'));
} catch {
  console.error(red('✗ No se encontró firebase-admin en functions/node_modules'));
  console.error('  Corré: cd functions && npm install');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ projectId: PROJECT_ID });
}

const adminAuth = getAuth();
const db        = getFirestore();

// ─── Paso 1: Firebase Auth ────────────────────────────────────────────────────
async function deleteAllAuthUsers() {
  console.log('\n' + bold('1. Firebase Auth — eliminando usuarios...'));
  let pageToken;
  let deleted = 0;
  let skipped = 0;

  do {
    const result = await adminAuth.listUsers(1000, pageToken);
    const toDelete = result.users
      .filter(u => u.email !== SUPERADMIN_EMAIL)
      .map(u => u.uid);

    skipped += result.users.length - toDelete.length;

    if (toDelete.length > 0) {
      const res = await adminAuth.deleteUsers(toDelete);
      deleted += res.successCount;
      res.errors?.forEach(e =>
        console.warn(yellow(`  ⚠ Error eliminando uid[${e.index}]: ${e.error.message}`))
      );
    }

    pageToken = result.pageToken;
  } while (pageToken);

  console.log(green(`  ✓ ${deleted} eliminado(s), ${skipped} omitido(s) (super admin preservado)`));
}

// ─── Paso 2: Firestore demo_usuarios ─────────────────────────────────────────
async function deleteFirestoreUsuarios() {
  console.log('\n' + bold('2. Firestore demo_usuarios — limpiando...'));
  const refs = await db.collection('demo_usuarios').listDocuments();

  if (refs.length === 0) {
    console.log(green('  ✓ Colección ya vacía'));
    return;
  }

  let count = 0;
  for (let i = 0; i < refs.length; i += 500) {
    const batch = db.batch();
    refs.slice(i, i + 500).forEach(ref => batch.delete(ref));
    await batch.commit();
    count += Math.min(500, refs.length - i);
  }
  console.log(green(`  ✓ ${count} documento(s) eliminado(s)`));
}

// ─── Paso 3: SQL (instrucciones manuales) ────────────────────────────────────
function printSQLInstructions() {
  console.log('\n' + bold('3. Cloud SQL — ejecutar manualmente'));
  console.log('');
  console.log('  Abrí Firebase Console → SQL Connect → tu servicio → Editor SQL,');
  console.log('  y ejecutá estas sentencias en orden:');
  console.log('');
  console.log('  ' + cyan('DELETE FROM reservas;'));
  console.log('  ' + cyan('DELETE FROM workshops;'));
  console.log('  ' + cyan('DELETE FROM dominios;'));
  console.log('  ' + cyan('DELETE FROM espacios;'));
  console.log('  ' + cyan('DELETE FROM profesionales;'));
  console.log('  ' + cyan('DELETE FROM usuarios;'));
  console.log('');
  console.log('  (El orden es importante por las foreign keys)');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(bold('\n🗑  Reset de datos — Antológico'));
  console.log(`   Proyecto : ${PROJECT_ID}`);
  console.log(`   Preserva : ${SUPERADMIN_EMAIL}`);
  console.log('');
  console.log(red('   ⚠  Esta acción borra Firebase Auth + Firestore. Es irreversible.'));
  console.log('');

  process.stdout.write('   Escribí "RESET" para confirmar: ');
  const input = await new Promise(resolve => {
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', chunk => resolve(chunk.trim()));
  });

  if (input !== 'RESET') {
    console.log(yellow('\n   Cancelado — no se borró nada.'));
    process.exit(0);
  }

  try {
    await deleteAllAuthUsers();
    await deleteFirestoreUsuarios();
    printSQLInstructions();

    console.log('\n' + green(bold('✓ Auth + Firestore limpiados.')));
    console.log('  Falta ejecutar el SQL de arriba para limpiar la DB relacional.\n');
  } catch (err) {
    console.error(red('\n✗ Error:'), err.message);
    if (err.code === 'app/invalid-credential') {
      console.error(yellow('  → Autenticarte con: firebase login --reauth'));
    }
    process.exit(1);
  }
}

main();
