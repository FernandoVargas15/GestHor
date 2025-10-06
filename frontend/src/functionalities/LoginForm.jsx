import { useState } from "react";
import styles from "./LoginForm.module.css";

function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "correo") {
      setCorreo(value);
    } else if (id === "contraseña") {
      setContraseña(value);
    } else if (id === "tipoUsuario") {
      setTipoUsuario(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Formulario enviado ");
    console.log("Valores del aformulario:");
    console.log("Correo: ", correo);
    console.log("Contraseña: ", contraseña);
    console.log("Tipo de usuario: ", tipoUsuario);

    const loginData = {
      correo: correo,
      contraseña: contraseña,
      tipoUsuario: tipoUsuario,
    };
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Login exitoso:", result);
      } else {
        console.error("Error en el login:", result);
        return;
      }
    } catch (error) {
      console.error("Error al enviar el formulario de login: ", error);
    }
  };

  return (
    <div>
      <h1 className={styles.titulo}>Sistema de Horarios</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="contraseña">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            value={contraseña}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="tipoUsuario">Tipo de usuario</label>
          <select
            name=""
            id="tipoUsuario"
            value={tipoUsuario}
            onChange={handleInputChange}
          >
            <option value="administrador"> Administrador</option>
            <option value="profesor">Profesor</option>
          </select>
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}
export default LoginForm;
