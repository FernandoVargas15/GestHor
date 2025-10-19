const BASE_URL = 'http://localhost:3000/api';

async function checkResponse(res) {
    const payload = await res.json().catch(() => null);
    if (!res.ok) {
        const msg = payload?.mensaje || payload?.error || 'Error en la petición';
        const err = new Error(msg);
        err.response = { status: res.status, data: payload };
        throw err;
    }
    return payload;
}

export const obtenerEstructura = async () => {
    const res = await fetch(`${BASE_URL}/lugares/estructura`);
    return checkResponse(res);
};

export const obtenerLugares = async () => {
    const res = await fetch(`${BASE_URL}/lugares`);
    return checkResponse(res);
};

export const crearLugar = async (lugar) => {
    const res = await fetch(`${BASE_URL}/lugares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lugar)
    });
    return checkResponse(res);
};

export const actualizarLugar = async (id, lugar) => {
    const res = await fetch(`${BASE_URL}/lugares/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lugar)
    });
    return checkResponse(res);
};

export const eliminarLugar = async (id) => {
    const res = await fetch(`${BASE_URL}/lugares/${id}`, { method: 'DELETE' });
    return checkResponse(res);
};

// Edificios
export const crearEdificio = async (edificio) => {
    const res = await fetch(`${BASE_URL}/edificios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edificio)
    });
    return checkResponse(res);
};

export const actualizarEdificio = async (id, edificio) => {
    const res = await fetch(`${BASE_URL}/edificios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edificio)
    });
    return checkResponse(res);
};

export const eliminarEdificio = async (id) => {
    const res = await fetch(`${BASE_URL}/edificios/${id}`, { method: 'DELETE' });
    return checkResponse(res);
};

// Salones
export const crearSalon = async (salon) => {
    const res = await fetch(`${BASE_URL}/salones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salon)
    });
    return checkResponse(res);
};

export const actualizarSalon = async (id, salon) => {
    const res = await fetch(`${BASE_URL}/salones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salon)
    });
    return checkResponse(res);
};

export const eliminarSalon = async (id) => {
    const res = await fetch(`${BASE_URL}/salones/${id}`, { method: 'DELETE' });
    return checkResponse(res);
};