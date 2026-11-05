const router = require('express').Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
router.use(requireAuth);

async function getCart(userId) {
  const [rows] = await pool.query(
    `SELECT ci.id AS itemId,ci.quantity,p.id AS productId,p.name,p.price,p.image_url,p.stock,
            (ci.quantity*p.price) AS lineTotal
     FROM cart_items ci JOIN carts c ON c.id=ci.cart_id JOIN products p ON p.id=ci.product_id
     WHERE c.user_id=?`, [userId]);
  return rows;
}
router.get('/', async (req, res, next) => {
  try { const items = await getCart(req.user.id); res.json({ items, subtotal: items.reduce((s,i)=>s+i.lineTotal,0) }); }
  catch(e){next(e);}
});
router.post('/items', async (req,res,next)=>{
  const conn = await pool.getConnection();
  try {
    const { productId, quantity=1 } = req.body;
    if (!Number.isInteger(Number(quantity)) || Number(quantity)<1) return res.status(400).json({message:'Quantity must be at least 1.'});
    await conn.beginTransaction();
    const [p] = await conn.query('SELECT id,stock FROM products WHERE id=? AND active=1 FOR UPDATE',[productId]);
    if (!p.length) { await conn.rollback(); return res.status(404).json({message:'Product not found.'}); }
    if (p[0].stock < quantity) { await conn.rollback(); return res.status(409).json({message:'Not enough stock.'}); }
    const [c] = await conn.query('SELECT id FROM carts WHERE user_id=?',[req.user.id]);
    let cartId = c[0]?.id;
    if (!cartId) { const [r]=await conn.query('INSERT INTO carts(user_id) VALUES(?)',[req.user.id]); cartId=r.insertId; }
    const [old]=await conn.query('SELECT id,quantity FROM cart_items WHERE cart_id=? AND product_id=?',[cartId,productId]);
    if(old.length) await conn.query('UPDATE cart_items SET quantity=? WHERE id=?',[Number(old[0].quantity)+Number(quantity),old[0].id]);
    else await conn.query('INSERT INTO cart_items(cart_id,product_id,quantity) VALUES(?,?,?)',[cartId,productId,quantity]);
    await conn.commit();
    res.status(201).json({items:await getCart(req.user.id)});
  } catch(e){await conn.rollback();next(e);} finally{conn.release();}
});
router.patch('/items/:itemId', async(req,res,next)=>{
  try {
    const q=Number(req.body.quantity);
    if(!Number.isInteger(q)||q<1) return res.status(400).json({message:'Quantity must be at least 1.'});
    const [r]=await pool.query(
      `UPDATE cart_items ci JOIN carts c ON c.id=ci.cart_id JOIN products p ON p.id=ci.product_id
       SET ci.quantity=? WHERE ci.id=? AND c.user_id=? AND p.stock>=?`,
      [q,req.params.itemId,req.user.id,q]);
    if(!r.affectedRows) return res.status(400).json({message:'Item not found or quantity exceeds stock.'});
    res.json({items:await getCart(req.user.id)});
  }catch(e){next(e);}
});
router.delete('/items/:itemId', async(req,res,next)=>{
  try {
    await pool.query('DELETE ci FROM cart_items ci JOIN carts c ON c.id=ci.cart_id WHERE ci.id=? AND c.user_id=?',[req.params.itemId,req.user.id]);
    res.json({items:await getCart(req.user.id)});
  }catch(e){next(e);}
});
module.exports=router;
