import { NavLink } from "react-router-dom";
import "../../styles/profesor.css";

export default function ProfesorTabs() {
  // Clase dinámica: aplica pf-tab--active cuando la ruta coincide
  const cx = ({ isActive }) => `pf-tab ${isActive ? "pf-tab--active" : ""}`;

  return (
    <div className="pf-tabs">
      <NavLink end to="/profesor/mi-horario" className={cx}>
        Mi Horario
      </NavLink>
      <NavLink end to="/profesor/mis-materias" className={cx}>
        Mis Materias
      </NavLink>
      <NavLink end to="/profesor/disponibilidad" className={cx}>
        Disponibilidad
      </NavLink>
    </div>
  );
}
