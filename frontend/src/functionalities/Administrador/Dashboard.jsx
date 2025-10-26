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
  const [lugaresEstructura, setLugaresEstructura] = useState([]);
  const [salonesFlat, setSalonesFlat] = useState([]);
  const [salonSel, setSalonSel] = useState(null);
  const [salonHorarios, setSalonHorarios] = useState([]);

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

  // Cargar estructura de lugares -> edificios -> salones
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const r = await fetch('http://localhost:3000/api/lugares');
        if (!r.ok) throw new Error('No se pudieron cargar los lugares.');
        const json = await r.json();
        const estructura = Array.isArray(json) ? json : json.lugares || json;
        if (abort) return;
        setLugaresEstructura(estructura || []);
        // aplanar salones
        const flat = [];
        for (const lugar of estructura || []) {
          for (const edificio of lugar.edificios || []) {
            for (const salon of edificio.salones || []) {
              flat.push({
                salon_id: salon.salon_id,
                nombre_salon: salon.nombre_salon,
                tipo_salon: salon.tipo_salon,
                edificio_id: edificio.edificio_id,
                nombre_edificio: edificio.nombre_edificio,
                lugar_id: lugar.lugar_id,
                nombre_lugar: lugar.nombre_lugar,
              });
            }
          }
        }
        setSalonesFlat(flat);
      } catch (e) {
        console.error('Error cargando estructura de lugares:', e);
      }
    })();
    return () => { abort = true; };
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

          {/* Filtro por Salón */}
          <select
            className="btn"
            value={salonSel || ""}
            onChange={async (e) => {
              const val = e.target.value || null;
              setSalonSel(val);
              setSalonHorarios([]);
              if (val) {
                try {
                  const resp = await fetch(`http://localhost:3000/api/horarios/salon/${encodeURIComponent(val)}`);
                  if (!resp.ok) throw new Error('No se pudieron obtener los horarios del salón');
                  const json = await resp.json();
                  const rows = Array.isArray(json?.horarios) ? json.horarios : [];
                  setSalonHorarios(rows);
                } catch (err) {
                  console.error(err);
                }
              }
            }}
          >
            <option value="">Filtrar por salón </option>
            {salonesFlat.map((s) => (
              <option key={s.salon_id} value={s.salon_id}>
                {s.nombre_lugar} / {s.nombre_edificio} / {s.nombre_salon}
              </option>
            ))}
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

      {/* Información del salón seleccionado */}
      {salonSel && (
        <div style={{ marginTop: 8, padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}>
          <div style={{ fontWeight: 700 }}>Salón seleccionado</div>
          {(() => {
            const info = salonesFlat.find(s => String(s.salon_id) === String(salonSel));
            if (!info) return <div className="form__hint">Información del salón no disponible</div>;
            const profesoresUnicos = Array.from(new Map(salonHorarios.map(h => [h.profesor_id, { profesor_id: h.profesor_id, nombres: h.nombres, apellidos: h.apellidos }])).values());
            return (
              <div style={{ marginTop: 6 }}>
                <div className="form__hint">Lugar: {info.nombre_lugar}</div>
                <div className="form__hint">Edificio: {info.nombre_edificio}</div>
                <div className="form__hint">Salón: {info.nombre_salon} {info.tipo_salon && `(${info.tipo_salon})`}</div>
                <div style={{ marginTop: 8 }}>
                  <strong>Profesores con clases en este salón ({profesoresUnicos.length}):</strong>
                  <ul style={{ marginTop: 6 }}>
                    {profesoresUnicos.map(p => (
                      <li key={p.profesor_id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span>{p.nombres} {p.apellidos}</span>
                        <div>
                          <button className="btn" onClick={() => { setProfesorSel(p); setQuery(`${p.nombres} ${p.apellidos}`); }}>Ver horario</button>
                        </div>
                      </li>
                    ))}
                    {profesoresUnicos.length === 0 && <li className="form__hint">No hay profesores asignados actualmente</li>}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tabla */}
      <div style={{ overflowX: "auto", marginTop: 8 }}>
        {/* Priority: if a professor is selected, show the existing schedule table.
            If no professor but a salon is selected, show the compact materia-docente table. */}
        {profesorSel ? (
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
        ) : salonSel ? (
          // Compact table grouped by materia + docente for the selected salon
          <table className="table">
            <thead>
              <tr>
                <th>Materia</th>
                <th>Docente</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // agrupar salonHorarios por materia+docente
                const groups = new Map();
                for (const h of salonHorarios || []) {
                  const key = `${h.materia_id}||${h.profesor_id}`;
                  if (!groups.has(key)) {
                    groups.set(key, {
                      materia_id: h.materia_id,
                      nombre_materia: h.nombre_materia,
                      profesor_id: h.profesor_id,
                      docente_nombre: `${h.nombres} ${h.apellidos}`,
                      byDay: { Lunes: [], Martes: [], 'Miércoles': [], Jueves: [], Viernes: [] }
                    });
                  }
                  const entry = groups.get(key);
                  const day = h.dia_semana || '';
                  const dayNorm = day === 'Miercoles' ? 'Miércoles' : day; // normalize possible accent
                  const time = `${String(h.hora_inicio || '').substring(0, 5)} - ${String(h.hora_fin || '').substring(0, 5)}`;
                  if (entry.byDay[dayNorm]) entry.byDay[dayNorm].push(time);
                }

                const rows = Array.from(groups.values());
                if (rows.length === 0) {
                  return (
                    <tr>
                      <td colSpan={7} className="form__hint">No hay clases registradas para este salón.</td>
                    </tr>
                  );
                }

                return rows.map((r) => (
                  <tr key={`${r.materia_id}-${r.profesor_id}`}>
                    <td style={{ fontWeight: 600 }}>{r.nombre_materia}</td>
                    <td>{r.docente_nombre}</td>
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((d) => (
                      <td key={d}>
                        {r.byDay[d] && r.byDay[d].length > 0 ? (
                          r.byDay[d].map((t, i) => (
                            <div key={i} style={{ marginBottom: 6 }}>{t}</div>
                          ))
                        ) : (
                          <span className="form__hint">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        ) : (
          // Default: show empty schedule (no professor selected)
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
                  {DAYS.map((dKey) => <td key={dKey}></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
    salones: 0,
    activos: 0,
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

        const respLugares = await fetch("http://localhost:3000/api/lugares");
        const dataLugares = await respLugares.json();
        const estructura = Array.isArray(dataLugares)
          ? dataLugares
          : dataLugares.lugares || [];

        let totalSalones = 0;
        for (const lugar of estructura) {
          for (const edificio of lugar.edificios || []) {
            totalSalones += (edificio.salones || []).length;
          }
        }

        const respHorarios = await fetch("http://localhost:3000/api/horarios");
        const dataHorarios = await respHorarios.json();
        const totalActivos = Array.isArray(dataHorarios)
          ? dataHorarios.length
          : dataHorarios.horarios?.length || 0;

        setStats({
          docentes: estadisticasDocentes.estadisticas.totalDocentes,
          carreras: estadisticasCarreras.estadisticas.totalCarreras,
          salones: totalSalones,
          activos: totalActivos,
        });
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
