import { useMemo, useState } from "react";

// util: crea arreglo [1..n]
const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

// estructura vacia por semestre
const emptySem = () => ({ materias: ["", "", "", ""] });

const emptyCareer = {
    nombre: "",
    semestres: 0,
    plan: {}, 
};

export default function PlanesEstudio() {
    const [form, setForm] = useState(emptyCareer);
    const [carreras, setCarreras] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // semestres activos segun selección
    const semKeys = useMemo(() => range(Number(form.semestres || 0)), [form.semestres]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: name === "semestres" ? Number(value) : value }));
    };

    // asegura que existan contenedores por semestre cuando se elige "numero de semestres"
    const ensureSemesters = (count) => {
        setForm((f) => {
            const plan = { ...f.plan };
            for (let i = 1; i <= count; i++) {
                if (!plan[i]) plan[i] = emptySem();
            }
            // si se baja el numero, limpia el extra que tenga de semestre
            Object.keys(plan)
                .map(Number)
                .forEach((k) => {
                    if (k > count) delete plan[k];
                });
            return { ...f, plan };
        });
    };

    const onSemestresSelect = (e) => {
        onChange(e);
        const count = Number(e.target.value || 0);
        ensureSemesters(count);
    };

    const onMateriaChange = (sem, idx, value) => {
        setForm((f) => {
            const plan = { ...f.plan };
            const materias = [...(plan[sem]?.materias || [])];
            materias[idx] = value;
            plan[sem] = { materias };
            return { ...f, plan };
        });
    };

    const addMateria = (sem) => {
        setForm((f) => {
            const plan = { ...f.plan };
            const materias = [...(plan[sem]?.materias || [])];
            materias.push("");
            plan[sem] = { materias };
            return { ...f, plan };
        });
    };

    const removeMateria = (sem, idx) => {
        setForm((f) => {
            const plan = { ...f.plan };
            const materias = [...(plan[sem]?.materias || [])];
            materias.splice(idx, 1);
            plan[sem] = { materias };
            return { ...f, plan };
        });
    };

    const validar = () => {
        if (!form.nombre.trim()) return "El nombre de la carrera es obligatorio.";
        if (!form.semestres || form.semestres < 1) return "Selecciona el número de semestres.";
        // (opcional) validar que haya al menos 1 materia en cada semestre
        for (const s of semKeys) {
            const list = (form.plan[s]?.materias || []).filter((m) => m.trim() !== "");
            if (list.length === 0) return `Agrega al menos una materia en el semestre ${s}.`;
        }
        return null;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const err = validar();
        if (err) return alert(err);

        const payload = {
            id: editingId ?? crypto.randomUUID(),
            nombre: form.nombre.trim(),
            semestres: form.semestres,
            plan: form.plan,
        };

        if (editingId) {
            setCarreras((arr) => arr.map((c) => (c.id === editingId ? payload : c)));
            setEditingId(null);
        } else {
            setCarreras((arr) => [...arr, payload]);
        }
        setForm(emptyCareer);
    };

    const onEdit = (car) => {
        setForm({
            nombre: car.nombre,
            semestres: car.semestres,
            plan: car.plan,
        });
        setEditingId(car.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = (id) => {
        if (confirm("¿Eliminar este plan de estudios?")) {
            setCarreras((arr) => arr.filter((c) => c.id !== id));
            if (editingId === id) {
                setEditingId(null);
                setForm(emptyCareer);
            }
        }
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>Planes de Estudio</h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Gestionar carreras y materias
                </p>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ marginTop: 0 }}>Crear Nueva Carrera</h3>

                <form onSubmit={onSubmit}>
                    <div className="form__row form__row--2">
                        <div>
                            <label>Nombre de la Carrera</label>
                            <input
                                className="input"
                                name="nombre"
                                placeholder="Ej: Ingeniería en Sistemas"
                                value={form.nombre}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Número de Semestres</label>
                            <select
                                className="select"
                                name="semestres"
                                value={form.semestres || ""}
                                onChange={onSemestresSelect}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {[6, 7, 8, 9, 10].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Semestres */}
                    {semKeys.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                                Materias por Semestre
                            </label>

                            <div className="grid" style={{ gap: 12 }}>
                                {semKeys.map((s) => (
                                    <div key={s} className="card" style={{ borderColor: "var(--border)" }}>
                                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{s}er Semestre</div>

                                        <div className="grid form__row--2" style={{ gap: 10 }}>
                                            {(form.plan[s]?.materias || []).map((m, idx) => (
                                                <div key={idx} className="form__row" style={{ gridTemplateColumns: "1fr auto" }}>
                                                    <input
                                                        className="input"
                                                        placeholder={`Materia ${idx + 1}`}
                                                        value={m}
                                                        onChange={(e) => onMateriaChange(s, idx, e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => removeMateria(s, idx)}
                                                        title="Eliminar"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginTop: 10 }}>
                                            <button type="button" className="btn" onClick={() => addMateria(s)}>
                                                Añadir materia
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                        <button type="submit" className="btn btn--primary">
                            {editingId ? "Actualizar Plan de Estudios" : "Crear Plan de Estudios"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm(emptyCareer);
                                }}
                            >
                                Cancelar edición
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* listado de carreras creadas */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Carreras Registradas</h3>

                {carreras.length === 0 ? (
                    <div className="form__hint">Aún no hay carreras registradas.</div>
                ) : (
                    <div className="grid" style={{ gap: 12 }}>
                        {carreras.map((c) => (
                            <div key={c.id} className="card" style={{ borderColor: "var(--border)" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: 8,
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{c.nombre}</div>
                                        <div className="form__hint">Semestres: {c.semestres}</div>
                                        <div className="form__hint" style={{ marginTop: 6 }}>
                                            Materias totales:{" "}
                                            {Object.values(c.plan).reduce(
                                                (acc, s) => acc + (s.materias || []).filter((m) => m.trim() !== "").length,
                                                0
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <button className="link-btn" onClick={() => onEdit(c)}>
                                            Editar
                                        </button>
                                        <button className="link-btn link-btn--danger" onClick={() => onDelete(c.id)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                {/* resumen corto por semestre */}
                                <div className="grid" style={{ gap: 8, marginTop: 10 }}>
                                    {range(c.semestres).map((s) => {
                                        const materias = (c.plan[s]?.materias || []).filter((m) => m.trim() !== "");
                                        return (
                                            <div key={s} className="card" style={{ padding: 10 }}>
                                                <div style={{ fontWeight: 600, marginBottom: 6 }}>{s}er Semestre</div>
                                                {materias.length ? (
                                                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                                                        {materias.map((m, idx) => (
                                                            <li key={idx} style={{ fontSize: 14 }}>{m}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="form__hint">Sin materias.</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
