import express from "express";
import { 
    obtenerDocentesController, 
    obtenerDocentePorIdController, 
    insertarDocenteController, 
    actualizarDocenteController, 
    eliminarDocenteController 
} from "../controllers/docenteController.js";

const router = express.Router();

router.get('/docentes', obtenerDocentesController);
router.get('/docentes/:id', obtenerDocentePorIdController);
router.post('/docentes', insertarDocenteController);
router.put('/docentes/:id', actualizarDocenteController);
router.delete('/docentes/:id', eliminarDocenteController);

router.post('/insertardocente', insertarDocenteController);

export default router;
