import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * Obtener todas las carreras
 */
export const obtenerCarreras = async () => {
    const response = await axios.get(`${API_URL}/carreras`);
    return response.data;
};

/**
 * Obtener una carrera por ID (incluye materias por semestre)
 */
export const obtenerCarreraPorId = async (id) => {
    const response = await axios.get(`${API_URL}/carreras/${id}`);
    return response.data;
};

/**
 * Crear una carrera (con o sin materias)
 * @param {Object} carrera - { nombre_carrera, total_semestres, materias? }
 * materias es un objeto: { 1: [materiaId1, materiaId2], 2: [materiaId3] }
 * Los IDs son del catálogo global de materias
 */
export const crearCarrera = async (carrera) => {
    const response = await axios.post(`${API_URL}/carreras`, carrera);
    return response.data;
};

/**
 * Actualizar una carrera (solo datos básicos)
 */
export const actualizarCarrera = async (id, carrera) => {
    const response = await axios.put(`${API_URL}/carreras/${id}`, carrera);
    return response.data;
};

/**
 * Eliminar una carrera
 */
export const eliminarCarrera = async (id) => {
    const response = await axios.delete(`${API_URL}/carreras/${id}`);
    return response.data;
};

export const obtenerEstadisticasCarreras = async () => {
    const response = await axios.get(`${API_URL}/carreras/estadisticas`);
    return response.data;
};
