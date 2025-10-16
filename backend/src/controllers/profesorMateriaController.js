import { obtenerMateriasPorProfesor, asignarMateriaAProfesor, eliminarMateriaDeProfesor } from '../models/profesorMateriaModel.js';

// Obtener materias de un profesor
export const obtenerMaterias = async (req, res) => {
    try {
        const { profesorId } = req.params;

        if (!profesorId || profesorId === 'undefined') {
            return res.status(400).json({ error: 'ID de profesor inválido' });
        }

        const materias = await obtenerMateriasPorProfesor(profesorId);
        res.json({ materias });
    } catch (error) {
        console.error('Error en obtenerMaterias:', error);
        res.status(500).json({ error: 'Error al obtener materias del profesor' });
    }
};

// Asignar materia a profesor
export const asignarMateria = async (req, res) => {
    try {
        const { profesorId } = req.params;
        const { materia_id } = req.body;

        if (!profesorId || profesorId === 'undefined') {
            return res.status(400).json({ error: 'ID de profesor inválido' });
        }

        if (!materia_id) {
            return res.status(400).json({ error: 'ID de materia es requerido' });
        }

        const resultado = await asignarMateriaAProfesor(profesorId, materia_id);

        if (!resultado) {
            return res.status(400).json({ error: 'La materia ya está asignada a este profesor' });
        }

        res.status(201).json({ mensaje: 'Materia asignada exitosamente', resultado });
    } catch (error) {
        console.error('Error en asignarMateria:', error);
        res.status(500).json({ error: 'Error al asignar materia al profesor' });
    }
};

// Eliminar materia de profesor
export const eliminarMateria = async (req, res) => {
    try {
        const { profesorId, materiaId } = req.params;
        
        const eliminado = await eliminarMateriaDeProfesor(profesorId, materiaId);

        if (!eliminado) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        res.json({ mensaje: 'Materia eliminada del profesor exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar materia del profesor' });
    }
};
