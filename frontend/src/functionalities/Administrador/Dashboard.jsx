import { useMemo, useState } from "react";

function StatCard({ label, value }) {
  return (
    <div className="card">
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function ScheduleTable({ rows }) {
  return (
    <div className="card" style={{ marginTop: 16 }}>
      {/* Header del horario*/}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
          Visualización de Horarios
        </div>

        {/* Filtrados */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select className="btn" id="viewTypeSelect" defaultValue="profesor">
            <option value="">Seleccionar…</option>
            <option value="profesor">Por Profesor</option>
            <option value="salon">Por Salón</option>
          </select>

          <select className="btn" id="entitySelect" defaultValue="">
            <option value="">Seleccionar…</option>
            <option value="1">Opción 1</option>
            <option value="2">Opción 2</option>
          </select>

          <button className="btn" onClick={() => alert("Exportar a PDF…")}>PDF</button>
          <button className="btn btn--primary" onClick={() => alert("Exportar a Excel…")}>
            Excel
          </button>
        </div>
      </div>

      {/* Tabla (mejorar) */}
      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Lunes</th>
              <th>Martes</th>
              <th>Miércoles</th>
              <th>Jueves</th>
              <th>Viernes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h}>
                <td style={{ fontWeight: 600, background: "#f8fafc" }}>{h}</td>
                <td></td><td></td><td></td><td></td><td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // Tabla con rangos horarios tipo “matutino”, faltaria filtar para vespertino y actualizar la tabla 
  const timeSlots = useMemo(
    () => [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
    ],
    []
  );

  // para luego que se conecte con datos reales del backend
  const [stats] = useState({
    docentes: 24,
    carreras: 8,
    salones: 45,
    activos: 156,
  });

  return (
    <>
      {/* Título y subtítulo */}
      <div style={{ marginBottom: 16 }}>
        <h2 className="main__title" style={{ margin: 0 }}>Dashboard Principal</h2>
        <p className="main__subtitle" style={{ marginTop: 4 }}>
          Vista general del sistema de horarios
        </p>
      </div>

      {/* stats */}
      <div className="grid grid--4" style={{ marginBottom: 16 }}>
        <StatCard label="Total Docentes" value={stats.docentes} />
        <StatCard label="Carreras" value={stats.carreras} />
        <StatCard label="Salones" value={stats.salones} />
        <StatCard label="Horarios Activos" value={stats.activos} />
      </div>

      {/* Tabla de horarios + filtros */}
      <ScheduleTable rows={timeSlots} />
    </>
  );
}
