import React from 'react';
import {Routes,Route,Link,useNavigate,useParams} from 'react-router-dom';
import {api} from './api';
import {useAuth} from './context/AuthContext';

function Header(){
 const {user,logout}=useAuth();
 return <header className="header"><Link className="brand" to="/">STYLECART<span>.</span></Link>
 <nav><Link to="/">Shop</Link><Link to="/cart">Cart</Link>{user?<><Link to="/orders">My orders</Link><button className="linkbtn" onClick={logout}>Logout</button></>:<Link to="/login">Login</Link>}</nav></header>;
}
function Home(){
 const [products,setProducts]=React.useState([]),[error,setError]=React.useState('');
 React.useEffect(()=>{api('/products').then(setProducts).catch(e=>setError(e.message));},[]);
 return <><section className="hero"><div><p className="eyebrow">THE NEW EVERYDAY</p><h1>Style that feels<br/>like <em>you.</em></h1><p>Discover thoughtful pieces for every day and every occasion.</p><a className="button" href="#collection">Explore collection</a></div><div className="hero-art"><span>NEW<br/>SEASON</span></div></section>
 <section id="collection" className="section"><div className="section-head"><div><p className="eyebrow">CURATED FOR YOU</p><h2>Shop the collection</h2></div><span>{products.length} pieces</span></div>
 {error&&<p className="error">{error} — check that the backend and database are running.</p>}
 <div className="products">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div></section></>;
}
function ProductCard({product:p}){
 const {user}=useAuth(); const nav=useNavigate();
 async function add(){if(!user)return nav('/login');try{await api('/cart/items',{method:'POST',body:JSON.stringify({productId:p.id,quantity:1})});alert('Added to cart');}catch(e){alert(e.message);}}
 return <article className="product"><Link to={`/product/${p.id}`}><img src={p.image_url} alt={p.name}/></Link><div className="product-info"><div><h3>{p.name}</h3><p>{p.category||'StyleCart edit'}</p></div><strong>₹{Number(p.price).toLocaleString('en-IN')}</strong></div><button className="outline full" onClick={add}>Add to bag</button></article>;
}
function Product(){
 const {id}=useParams(),[p,setP]=React.useState(null),[err,setErr]=React.useState(''),{user}=useAuth(),nav=useNavigate();
 React.useEffect(()=>{api(`/products/${id}`).then(setP).catch(e=>setErr(e.message));},[id]);
 async function add(){if(!user)return nav('/login');try{await api('/cart/items',{method:'POST',body:JSON.stringify({productId:p.id,quantity:1})});nav('/cart');}catch(e){setErr(e.message);}}
 if(err)return <main className="narrow"><p className="error">{err}</p></main>;if(!p)return <main className="narrow">Loading product…</main>;
 return <main className="product-detail"><img src={p.image_url} alt={p.name}/><div><p className="eyebrow">{p.category}</p><h1>{p.name}</h1><h2>₹{Number(p.price).toLocaleString('en-IN')}</h2><p>{p.description}</p><p>{p.stock>0?`${p.stock} available`:'Out of stock'}</p><button className="button" disabled={!p.stock} onClick={add}>Add to bag</button></div></main>;
}
function Login(){
 const [mode,setMode]=React.useState('login'),[name,setName]=React.useState(''),[email,setEmail]=React.useState(''),[password,setPassword]=React.useState(''),[err,setErr]=React.useState('');
 const {login,register}=useAuth(),nav=useNavigate();
 async function submit(e){e.preventDefault();setErr('');try{mode==='login'?await login(email,password):await register(name,email,password);nav('/');}catch(x){setErr(x.message);}}
 return <main className="auth"><p className="eyebrow">WELCOME TO STYLECART</p><h1>{mode==='login'?'Good to see you.':'Create your account.'}</h1><form onSubmit={submit}>{mode==='register'&&<input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required/>}<input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password (8+ characters)" value={password} onChange={e=>setPassword(e.target.value)} minLength="8" required/><button className="button full">{mode==='login'?'Sign in':'Create account'}</button></form>{err&&<p className="error">{err}</p>}<p>{mode==='login'?'New here?':'Already registered?'} <button className="textbtn" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Create an account':'Sign in'}</button></p></main>;
}
function Cart(){
 const [cart,setCart]=React.useState({items:[],subtotal:0}),[err,setErr]=React.useState('');
 async function load(){try{setCart(await api('/cart'));}catch(e){setErr(e.message);}}
 React.useEffect(()=>{load();},[]);
 async function change(itemId,quantity){try{await api(`/cart/items/${itemId}`,{method:'PATCH',body:JSON.stringify({quantity:Number(quantity)})});load();}catch(e){setErr(e.message);}}
 async function remove(itemId){try{await api(`/cart/items/${itemId}`,{method:'DELETE'});load();}catch(e){setErr(e.message);}}
 return <main className="section"><p className="eyebrow">YOUR SELECTION</p><h1>Your shopping bag</h1>{err&&<p className="error">{err}</p>}{!cart.items.length?<div className="empty"><h2>Your bag is waiting.</h2><Link className="button" to="/">Continue shopping</Link></div>:<div className="cart-layout"><div>{cart.items.map(i=><div className="cart-item" key={i.itemId}><img src={i.image_url} alt={i.name}/><div className="grow"><h3>{i.name}</h3><p>₹{Number(i.price).toLocaleString('en-IN')}</p><label>Qty <select value={i.quantity} onChange={e=>change(i.itemId,e.target.value)}>{Array.from({length:Math.min(10,i.stock)},(_,n)=><option key={n+1}>{n+1}</option>)}</select></label><button className="textbtn" onClick={()=>remove(i.itemId)}>Remove</button></div><strong>₹{Number(i.lineTotal).toLocaleString('en-IN')}</strong></div>)}</div><aside className="summary"><h2>Order summary</h2><p>Subtotal <strong>₹{Number(cart.subtotal).toLocaleString('en-IN')}</strong></p><p>Shipping <strong>Calculated at checkout</strong></p><Link className="button full" to="/checkout">Continue to checkout</Link></aside></div>}</main>;
}
function Checkout(){
 const [address,setAddress]=React.useState(''),[phone,setPhone]=React.useState(''),[method,setMethod]=React.useState('COD'),[err,setErr]=React.useState(''),[done,setDone]=React.useState(null),nav=useNavigate();
 async function submit(e){e.preventDefault();setErr('');try{const result=await api('/orders',{method:'POST',body:JSON.stringify({address,phone,paymentMethod:method})});setDone(result);}catch(x){setErr(x.message);}}
 if(done)return <main className="auth"><p className="eyebrow">ORDER CONFIRMED</p><h1>Thank you for your order.</h1><p>Order #{done.orderId} · ₹{Number(done.total).toLocaleString('en-IN')}</p><p>This is a demo order; no payment was collected.</p><button className="button" onClick={()=>nav('/orders')}>View my orders</button></main>;
 return <main className="auth wide"><p className="eyebrow">ALMOST YOURS</p><h1>Delivery details</h1><form onSubmit={submit}><label>Delivery address<textarea value={address} onChange={e=>setAddress(e.target.value)} required rows="4"/></label><label>Phone number<input value={phone} onChange={e=>setPhone(e.target.value)} required/></label><label>Payment method<select value={method} onChange={e=>setMethod(e.target.value)}><option value="COD">Cash on delivery</option><option value="DEMO">Demo payment (no real charge)</option></select></label><button className="button full">Place demo order</button></form>{err&&<p className="error">{err}</p>}<p className="muted">Never enter real card details in this demo project.</p></main>;
}
function Orders(){
 const [orders,setOrders]=React.useState([]),[err,setErr]=React.useState('');
 React.useEffect(()=>{api('/orders/my').then(setOrders).catch(e=>setErr(e.message));},[]);
 return <main className="section"><p className="eyebrow">YOUR ACCOUNT</p><h1>Order history</h1>{err&&<p className="error">{err}</p>}{orders.map(o=><div className="order" key={o.id}><strong>Order #{o.id}</strong><span>{o.status}</span><strong>₹{Number(o.total_amount).toLocaleString('en-IN')}</strong><small>{new Date(o.created_at).toLocaleString()}</small></div>)}{!orders.length&&!err&&<p>No orders yet.</p>}</main>;
}
function Footer(){return <footer><span>STYLECART.</span><p>Thoughtful style. Everyday confidence.</p><small>Independent learning demo · Not a real store</small></footer>}
export default function App(){return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<Product/>}/><Route path="/login" element={<Login/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/orders" element={<Orders/>}/><Route path="*" element={<main className="narrow"><h1>Page not found</h1><Link to="/">Return home</Link></main>}/></Routes><Footer/></>}
