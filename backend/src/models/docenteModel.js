import { dbConnection } from "../config/database.js";
import { generarTokenAcceso } from "../utils/tokenGenerator.js";
import bcrypt from "bcrypt";

const obtenerTodos = async () => {
    try {
        const docentes = await dbConnection.any('SELECT * FROM profesores ORDER BY profesor_id');
        return docentes;
    } catch (error) {
        console.error('Error al obtener docentes:', error);
        throw error;
    }
};

const obtenerPorId = async (id) => {
    try {
        const docente = await dbConnection.oneOrNone('SELECT * FROM profesores WHERE profesor_id = $1', [id]);
        return docente;
    } catch (error) {
        console.error('Error al obtener docente por ID:', error);
        throw error;
    }
};

const obtenerNombreProfesor = async (id) => {
    try {
        const profesor = await dbConnection.oneOrNone(
            'SELECT nombres, apellidos FROM profesores WHERE profesor_id = $1',
            [id]
        );
        return profesor;
    } catch (error) {
        console.error('Error al obtener nombre del profesor:', error);
        throw error;
    }
};

const insertarDocente = async (docente) => {
    try {
        const { nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email } = docente;
        
        // Verificar si la matrícula ya existe
        const existeMatricula = await dbConnection.oneOrNone(
            'SELECT * FROM profesores WHERE matricula = $1',
            [matricula]
        );
        
        if (existeMatricula) {
            return { error: 'matricula', mensaje: 'La matrícula ya existe en el sistema' };
        }
        
        // Verificar si el email ya existe
        const existeEmail = await dbConnection.oneOrNone(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        
        if (existeEmail) {
            return { error: 'email', mensaje: 'El email ya está registrado en el sistema' };
        }
        
        // Generar token de acceso de 8 caracteres
        const token = generarTokenAcceso();
        
        // Hashear el token para guardarlo como contraseña
        const hashedToken = await bcrypt.hash(token, 10);
        
        // Crear usuario con rol profesor (rol_id = 2)
        const usuario = await dbConnection.one(
            `INSERT INTO usuarios (email, password, rol_id) 
             VALUES ($1, $2, 2) 
             RETURNING usuario_id`,
            [email, hashedToken]
        );
        
        // Insertar profesor
        const resultado = await dbConnection.one(
            `INSERT INTO profesores (profesor_id, nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING *`,
            [usuario.usuario_id, nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email]
        );
        
        // Guardar token en la tabla tokens_auth
        await dbConnection.none(
            `INSERT INTO tokens_auth (usuario_id, token) 
             VALUES ($1, $2)`,
            [usuario.usuario_id, token]
        );
        
        // Agregar el token al resultado para enviarlo por correo
        resultado.tokenAcceso = token;
        
        return resultado;
    } catch (error) {
        console.error('Error al insertar docente:', error);
        throw error;
    }
};

const actualizarDocente = async (id, docente) => {
    try {
        const { nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email } = docente;
        
        const resultado = await dbConnection.one(
            `UPDATE profesores 
             SET nombres = $1, apellidos = $2, matricula = $3, grado_academico = $4, 
                 numero_plaza = $5, numero_contrato = $6, direccion = $7, telefono = $8, email = $9
             WHERE profesor_id = $10
             RETURNING *`,
            [nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email, id]
        );
        
        return resultado;
    } catch (error) {
        console.error('Error al actualizar docente:', error);
        throw error;
    }
};

//   Obtener el conteo total de profesores 
const contarDocentes = async () => {
    try {
        const resultado = await dbConnection.one('SELECT COUNT(*) as total FROM profesores');
        return parseInt(resultado.total, 10);
    } catch (error) {
        console.error('Error al contar docentes:', error);
        throw error;
    }
};

const eliminarDocente = async (id) => {
    try {
        const resultado = await dbConnection.result('DELETE FROM profesores WHERE profesor_id = $1', [id]);
        return resultado.rowCount > 0;
    } catch (error) {
        console.error('Error al eliminar docente:', error);
        throw error;
    }
};

export { obtenerTodos, obtenerPorId, obtenerNombreProfesor, insertarDocente, actualizarDocente, eliminarDocente, contarDocentes };
export default insertarDocente;