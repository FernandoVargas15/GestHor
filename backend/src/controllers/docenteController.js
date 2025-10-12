import { obtenerTodos, obtenerPorId, insertarDocente, actualizarDocente, eliminarDocente } from "../models/docenteModel.js";

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

export { obtenerDocentesController, obtenerDocentePorIdController, insertarDocenteController, actualizarDocenteController, eliminarDocenteController };
export default insertarDocenteController;
