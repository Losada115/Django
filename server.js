const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // Para usar variables de entorno

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔐 Configuración de Nodemailer con variables de entorno
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Debes definir EMAIL_USER en tu archivo .env
        pass: process.env.EMAIL_PASS, // Debes definir EMAIL_PASS en tu archivo .env
    },
});

// Ruta para procesar el pago y enviar correos
app.post("/procesar-pago", async (req, res) => {
    try {
        const { nombre, apellido, celular, municipio, residencia, email, productos, total, metodoPago } = req.body;

        if (!nombre || !apellido || !celular || !municipio || !residencia || !email || !productos || !total || !metodoPago) {
            return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
        }

        // 📨 Contenido del correo para Sabrosuras del Huila
        const contenidoCorreoSabrosuras = `
            <h1>Nueva Compra Recibida</h1>
            <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
            <p><strong>Celular:</strong> ${celular}</p>
            <p><strong>Municipio:</strong> ${municipio}</p>
            <p><strong>Dirección:</strong> ${residencia}</p>
            <p><strong>Correo Electrónico:</strong> ${email}</p>
            <p><strong>Método de Pago:</strong> ${metodoPago}</p>
            <p><strong>Total:</strong> $${total}</p>
            <h2>Productos:</h2>
            <ul>
                ${productos.map(p => `<li>${p.nombre} - Cantidad: ${p.cantidad} - Precio: $${p.precio}</li>`).join('')}
            </ul>
        `;

        // 📨 Contenido del correo para el usuario
        const contenidoCorreoUsuario = `
            <h1>Gracias por tu compra en Sabrosuras del Huila</h1>
            <p>Aquí está el resumen de tu compra:</p>
            <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
            <p><strong>Celular:</strong> ${celular}</p>
            <p><strong>Municipio:</strong> ${municipio}</p>
            <p><strong>Dirección:</strong> ${residencia}</p>
            <p><strong>Correo Electrónico:</strong> ${email}</p>
            <p><strong>Método de Pago:</strong> ${metodoPago}</p>
            <p><strong>Total:</strong> $${total}</p>
            <h2>Productos:</h2>
            <ul>
                ${productos.map(p => `<li>${p.nombre} - Cantidad: ${p.cantidad} - Precio: $${p.precio}</li>`).join('')}
            </ul>
            <p>Gracias por tu compra. ¡Esperamos verte pronto!</p>
        `;

        // ✉️ Opciones de correo para Sabrosuras del Huila
        const mailOptionsSabrosuras = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_DESTINO, // Definir EMAIL_DESTINO en .env
            subject: "Nueva Compra Recibida",
            html: contenidoCorreoSabrosuras,
        };

        // ✉️ Opciones de correo para el usuario
        const mailOptionsUsuario = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Resumen de tu compra en Sabrosuras del Huila",
            html: contenidoCorreoUsuario,
        };

        // Enviar correos
        await transporter.sendMail(mailOptionsSabrosuras);
        await transporter.sendMail(mailOptionsUsuario);

        res.json({ success: true, message: "Pago procesado y correos enviados correctamente." });
    } catch (error) {
        console.error("Error al procesar el pago:", error);
        res.status(500).json({ success: false, message: "Error al procesar el pago." });
    }
});

// Servidor corriendo en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});

