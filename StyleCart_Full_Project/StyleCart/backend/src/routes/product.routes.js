const router = require('express').Router();
const pool = require('../config/db');
router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let sql = `SELECT p.id,p.name,p.description,p.price,p.image_url,p.stock,c.name AS category
               FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.active=1`;
    const params = [];
    if (search) { sql += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (category) { sql += ' AND c.slug=?'; params.push(category); }
    sql += ' ORDER BY p.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id,p.name,p.description,p.price,p.image_url,p.stock,c.name AS category
       FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.id=? AND p.active=1`,
      [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found.' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});
module.exports = router;
