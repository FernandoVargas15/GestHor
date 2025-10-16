import express from "express";
import cors from "cors";
import docentes from './docentes.js'


// cambio de rutas para que nos funcione a todos (creo)
import { pruebaConexion } from "./src/config/database.js";
import authRoutes from "./src/routes/authRout.js";
import docenteRoutes from "./src/routes/docenteRoutes.js";
import carreraRoutes from "./src/routes/carreraRoutes.js";
import materiaRoutes from "./src/routes/materiaRoutes.js";
import profesorMateriaRoutes from "./src/routes/profesorMateriaRoutes.js";
import disponibilidadRoutes from "./src/routes/disponibilidadRoutes.js";
import profesorInfoRoutes from "./src/routes/profesorInfoRoutes.js";
import horarioRoutes from "./src/routes/horarioRoutes.js";
import lugaresRoutes from './src/routes/lugaresRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas base:
//  - POST /api/login              (desde authRout.js)
//  - /api/docentes                (desde docenteRoutes.js)
//  - /api/carreras                (desde carreraRoutes.js)
//  - /api/materias                (desde materiaRoutes.js)
//  - /api/profesor-materias       (desde profesorMateriaRoutes.js)
//  - /api/disponibilidad          (desde disponibilidadRoutes.js)
//  - /api/preferencias            (desde disponibilidadRoutes.js)
//  - /api/profesores/:id/info-horarios  (desde profesorInfoRoutes.js)
//  - /api/horarios/validar-profesor-materia (desde profesorInfoRoutes.js)
//  - /api/horarios                (desde horarioRoutes.js)
app.use("/api", authRoutes);
app.use("/api", docenteRoutes);
app.use("/api", carreraRoutes);
app.use("/api", materiaRoutes);
app.use("/api/profesor-materias", profesorMateriaRoutes);
app.use("/api", disponibilidadRoutes);
app.use("/api", profesorInfoRoutes);
app.use("/api", horarioRoutes);
app.use('/api', lugaresRoutes);
// Health-check simple y prueba de conexión
app.get("/api", async (_req, res) => {
  await pruebaConexion(); // mostrará el resultado en consola
  res.json({ message: "Conexión a la base de datos: OK" });
});

app.get('/', (req, res) => {
    // const docente = JSON.stringify(docentes);
    const docente = docentes;
    // console.log(docente);
    res.json(docente);


});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
