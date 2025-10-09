import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

// Configurar dotenv para cargar variables de entorno desde el directorio raíz
dotenv.config();

const pgp = pgPromise();

const cn = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// const cn = 'postgres://postgres:1234@localhost:5432/GesThor';

const dbConnection = pgp(cn);

async function pruebaConexion() {
    try {
        const fecha = await dbConnection.oneOrNone('SELECT NOW() AS fecha');
        console.log('Prueba de conexión establecida', fecha);

    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
    }
}

async function users(email, password) {
    try {
        const user = await dbConnection.oneOrNone('SELECT * FROM usuarios WHERE email = $1 AND password = $2', [email, password]);
        return user;
        
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        
    }
    
}

// users ('rubenclemente221@gmail.com', '1234').then(user => {
//     if (user) {
//         console.log('Usuario encontrado:', user);
//     } else {
//         console.log('Usuario no encontrado');
//     }
// });


export { dbConnection, pruebaConexion, users };
