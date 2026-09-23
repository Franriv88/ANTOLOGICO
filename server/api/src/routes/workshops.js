const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { requireTenant } = require('../middleware/auth');
const { getSlotStatus } = require('../lib/slotStatus');

const router = Router();

const validate = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido').isLength({ max: 200 }),
  body('cuposTotales').isInt({ min: 1 }).withMessage('Los cupos deben ser un entero mayor a 0'),
  body('precio').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('fecha').isISO8601().withMessage('Fecha inválida'),
];

function withStatus(w) {
  return { ...w, slotStatus: getSlotStatus(w.cuposDisponibles, w.cuposTotales) };
}

// GET /api/workshops
router.get('/', requireTenant, async (req, res, next) => {
  try {
    const { estado, q } = req.query;
    const workshops = await prisma.workshop.findMany({
      where: {
        profesionalId: req.user.id,
        ...(estado ? { estado } : {}),
        ...(q ? { nombre: { contains: q } } : {}),
      },
      orderBy: { fecha: 'asc' },
    });
    res.json(workshops.map(withStatus));
  } catch (e) {
    next(e);
  }
});

// POST /api/workshops
router.post('/', requireTenant, validate, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { nombre, categoria, descripcion, cuposTotales, precio, fecha, headerType, headerValue, estado } = req.body;
    const cupos = parseInt(cuposTotales);

    const workshop = await prisma.workshop.create({
      data: {
        profesionalId: req.user.id,
        nombre,
        categoria: categoria || null,
        descripcion: descripcion || null,
        cuposTotales: cupos,
        cuposDisponibles: cupos,
        precio: parseFloat(precio),
        fecha: new Date(fecha),
        headerType: headerType || 'COLOR',
        headerValue: headerValue || null,
        estado: estado || 'BORRADOR',
      },
    });
    res.status(201).json(withStatus(workshop));
  } catch (e) {
    next(e);
  }
});

// GET /api/workshops/:id
router.get('/:id', requireTenant, async (req, res, next) => {
  try {
    const workshop = await prisma.workshop.findFirst({
      where: { id: parseInt(req.params.id), profesionalId: req.user.id },
    });
    if (!workshop) return res.status(404).json({ error: 'Taller no encontrado' });
    res.json(withStatus(workshop));
  } catch (e) {
    next(e);
  }
});

// PUT /api/workshops/:id
router.put('/:id', requireTenant, validate, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const existing = await prisma.workshop.findFirst({
      where: { id: parseInt(req.params.id), profesionalId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'Taller no encontrado' });

    const { nombre, categoria, descripcion, cuposTotales, precio, fecha, headerType, headerValue, estado } = req.body;
    const nuevoTotal = parseInt(cuposTotales);
    const reservados = existing.cuposTotales - existing.cuposDisponibles;
    const nuevosDisponibles = Math.max(0, nuevoTotal - reservados);

    const workshop = await prisma.workshop.update({
      where: { id: parseInt(req.params.id) },
      data: {
        nombre,
        categoria: categoria || null,
        descripcion: descripcion || null,
        cuposTotales: nuevoTotal,
        cuposDisponibles: nuevosDisponibles,
        precio: parseFloat(precio),
        fecha: new Date(fecha),
        headerType: headerType || existing.headerType,
        headerValue: headerValue ?? existing.headerValue,
        estado: estado || existing.estado,
      },
    });
    res.json(withStatus(workshop));
  } catch (e) {
    next(e);
  }
});

// DELETE /api/workshops/:id
router.delete('/:id', requireTenant, async (req, res, next) => {
  try {
    const existing = await prisma.workshop.findFirst({
      where: { id: parseInt(req.params.id), profesionalId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'Taller no encontrado' });

    await prisma.workshop.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
