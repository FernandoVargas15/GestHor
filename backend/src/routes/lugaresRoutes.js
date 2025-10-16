import express from 'express';
import * as lugaresController from '../controllers/lugaresController.js';

const router = express.Router();

// Rutas de edificios
router.get('/edificios', lugaresController.obtenerEdificios);
router.post('/edificios', lugaresController.crearEdificio);
router.put('/edificios/:id', lugaresController.actualizarEdificio);
router.delete('/edificios/:id', lugaresController.eliminarEdificio);

// Rutas de salones
router.post('/salones', lugaresController.crearSalon);
router.put('/salones/:id', lugaresController.actualizarSalon);
router.delete('/salones/:id', lugaresController.eliminarSalon);

export default router;