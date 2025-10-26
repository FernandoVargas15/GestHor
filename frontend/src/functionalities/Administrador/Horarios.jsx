import { useMemo, useState, useEffect } from "react";
import { useToast } from "../../components/ui/NotificacionFlotante";
import { obtenerMaterias } from "../../services/materiaService";
import { obtenerDocentes as fetchDocentes, enviarHorarioPorCorreo, sugerirDocentes } from "../../services/docenteService";
import { HorarioPDFExporter } from "../../utils/pdfExportService";
import { obtenerHorariosProfesor, crearHorario, actualizarHorario, eliminarHorario } from "../../services/horarioService";
import { obtenerEstructura } from "../../services/lugaresService";
import AutocompleteInput from "../../components/admin/AutocompleteInput";
import InfoProfesorModal from "../../components/admin/InfoProfesorModal";
import ProfesorDetailsContent from "../../components/admin/ProfesorDetailsContent";
import { useValidacionHorario } from "../../hooks/useValidacionHorario";
import ScheduleGrid from "../../components/admin/ScheduleGrid";
import styles from "../../styles/AdminHorarios.module.css";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const DAY_KEYS = ["lunes", "martes", "miercoles", "jueves", "viernes"];

const MATUTINO_SLOTS = [
    "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00",
    "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00",
];
const VESPERTINO_SLOTS = [
    "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00",
    "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00",
];

const COLORS = [
    'c-blue', 'c-green', 'c-yellow', 'c-red', 'c-purple', 'c-cyan',
    'c-pink', 'c-teal', 'c-amber', 'c-lime', 'c-indigo',
];

// utilidades de tiempo
const toMins = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};
const timeRange = (start = "07:00", end = "22:00", step = 60) => {
    const out = [];
    let cur = toMins(start);
    const max = toMins(end);
    while (cur <= max) {
        const h = String(Math.floor(cur / 60)).padStart(2, "0");
        const m = String(cur % 60).padStart(2, "0");
        out.push(`${h}:${m}`);
        cur += step;
    }
    return out;
};

const normalize = (s) =>
    String(s || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const emptyForm = {
    materia: "",
    salonId: "",
    dia: "",
    inicio: "",
    fin: "",
};

export default function Horarios() {
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [materias, setMaterias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [selectedLugarId, setSelectedLugarId] = useState("");
    const [selectedEdificioId, setSelectedEdificioId] = useState("");
    const [cargando, setCargando] = useState(false);
    const [cargandoHorario, setCargandoHorario] = useState(false);
    const [errorHorario, setErrorHorario] = useState(null);
    const [profesorSel, setProfesorSel] = useState(null);
    const [query, setQuery] = useState("");
    const [tipo, setTipo] = useState("matutino");
    const [activeTab, setActiveTab] = useState('horario');
    const [schedule, setSchedule] = useState({ slots: [], classes: {} });
    const { notify } = useToast();

    const { loading: validando, infoProfesor, cargarInfoProfesor, validarAsignacion } = useValidacionHorario();
    const [candidatos, setCandidatos] = useState([]);
    const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
    const [errorSugerencias, setErrorSugerencias] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [dataMaterias, dataDocentes, dataLugares] = await Promise.all([
                obtenerMaterias(),
                fetchDocentes(),
                obtenerEstructura().catch(err => {
                    // Make this promise non-fatal if it fails
                    console.warn('No se pudieron cargar los lugares:', err);
                    return { lugares: [] };
                })
            ]);
            setMaterias(dataMaterias.materias || []);
            setProfesores(dataDocentes.docentes || []);
            setLugares(dataLugares.lugares || []);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            notify({ type: 'error', message: 'Error al cargar datos iniciales' });
        } finally {
            setCargando(false);
        }
    };

    const horas = useMemo(() => timeRange("07:00", "22:00", 60), []);

    const sugerencias = useMemo(() => {
        const q = normalize(query);
        if (!q) return profesores.slice(0, 15);
        return profesores.filter((d) =>
            normalize(`${d.nombres} ${d.apellidos}`).includes(q)
        ).slice(0, 15);
    }, [query, profesores]);

    useEffect(() => {
        const cargarHorario = async () => {
            if (!profesorSel?.profesor_id) {
                setSchedule({ slots: [], classes: {} });
                return;
            }
            try {
                setCargandoHorario(true);
                setErrorHorario(null);

                const resp = await obtenerHorariosProfesor(profesorSel.profesor_id);
                const rows = resp.horarios || [];

                const horaToSlot = (hora) => {
                    if (!hora) return null;
                    const h = hora.substring(0, 5);
                    const allSlots = [...MATUTINO_SLOTS, ...VESPERTINO_SLOTS];
                    for (const s of allSlots) if (s.startsWith(h)) return s;
                    return null;
                };

                const classes = {};
                for (const r of rows) {
                    const slot = horaToSlot(r.hora_inicio);
                    if (!slot) continue;

                    const diaKey = normalize(r.dia_semana);
                    if (!DAY_KEYS.includes(diaKey)) continue;

                    const roomParts = [r.nombre_salon, r.nombre_edificio, r.nombre_lugar].filter(Boolean);
                    const room = roomParts.join(' - ');
                    const colorClass = COLORS[(r.materia_id || 0) % COLORS.length];

                    const parseMinutes = (t) => t ? toMins(String(t).substring(0, 5)) : 0;
                    const startMin = parseMinutes(r.hora_inicio);
                    const endMin = parseMinutes(r.hora_fin);
                    const span = endMin > startMin ? Math.max(1, Math.round((endMin - startMin) / 60)) : 1;

                    const slotsArray = MATUTINO_SLOTS.includes(slot) ? MATUTINO_SLOTS : VESPERTINO_SLOTS;
                    const startIndex = slotsArray.indexOf(slot);

                    for (let i = 0; i < span; i++) {
                        const idx = startIndex + i;
                        if (idx < 0 || idx >= slotsArray.length) break;
                        const targetSlot = slotsArray[idx];

                        if (!classes[targetSlot]) classes[targetSlot] = {};
                        const item = { s: r.nombre_materia, r: room, c: colorClass, h: r };

                        if (classes[targetSlot][diaKey]) {
                            const existing = classes[targetSlot][diaKey];
                            classes[targetSlot][diaKey] = Array.isArray(existing) ? [...existing, item] : [existing, item];
                        } else {
                            classes[targetSlot][diaKey] = item;
                        }
                    }
                }

                const finalSlots = tipo === 'matutino' ? MATUTINO_SLOTS : VESPERTINO_SLOTS;
                setSchedule({ slots: finalSlots, classes });
            } catch (e) {
                setErrorHorario(e.message || "Error desconocido");
                setSchedule({ slots: tipo === "matutino" ? MATUTINO_SLOTS : VESPERTINO_SLOTS, classes: {} });
            } finally {
                setCargandoHorario(false);
            }
        };
        cargarHorario();
    }, [profesorSel, tipo]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSeleccionarProfesor = async (profesor) => {
        setProfesorSel(profesor);
        setQuery(`${profesor.nombres} ${profesor.apellidos}`);
        setActiveTab('horario'); // Reset to default tab on new selection
        await cargarInfoProfesor(profesor.profesor_id);
    };

    // Helper: parsear distintos formatos de `horas_asignadas` a número entero de horas
    const parseHorasToNumber = (v) => {
        if (v == null) return 0;
        if (typeof v === 'number') return Math.floor(v);
        if (typeof v === 'string') {
            const parts = v.split(':');
            const h = parseInt(parts[0], 10);
            return Number.isNaN(h) ? 0 : h;
        }
        if (typeof v === 'object') {
            if ('hours' in v && typeof v.hours === 'number') return Math.floor(v.hours);
            if ('hour' in v && typeof v.hour === 'number') return Math.floor(v.hour);
            try {
                const s = String(v);
                const parts = s.split(':');
                const h = parseInt(parts[0], 10);
                return Number.isNaN(h) ? 0 : h;
            } catch (_) {
                return 0;
            }
        }
        return 0;
    };

    // Presentational component para un candidato (mantiene Single Responsibility)
    const CandidateRow = ({ candidato, onSelect }) => {
        const horasNum = parseHorasToNumber(candidato.horas_asignadas);

        return (
            <div onClick={() => onSelect(candidato)} style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                <div>
                    <div style={{ fontWeight: 600 }}>{candidato.nombres} {candidato.apellidos}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {candidato.nombre_tipo ? `${candidato.nombre_tipo} (prioridad ${candidato.nivel_prioridad})` : 'Sin contrato'}
                        {' — '}
                        Horas asignadas: <strong>{horasNum} h</strong>
                    </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Click para seleccionar</div>
            </div>
        );
    };

    const validarFormulario = () => {
        if (!profesorSel) return "Selecciona un profesor.";
        if (!form.materia) return "Selecciona una materia.";
        if (!form.salonId) return "Selecciona un salón.";
        if (!form.dia) return "Selecciona un día.";
        if (!form.inicio) return "Selecciona hora de inicio.";
        if (!form.fin) return "Selecciona hora de fin.";
        if (toMins(form.inicio) >= toMins(form.fin)) return "La hora fin debe ser mayor que la hora inicio.";
        return null;
    };

    const submit = async (e) => {
        e.preventDefault();

        if (cargando || validando) return;

        try {
            setCargando(true);

            // 1. Validaciones
            const err = validarFormulario();
            if (err) {
                notify({ type: 'error', message: err });
                return;
            }

            // 2. Obtener la materia seleccionada
            const materiaSeleccionada = materias.find(m => m.nombre_materia === form.materia);
            if (!materiaSeleccionada) {
                notify({ type: 'error', message: 'Error: No se encontró la materia seleccionada' });
                return;
            }

            // 2. Validar si el profesor puede impartir la materia (solo en creación)
            if (!editId) {
                const puedeAsignar = await validarAsignacion(
                    profesorSel.profesor_id,
                    materiaSeleccionada.materia_id,
                    `${profesorSel.nombres} ${profesorSel.apellidos}`,
                    form.materia
                );

                if (!puedeAsignar) return;
            }

            // 4. Preparar datos para el backend
            const horarioData = {
                profesorId: profesorSel.profesor_id,
                materiaId: materiaSeleccionada.materia_id,
                salonId: parseInt(form.salonId),
                diaSemana: form.dia,
                horaInicio: form.inicio,
                horaFin: form.fin
            };

            // 5. Guardar
            let response;
            if (editId) {
                response = await actualizarHorario(editId, horarioData);
            } else {
                response = await crearHorario(horarioData);
            }

            if (response.ok) {
                notify({ type: 'success', message: `Horario ${editId ? 'actualizado' : 'creado'} exitosamente` });
                setEditId(null);
                setForm(emptyForm);
                // Forzar recarga del horario del profesor
                setProfesorSel(p => ({ ...p }));
            } else {
                notify({ type: 'error', message: response.mensaje || `Error al ${editId ? 'actualizar' : 'crear'} horario` });
            }
        } catch (error) {
            console.error("Error en submit:", error);
            notify({ type: 'error', message: error.response?.data?.mensaje || 'Error de servidor al guardar horario' });
        } finally {
            setCargando(false);
        }
    };

    const onEdit = (h) => {
        const lugar = lugares.find(l => l.edificios.some(e => e.edificio_id === h.edificio_id));
        if (lugar) {
            setSelectedLugarId(lugar.lugar_id);
            setSelectedEdificioId(h.edificio_id);
        }

        setForm({
            materia: h.nombre_materia,
            salonId: h.salon_id,
            dia: h.dia_semana,
            inicio: h.hora_inicio.substring(0, 5),
            fin: h.hora_fin.substring(0, 5),
        });

        setEditId(h.horario_id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = async (horarioId) => {
        if (!confirm("¿Eliminar este horario?")) return;

        try {
            setCargando(true);
            const response = await eliminarHorario(horarioId);

            if (response.ok) {
                notify({ type: 'success', message: 'Horario eliminado exitosamente' });

                if (editId === horarioId) {
                    setEditId(null);
                    setForm(emptyForm);
                }
                setProfesorSel(p => ({ ...p })); // Forzar recarga
            } else {
                notify({ type: 'error', message: response.mensaje || 'Error al eliminar horario' });
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            notify({ type: 'error', message: error.response?.data?.mensaje || 'Error al eliminar horario' });
        } finally {
            setCargando(false);
        }
    };

    // Dadas las selecciones, obtener la lista de salones filtrada
    const salonesFiltrados = () => {
        let resultados = [];
        const lugar = lugares.find((l) => String(l.lugar_id) === String(selectedLugarId));
        const edificios = lugar ? (lugar.edificios || []) : lugares.flatMap(l => l.edificios || []);
        const edificiosFiltrados = selectedEdificioId ? edificios.filter(e => String(e.edificio_id) === String(selectedEdificioId)) : edificios;
        for (const ed of edificiosFiltrados) {
            resultados = resultados.concat(ed.salones || []);
        }
        return resultados;
    };

    const handleSendEmail = async () => {
        if (!profesorSel || !schedule) {
            notify({ type: 'error', message: 'No hay profesor o horario seleccionado.' });
            return;
        }

        if (!confirm(`¿Deseas enviar el horario actual por correo a ${profesorSel.nombres} ${profesorSel.apellidos}?`)) {
            return;
        }

        try {
            setCargando(true);
            const pdfBlob = HorarioPDFExporter.exportSchedule(schedule, tipo, `${profesorSel.nombres} ${profesorSel.apellidos}`, 'blob');

            const response = await enviarHorarioPorCorreo(profesorSel.profesor_id, pdfBlob);

            notify({ type: 'success', message: response.mensaje || 'Horario enviado por correo exitosamente.' });
        } catch (error) {
            notify({ type: 'error', message: error.message || 'Error al enviar el correo.' });
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>Gestión de Horarios</h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Asigne y visualice los horarios de los docentes
                </p>
            </div>

            {/* Panel de Controles Superior */}
            <div className="card" style={{ marginBottom: 16 }}>
                <div className={styles.controlsGrid}>
                    {/* Sección de Selección de Docente */}
                    <div className={styles.teacherSelector}>
                        <h3 className={styles.panelTitle}>Docente</h3>
                        {cargando ? (
                            <div className="form__hint">Cargando docentes...</div>
                        ) : profesorSel ? (
                            <div className={styles.selectedTeacherBox}>
                                <span className={styles.selectedTeacherName}>
                                    {profesorSel.nombres} {profesorSel.apellidos}
                                </span>
                                <button onClick={() => setProfesorSel(null)} className={styles.clearButton} title="Limpiar selección">
                                    &times;
                                </button>
                                <div className={styles.teacherPriority}>
                                    {profesorSel.nombre_tipo ?
                                        `Prioridad: ${profesorSel.nivel_prioridad} (${profesorSel.nombre_tipo})` :
                                        'Prioridad: No asignada'
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className={styles.searchContainer}>
                                <AutocompleteInput
                                    items={profesores}
                                    onSelect={handleSeleccionarProfesor}
                                    placeholder="Buscar y seleccionar docente..."
                                    disabled={cargando}
                                    getItemKey={(p) => p.profesor_id}
                                    getItemLabel={(p) => `${p.nombres} ${p.apellidos}`}
                                />
                                {profesores.length === 0 && !cargando && (
                                    <div className="form__hint" style={{ marginTop: 8, textAlign: 'center' }}>
                                        No hay docentes registrados.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sección de Formulario de Asignación */}
                    <div className={styles.assignmentForm}>
                        <h3 className={styles.panelTitle}>{editId ? "Editar Horario" : "Asignar Nuevo Horario"}</h3>
                        <form onSubmit={submit}>
                            <div className="form__row form__row--2">
                                <div>
                                    <label>Materia</label>
                                    <AutocompleteInput
                                        items={materias}
                                        onSelect={(m) => setForm(f => ({ ...f, materia: m.nombre_materia }))}
                                        placeholder="Buscar y seleccionar materia..."
                                        disabled={cargando }
                                        getItemKey={(m) => m.materia_id}
                                        getItemLabel={(m) => m.nombre_materia}
                                    />
                                    {/* El botón de sugerir ahora está al lado de "Asignar Horario". */}
                                    {materias.length === 0 && !cargando && (
                                        <div className="form__hint" style={{ marginTop: 8, textAlign: 'center' }}>
                                            No hay materias registradas.
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label>Día</label>
                                    <select className="select" name="dia" value={form.dia} onChange={onChange} required >
                                        <option value="">Seleccionar día...</option>
                                        {DIAS.map((d) => (<option key={d} value={d}>{d}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="form__row form__row--3" style={{ marginTop: 12 }}>
                                <div>
                                    <label>Lugar</label>
                                    <select className="select" value={selectedLugarId} onChange={(e) => { setSelectedLugarId(e.target.value); setSelectedEdificioId(""); }} required >
                                        <option value="">Seleccionar...</option>
                                        {lugares.map((l) => (<option key={l.lugar_id} value={l.lugar_id}>{l.nombre_lugar}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label>Edificio</label>
                                    <select className="select" value={selectedEdificioId} onChange={(e) => setSelectedEdificioId(e.target.value)} required disabled={!profesorSel}>
                                        <option value="">Seleccionar...</option>
                                        {(lugares.find(l => String(l.lugar_id) === String(selectedLugarId))?.edificios || []).map((ed) => (<option key={ed.edificio_id} value={ed.edificio_id}>{ed.nombre_edificio}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label>Salón</label>
                                    <select className="select" name="salonId" value={form.salonId} onChange={onChange} required disabled={!profesorSel}>
                                        <option value="">Seleccionar...</option>
                                        {salonesFiltrados().map((s) => (<option key={s.salon_id} value={s.salon_id}>{s.nombre_salon} {s.tipo_salon ? ` - ${s.tipo_salon}` : ""}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="form__row form__row--2" style={{ marginTop: 12 }}>
                                <div>
                                    <label>Hora Inicio</label>
                                    <select className="select" name="inicio" value={form.inicio} onChange={onChange} required >
                                        <option value="">Seleccionar hora...</option>
                                        {horas.map((h) => (<option key={h} value={h}>{h}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label>Hora Fin</label>
                                    <select className="select" name="fin" value={form.fin} onChange={onChange} required >
                                        <option value="">Seleccionar hora...</option>
                                        {horas.map((h) => (<option key={h} value={h}>{h}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                <button type="submit" className="btn btn--primary" disabled={cargando || validando || !profesorSel}>
                                    {cargando || validando ? "Cargando..." : editId ? "Actualizar Horario" : "Asignar Horario"}
                                </button>

                                <button type="button" className="btn btn--primary" onClick={async () => {
                                    // trigger suggestion fetch
                                    try {
                                        setErrorSugerencias(null);
                                        setCandidatos([]);
                                        const materiaSeleccionada = materias.find(m => m.nombre_materia === form.materia);
                                        if (!materiaSeleccionada) {
                                            notify({ type: 'error', message: 'Selecciona primero una materia válida' });
                                            return;
                                        }
                                        if (!form.dia || !form.inicio || !form.fin) {
                                            notify({ type: 'error', message: 'Selecciona día, inicio y fin para buscar sugerencias' });
                                            return;
                                        }
                                        setCargandoSugerencias(true);
                                        const resp = await sugerirDocentes({ materiaId: materiaSeleccionada.materia_id, dia: form.dia, inicio: form.inicio, fin: form.fin });
                                        if (resp && resp.ok) {
                                            // Normalizar y ordenar por prioridad ASC (nulls last) y luego por menor horas asignadas
                                            const rawCandidates = resp.candidatos || [];
                                            const normalized = rawCandidates.map(c => ({ ...c, __horas_num: parseHorasToNumber(c.horas_asignadas) }));
                                            normalized.sort((a, b) => {
                                                const pa = (a.nivel_prioridad == null) ? Number.POSITIVE_INFINITY : Number(a.nivel_prioridad);
                                                const pb = (b.nivel_prioridad == null) ? Number.POSITIVE_INFINITY : Number(b.nivel_prioridad);
                                                if (pa !== pb) return pa - pb;
                                                if (a.__horas_num !== b.__horas_num) return a.__horas_num - b.__horas_num;
                                                if (a.apellidos !== b.apellidos) return a.apellidos.localeCompare(b.apellidos);
                                                return a.nombres.localeCompare(b.nombres);
                                            });
                                            setCandidatos(normalized);
                                        } else {
                                            setErrorSugerencias(resp?.mensaje || 'No se encontraron candidatos');
                                            setCandidatos([]);
                                        }
                                    } catch (e) {
                                        console.error('Error al solicitar sugerencias:', e);
                                        setErrorSugerencias(e.message || 'Error al buscar sugerencias');
                                        setCandidatos([]);
                                    } finally {
                                        setCargandoSugerencias(false);
                                    }
                                }} disabled={cargando || cargandoSugerencias}>
                                    {cargandoSugerencias ? 'Buscando...' : 'Sugerir docentes'}
                                </button>

                                {editId && (<button type="button" className="btn" onClick={() => { setEditId(null); setForm(emptyForm); }} disabled={cargando}>Cancelar edición</button>)}
                            </div>

                            {/* Lista de candidatos mostrada debajo de los botones */}
                            <div style={{ marginTop: 12 }}>
                                {errorSugerencias && <div className="form__hint" style={{ color: 'var(--danger)' }}>{errorSugerencias}</div>}
                                {candidatos.length > 0 && (
                                    <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'white', overflow: 'hidden' }}>
                                        {candidatos.map((c) => (
                                            <CandidateRow key={c.profesor_id} candidato={c} onSelect={handleSeleccionarProfesor} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Contenido principal (Pestañas y Parrilla/Info) */}
            <div className={styles.mainContentArea}>
                {!profesorSel ? (
                    <div className={`${styles.placeholder} card`}>
                        <p>Seleccione un docente para ver su horario y su información detallada.</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className={styles.tabsContainer}>
                            <button className={`${styles.tabButton} ${activeTab === 'horario' ? styles.tabButtonActive : ''}`} onClick={() => setActiveTab('horario')}>
                                Horario Semanal
                            </button>
                            <button className={`${styles.tabButton} ${activeTab === 'info' ? styles.tabButtonActive : ''}`} onClick={() => setActiveTab('info')}>
                                Información del Docente
                            </button>
                        </div>

                        {activeTab === 'horario' && (
                            <div className="card fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h3 style={{ margin: 0 }}>Horario Semanal de {profesorSel.nombres}</h3>
                                    <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                        <option value="matutino">Matutino (07:00 - 14:00)</option>
                                        <option value="vespertino">Vespertino (15:00 - 22:00)</option>
                                    </select>
                                    <button
                                        className="btn"
                                        onClick={handleSendEmail}
                                        disabled={cargando || cargandoHorario || !schedule.slots.length}>
                                        Enviar por Correo
                                    </button>
                                </div>
                                <ScheduleGrid schedule={schedule} onEdit={onEdit} onDelete={onDelete} cargando={cargandoHorario} error={errorHorario} />
                            </div>
                        )}

                        {activeTab === 'info' && infoProfesor && (
                            <div className="card fade-in">
                                <ProfesorDetailsContent profesorNombre={`${profesorSel.nombres} ${profesorSel.apellidos}`} infoProfesor={infoProfesor} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
