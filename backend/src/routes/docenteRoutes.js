import express from "express";
import insertarDocenteController from "../controllers/docenteController.js";

const router = express.Router();

router.post('/insertardocente', insertarDocenteController);

export default router;
