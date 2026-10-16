// Servidor de checkout de Mercado Pago para CANDY st.
// Requiere Node.js 18+ y una credencial de prueba/producción configurada en MP_ACCESS_TOKEN.
const express = require("express");
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const app = express();
app.use(express.json({limit:"30kb"}));
app.use(express.static(__dirname));
const packs = { pack10:{qty:10,price:3000}, pack50:{qty:50,price:10000}, pack100:{qty:100,price:25000} };
const flavors = new Set(["uva","naranja","menta","frutilla","limon","leche","chocolate","mix","doble"]);
app.post("/api/create-preference", async (req,res)=>{
  try {
    if(!process.env.MP_ACCESS_TOKEN) return res.status(503).json({error:"Falta configurar MP_ACCESS_TOKEN en el servidor."});
    const {name,email,phone,items}=req.body||{};
    if(typeof name!=="string"||!name.trim()||typeof email!=="string"||!email.includes("@")||typeof phone!=="string"||!phone.trim())
      return res.status(400).json({error:"Completá nombre, email y WhatsApp válidos."});
    if(!Array.isArray(items)||!items.length||items.length>30) return res.status(400).json({error:"El carrito está vacío o no es válido."});
    const normalized=items.map(i=>{
      if(!flavors.has(i.product)||!packs[i.pack]||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>50) throw new Error("Hay un producto o cantidad no válida.");
      const p=packs[i.pack];
      return {title:`CANDY st. - ${i.product} - bolsa de ${p.qty} caramelos`,quantity:i.quantity,unit_price:p.price,currency_id:"ARS"};
    });
    const client=new MercadoPagoConfig({accessToken:process.env.MP_ACCESS_TOKEN});
    const preference=new Preference(client);
    const base=(process.env.PUBLIC_BASE_URL||"").replace(/\/+$/,"");
    if(!base.startsWith("https://")) return res.status(503).json({error:"Configurá PUBLIC_BASE_URL con la URL HTTPS pública del sitio."});
    const result=await preference.create({body:{
      items:normalized,
      payer:{name:name.trim(),email:email.trim(),phone:{number:phone.trim()}},
      external_reference:`candy-${Date.now()}`,
      back_urls:{success:`${base}/?pago=exitoso`,failure:`${base}/?pago=fallido`,pending:`${base}/?pago=pendiente`},
      auto_return:"approved",
      notification_url:`${base}/api/mercadopago-webhook`
    }});
    res.json({init_point:result.init_point});
  } catch(err){ console.error("Checkout error:",err.message);res.status(400).json({error:err.message||"No se pudo crear el pago."});}
});
app.post("/api/mercadopago-webhook",(req,res)=>{
  // En producción: validar firma x-signature con el secreto de webhook de Mercado Pago,
  // consultar el pago por API y actualizar el pedido en una base de datos antes de despachar.
  console.log("Notificación de Mercado Pago recibida",req.body?.type||"sin tipo");
  res.sendStatus(200);
});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`CANDY st. listo en http://localhost:${port}`));
