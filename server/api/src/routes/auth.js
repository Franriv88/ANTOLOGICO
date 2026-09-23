const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { generateToken, requireSuperAdmin } = require('../middleware/auth');
const prisma = require('../lib/prisma');

const router = Router();

// ─── Dev: login sin Google OAuth (solo development) ──────────────────────────
if (process.env.NODE_ENV !== 'production') {
  router.post('/dev/tenant', async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'email requerido' });

      const profesional = await prisma.profesional.findUnique({ where: { email } });
      if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado. Ejecutá pnpm db:seed.' });

      const token = generateToken({ id: profesional.id, role: 'tenant', email: profesional.email });
      res.json({ token, profesional: { id: profesional.id, nombre: profesional.nombre, email: profesional.email } });
    } catch (e) {
      next(e);
    }
  });
}

// ─── Super Admin: login con email + password ──────────────────────────────────
router.post('/superadmin/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email y password requeridos' });

    const admin = await prisma.superAdmin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = generateToken({ id: admin.id, role: 'superadmin', email: admin.email });
    res.json({ token, admin: { id: admin.id, nombre: admin.nombre, email: admin.email } });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
