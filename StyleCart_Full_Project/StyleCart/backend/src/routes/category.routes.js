const router = require('express').Router();
const pool = require('../config/db');
router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id,name,slug FROM categories ORDER BY name');
    res.json(rows);
  } catch (e) { next(e); }
});
module.exports = router;
