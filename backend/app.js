import express from "express";
import cors from "cors";

// cambio de rutas para que nos funcione a todos (creo)
import { pruebaConexion } from "./src/config/database.js";
import authRoutes from "./src/routes/authRout.js";
import docenteRoutes from "./src/routes/docenteRoutes.js";
import carreraRoutes from "./src/routes/carreraRoutes.js";
import materiaRoutes from "./src/routes/materiaRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas base:
//  - POST /api/login              (desde authRout.js)
//  - /api/docentes                (desde docenteRoutes.js)
//  - /api/carreras                (desde carreraRoutes.js)
//  - /api/materias                (desde materiaRoutes.js)
app.use("/api", authRoutes);
app.use("/api", docenteRoutes);
app.use("/api", carreraRoutes);
app.use("/api", materiaRoutes);

// Health-check simple y prueba de conexión
app.get("/api", async (_req, res) => {
  await pruebaConexion(); // mostrará el resultado en consola
  res.json({ message: "Conexión a la base de datos: OK" });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
