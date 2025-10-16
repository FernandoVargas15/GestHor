import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import { plantillaBienvenida } from '../templates/emailTemplate.js';

dotenv.config();


const crearTransporter = () => {
    return createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false'
        }
    });
};


export const enviarCorreoBienvenida = async ({ email, nombreCompleto, token }) => {
    try {
        const transporter = crearTransporter();
        const adminEmail = 'admin@unach.mx';
        
        const html = plantillaBienvenida({
            nombreCompleto,
            token,
            adminEmail
        });
        
        const mailOptions = {
            from: {
                name: 'Sistema GestHor',
                address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
            },
            to: email,
            subject: 'Bienvenido al Sistema GestHor - Tu llave de acceso',
            html
        };
        
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`✅ Correo enviado a ${email} - ID: ${info.messageId}`);
        
        return {
            success: true,
            messageId: info.messageId
        };
        
    } catch (error) {
        console.error(` Error al enviar correo a ${email}:`, error.message);
        
        return {
            success: false,
            error: error.message
        };
    }
};
