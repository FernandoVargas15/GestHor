import { useMemo, useState, useEffect } from "react";
import { useToast } from "../../components/ui/NotificacionFlotante";
import { obtenerMaterias } from "../../services/materiaService";
import { obtenerDocentes } from "../../services/docenteService";
import { obtenerHorarios, crearHorario, actualizarHorario, eliminarHorario } from "../../services/horarioService";
import { obtenerEstructura } from "../../services/lugaresService";
import AutocompleteInput from "../../components/admin/AutocompleteInput";
import InfoProfesorModal from "../../components/admin/InfoProfesorModal";
import { useValidacionHorario } from "../../hooks/useValidacionHorario";

// Los salones se obtienen desde la API mediante la estructura lugares -> edificios -> salones

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// utilidades de tiempo
const toMins = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};
const overlap = (aStart, aEnd, bStart, bEnd) => {
    return toMins(aStart) < toMins(bEnd) && toMins(aEnd) > toMins(bStart);
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

const emptyForm = {
    profesorId: "",
    materia: "",
    salonId: "",
    dia: "",
    inicio: "",
    fin: "",
};

export default function Horarios() {
    const [form, setForm] = useState(emptyForm);
    const [horarios, setHorarios] = useState([]);
    const [editId, setEditId] = useState(null);
    const [materias, setMaterias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [selectedLugarId, setSelectedLugarId] = useState("");
    const [selectedEdificioId, setSelectedEdificioId] = useState("");
    const [cargando, setCargando] = useState(false);
    const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
    const { notify } = useToast();
    
    // Hook de validación - Principio: Dependency Inversion
    const { loading: validando, infoProfesor, cargarInfoProfesor, validarAsignacion } = useValidacionHorario();

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [dataMaterias, dataDocentes, dataHorarios] = await Promise.all([
                obtenerMaterias(),
                obtenerDocentes(),
                obtenerHorarios()
            ]);
            setMaterias(dataMaterias.materias || []);
            setProfesores(dataDocentes.docentes || []);
            setHorarios(dataHorarios.horarios || []);

            // Cargar estructura de lugares (lugares -> edificios -> salones)
            try {
                const resp = await obtenerEstructura();
                setLugares(resp.lugares || []);
            } catch (err) {
                console.warn('No se pudieron cargar los lugares:', err);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            notify({ type: 'error', message: 'Error al cargar datos iniciales' });
        } finally {
            setCargando(false);
        }
    };

    const horas = useMemo(() => timeRange("07:00", "22:00", 60), []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSeleccionarProfesor = async (profesor) => {
        setProfesorSeleccionado(profesor);
        setForm((f) => ({ ...f, profesorId: profesor.profesor_id }));
        
        // Cargar info del profesor automáticamente al seleccionarlo
        await cargarInfoProfesor(profesor.profesor_id);
    };

    const limpiarProfesor = () => {
        setProfesorSeleccionado(null);
        setForm((f) => ({ ...f, profesorId: "" }));
    };

    const validar = () => {
        if (!form.profesorId) return "Selecciona un profesor.";
        if (!form.materia) return "Selecciona una materia.";
        if (!form.salonId) return "Selecciona un salón.";
        if (!form.dia) return "Selecciona un día.";
        if (!form.inicio) return "Selecciona hora de inicio.";
        if (!form.fin) return "Selecciona hora de fin.";
        if (toMins(form.inicio) >= toMins(form.fin))
            return "La hora fin debe ser mayor que la hora inicio.";

        // choques con profesor
        const sameDay = horarios.filter(
            (h) => h.dia === form.dia && (editId ? h.id !== editId : true)
        );

        const choqueProfesor = sameDay.find(
            (h) =>
                h.profesorId === form.profesorId &&
                overlap(form.inicio, form.fin, h.inicio, h.fin)
        );
        if (choqueProfesor)
            return "Choque: el profesor ya tiene un horario en ese rango.";

        // choques con salón
        const choqueSalon = sameDay.find(
            (h) =>
                h.salonId === form.salonId &&
                overlap(form.inicio, form.fin, h.inicio, h.fin)
        );
        if (choqueSalon)
            return "Choque: el salón ya está ocupado en ese rango.";

        return null;
    };

    const submit = async (e) => {
        e.preventDefault();
        
        if (cargando) return;

        try {
            setCargando(true);

            // 1. Validaciones básicas
            const err = validar();
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

            // 3. Validar que el profesor puede impartir la materia (solo en creación)
            if (!editId) {
                const nombreProfesor = profName(form.profesorId);
                const puedeAsignar = await validarAsignacion(
                    form.profesorId,
                    materiaSeleccionada.materia_id,
                    nombreProfesor,
                    form.materia
                );

                if (!puedeAsignar) return;
            }

            // 4. Preparar datos para el backend
            const horarioData = {
                profesorId: parseInt(form.profesorId),
                materiaId: materiaSeleccionada.materia_id,
                salonId: parseInt(form.salonId),
                diaSemana: form.dia,
                horaInicio: form.inicio,
                horaFin: form.fin
            };

            // 5. Guardar en el backend
            if (editId) {
                const response = await actualizarHorario(editId, horarioData);
                    if (response.ok) {
                    // Recargar horarios
                    const dataHorarios = await obtenerHorarios();
                    setHorarios(dataHorarios.horarios || []);
                    notify({ type: 'success', message: 'Horario actualizado exitosamente' });
                    setEditId(null);
                    setForm(emptyForm);
                    setProfesorSeleccionado(null);
                } else {
                    notify({ type: 'error', message: response.mensaje || 'Error al actualizar horario' });
                }
            } else {
                const response = await crearHorario(horarioData);
                if (response.ok) {
                    // Recargar horarios
                    const dataHorarios = await obtenerHorarios();
                    setHorarios(dataHorarios.horarios || []);
                    notify({ type: 'success', message: 'Horario creado exitosamente' });
                    
                    // MEJORA UX: Limpiar solo campos de horario, mantener profesor seleccionado
                    setForm({
                        profesorId: form.profesorId,  // Mantener profesor
                        materia: "",                   // Limpiar materia
                        salonId: "",                   // Limpiar salón
                        dia: "",                       // Limpiar día
                        inicio: "",                    // Limpiar hora inicio
                        fin: ""                        // Limpiar hora fin
                    });
                    // NO limpiar profesorSeleccionado para que permanezca visible
                    } else {
                    notify({ type: 'error', message: response.mensaje || 'Error al crear horario' });
                }
            }
        } catch (error) {
            console.error("Error en submit:", error);
            notify({ type: 'error', message: error.response?.data?.mensaje || 'Error al guardar horario' });
        } finally {
            setCargando(false);
        }
    };

    const onEdit = (h) => {
        setForm({
            profesorId: h.profesor_id,
            materia: h.nombre_materia,
            salonId: h.salon_id,
            dia: h.dia_semana,
            inicio: h.hora_inicio.substring(0, 5),
            fin: h.hora_fin.substring(0, 5),
        });
        
        // Encontrar y establecer el profesor seleccionado para edición
        const profesor = profesores.find(p => p.profesor_id === h.profesor_id);
        setProfesorSeleccionado(profesor || null);
        
        setEditId(h.horario_id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = async (horarioId) => {
        if (!confirm("¿Eliminar este horario?")) return;
        
        try {
            setCargando(true);
            const response = await eliminarHorario(horarioId);
            
            if (response.ok) {
                // Recargar horarios
                const dataHorarios = await obtenerHorarios();
                setHorarios(dataHorarios.horarios || []);
                    notify({ type: 'success', message: 'Horario eliminado exitosamente' });
                
                if (editId === horarioId) {
                    setEditId(null);
                    setForm(emptyForm);
                    setProfesorSeleccionado(null);
                }
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

    // helpers para mostrar nombres
    const profName = (id) => {
        const profesor = profesores.find((p) => p.profesor_id === id);
        return profesor ? `${profesor.nombres} ${profesor.apellidos}` : "";
    };
    
    // Buscar nombre de salón por id en la estructura cargada
    const salonName = (id) => {
        for (const lugar of lugares) {
            for (const edificio of lugar.edificios || []) {
                for (const s of edificio.salones || []) {
                    if (s.salon_id === id) return s.nombre_salon;
                }
            }
        }
        return "";
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

    // agrupar por dia para el listado
    const porDia = useMemo(() => {
        const map = {};
        DIAS.forEach((d) => (map[d] = []));
        horarios.forEach((h) => map[h.dia_semana]?.push(h));
        // ordenar por inicio
        Object.values(map).forEach((list) =>
            list.sort((a, b) => toMins(a.hora_inicio.substring(0, 5)) - toMins(b.hora_inicio.substring(0, 5)))
        );
        return map;
    }, [horarios]);

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>Asignación de Horarios</h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Crear y gestionar horarios de clases
                </p>
            </div>

            {/* Formulario */}
            <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ marginTop: 0 }}>{editId ? "Editar Horario" : "Asignar Nuevo Horario"}</h3>

                <form onSubmit={submit}>
                    <div className="form__row form__row--2">
                        <div>
                            <label>Profesor</label>
                            {profesorSeleccionado ? (
                                <div>
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 8,
                                        padding: "10px 12px",
                                        border: "1px solid var(--border)",
                                        borderRadius: 4,
                                        backgroundColor: "#f0fdf4"
                                    }}>
                                        <span style={{ flex: 1, fontWeight: 600 }}>
                                            {profesorSeleccionado.nombres} {profesorSeleccionado.apellidos}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={limpiarProfesor}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                color: "#dc2626",
                                                cursor: "pointer",
                                                fontSize: 20,
                                                padding: "0 4px",
                                                lineHeight: 1
                                            }}
                                            title="Cambiar profesor"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <AutocompleteInput
                                    items={profesores}
                                    onSelect={handleSeleccionarProfesor}
                                    placeholder=" Buscar profesor por nombre o apellido..."
                                    disabled={cargando}
                                    getItemKey={(p) => p.profesor_id}
                                    getItemLabel={(p) => `${p.nombres} ${p.apellidos}`}
                                />
                            )}
                            {profesores.length === 0 && !cargando && (
                                <div className="form__hint" style={{ marginTop: 4 }}>
                                    No hay profesores registrados. Ve a la sección "Docentes" para agregar.
                                </div>
                            )}
                        </div>

                        <div>
                            <label>Materia</label>
                            <select
                                className="select"
                                name="materia"
                                value={form.materia}
                                onChange={onChange}
                                required
                                disabled={cargando}
                            >
                                <option value="">Seleccionar materia...</option>
                                {materias.map((m) => (
                                    <option key={m.materia_id} value={m.nombre_materia}>
                                        {m.nombre_materia}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form__row form__row--2" style={{ marginTop: 12 }}>
                        <div>
                            <label>Salón</label>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Lugar</label>
                                        <select className="select" value={selectedLugarId} onChange={(e) => { setSelectedLugarId(e.target.value); setSelectedEdificioId(""); }} required>
                                            <option value="">Seleccionar lugar...</option>
                                            {lugares.map((l) => (
                                                <option key={l.lugar_id} value={l.lugar_id}>{l.nombre_lugar}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <label>Edificio</label>
                                        <select className="select" value={selectedEdificioId} onChange={(e) => setSelectedEdificioId(e.target.value)} required>
                                            <option value="">Seleccionar edificio...</option>
                                            {(lugares.find(l => String(l.lugar_id) === String(selectedLugarId))?.edificios || lugares.flatMap(l => l.edificios || [])).map((ed) => (
                                                <option key={ed.edificio_id} value={ed.edificio_id}>{ed.nombre_edificio}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <label>Salón</label>
                                        <select
                                            className="select"
                                            name="salonId"
                                            value={form.salonId}
                                            onChange={onChange}
                                            required
                                        >
                                            <option value="">Seleccionar salón...</option>
                                            {salonesFiltrados().map((s) => (
                                                <option key={s.salon_id} value={s.salon_id}>{s.nombre_salon} {s.tipo_salon ? ` - ${s.tipo_salon}` : ""}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                        </div>

                        <div>
                            <label>Día</label>
                            <select
                                className="select"
                                name="dia"
                                value={form.dia}
                                onChange={onChange}
                                required
                            >
                                <option value="">Seleccionar día...</option>
                                {DIAS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form__row form__row--2" style={{ marginTop: 12 }}>
                        <div>
                            <label>Hora Inicio</label>
                            <select
                                className="select"
                                name="inicio"
                                value={form.inicio}
                                onChange={onChange}
                                required
                            >
                                <option value="">Seleccionar hora...</option>
                                {horas.map((h) => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Hora Fin</label>
                            <select
                                className="select"
                                name="fin"
                                value={form.fin}
                                onChange={onChange}
                                required
                            >
                                <option value="">Seleccionar hora...</option>
                                {horas.map((h) => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                        <button 
                            type="submit" 
                            className="btn btn--primary"
                            disabled={cargando}
                        >
                            {cargando ? "Cargando..." : editId ? "Actualizar Horario" : "Asignar Horario"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setEditId(null);
                                    setForm(emptyForm);
                                    setProfesorSeleccionado(null);
                                }}
                                disabled={cargando}
                            >
                                Cancelar edición
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Listado por dia */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Horarios Registrados</h3>

                {horarios.length === 0 ? (
                    <div className="form__hint">Aún no hay horarios registrados.</div>
                ) : (
                    <div className="grid" style={{ gap: 12 }}>
                        {DIAS.map((dia) => (
                            <div key={dia} className="card" style={{ borderColor: "var(--border)" }}>
                                <div style={{ fontWeight: 700, marginBottom: 8 }}>{dia}</div>

                                {porDia[dia].length === 0 ? (
                                    <div className="form__hint">Sin clases.</div>
                                ) : (
                                    <div style={{ overflowX: "auto" }}>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Profesor</th>
                                                    <th>Materia</th>
                                                    <th>Salón</th>
                                                    <th>Inicio</th>
                                                    <th>Fin</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {porDia[dia].map((h) => (
                                                    <tr key={h.horario_id}>
                                                        <td>{h.nombres} {h.apellidos}</td>
                                                        <td>{h.nombre_materia}</td>
                                                        <td>{salonName(h.salon_id)}</td>
                                                        <td>{h.hora_inicio.substring(0, 5)}</td>
                                                        <td>{h.hora_fin.substring(0, 5)}</td>
                                                        <td style={{ textAlign: "right" }}>
                                                            <button className="link-btn" onClick={() => onEdit(h)}>
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="link-btn link-btn--danger"
                                                                onClick={() => onDelete(h.horario_id)}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Información del profesor - se muestra automáticamente */}
            {profesorSeleccionado && infoProfesor && (
                <InfoProfesorModal
                    profesorNombre={`${profesorSeleccionado.nombres} ${profesorSeleccionado.apellidos}`}
                    infoProfesor={infoProfesor}
                />
            )}
        </>
    );
}
