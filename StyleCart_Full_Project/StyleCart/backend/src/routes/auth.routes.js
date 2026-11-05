const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

function tokenFor(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8)
      return res.status(400).json({ message: 'Name, valid email and password (at least 8 characters) are required.' });
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length) return res.status(409).json({ message: 'Email is already registered.' });
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (name,email,password_hash) VALUES (?,?,?)',
      [name.trim(), email.toLowerCase(), hash]
    );
    const user = { id: result.insertId, name: name.trim(), email: email.toLowerCase(), role: 'customer' };
    res.status(201).json({ token: tokenFor(user), user });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [(email || '').toLowerCase()]);
    if (!rows.length || !(await bcrypt.compare(password || '', rows[0].password_hash)))
      return res.status(401).json({ message: 'Incorrect email or password.' });
    const u = rows[0];
    const user = { id: u.id, name: u.name, email: u.email, role: u.role };
    res.json({ token: tokenFor(user), user });
  } catch (e) { next(e); }
});
module.exports = router;
