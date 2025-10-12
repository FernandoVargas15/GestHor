import { useMemo, useState } from "react";

// simulacion de datos (conectar al backend luego)
const PROFESORES = [
    { id: "p1", nombre: "Prof. Juan Pérez" },
    { id: "p2", nombre: "Prof. María García" },
    { id: "p3", nombre: "Prof. Carlos López" },
];

const MATERIAS = [
    "Matemáticas I",
    "Álgebra",
    "Cálculo",
    "Geometría",
    "Física I",
    "Química General",
];

const SALONES = [
    { id: "s101", nombre: "Aula 101" },
    { id: "s102", nombre: "Aula 102" },
    { id: "s103", nombre: "Lab 103" },
];

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
    const [horarios, setHorarios] = useState([]); // [{id, profesorId, materia, salonId, dia, inicio, fin}]
    const [editId, setEditId] = useState(null);

    const horas = useMemo(() => timeRange("07:00", "22:00", 60), []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
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

    const submit = (e) => {
        e.preventDefault();
        const err = validar();
        if (err) return alert(err);

        const payload = { id: editId ?? crypto.randomUUID(), ...form };

        if (editId) {
            setHorarios((arr) => arr.map((h) => (h.id === editId ? payload : h)));
            setEditId(null);
        } else {
            setHorarios((arr) => [...arr, payload]);
        }
        setForm(emptyForm);
    };

    const onEdit = (h) => {
        setForm({
            profesorId: h.profesorId,
            materia: h.materia,
            salonId: h.salonId,
            dia: h.dia,
            inicio: h.inicio,
            fin: h.fin,
        });
        setEditId(h.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = (id) => {
        if (!confirm("¿Eliminar este horario?")) return;
        setHorarios((arr) => arr.filter((h) => h.id !== id));
        if (editId === id) {
            setEditId(null);
            setForm(emptyForm);
        }
    };

    // helpers para mostrar nombres
    const profName = (id) => PROFESORES.find((p) => p.id === id)?.nombre || "";
    const salonName = (id) => SALONES.find((s) => s.id === id)?.nombre || "";

    // agrupar por dia para el listado
    const porDia = useMemo(() => {
        const map = {};
        DIAS.forEach((d) => (map[d] = []));
        horarios.forEach((h) => map[h.dia]?.push(h));
        // ordenar por inicio
        Object.values(map).forEach((list) =>
            list.sort((a, b) => toMins(a.inicio) - toMins(b.inicio))
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
                            <select
                                className="select"
                                name="profesorId"
                                value={form.profesorId}
                                onChange={onChange}
                                required
                            >
                                <option value="">Seleccionar profesor...</option>
                                {PROFESORES.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Materia</label>
                            <select
                                className="select"
                                name="materia"
                                value={form.materia}
                                onChange={onChange}
                                required
                            >
                                <option value="">Seleccionar materia...</option>
                                {MATERIAS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form__row form__row--2" style={{ marginTop: 12 }}>
                        <div>
                            <label>Salón</label>
                            <select
                                className="select"
                                name="salonId"
                                value={form.salonId}
                                onChange={onChange}
                                required
                            >
                                <option value="">Seleccionar salón...</option>
                                {SALONES.map((s) => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
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
                        <button type="submit" className="btn btn--primary">
                            {editId ? "Actualizar Horario" : "Asignar Horario"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setEditId(null);
                                    setForm(emptyForm);
                                }}
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
                                                    <tr key={h.id}>
                                                        <td>{profName(h.profesorId)}</td>
                                                        <td>{h.materia}</td>
                                                        <td>{salonName(h.salonId)}</td>
                                                        <td>{h.inicio}</td>
                                                        <td>{h.fin}</td>
                                                        <td style={{ textAlign: "right" }}>
                                                            <button className="link-btn" onClick={() => onEdit(h)}>
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="link-btn link-btn--danger"
                                                                onClick={() => onDelete(h.id)}
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
        </>
    );
}
