import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const obtenerPeriodos = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.start) params.append('start', filters.start);
  if (filters.end) params.append('end', filters.end);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const response = await axios.get(`${API_URL}/periodos${qs}`);
  return response.data;
};

const obtenerPeriodoPorId = async (id) => {
  const response = await axios.get(`${API_URL}/periodos/${id}`);
  return response.data;
};

const crearPeriodo = async (periodo) => {
  const response = await axios.post(`${API_URL}/periodos`, periodo);
  return response.data;
};

const actualizarPeriodo = async (id, periodo) => {
  const response = await axios.put(`${API_URL}/periodos/${id}`, periodo);
  return response.data;
};

const eliminarPeriodo = async (id) => {
  const response = await axios.delete(`${API_URL}/periodos/${id}`);
  return response.data;
};

export { obtenerPeriodos, obtenerPeriodoPorId, crearPeriodo, actualizarPeriodo, eliminarPeriodo };
