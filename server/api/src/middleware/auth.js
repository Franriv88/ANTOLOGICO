const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requireSuperAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Acceso restringido' });
    }
    next();
  });
}

function requireTenant(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'tenant') {
      return res.status(403).json({ error: 'Acceso restringido' });
    }
    next();
  });
}

function requireUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'user') {
      return res.status(403).json({ error: 'Acceso restringido' });
    }
    next();
  });
}

module.exports = { generateToken, verifyToken, requireSuperAdmin, requireTenant, requireUser };
