import express from "express";
import { 
    obtenerDocentesController, 
    obtenerDocentePorIdController,
    obtenerNombreProfesorController,
    insertarDocenteController, 
    actualizarDocenteController, 
    eliminarDocenteController,
    obtenerEstadisticasDocentesController
} from "../controllers/docenteController.js";

const router = express.Router();

// Estadísticas (debe ir ANTES de las rutas con parámetros)
router.get('/docentes/estadisticas', obtenerEstadisticasDocentesController);

// CRUD de docentes
router.get('/docentes', obtenerDocentesController);
router.get('/docentes/:id', obtenerDocentePorIdController);
router.get('/profesor/nombre/:id', obtenerNombreProfesorController);
router.post('/docentes', insertarDocenteController);
router.put('/docentes/:id', actualizarDocenteController);
router.delete('/docentes/:id', eliminarDocenteController);

router.post('/insertardocente', insertarDocenteController);

export default router;
