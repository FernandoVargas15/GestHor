import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";

function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "correo") setCorreo(value);
    else if (id === "contraseña") setContraseña(value);
    else if (id === "tipoUsuario") setTipoUsuario(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setCargando(true);

    try {
      // enviar datos al backend
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // se manda tambien tipoUsuario para validarlo en el backend
        body: JSON.stringify({ correo, contraseña, tipoUsuario }),
      });

      const result = await response.json();

      // si hay error (credenciales o rol incorrecto)
      if (!response.ok || !result.ok) {
        setError(result?.message || "Error en el login");
        setCargando(false);
        return;
      }

      // si todo esta bien, redirige según el rol
      const rol = result?.usuario?.rol;

      // (opcional) guarda la sesión
      //localStorage.setItem("usuario", JSON.stringify(result.usuario));

      if (rol === "administrador") {
        navigate("/admin/admin-dashboard");
      } else if (rol === "profesor") {
        navigate("/profesor/mi-horario");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.loginBackground}>
      <div className={styles.loginContent}>
        <div className={styles.infoSection}>
          <h1 className={styles.systemTitle}>SISTEMA DE HORARIOS</h1>
          <h3 className={styles.systemSubtitle}>Gestión escolar - UNACH</h3>
          <p className={styles.infoText}>
            Bienvenido al sistema para administrar y consultar los horarios de clase.
            Inicia sesión para continuar.
          </p>
        </div>

        <div className={styles.loginCardwrapper}>
          <div className={styles.loginCard}>
            <h2 className={styles.cardTitle}>INICIO DE SESIÓN</h2>
            <p className={styles.cardSubtitle}>
              Por favor, ingresa tus datos para continuar
            </p>

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
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              <div className={styles.forgotPasswordLink}>
                <Link to="/recovery">¿Olvidaste tu contraseña?</Link>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <button
                type="submit"
                className={styles.loginButton}
                disabled={cargando}
              >
                {cargando ? "VALIDANDO..." : "INICIAR SESIÓN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
