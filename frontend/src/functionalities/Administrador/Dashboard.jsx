import { useState, useEffect } from "react";
import { useToast } from "../../components/ui/NotificacionFlotante";
import { obtenerEstadisticasDocentes } from "../../services/docenteService";
import { obtenerEstadisticasCarreras } from "../../services/carreraService";
import { HorarioPDFExporter } from "../../utils/pdfExportService";
import { HorarioExcelExporter } from "../../utils/excelExportService";

// Tarjeta de stats
function StatCard({ label, value, loading = false }) {
  return (
    <div className="card">
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
        {loading ? <span style={{ color: "var(--muted)" }}>...</span> : value}
      </div>
    </div>
  );
}

//Tabla de horarios (admin)
function ScheduleTable() {
  const DAYS = ["lunes", "martes", "miercoles", "jueves", "viernes"];

  const normalize = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const matutinoSlots = [
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
  ];
  const vespertinoSlots = [
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
  ];

  // Estado UI
  const [tipo, setTipo] = useState("matutino"); // "matutino" | "vespertino"
  const [docentes, setDocentes] = useState([]);
  const [query, setQuery] = useState("");
  const [sugerencias, setSugerencias] = useState([]); // lista filtrada
  const [profesorSel, setProfesorSel] = useState(null); // profesor_id, nombres, apellidos }

  // datos del horario del profesor que se seleccione
  const [schedule, setSchedule] = useState({ slots: [], classes: {} });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const { notify } = useToast();

  // cargar docentes
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setError(null);
        const r = await fetch("http://localhost:3000/api/docentes");
        if (!r.ok) throw new Error("No se pudieron cargar los docentes.");
        const data = await r.json();
        const lista = Array.isArray(data) ? data : data.docentes || [];
        if (!abort) {
          setDocentes(lista);
          setSugerencias(lista.slice(0, 8));
        }
      } catch (e) {
        if (!abort) setError(e.message);
      }
    })();
    return () => {
      abort = true;
    };
  }, []);

  // Filtrado por nombre (autocompletado) *MEJORAR*
  useEffect(() => {
    const q = normalize(query);
    if (!q) {
      setSugerencias(docentes.slice(0, 8));
      return;
    }
    const filtered = docentes.filter((d) =>
      normalize(`${d.nombres} ${d.apellidos}`).includes(q)
    );
    setSugerencias(filtered.slice(0, 12));
  }, [query, docentes]);

  // Cargar horario del profesor seleccionado
  useEffect(() => {
    const cargarHorario = async () => {
      if (!profesorSel?.profesor_id) {
        setSchedule({
          slots: tipo === "matutino" ? matutinoSlots : vespertinoSlots,
          classes: {},
        });
        return;
      }
      try {
        setCargando(true);
        setError(null);

        const resp = await fetch(
          `http://localhost:3000/api/horarios/profesor/${encodeURIComponent(
            profesorSel.profesor_id
          )}`
        );
        if (!resp.ok) throw new Error("No se pudo obtener el horario del profesor.");
        const json = await resp.json();
        const rows = Array.isArray(json?.horarios)
          ? json.horarios
          : Array.isArray(json)
            ? json
            : [];

        const horaToSlot = (hora) => {
          if (!hora) return null;
          const h = String(hora).substring(0, 5);
          const all = [...matutinoSlots, ...vespertinoSlots];
          for (const s of all) if (s.startsWith(h)) return s;
          const [hh, mm] = h.split(":").map(Number);
          const hh2 = String(hh + 1).padStart(2, "0");
          return `${h} - ${hh2}:${String(mm).padStart(2, "0")}`;
        };

        const classes = {};
        for (const r of rows) {
          const slot = horaToSlot(r.hora_inicio);
          if (!slot) continue;

          const diaKey = normalize(r.dia_semana);
          if (!DAYS.includes(diaKey)) continue;

          const subject = r.nombre_materia || "";
          const roomParts = [];
          if (r.nombre_salon) roomParts.push(r.nombre_salon);
          if (r.nombre_edificio) roomParts.push(r.nombre_edificio);
          if (r.nombre_lugar) roomParts.push(r.nombre_lugar);
          const room = roomParts.join(" - ");

          const _colors = [
            "blue",
            "green",
            "yellow",
            "red",
            "purple",
            "cyan",
            "pink",
            "teal",
            "amber",
            "lime",
            "indigo",
          ];
          const colorClass = `pf-c-${_colors[(r.materia_id || 0) % _colors.length]}`;

          const parseMinutes = (t) => {
            const s = String(t || "").substring(0, 5);
            const [hh, mm] = s.split(":").map(Number);
            return (hh || 0) * 60 + (mm || 0);
          };
          const startMin = parseMinutes(r.hora_inicio);
          const endMin = parseMinutes(r.hora_fin);
          let span = 1;
          if (endMin > startMin) span = Math.max(1, Math.round((endMin - startMin) / 60));

          const slotsArray = matutinoSlots.includes(slot) ? matutinoSlots : vespertinoSlots;
          const startIndex = slotsArray.indexOf(slot);

          for (let i = 0; i < span; i++) {
            const idx = startIndex + i;
            if (idx < 0 || idx >= slotsArray.length) break;
            const targetSlot = slotsArray[idx];

            if (!classes[targetSlot]) classes[targetSlot] = {};

            const item = { s: subject, r: room, c: colorClass };

            if (classes[targetSlot][diaKey]) {
              const existing = classes[targetSlot][diaKey];
              classes[targetSlot][diaKey] = Array.isArray(existing)
                ? [...existing, item]
                : [existing, item];
            } else {
              classes[targetSlot][diaKey] = item;
            }
          }
        }

        const finalSlots = tipo === "matutino" ? matutinoSlots : vespertinoSlots;
        setSchedule({ slots: finalSlots, classes });
      } catch (e) {
        setError(e.message || "Error desconocido");
        setSchedule({
          slots: tipo === "matutino" ? matutinoSlots : vespertinoSlots,
          classes: {},
        });
      } finally {
        setCargando(false);
      }
    };

    cargarHorario();
  }, [profesorSel, tipo]);

  /**
 * Exporta el horario actual a PDF
 */
  const exportPDF = () => {
    try {
      HorarioPDFExporter.exportSchedule(
        schedule,
        tipo,
        profesorSel
          ? `${profesorSel.nombres} ${profesorSel.apellidos}`
          : "Profesor"
      );
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      notify({ type: 'error', message: 'Error al generar el PDF. Por favor, intenta nuevamente.' });
    }
  };

  /**
   * Exporta el horario actual a Excel
   */
  const exportExcel = () => {
    try {
      HorarioExcelExporter.exportSchedule(
        schedule,
        tipo,
        profesorSel
          ? `${profesorSel.nombres} ${profesorSel.apellidos}`
          : "Profesor"
      );
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      notify({ type: 'error', message: 'Error al exportar el horario. Por favor, intenta nuevamente.' });
    }
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
          Visualización de Horarios
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Buscador por nombre */}
          <div style={{ position: "relative" }}>
            <input
              className="btn"
              style={{ minWidth: 260 }}
              placeholder="Buscar profesor por nombre…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setProfesorSel(null);
              }}
            />
            {query && sugerencias.length > 0 && !profesorSel && (
              <div
                style={{
                  position: "absolute",
                  top: "105%",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  zIndex: 10,
                  maxHeight: 260,
                  overflowY: "auto",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
                }}
              >
                {sugerencias.map((d) => (
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setProfesorSel(d);
                      setQuery(`${d.nombres} ${d.apellidos}`.trim());
                      setSugerencias([]);
                    }}
                    style={{
                      padding: "8px 10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    {d.nombres} {d.apellidos}
                  </div>
                ))}
                {sugerencias.length === 0 && (
                  <div style={{ padding: 8, color: "#6b7280" }}>Sin coincidencias</div>
                )}
              </div>
            )}
          </div>

          {/* Turno */}
          <select className="btn" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="matutino">Matutino (07:00 - 14:00)</option>
            <option value="vespertino">Vespertino (15:00 - 22:00)</option>
          </select>

          <button className="btn" onClick={exportPDF}>PDF</button>
          <button className="btn btn--primary" onClick={exportExcel}>Excel</button>
        </div>
      </div>

      {/* Estado */}
      {cargando && <p style={{ marginTop: 8 }}>Cargando…</p>}
      {error && <p style={{ color: "tomato", marginTop: 8 }}>{error}</p>}
      <div style={{ fontSize: 12, color: "var(--muted)" }}>
        {profesorSel
          ? `Profesor: ${profesorSel.nombres} ${profesorSel.apellidos}`
          : "Selecciona un profesor…"}
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto", marginTop: 8 }}>
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
            {schedule.slots.map((slot) => (
              <tr key={slot}>
                <td style={{ fontWeight: 600, background: "#f8fafc" }}>{slot}</td>
                {DAYS.map((dKey) => {
                  const info = schedule.classes[slot]?.[dKey];
                  return (
                    <td key={dKey}>
                      {Array.isArray(info) ? (
                        info.map((ev, idx) => (
                          <div
                            key={idx}
                            className={`pf-event ${ev.c}`}
                            title={ev.s}
                            style={{ marginBottom: 6 }}
                          >
                            <div className="pf-event__subject">{ev.s}</div>
                            <div className="pf-event__room">{ev.r}</div>
                          </div>
                        ))
                      ) : (
                        info && (
                          <div className={`pf-event ${info.c}`} title={info.s}>
                            <div className="pf-event__subject">{info.s}</div>
                            <div className="pf-event__room">{info.r}</div>
                          </div>
                        )
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
  );
}

// Pagina completa del Dashboard 
export default function Dashboard() {
  // Estados de stats
  const [stats, setStats] = useState({
    docentes: 0,
    carreras: 0,
    salones: 45, //falta conectar con bd  
    activos: 156, //falta conectar con bd
  });
  const [cargando, setCargando] = useState(true);

  // Cargar estadísticas
  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const [estadisticasDocentes, estadisticasCarreras] = await Promise.all([
          obtenerEstadisticasDocentes(),
          obtenerEstadisticasCarreras(),
        ]);
        setStats((prev) => ({
          ...prev,
          docentes: estadisticasDocentes.estadisticas.totalDocentes,
          carreras: estadisticasCarreras.estadisticas.totalCarreras,
        }));
      } catch (e) {
        console.error("Error al cargar estadísticas:", e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <>
      {/* Título */}
      <div style={{ marginBottom: 16 }}>
        <h2 className="main__title" style={{ margin: 0 }}> Dashboard Principal </h2>
        <p className="main__subtitle" style={{ marginTop: 4 }}> Vista general del sistema de horarios </p>
      </div>

      {/* Stats */}
      <div className="grid grid--4" style={{ marginBottom: 16 }}>
        <StatCard label="Total Docentes" value={stats.docentes} loading={cargando} />
        <StatCard label="Carreras" value={stats.carreras} loading={cargando} />
        <StatCard label="Salones" value={stats.salones} />
        <StatCard label="Horarios Activos" value={stats.activos} />
      </div>

      {/* Horario con búsqueda por profesor + turno */}
      <ScheduleTable />
    </>
  );
}
