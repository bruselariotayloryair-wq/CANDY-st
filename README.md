# CANDY st. — tienda web

## Incluye
- Diseño adaptable a celulares y computadoras, con los dos carteles compartidos.
- Sabores: uva, naranja, menta, frutilla, limón, leche, chocolate, mix frutal y doble sabor.
- Precios del cartel: bolsa de 10 $3.000; 50 $10.000; 100 $25.000.
- Carrito persistente en el navegador.
- Servidor Express que crea preferencias de pago de Mercado Pago usando precios del servidor.

## Probar localmente
Requiere Node.js 18 o superior.
1. Descomprimí el ZIP.
2. En esta carpeta ejecutá `npm install`.
3. Configurá las variables de entorno antes de iniciar el servidor:
   - `MP_ACCESS_TOKEN`: token privado de Mercado Pago (nunca lo pongas en app.js ni lo publiques).
   - `PUBLIC_BASE_URL`: URL pública HTTPS de tu sitio para los retornos y notificaciones.
4. Ejecutá `npm start`.
5. Abrí `http://localhost:3000`.

Para probar solo el diseño, también podés abrir index.html directamente; el checkout no funcionará hasta que ejecutes y configures el servidor.

## Antes de cobrar dinero real
- Probá primero con credenciales de prueba de Mercado Pago.
- Desplegá el servidor en un hosting HTTPS y configurá MP_ACCESS_TOKEN y PUBLIC_BASE_URL como variables secretas.
- Implementá validación de firma del webhook y persistencia de pedidos/pagos antes de entregar productos. El webhook incluido es solo un punto de partida y no confirma pagos.
- Revisá disponibilidad, precios y datos de contacto antes de publicar.
- Los carteles enviados se muestran como imágenes originales y pueden contener detalles visuales pequeños; el contenido principal también está escrito en la página.

## Datos incluidos
Dirección: Av. San Martín 248
WhatsApp: 343 508 3080
Instagram: @Candy_s.t
Horario indicado en el cartel: lunes a viernes, 8:00–12:30 y 16:00–20:00.
