const router = require('express').Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
router.use(requireAuth);

router.post('/', async(req,res,next)=>{
  const conn=await pool.getConnection();
  try{
    const { address, phone, paymentMethod='COD' }=req.body;
    if(!address?.trim()||!phone?.trim()) return res.status(400).json({message:'Delivery address and phone are required.'});
    if(!['COD','DEMO'].includes(paymentMethod)) return res.status(400).json({message:'Unsupported demo payment method.'});
    await conn.beginTransaction();
    const [cart]=await conn.query(
      `SELECT ci.product_id,ci.quantity,p.name,p.price,p.stock FROM carts c
       JOIN cart_items ci ON ci.cart_id=c.id JOIN products p ON p.id=ci.product_id
       WHERE c.user_id=? FOR UPDATE`,[req.user.id]);
    if(!cart.length){await conn.rollback();return res.status(400).json({message:'Your cart is empty.'});}
    for(const item of cart) if(item.stock<item.quantity){await conn.rollback();return res.status(409).json({message:`Insufficient stock for ${item.name}.`});}
    const total=cart.reduce((s,i)=>s+Number(i.price)*i.quantity,0);
    const [o]=await conn.query(
      'INSERT INTO orders(user_id,total_amount,status,payment_method,delivery_address,phone) VALUES(?,?,?,?,?,?)',
      [req.user.id,total,'placed',paymentMethod,address.trim(),phone.trim()]);
    for(const item of cart){
      await conn.query('INSERT INTO order_items(order_id,product_id,product_name,unit_price,quantity) VALUES(?,?,?,?,?)',
        [o.insertId,item.product_id,item.name,item.price,item.quantity]);
      await conn.query('UPDATE products SET stock=stock-? WHERE id=?',[item.quantity,item.product_id]);
    }
    const [c]=await conn.query('SELECT id FROM carts WHERE user_id=?',[req.user.id]);
    await conn.query('DELETE FROM cart_items WHERE cart_id=?',[c[0].id]);
    await conn.commit();
    res.status(201).json({message:'Order placed successfully (demo).',orderId:o.insertId,total});
  }catch(e){await conn.rollback();next(e);}finally{conn.release();}
});
router.get('/my',async(req,res,next)=>{
  try{
    const [orders]=await pool.query('SELECT id,total_amount,status,payment_method,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC',[req.user.id]);
    res.json(orders);
  }catch(e){next(e);}
});
module.exports=router;
