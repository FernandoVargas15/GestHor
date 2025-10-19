import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const crearSolicitudRecuperacion = async (email, motivo) => {
    const response = await axios.post(`${API_URL}/solicitudes-recuperacion`, {
        email,
        motivo
    });
    return response.data;
};

export const obtenerSolicitudesPendientes = async () => {
    const response = await axios.get(`${API_URL}/solicitudes-recuperacion/pendientes`);
    return response.data;
};

export const obtenerTodasSolicitudes = async () => {
    const response = await axios.get(`${API_URL}/solicitudes-recuperacion`);
    return response.data;
};

export const obtenerEstadisticasSolicitudes = async () => {
    const response = await axios.get(`${API_URL}/solicitudes-recuperacion/estadisticas`);
    return response.data;
};

export const resolverSolicitud = async (solicitudId) => {
    const response = await axios.put(`${API_URL}/solicitudes-recuperacion/${solicitudId}/resolver`);
    return response.data;
};

export const regenerarPassword = async (solicitudId) => {
    const response = await axios.post(`${API_URL}/solicitudes-recuperacion/${solicitudId}/regenerar-password`);
    return response.data;
};

export const obtenerActividadesRecientes = async (limite = 10) => {
    const response = await axios.get(`${API_URL}/solicitudes-recuperacion/actividades`, {
        params: { limite }
    });
    return response.data;
};
