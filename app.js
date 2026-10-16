const products = [
 {id:"uva",name:"Uva",emoji:"🍇",color:"#8d4bb3",desc:"Caramelos sabor uva."},
 {id:"naranja",name:"Naranja",emoji:"🍊",color:"#f08a31",desc:"Dulce sabor naranja."},
 {id:"menta",name:"Menta",emoji:"🌿",color:"#76aa63",desc:"Frescos caramelos de menta."},
 {id:"frutilla",name:"Frutilla",emoji:"🍓",color:"#e66b91",desc:"Dulzura frutal de frutilla."},
 {id:"limon",name:"Limón",emoji:"🍋",color:"#e9bd36",desc:"Un toque cítrico y dulce."},
 {id:"leche",name:"Leche",emoji:"🥛",color:"#739bd7",desc:"Suave sabor a leche."},
 {id:"chocolate",name:"Chocolate",emoji:"🍫",color:"#8c5a43",desc:"Intenso sabor a chocolate."},
 {id:"mix",name:"Mix frutal",emoji:"🍓🍇",color:"#e98b42",desc:"Una mezcla de sabores frutales."},
 {id:"doble",name:"Doble sabor",emoji:"🍬",color:"#9b60b9",desc:"Dos sabores en un solo caramelo."}
];
const packs=[{id:"pack10",qty:10,price:3000},{id:"pack50",qty:50,price:10000},{id:"pack100",qty:100,price:25000}];
let cart=JSON.parse(localStorage.getItem("candy-cart")||"{}");
const money=n=>new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n);
const $=s=>document.querySelector(s);
function save(){localStorage.setItem("candy-cart",JSON.stringify(cart));renderCart()}
function renderFlavors(){
 const q=$("#search").value.trim().toLowerCase();
 $("#flavors").innerHTML=products.filter(p=>(p.name+" "+p.desc).toLowerCase().includes(q)).map(p=>`
 <article class="flavor-card" style="--accent:${p.color}">
  <div class="flavor-art">${p.emoji}</div><h3>${p.name}</h3><p>${p.desc}</p>
  <label for="pack-${p.id}">Presentación</label>
  <select id="pack-${p.id}">${packs.map(x=>`<option value="${x.id}">Bolsa de ${x.qty} · ${money(x.price)}</option>`).join("")}</select>
  <button class="button add" data-product="${p.id}">＋ Agregar al carrito</button>
 </article>`).join("")||"<p>No encontramos ese sabor. Probá otra búsqueda.</p>";
}
function renderCart(){
 const entries=Object.entries(cart).filter(([,v])=>v.qty>0);
 const count=entries.reduce((n,[,v])=>n+v.qty,0);
 $("#cart-count").textContent=count;
 $("#cart-lines").innerHTML=entries.length?entries.map(([id,v])=>{
  const p=products.find(x=>x.id===v.product), pack=packs.find(x=>x.id===v.pack);
  return `<div class="cart-line"><div><strong>${p.emoji} ${p.name}</strong><small>Bolsa de ${pack.qty} caramelos · ${money(pack.price)}</small><div class="quantity"><button data-minus="${id}" aria-label="Restar">−</button><span>${v.qty}</span><button data-plus="${id}" aria-label="Sumar">＋</button><button class="remove" data-remove="${id}">Quitar</button></div></div><b>${money(pack.price*v.qty)}</b></div>`
 }).join(""):"<p class='empty'>Tu carrito está esperando algo dulce 💜</p>";
 const total=entries.reduce((n,[,v])=>n+packs.find(p=>p.id===v.pack).price*v.qty,0);
 $("#cart-total").textContent=money(total);
 $("#checkout").disabled=!entries.length;
}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-product]");
 if(add){const pid=add.dataset.product, pack=$("#pack-"+pid).value, key=pid+"_"+pack;
  cart[key]??={product:pid,pack,qty:0};cart[key].qty++;save();add.textContent="¡Agregado! ✓";setTimeout(()=>{if(add.isConnected)add.textContent="＋ Agregar al carrito"},900)}
 const plus=e.target.closest("[data-plus]");if(plus){cart[plus.dataset.plus].qty++;save()}
 const minus=e.target.closest("[data-minus]");if(minus){cart[minus.dataset.minus].qty--;if(cart[minus.dataset.minus].qty<=0)delete cart[minus.dataset.minus];save()}
 const remove=e.target.closest("[data-remove]");if(remove){delete cart[remove.dataset.remove];save()}
});
$("#search").addEventListener("input",renderFlavors);
$("#cart-open").onclick=()=>$("#cart-dialog").showModal();
$("#cart-close").onclick=()=>$("#cart-dialog").close();
$("#checkout").onclick=async()=>{
 const name=$("#customer-name").value.trim(),email=$("#customer-email").value.trim(),phone=$("#customer-phone").value.trim();
 if(!name||!email||!phone){alert("Completá tu nombre, email y WhatsApp para continuar.");return}
 const items=Object.values(cart).map(v=>({product:v.product,pack:v.pack,quantity:v.qty}));
 $("#checkout").disabled=true;$("#checkout").textContent="Conectando con Mercado Pago…";
 try{
  const r=await fetch("/api/create-preference",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,phone,items})});
  const data=await r.json();if(!r.ok)throw new Error(data.error||"No se pudo iniciar el pago.");
  if(!data.init_point)throw new Error("El servidor no devolvió el enlace de pago.");
  location.href=data.init_point;
 }catch(err){alert(err.message+" Si estás viendo esta página como archivo local, primero hay que instalar y configurar el servidor. No se realizó ningún cobro.");}
 finally{$("#checkout").disabled=!Object.keys(cart).length;$("#checkout").textContent="Pagar con Mercado Pago"}
};
$("#contact-wa").href="https://wa.me/5493435083080";
renderFlavors();renderCart();
