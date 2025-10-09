import { dbConnection } from "../config/database.js";

const insertarDocente = async (docente) => {
    try {
        const { nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono } = docente;
        
        // Verificar si la matrícula ya existe
        const existe = await dbConnection.oneOrNone(
            'SELECT * FROM profesores WHERE matricula = $1',
            [matricula]
        );
        
        if (existe) {
            return null; 
        }
        
        // Si no existe, insertar el profeso
        const resultado = await dbConnection.one(
            `INSERT INTO profesores (nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono]
        );
        
        return resultado;
    } catch (error) {
        console.error('Error al insertar docente:', error);
        throw error;
    }
};

export default insertarDocente;