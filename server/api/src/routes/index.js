const { Router } = require('express');

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

router.use('/auth',      require('./auth'));
router.use('/workshops', require('./workshops'));
// router.use('/reservas', require('./reservas'));
// router.use('/admin',    require('./admin'));

module.exports = router;
