import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * Obtener información completa del profesor para asignación de horarios
 * Incluye: disponibilidad, preferencias y materias
 */
export const obtenerInfoHorariosProfesor = async (profesorId) => {
    const response = await axios.get(`${API_URL}/profesores/${profesorId}/info-horarios`);
    return response.data;
};

/**
 * Validar si un profesor puede impartir una materia específica
 * Retorna si la materia está en el perfil del profesor
 */
export const validarProfesorMateria = async (profesorId, materiaId) => {
    const response = await axios.post(`${API_URL}/horarios/validar-profesor-materia`, {
        profesorId,
        materiaId
    });
    return response.data;
};
