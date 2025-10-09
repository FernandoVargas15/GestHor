import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";

function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "correo") setCorreo(value);
    else if (id === "contraseña") setContraseña(value);
    else if (id === "tipoUsuario") setTipoUsuario(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log({ correo, contraseña, tipoUsuario });

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña, tipoUsuario }),
      });
      const result = await response.json();
      response.ok
        ? console.log("Login exitoso:", result)
        : console.error("Error en el login:", result);
    } catch (error) {
      console.error("Error al enviar el formulario de login:", error);
    }
  };

  return (
    <div className={styles.loginBackground}>
      <div className={styles.loginContent}>
        <div className={styles.infoSection}>
          <h1 className={styles.systemTitle}>SISTEMA DE HORARIOS</h1>
          <h3 className={styles.systemSubtitle}>Gestión escolar-UNACH</h3>
          <p className={styles.infoText}>
            Bienvenido al sistema para administrar y consultar los horarios de clase. Inicia sesión para continuar.
          </p>
        </div>
        <div className={styles.loginCardwrapper}>
        <div className={styles.loginCard}> 
        <h2 className={styles.cardTitle}>INICIO DE SESIÓN</h2>
        <p className={styles.cardSubtitle}>Por favor, ingresa tus datos para continuar</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={handleInputChange}
              required
              className={styles.inputField}
              placeholder="Tucorreo@unach.mx"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type="password"
              id="contraseña"
              value={contraseña}
              onChange={handleInputChange}
              required
              className={styles.inputField}
              placeholder="ingresa tu contraseña"
            /> 
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipoUsuario">Tipo de usuario</label>
            <select
              id="tipoUsuario"
              value={tipoUsuario}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            >
              <option value="">Seleccione...</option>
              <option value="administrador">Administrador</option>
              <option value="profesor">Profesor</option>
            </select>
          </div>

          <div className={styles.forgotPasswordLink}>
            <Link to="/recovery">¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" className={styles.loginButton}>
            INICIAR SESIÓN
          </button>
        </form>
      </div>
    </div>
    </div>
    </div>
  );
}

export default LoginForm;
