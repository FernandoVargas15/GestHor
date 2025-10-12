import { dbConnection } from '../config/database.js';

// Buscar usuario por email y devolver datos incluyendo hash de password
async function findUserByEmail(email) {
    try {
        const sql = `
            SELECT u.usuario_id, u.email, u.password, r.nombre_rol
            FROM usuarios u
            JOIN roles r ON r.rol_id = u.rol_id
            WHERE u.email = $1
            LIMIT 1
        `;
        const user = await dbConnection.oneOrNone(sql, [email]);
        return user;
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        throw error;
    }
}

// Función legacy (mantener compatibilidad si se usa en otro lugar)
async function users(email, password) {
    try {
        const sql = `
            SELECT u.usuario_id, u.email, r.nombre_rol
            FROM usuarios u
            JOIN roles r ON r.rol_id = u.rol_id
            WHERE u.email = $1 AND u.password = $2
            LIMIT 1
        `;
        const user = await dbConnection.oneOrNone(sql, [email, password]);
        return user;
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
    }
}

export { users, findUserByEmail };
