import { dbConnection } from '../config/database.js';


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

export { users };
