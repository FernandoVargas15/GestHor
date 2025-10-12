import { useMemo, useState } from "react";

const SUBJECT_OPTIONS = [
    "Matemáticas I",
    "Álgebra",
    "Cálculo",
    "Geometría",
];

function emptyForm() {
    return {
        nombre: "",
        matricula: "",
        estudios: "",
        plaza: "",
        contrato: "",
        direccion: "",
        telefono: "",
        email: "",
        materias: [],
    };
}

export default function Docentes() {
    // Lista inicial (demo)
    const [docentes, setDocentes] = useState([
        {
            id: crypto.randomUUID(),
            nombre: "Prof. Juan Pérez",
            matricula: "MAT001",
            email: "juan.perez@escuela.edu",
            telefono: "",
            estudios: "Licenciatura en Matemáticas",
            plaza: "",
            contrato: "",
            direccion: "",
            materias: ["Matemáticas I", "Álgebra"],
        },
    ]);

    const [form, setForm] = useState(emptyForm());
    const [editingId, setEditingId] = useState(null);
    const materiasSet = useMemo(() => new Set(form.materias), [form.materias]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const toggleMateria = (materia) => {
        setForm((f) => {
            const current = new Set(f.materias);
            current.has(materia) ? current.delete(materia) : current.add(materia);
            return { ...f, materias: Array.from(current) };
        });
    };

    const validar = () => {
        if (!form.nombre.trim()) return "El nombre es obligatorio.";
        if (!form.matricula.trim()) return "La matrícula es obligatoria.";
        if (!form.email.trim()) return "El correo es obligatorio.";
        // validación simple email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Correo no válido.";
        return null;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const err = validar();
        if (err) return alert(err);

        if (editingId) {
            setDocentes((list) =>
                list.map((d) => (d.id === editingId ? { ...d, ...form } : d))
            );
            setEditingId(null);
        } else {
            setDocentes((list) => [
                ...list,
                { id: crypto.randomUUID(), ...form },
            ]);
        }
        setForm(emptyForm());
    };

    const onEdit = (doc) => {
        setForm({
            nombre: doc.nombre,
            matricula: doc.matricula,
            estudios: doc.estudios || "",
            plaza: doc.plaza || "",
            contrato: doc.contrato || "",
            direccion: doc.direccion || "",
            telefono: doc.telefono || "",
            email: doc.email,
            materias: doc.materias || [],
        });
        setEditingId(doc.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = (id) => {
        if (confirm("¿Eliminar este docente?")) {
            setDocentes((list) => list.filter((d) => d.id !== id));
            if (editingId === id) {
                setEditingId(null);
                setForm(emptyForm());
            }
        }
    };

    const enviarCredenciales = () => {
        if (!form.email) return alert("Primero completa el correo.");
        alert(`Credenciales enviadas a ${form.email}`);
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>Gestión de Docentes</h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Administrar profesores del sistema
                </p>
            </div>

            <div className="grid grid--2">
                {/* Formulario */}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>Registrar Nuevo Docente</h3>

                    <form onSubmit={onSubmit}>
                        <div className="form__row form__row--2">
                            <div>
                                <label>Nombre Completo</label>
                                <input
                                    className="input"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={onChange}
                                    placeholder="Ej: Ana Martínez"
                                    required
                                />
                            </div>
                            <div>
                                <label>Matrícula</label>
                                <input
                                    className="input"
                                    name="matricula"
                                    value={form.matricula}
                                    onChange={onChange}
                                    placeholder="Ej: MAT023"
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 14 }}>
                            <label>Estudios</label>
                            <input
                                className="input"
                                name="estudios"
                                value={form.estudios}
                                onChange={onChange}
                                placeholder="Ej: Licenciatura en Matemáticas"
                            />
                        </div>

                        <div className="form__row form__row--2" style={{ marginTop: 14 }}>
                            <div>
                                <label>No. Plaza</label>
                                <input
                                    className="input"
                                    name="plaza"
                                    value={form.plaza}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <label>No. Contrato</label>
                                <input
                                    className="input"
                                    name="contrato"
                                    value={form.contrato}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 14 }}>
                            <label>Dirección</label>
                            <textarea
                                className="textarea"
                                name="direccion"
                                rows={2}
                                value={form.direccion}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form__row form__row--2" style={{ marginTop: 14 }}>
                            <div>
                                <label>Teléfono</label>
                                <input
                                    className="input"
                                    name="telefono"
                                    value={form.telefono}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <label>Correo Electrónico</label>
                                <input
                                    className="input"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 14 }}>
                            <label>Materias que puede impartir</label>
                            <div className="form__row form__row--2" style={{ marginTop: 8 }}>
                                {SUBJECT_OPTIONS.map((m) => (
                                    <label key={m} className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={materiasSet.has(m)}
                                            onChange={() => toggleMateria(m)}
                                        />
                                        <span>{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                            <button type="submit" className="btn btn--primary">
                                {editingId ? "Actualizar Docente" : "Guardar Docente"}
                            </button>
                            <button type="button" className="btn" onClick={enviarCredenciales}>
                                Enviar Credenciales
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm(emptyForm());
                                    }}
                                >
                                    Cancelar edición
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Listado / registrados*/}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>Docentes Registrados</h3>

                    <div className="form__hint" style={{ marginBottom: 10 }}>
                        Total: {docentes.length}
                    </div>

                    <div className="grid" style={{ gap: 12 }}>
                        {docentes.map((d) => (
                            <div
                                key={d.id}
                                className="card"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: 8,
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{d.nombre}</div>
                                        <div className="form__hint">Matrícula: {d.matricula}</div>
                                        {d.email && (
                                            <div className="form__hint">{d.email}</div>
                                        )}
                                        {!!(d.materias && d.materias.length) && (
                                            <div className="chips" style={{ marginTop: 8 }}>
                                                {d.materias.map((m) => (
                                                    <span key={m} className="chip">{m}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <button className="link-btn" onClick={() => onEdit(d)}>
                                            Editar
                                        </button>
                                        <button
                                            className="link-btn link-btn--danger"
                                            onClick={() => onDelete(d.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {docentes.length === 0 && (
                            <div className="form__hint">Sin registros aún.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
