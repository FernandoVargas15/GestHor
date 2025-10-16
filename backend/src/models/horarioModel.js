import { dbConnection } from "../config/database.js";

/**
 * Obtener todos los horarios
 */
const obtenerHorarios = async () => {
    const query = `
        SELECT 
            h.horario_id,
            h.profesor_id,
            h.materia_id,
            h.salon_id,
            h.dia_semana,
            h.hora_inicio,
            h.hora_fin,
            p.nombres,
            p.apellidos,
            mc.nombre_materia
        FROM horarios h
        JOIN profesores p ON h.profesor_id = p.profesor_id
        JOIN materias_catalogo mc ON h.materia_id = mc.materia_id
        ORDER BY h.dia_semana, h.hora_inicio
    `;
    return await dbConnection.any(query);
};

/**
 * Obtener horarios por profesor
 */
const obtenerHorariosPorProfesor = async (profesorId) => {
    const query = `
        SELECT 
            h.horario_id,
            h.profesor_id,
            h.materia_id,
            h.salon_id,
            h.dia_semana,
            h.hora_inicio,
            h.hora_fin,
            mc.nombre_materia
        FROM horarios h
        JOIN materias_catalogo mc ON h.materia_id = mc.materia_id
        WHERE h.profesor_id = $1
        ORDER BY h.dia_semana, h.hora_inicio
    `;
    return await dbConnection.any(query, [profesorId]);
};

/**
 * Crear un nuevo horario
 */
const crearHorario = async (profesorId, materiaId, salonId, diaSemana, horaInicio, horaFin) => {
    const query = `
        INSERT INTO horarios 
            (profesor_id, materia_id, salon_id, dia_semana, hora_inicio, hora_fin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    return await dbConnection.one(query, [profesorId, materiaId, salonId, diaSemana, horaInicio, horaFin]);
};

/**
 * Actualizar un horario existente
 */
const actualizarHorario = async (horarioId, profesorId, materiaId, salonId, diaSemana, horaInicio, horaFin) => {
    const query = `
        UPDATE horarios
        SET 
            profesor_id = $2,
            materia_id = $3,
            salon_id = $4,
            dia_semana = $5,
            hora_inicio = $6,
            hora_fin = $7
        WHERE horario_id = $1
        RETURNING *
    `;
    return await dbConnection.one(query, [horarioId, profesorId, materiaId, salonId, diaSemana, horaInicio, horaFin]);
};

/**
 * Eliminar un horario
 */
const eliminarHorario = async (horarioId) => {
    const query = `DELETE FROM horarios WHERE horario_id = $1`;
    return await dbConnection.result(query, [horarioId]);
};

/**
 * Verificar si existe un choque de horario para un profesor
 */
const verificarChoqueProfesor = async (profesorId, diaSemana, horaInicio, horaFin, horarioIdExcluir = null) => {
    let query = `
        SELECT * FROM horarios
        WHERE profesor_id = $1
        AND dia_semana = $2
        AND (
            (hora_inicio < $4 AND hora_fin > $3)
            OR (hora_inicio >= $3 AND hora_inicio < $4)
        )
    `;
    const params = [profesorId, diaSemana, horaInicio, horaFin];
    
    if (horarioIdExcluir) {
        query += ` AND horario_id != $5`;
        params.push(horarioIdExcluir);
    }
    
    return await dbConnection.any(query, params);
};

/**
 * Verificar si existe un choque de horario para un salón
 */
const verificarChoqueSalon = async (salonId, diaSemana, horaInicio, horaFin, horarioIdExcluir = null) => {
    let query = `
        SELECT * FROM horarios
        WHERE salon_id = $1
        AND dia_semana = $2
        AND (
            (hora_inicio < $4 AND hora_fin > $3)
            OR (hora_inicio >= $3 AND hora_inicio < $4)
        )
    `;
    const params = [salonId, diaSemana, horaInicio, horaFin];
    
    if (horarioIdExcluir) {
        query += ` AND horario_id != $5`;
        params.push(horarioIdExcluir);
    }
    
    return await dbConnection.any(query, params);
};

export {
    obtenerHorarios,
    obtenerHorariosPorProfesor,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
    verificarChoqueProfesor,
    verificarChoqueSalon
};
