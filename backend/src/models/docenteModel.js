import { dbConnection } from "../config/database.js";

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

const insertarDocente = async (docente) => {
    try {
        const { nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email } = docente;
        
        const existe = await dbConnection.oneOrNone(
            'SELECT * FROM profesores WHERE matricula = $1',
            [matricula]
        );
        
        if (existe) {
            return null; 
        }
        
        const defaultPassword = '$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G';
        
        const usuario = await dbConnection.one(
            `INSERT INTO usuarios (email, password, rol_id) 
             VALUES ($1, $2, 2) 
             RETURNING usuario_id`,
            [email, defaultPassword]
        );
        
        const resultado = await dbConnection.one(
            `INSERT INTO profesores (profesor_id, nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING *`,
            [usuario.usuario_id, nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email]
        );
        
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

const eliminarDocente = async (id) => {
    try {
        const resultado = await dbConnection.result('DELETE FROM profesores WHERE profesor_id = $1', [id]);
        return resultado.rowCount > 0;
    } catch (error) {
        console.error('Error al eliminar docente:', error);
        throw error;
    }
};

export { obtenerTodos, obtenerPorId, insertarDocente, actualizarDocente, eliminarDocente };
export default insertarDocente;