const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Planes de suscripción
  const planEsencial = await prisma.plan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'Esencial',
      precioMensual: 4999,
      precioAnual: 49990,
      features: ['Hasta 5 talleres activos', 'Dominio personalizado', 'Encabezado de color'],
    },
  });

  const planProfesional = await prisma.plan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nombre: 'Profesional',
      precioMensual: 9999,
      precioAnual: 99990,
      features: ['Talleres ilimitados', 'Dominio personalizado', 'Encabezado con imagen', 'Reportes exportables'],
    },
  });

  await prisma.plan.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nombre: 'Estudio',
      precioMensual: 19999,
      precioAnual: 199990,
      features: [
        'Talleres ilimitados',
        'Múltiples dominios',
        'Encabezado con imagen',
        'Reportes exportables',
        'Auditoría completa',
      ],
    },
  });

  // Super Admin inicial
  const passwordHash = await bcrypt.hash('admin1234', 10);
  await prisma.superAdmin.upsert({
    where: { email: 'admin@antologico.com' },
    update: {},
    create: {
      nombre: 'Super Admin',
      email: 'admin@antologico.com',
      passwordHash,
    },
  });

  // Profesional de prueba para desarrollo
  await prisma.profesional.upsert({
    where: { email: 'profesional@test.com' },
    update: {},
    create: {
      nombre: 'Ana García',
      email: 'profesional@test.com',
      planId: planProfesional.id,
      estado: 'ACTIVO',
    },
  });

  console.log('Seed completado:', { planEsencial, planProfesional });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
