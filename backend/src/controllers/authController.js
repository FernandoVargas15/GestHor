import { users } from "../config/database.js";

const normaliza = (s = "") => String(s).trim().toLowerCase();

const login = async (req, res) => {
    try {
        const { correo, contraseña, tipoUsuario } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({ ok: false, message: "Falta correo o contraseña" });
        }

        const user = await users(correo, contraseña); // trae {usuario_id, email, nombre_rol} o null
        if (!user) {
            return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
        }

        // validación de rol se envia el tipoUsuario
        if (tipoUsuario && normaliza(tipoUsuario) !== normaliza(user.nombre_rol)) {
            return res.status(403).json({
                ok: false,
                message: `Por favor seleccione su rol correctamente.`
            });
        }

        const redirectTo = user.nombre_rol === "administrador" ? "/admin" : "/profesor";
        return res.json({
            ok: true,
            usuario: { id: user.usuario_id, email: user.email, rol: user.nombre_rol },
            redirectTo,
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ ok: false, message: "Error en login" });
    }
};

export default login;
