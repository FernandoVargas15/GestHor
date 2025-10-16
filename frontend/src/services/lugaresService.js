const BASE_URL = 'http://localhost:3000/api';

export const obtenerEdificios = async () => {
    const response = await fetch(`${BASE_URL}/edificios`);
    if (!response.ok) throw new Error('Error al obtener edificios');
    return response.json();
};

export const crearEdificio = async (edificio) => {
    const response = await fetch(`${BASE_URL}/edificios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edificio)
    });
    if (!response.ok) throw new Error('Error al crear edificio');
    return response.json();
};

export const actualizarEdificio = async (id, edificio) => {
    const response = await fetch(`${BASE_URL}/edificios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edificio)
    });
    if (!response.ok) throw new Error('Error al actualizar edificio');
    return response.json();
};

export const eliminarEdificio = async (id) => {
    const response = await fetch(`${BASE_URL}/edificios/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar edificio');
};

export const crearSalon = async (salon) => {
    const response = await fetch(`${BASE_URL}/salones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salon)
    });
    if (!response.ok) throw new Error('Error al crear salón');
    return response.json();
};

export const actualizarSalon = async (id, salon) => {
    const response = await fetch(`${BASE_URL}/salones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salon)
    });
    if (!response.ok) throw new Error('Error al actualizar salón');
    return response.json();
};

export const eliminarSalon = async (id) => {
    const response = await fetch(`${BASE_URL}/salones/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar salón');
};