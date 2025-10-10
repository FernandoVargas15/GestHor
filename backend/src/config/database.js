import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
dotenv.config();

const pgp = pgPromise();
const cn = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
    `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const dbConnection = pgp(cn);

async function pruebaConexion() {
    try {
        const fecha = await dbConnection.oneOrNone('SELECT NOW() AS fecha');
        console.log('Prueba de conexión establecida', fecha);
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
    }
}

// un JOIN para traer el rol y comparar en texto plano (por ahora, despues hay que implementar la encriptacion de contraseña en BD)
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

export { dbConnection, pruebaConexion, users };
