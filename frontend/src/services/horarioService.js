import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * Obtener todos los horarios
 */
export const obtenerHorarios = async () => {
    const response = await axios.get(`${API_URL}/horarios`);
    return response.data;
};

/**
 * Obtener horarios de un profesor específico
 */
export const obtenerHorariosProfesor = async (profesorId) => {
    const response = await axios.get(`${API_URL}/horarios/profesor/${profesorId}`);
    return response.data;
};

/**
 * Crear un nuevo horario
 */
export const crearHorario = async (horarioData) => {
    const response = await axios.post(`${API_URL}/horarios`, horarioData);
    return response.data;
};

/**
 * Actualizar un horario existente
 */
export const actualizarHorario = async (horarioId, horarioData) => {
    const response = await axios.put(`${API_URL}/horarios/${horarioId}`, horarioData);
    return response.data;
};

/**
 * Eliminar un horario
 */
export const eliminarHorario = async (horarioId) => {
    const response = await axios.delete(`${API_URL}/horarios/${horarioId}`);
    return response.data;
};
