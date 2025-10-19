import { useMemo, useState, useEffect } from "react";
import "../../styles/profesor.css";
import ProfesorTabs from "../../components/Profesor/ProfesorTabs";
import { useNavigate } from "react-router-dom";
import { obtenerNombreProfesor } from "../../services/docenteService";
import { HorarioExcelExporter } from "../../utils/excelExportService";
import { obtenerHorariosProfesor } from "../../services/horarioService";

  const DAYS = ["lunes", "martes", "miercoles", "jueves", "viernes"];

  const normalize = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

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
  const [schedule, setSchedule] = useState({ slots: [], classes: {} });

  // Cargar horarios del profesor y mapear a la estructura usada por la UI
  useEffect(() => {
    const cargarHorario = async () => {
      if (!profesorId) return;
      try {
        const resp = await obtenerHorariosProfesor(profesorId);
        const rows = resp.horarios || [];

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

        const horaToSlot = (hora) => {
          if (!hora) return null;
          const h = hora.substring(0,5);
          for (const s of matutinoSlots) if (s.startsWith(h)) return s;
          for (const s of vespertinoSlots) if (s.startsWith(h)) return s;
          const [hh, mm] = h.split(":").map(Number);
          const hh2 = String((hh + 1)).padStart(2,'0');
          return `${h} - ${hh2}:${String(mm).padStart(2,'0')}`;
        };

        const classes = {};
        for (const r of rows) {
          const slot = horaToSlot(r.hora_inicio);
          if (!slot) continue;
          // Normalize database day names (e.g. "Miércoles") to match DAYS keys ("miercoles")
          const diaKey = normalize(r.dia_semana);
          if (!classes[slot]) classes[slot] = {};

          const subject = r.nombre_materia || '';
          const roomParts = [];
          if (r.nombre_salon) roomParts.push(r.nombre_salon);
          if (r.nombre_edificio) roomParts.push(r.nombre_edificio);
          if (r.nombre_lugar) roomParts.push(r.nombre_lugar);
          const room = roomParts.join(' - ');

          // Map materia_id deterministically to the defined color palette names
          const _colors = [
            'blue',
            'green',
            'yellow',
            'red',
            'purple',
            'cyan',
            'pink',
            'teal',
            'amber',
            'lime',
            'indigo',
          ];
          const colorClass = `pf-c-${_colors[(r.materia_id || 0) % _colors.length]}`;

          // calculate duration in 1-hour slots
          const parseMinutes = (timeStr) => {
            if (!timeStr) return 0;
            const t = String(timeStr).substring(0,5);
            const [hh, mm] = t.split(':').map(Number);
            return hh * 60 + (mm || 0);
          };
          const startMin = parseMinutes(r.hora_inicio);
          const endMin = parseMinutes(r.hora_fin);
          let span = 1;
          if (endMin > startMin) {
            span = Math.max(1, Math.round((endMin - startMin) / 60));
          }

          // determine which slot array this slot belongs to
          const slotsArray = matutinoSlots.includes(slot) ? matutinoSlots : vespertinoSlots;
          const startIndex = slotsArray.indexOf(slot);

          // assign start cell with span and mark following slots as skipped
          classes[slot][diaKey] = { s: subject, r: room, c: colorClass, span };
          for (let i = 1; i < span; i++) {
            const nextIndex = startIndex + i;
            if (nextIndex >= 0 && nextIndex < slotsArray.length) {
              const nextSlot = slotsArray[nextIndex];
              if (!classes[nextSlot]) classes[nextSlot] = {};
              classes[nextSlot][diaKey] = { skip: true };
            }
          }
        }

        const finalSlots = tipo === 'matutino' ? matutinoSlots : vespertinoSlots;
        setSchedule({ slots: finalSlots, classes });
      } catch (err) {
        console.error('Error al cargar horario del profesor:', err);
      }
    };

    cargarHorario();
  }, [profesorId, tipo]);

  const titleTipo = useMemo(
    () => (tipo === "matutino" ? "Matutino (07:00 - 14:00)" : "Vespertino (15:00 - 22:00)"),
    [tipo]
  );

  /**
   * Exporta el horario actual a PDF
   */
  const exportPDF = () => {
    alert("Exportar a PDF (simulado).");
  };


  const exportExcel = () => {
    try {
      HorarioExcelExporter.exportSchedule(
        schedule,
        tipo,
        nombreProfesor || 'Profesor'
      );
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar el horario. Por favor, intenta nuevamente.');
    }
  };

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
                      if (info && info.skip) {
                        return null;
                      }

                      const rowSpan = info && info.span && info.span > 1 ? info.span : undefined;

                      return (
                        <td key={d} rowSpan={rowSpan}>
                          {info && !info.skip && (
                            <div className={`pf-event ${info.c}`} title={info.s}>
                              <div className="pf-event__subject">{info.s}</div>
                              <div className="pf-event__room">{info.r}</div>
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
