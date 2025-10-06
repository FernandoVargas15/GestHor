import express from "express";
import pruebaConexion from "/home/jose/5M/GestHor/backend/src/config/database.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
   pruebaConexion();

  res.send("GestHor backend funcionando ");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
