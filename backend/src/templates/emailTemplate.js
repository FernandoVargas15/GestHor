import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo CSS
const emailStyles = fs.readFileSync(
    path.join(__dirname, 'emailStyles.css'),
    'utf-8'
);

export const plantillaBienvenida = ({ nombreCompleto, token, adminEmail }) => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a GestHor</title>
    <style>
        ${emailStyles}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Sistema GestHor</h1>
            <p>Gestión de Horarios</p>
        </div>
        
        <div class="content">
            <p>Hola <strong>${nombreCompleto}</strong>,</p>
            
            <p>Has sido dado de alta en el <strong>Sistema GestHor</strong>, la plataforma de gestión de horarios académicos de la institución.</p>
            
            <p>Este sistema te permitirá administrar tu disponibilidad, consultar tus horarios asignados y coordinar tus actividades académicas.</p>
            
            <p><strong>Cuenta creada por:</strong> ${adminEmail}</p>
            
            <div class="token-box">
                <div class="token-label">Tu llave de acceso permanente:</div>
                <div class="token-value">${token}</div>
            </div>
            
            <p>Esta llave de acceso es <strong>permanente</strong> y será necesaria cada vez que ingreses al sistema. Te recomendamos guardarla en un lugar seguro.</p>
            
            <div class="alert-box">
                <p><strong> Importante:</strong> Tienes un máximo de <strong>72 horas</strong> para completar tu horario personal en el sistema.</p>
            </div>
            
            <p>Si tienes alguna duda o problema, contacta al administrador del sistema.</p>
        </div>
        
        <div class="footer">
            <p><strong>Sistema GestHor</strong></p>
            <p>Gestión de Horarios Académicos</p>
            <p>© ${new Date().getFullYear()} - Este es un correo automático</p>
        </div>
    </div>
</body>
</html>
    `.trim();
};
