import express from "express";
import {
  pruebaConexion,
  users,
} from "/home/jose/5M/GestHor/backend/src/config/database.js";
import cors from "cors";
import authRoutes from "./src/routes/authRout.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

//ruta de autenticacion '/api/login'
app.use("/api", authRoutes);

app.get("/api", (req, res) => {
  pruebaConexion();
  res.json({ message: "Conexión a la base de datos exitosa" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
