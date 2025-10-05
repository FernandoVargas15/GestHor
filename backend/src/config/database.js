import pgPromise from 'pg-promise';

const pgp = pgPromise();

const cn = 'postgres://postgres:1234@localhost:5432/GesThor';

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
