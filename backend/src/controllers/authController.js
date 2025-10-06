import { users } from "../config/database.js";

const login = async (req, res) => {
    console.log("Datos recibidos:", req.body);

    try {
        const { correo, contraseña, tipoUsuario } = req.body;
        const user = await users(correo, contraseña); // espera la promesa

        if (user) {
            console.log("Usuario encontrado:", user);
        } else {
            console.log("Usuario no encontrado");
        }
        res.json({mensaje: "Login exitos"});
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en login" });
    }
};

export default login;
