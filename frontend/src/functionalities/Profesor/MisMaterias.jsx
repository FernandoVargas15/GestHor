import { useMemo, useState } from "react";
import "../../styles/profesor.css";
import ProfesorTabs from "../../components/Profesor/ProfesorTabs";
import { useNavigate } from "react-router-dom";

const TODAS_LAS_MATERIAS = [
    "Matemáticas I",
    "Matemáticas II",
    "Álgebra",
    "Álgebra Lineal",
    "Cálculo Diferencial",
    "Cálculo Integral",
    "Geometría",
    "Trigonometría",
    "Estadística",
    "Probabilidad",
    "Física I",
    "Física II",
    "Química",
    "Biología",
    "Historia",
    "Geografía",
    "Literatura",
    "Inglés",
    "Francés",
    "Educación Física",
    "Arte",
];

export default function MisMaterias() {
    const navigate = useNavigate();
    // demo inicial para que se vea como tu captura
    const [misMaterias, setMisMaterias] = useState([
        { id: crypto.randomUUID(), nombre: "Matemáticas I", estado: "Activa" },
        { id: crypto.randomUUID(), nombre: "Álgebra", estado: "Activa" },
        { id: crypto.randomUUID(), nombre: "Cálculo Diferencial", estado: "Activa" },
    ]);
    const [seleccion, setSeleccion] = useState("");

    // materias disponibles que aún no están agregadas
    const disponibles = useMemo(() => {
        const ya = new Set(misMaterias.map((m) => m.nombre));
        return TODAS_LAS_MATERIAS.filter((n) => !ya.has(n));
    }, [misMaterias]);

    const agregar = (e) => {
        e.preventDefault();
        if (!seleccion) return alert("Selecciona una materia.");
        setMisMaterias((arr) => [
            ...arr,
            { id: crypto.randomUUID(), nombre: seleccion, estado: "Activa" },
        ]);
        setSeleccion("");
    };

    const eliminar = (id) => {
        if (!confirm("¿Eliminar esta materia de tu lista?")) return;
        setMisMaterias((arr) => arr.filter((m) => m.id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="pf-page">
            <div className="pf-container">
                {/* Header simple */}
                <div className="pf-header">
                    <div className="pf-header__left">
                        <span className="pf-header__title">Panel del Profesor</span>
                        <span className="pf-header__caption">Bienvenido, Prof. Juan Pérez</span>
                    </div>
                    <button className="pf-btn" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>

                {/* Tabs */}
                <ProfesorTabs />

                {/* Contenido */}
                <div className="grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {/* Formulario */}
                    <div className="pf-card">
                        <div className="pf-title" style={{ marginBottom: 8 }}>
                            Agregar Materia que Puedo Impartir
                        </div>

                        <form onSubmit={agregar}>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: "block", fontSize: 13, color: "var(--pf-muted)", marginBottom: 6 }}>
                                    Seleccionar Materia
                                </label>
                                <select
                                    className="pf-select"
                                    value={seleccion}
                                    onChange={(e) => setSeleccion(e.target.value)}
                                    style={{ width: "100%" }}
                                >
                                    <option value="">Seleccionar materia...</option>
                                    {disponibles.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button className="pf-btn pf-btn--primary" style={{ width: "100%" }} type="submit">
                                Agregar Materia
                            </button>
                        </form>
                    </div>

                    {/* Listado de mis materias */}
                    <div className="pf-card">
                        <div className="pf-title" style={{ marginBottom: 8 }}>
                            Mis Materias Registradas
                        </div>

                        <div className="grid" style={{ display: "grid", gap: 10 }}>
                            {misMaterias.map((m) => (
                                <div key={m.id} className="pf-card" style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{m.nombre}</div>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                marginTop: 6,
                                                fontSize: 12,
                                                padding: "3px 8px",
                                                borderRadius: 999,
                                                background: "#e8faef",
                                                color: "#15803d",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {m.estado}
                                        </span>
                                    </div>
                                    <button
                                        className="pf-btn"
                                        style={{ borderColor: "#fecaca", color: "#b91c1c" }}
                                        onClick={() => eliminar(m.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}

                            {misMaterias.length === 0 && (
                                <div className="pf-card" style={{ padding: 12, color: "var(--pf-muted)" }}>
                                    Aún no has agregado materias.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
