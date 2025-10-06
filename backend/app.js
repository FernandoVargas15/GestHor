import express from "express";
import pruebaConexion from "/home/jose/5M/GestHor/backend/src/config/database.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.post('/api/login', (req, res) => {
  const { correo, contraseña, tipoUsuario} = req.body;
  // console.log('Correo:', correo);
  // console.log('Contraseña:', contraseña);  
  // console.log ('Tipo de usuario:', tipoUsuario);  
  console.log('Datos recibidos:', req.body);
  res.json({ message: 'Login recibido correctamente' });

});

app.get("/api", (req, res) => {
   pruebaConexion();
   res.json({ message: "Conexión a la base de datos exitosa" });
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
