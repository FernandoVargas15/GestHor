import insertarDocente from "../models/docenteModel.js";

const insertarDocenteController = async (req, res) => {
    try {
        const docente = req.body;
        
        const resultado = await insertarDocente(docente);
        
        if (resultado === null) {
            return res.status(409).json({
                mensaje: "La matrícula ya existe en el sistema",
                matricula: docente.matricula
            });
        }
        
        res.status(201).json({
            mensaje: "Docente insertado exitosamente",
            docente: resultado
        });
    } catch (error) {
        console.error("Error en insertarDocenteController:", error);
        res.status(500).json({ 
            mensaje: "Error al insertar docente",
            error: error.message 
        });
    }
};

export default insertarDocenteController;
