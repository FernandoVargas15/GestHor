import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const obtenerDocentes = async () => {
    const response = await axios.get(`${API_URL}/docentes`);
    return response.data;
};

export const obtenerDocentePorId = async (id) => {
    const response = await axios.get(`${API_URL}/docentes/${id}`);
    return response.data;
};

export const obtenerNombreProfesor = async (id) => {
    const response = await axios.get(`${API_URL}/profesor/nombre/${id}`);
    return response.data;
};

export const crearDocente = async (docente) => {
    const response = await axios.post(`${API_URL}/docentes`, docente);
    return response.data;
};

export const actualizarDocente = async (id, docente) => {
    const response = await axios.put(`${API_URL}/docentes/${id}`, docente);
    return response.data;
};

export const eliminarDocente = async (id) => {
    const response = await axios.delete(`${API_URL}/docentes/${id}`);
    return response.data;
};

export const obtenerEstadisticasDocentes = async () => {
    const response = await axios.get(`${API_URL}/docentes/estadisticas`);
    return response.data;
};
