import { obtenerTodos, obtenerPorId, obtenerNombreProfesor, insertarDocente, actualizarDocente, eliminarDocente, contarDocentes } from "../models/docenteModel.js";

const obtenerDocentesController = async (req, res) => {
    try {
        const docentes = await obtenerTodos();
        res.json({ ok: true, docentes });
    } catch (error) {
        console.error("Error en obtenerDocentesController:", error);
        res.status(500).json({ ok: false, mensaje: "Error al obtener docentes", error: error.message });
    }
};

const obtenerDocentePorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const docente = await obtenerPorId(id);
        
        if (!docente) {
            return res.status(404).json({ ok: false, mensaje: "Docente no encontrado" });
        }
        
        res.json({ ok: true, docente });
    } catch (error) {
        console.error("Error en obtenerDocentePorIdController:", error);
        res.status(500).json({ ok: false, mensaje: "Error al obtener docente", error: error.message });
    }
};

const obtenerNombreProfesorController = async (req, res) => {
    try {
        const { id } = req.params;
        const profesor = await obtenerNombreProfesor(id);
        
        if (!profesor) {
            return res.status(404).json({ ok: false, mensaje: "Profesor no encontrado" });
        }
        
        res.json({ ok: true, profesor });
    } catch (error) {
        console.error("Error en obtenerNombreProfesorController:", error);
        res.status(500).json({ ok: false, mensaje: "Error al obtener nombre del profesor", error: error.message });
    }
};

const insertarDocenteController = async (req, res) => {
    try {
        const docente = req.body;
        
        const resultado = await insertarDocente(docente);
        
        if (resultado === null) {
            return res.status(409).json({
                ok: false,
                mensaje: "La matrícula ya existe en el sistema",
                matricula: docente.matricula
            });
        }
        
        res.status(201).json({
            ok: true,
            mensaje: "Docente insertado exitosamente",
            docente: resultado
        });
    } catch (error) {
        console.error("Error en insertarDocenteController:", error);
        res.status(500).json({ 
            ok: false,
            mensaje: "Error al insertar docente",
            error: error.message 
        });
    }
};

const actualizarDocenteController = async (req, res) => {
    try {
        const { id } = req.params;
        const docente = req.body;
        
        const resultado = await actualizarDocente(id, docente);
        
        res.json({
            ok: true,
            mensaje: "Docente actualizado exitosamente",
            docente: resultado
        });
    } catch (error) {
        console.error("Error en actualizarDocenteController:", error);
        res.status(500).json({ 
            ok: false,
            mensaje: "Error al actualizar docente",
            error: error.message 
        });
    }
};

const eliminarDocenteController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const eliminado = await eliminarDocente(id);
        
        if (!eliminado) {
            return res.status(404).json({ ok: false, mensaje: "Docente no encontrado" });
        }
        
        res.json({ ok: true, mensaje: "Docente eliminado exitosamente" });
    } catch (error) {
        console.error("Error en eliminarDocenteController:", error);
        res.status(500).json({ 
            ok: false,
            mensaje: "Error al eliminar docente",
            error: error.message 
        });
    }
};

/**
 * Obtener estadísticas de docentes (contador)
 * Endpoint: GET /api/docentes/estadisticas
 */
const obtenerEstadisticasDocentesController = async (req, res) => {
    try {
        const total = await contarDocentes();
        res.json({ 
            ok: true, 
            estadisticas: {
                totalDocentes: total
            }
        });
    } catch (error) {
        console.error("Error en obtenerEstadisticasDocentesController:", error);
        res.status(500).json({ 
            ok: false,
            mensaje: "Error al obtener estadísticas de docentes",
            error: error.message 
        });
    }
};

export { obtenerDocentesController, obtenerDocentePorIdController, obtenerNombreProfesorController, insertarDocenteController, actualizarDocenteController, eliminarDocenteController, obtenerEstadisticasDocentesController };
export default insertarDocenteController;
