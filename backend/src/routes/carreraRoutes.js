import express from "express";
import { 
    obtenerCarrerasController, 
    obtenerCarreraPorIdController, 
    insertarCarreraController, 
    actualizarCarreraController, 
    eliminarCarreraController 
} from "../controllers/carreraController.js";

const router = express.Router();

// Rutas para carreras
router.get('/carreras', obtenerCarrerasController);
router.get('/carreras/:id', obtenerCarreraPorIdController);
router.post('/carreras', insertarCarreraController);
router.put('/carreras/:id', actualizarCarreraController);
router.delete('/carreras/:id', eliminarCarreraController);

export default router;
