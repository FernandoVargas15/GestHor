import { useMemo, useState, useEffect } from "react";
import "../../styles/profesor.css";
import ProfesorTabs from "../../components/Profesor/ProfesorTabs";
import { useNavigate } from "react-router-dom";
import { obtenerNombreProfesor } from "../../services/docenteService";

const DATA = {
  matutino: {
    slots: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
    ],
    classes: {
      "07:00 - 08:00": {
        lunes: { s: "Matemáticas I", r: "Aula 101", c: "pf-c-blue" },
        miercoles: { s: "Álgebra", r: "Aula 203", c: "pf-c-green" },
        viernes: { s: "Cálculo", r: "Aula 105", c: "pf-c-purple" },
      },
      "08:00 - 09:00": {
        martes: { s: "Geometría", r: "Aula 102", c: "pf-c-yellow" },
        jueves: { s: "Estadística", r: "Aula 201", c: "pf-c-red" },
      },
      "09:00 - 10:00": {
        lunes: { s: "Física I", r: "Lab 301", c: "pf-c-indigo" },
        viernes: { s: "Química", r: "Lab 302", c: "pf-c-pink" },
      },
      "10:00 - 11:00": {
        miercoles: { s: "Trigonometría", r: "Aula 104", c: "pf-c-teal" },
      },
      "11:00 - 12:00": {
        martes: { s: "Probabilidad", r: "Aula 106", c: "pf-c-amber" },
        jueves: { s: "Álgebra II", r: "Aula 107", c: "pf-c-cyan" },
      },
    },
  },
  vespertino: {
    slots: [
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
      "20:00 - 21:00",
      "21:00 - 22:00",
    ],
    classes: {
      "15:00 - 16:00": {
        lunes: { s: "Cálculo Integral", r: "Aula 201", c: "pf-c-blue" },
        miercoles: { s: "Física II", r: "Lab 303", c: "pf-c-green" },
      },
      "16:00 - 17:00": {
        martes: { s: "Estadística II", r: "Aula 202", c: "pf-c-purple" },
        jueves: { s: "Matemáticas III", r: "Aula 203", c: "pf-c-red" },
        viernes: { s: "Geometría Analítica", r: "Aula 204", c: "pf-c-yellow" },
      },
      "17:00 - 18:00": {
        lunes: { s: "Álgebra Lineal", r: "Aula 205", c: "pf-c-indigo" },
        miercoles: { s: "Cálculo Vectorial", r: "Aula 206", c: "pf-c-pink" },
      },
      "18:00 - 19:00": {
        martes: { s: "Ecuaciones Diferenciales", r: "Aula 207", c: "pf-c-teal" },
        viernes: { s: "Análisis Numérico", r: "Lab 304", c: "pf-c-amber" },
      },
      "19:00 - 20:00": {
        jueves: { s: "Matemáticas Discretas", r: "Aula 208", c: "pf-c-cyan" },
      },
      "20:00 - 21:00": {
        lunes: { s: "Topología", r: "Aula 209", c: "pf-c-lime" },
        miercoles: { s: "Teoría de Números", r: "Aula 210", c: "pf-c-amber" },
      },
    },
  },
};

const DAYS = ["lunes", "martes", "miercoles", "jueves", "viernes"];

export default function MiHorario() {
  const navigate = useNavigate();
  const [nombreProfesor, setNombreProfesor] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profesorId = user.usuario_id;

  useEffect(() => {
    if (profesorId) {
      obtenerNombreProfesor(profesorId)
        .then((data) => {
          if (data.profesor) {
            setNombreProfesor(`${data.profesor.nombres} ${data.profesor.apellidos}`);
          }
        })
        .catch((error) => console.error("Error al cargar nombre:", error));
    }
  }, [profesorId]);

  const [tipo, setTipo] = useState("matutino");
  const schedule = DATA[tipo];

  const titleTipo = useMemo(
    () => (tipo === "matutino" ? "Matutino (07:00 - 14:00)" : "Vespertino (15:00 - 22:00)"),
    [tipo]
  );

  const exportPDF = () => alert("Exportar a PDF (simulado).");
  const exportExcel = () => alert("Exportar a Excel/CSV (simulado).");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="pf-page">
      <div className="pf-container">
        {/* Header */}
        <div className="pf-header">
                    <div className="pf-header__left">
            <span className="pf-header__title">Mi Horario</span>
            <span className="pf-header__caption">Bienvenido, Prof. {nombreProfesor || "Cargando..."}</span>
          </div>
          <button className="pf-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>

        {/* Tabs */}
        <ProfesorTabs />

        {/* Contenido principal */}
        <div className="pf-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="pf-title">Mi Horario Semanal Asignado</div>
              {/* Si quieres usar titleTipo en algún lado, está disponible */}
            </div>

            <div className="pf-schedule-actions">
              <label style={{ fontSize: 12, color: "var(--pf-muted)" }}>Tipo de Horario</label>
              <select className="pf-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="matutino">Matutino (07:00 - 14:00)</option>
                <option value="vespertino">Vespertino (15:00 - 22:00)</option>
              </select>

              <button className="pf-btn" onClick={exportPDF}>PDF</button>
              <button className="pf-btn pf-btn--primary" onClick={exportExcel}>Excel</button>
            </div>
          </div>

          <div className="pf-table-wrap" style={{ marginTop: 12 }}>
            <table className="pf-table">
              <thead>
                <tr>
                  <th className="pf-time">Hora</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miércoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                </tr>
              </thead>
              <tbody>
                {schedule.slots.map((slot) => (
                  <tr key={slot}>
                    <td className="pf-time">{slot}</td>
                    {DAYS.map((d) => {
                      const info = schedule.classes[slot]?.[d];
                      return (
                        <td key={d}>
                          {info && (
                            <div className={`pf-event ${info.c}`}>
                              {info.s}
                              <small>{info.r}</small>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
