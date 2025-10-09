import express from "express";
import {
  pruebaConexion,
  users,
} from "/home/jose/5M/GestHor/backend/src/config/database.js";
import cors from "cors";
import authRoutes from "./src/routes/authRout.js";
import docenteRoutes from "./src/routes/docenteRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

//ruta de autenticacion '/api/login'
app.use("/api", authRoutes);
//ruta de insercion de docentes '/api/insertardocente'
app.use("/api", docenteRoutes);

app.get("/api", (req, res) => {
  pruebaConexion();
  res.json({ message: "Conexión a la base de datos exitosa" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
