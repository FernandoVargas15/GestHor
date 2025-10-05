import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

// Configurar dotenv para cargar variables de entorno desde el directorio raíz
dotenv.config();

const pgp = pgPromise();

const cn = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// const cn = 'postgres://postgres:1234@localhost:5432/GesThor';

const dbConnection = pgp(cn);

export async function query(texto, params = []) {
    try {
        const rows = await dbConnection.any(texto, params);
        return { rows };
    } catch (error) {
        throw error;
    }
}

async function pruebaConexion() {
    try {
        const fecha = await dbConnection.oneOrNone('SELECT NOW() AS fecha');
        console.log('Prueba de conexión OK', fecha);
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
    }
}

pruebaConexion();

export default dbConnection;
