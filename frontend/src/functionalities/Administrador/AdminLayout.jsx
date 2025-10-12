// src/functionalities/Administrador/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../styles/admin.css";

export default function AdminLayout() {
    const navigate = useNavigate();
    const linkClass = ({ isActive }) => `sidebar__link${isActive ? " active" : ""}`;

    return (
        <div className="admin">
            <aside className="admin__sidebar">
                <div className="sidebar__header">
                    <h1 className="sidebar__title">Panel Admin</h1>
                    <p className="sidebar__subtitle">Sistema de Horarios</p>
                </div>
                <nav className="sidebar__nav">
                    <ul className="sidebar__list">
                        <li className="sidebar__item"><NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink></li>
                        <li className="sidebar__item"><NavLink to="/admin/docentes" className={linkClass}>Docentes</NavLink></li>
                        <li className="sidebar__item"><NavLink to="/admin/planes" className={linkClass}>Planes de Estudio</NavLink></li>
                        <li className="sidebar__item"><NavLink to="/admin/lugares" className={linkClass}>Lugares</NavLink></li>
                        <li className="sidebar__item"><NavLink to="/admin/horarios" className={linkClass}>Horarios</NavLink></li>
                        <li className="sidebar__item"><NavLink to="/admin/solicitudes" className={linkClass}>Solicitudes</NavLink></li>
                    </ul>
                </nav>
                <div className="sidebar__footer">
                    <button className="sidebar__logout" onClick={() => navigate("/")}>Cerrar sesión</button>
                </div>
            </aside>

            <section className="admin__main">
                <main className="main__content">
                    <Outlet />
                </main>
            </section>
        </div>
    );
}
