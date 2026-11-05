const router = require('express').Router();
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
router.use(requireAuth, requireAdmin);
router.get('/orders', async (_req,res,next)=>{
  try{
    const [rows]=await pool.query(
      `SELECT o.id,o.total_amount,o.status,o.created_at,u.name,u.email
       FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC`);
    res.json(rows);
  }catch(e){next(e);}
});
module.exports=router;
