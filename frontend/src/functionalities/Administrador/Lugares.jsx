import { useMemo, useState } from "react";

const TIPOS_SALON = ["Aula Regular", "Laboratorio", "Auditorio", "Taller"];

function emptyBuilding() {
    return { nombre: "", descripcion: "" };
}
function emptyClassroom() {
    return { edificioId: "", numero: "", capacidad: "", tipo: TIPOS_SALON[0] };
}

export default function Lugares() {
    // Demo inicial para verlo visualmente
    const [edificios, setEdificios] = useState([
        {
            id: crypto.randomUUID(),
            nombre: "Edificio A",
            descripcion: "",
            salones: [
                { id: crypto.randomUUID(), numero: "Aula 101", capacidad: 30, tipo: "Aula Regular" },
                { id: crypto.randomUUID(), numero: "Aula 102", capacidad: 25, tipo: "Aula Regular" },
                { id: crypto.randomUUID(), numero: "Lab 103", capacidad: 20, tipo: "Laboratorio" },
            ],
        },
    ]);

    // Formularios
    const [formEdificio, setFormEdificio] = useState(emptyBuilding());
    const [editEdificioId, setEditEdificioId] = useState(null);

    const [formSalon, setFormSalon] = useState(emptyClassroom());
    const [editSalon, setEditSalon] = useState({ edificioId: null, salonId: null });

    // Para el select de edificio en salón
    const optionsEdificios = useMemo(
        () => edificios.map((e) => ({ value: e.id, label: e.nombre })),
        [edificios]
    );

    // validaciones Edificio 
    const onChangeEdificio = (e) => {
        const { name, value } = e.target;
        setFormEdificio((f) => ({ ...f, [name]: value }));
    };

    const validarEdificio = () => {
        if (!formEdificio.nombre.trim()) return "El nombre del edificio es obligatorio.";
        return null;
    };

    const submitEdificio = (e) => {
        e.preventDefault();
        const err = validarEdificio();
        if (err) return alert(err);

        if (editEdificioId) {
            setEdificios((arr) =>
                arr.map((ed) =>
                    ed.id === editEdificioId ? { ...ed, nombre: formEdificio.nombre.trim(), descripcion: formEdificio.descripcion } : ed
                )
            );
            setEditEdificioId(null);
        } else {
            setEdificios((arr) => [
                ...arr,
                { id: crypto.randomUUID(), nombre: formEdificio.nombre.trim(), descripcion: formEdificio.descripcion, salones: [] },
            ]);
        }
        setFormEdificio(emptyBuilding());
    };

    const editarEdificio = (ed) => {
        setEditEdificioId(ed.id);
        setFormEdificio({ nombre: ed.nombre, descripcion: ed.descripcion || "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const eliminarEdificio = (id) => {
        if (!confirm("¿Eliminar el edificio y todos sus salones?")) return;
        setEdificios((arr) => arr.filter((e) => e.id !== id));
        if (editEdificioId === id) {
            setEditEdificioId(null);
            setFormEdificio(emptyBuilding());
        }
        if (editSalon.edificioId === id) {
            setEditSalon({ edificioId: null, salonId: null });
            setFormSalon(emptyClassroom());
        }
    };

    // validaciones Salon
    const onChangeSalon = (e) => {
        const { name, value } = e.target;
        setFormSalon((f) => ({ ...f, [name]: name === "capacidad" ? value.replace(/\D/g, "") : value }));
    };

    const validarSalon = () => {
        if (!formSalon.edificioId) return "Selecciona un edificio.";
        if (!formSalon.numero.trim()) return "El número/nombre del salón es obligatorio.";
        if (!formSalon.capacidad) return "La capacidad es obligatoria.";
        return null;
    };

    const submitSalon = (e) => {
        e.preventDefault();
        const err = validarSalon();
        if (err) return alert(err);

        const payload = {
            id: editSalon.salonId ?? crypto.randomUUID(),
            numero: formSalon.numero.trim(),
            capacidad: Number(formSalon.capacidad),
            tipo: formSalon.tipo,
        };

        setEdificios((arr) =>
            arr.map((ed) => {
                if (ed.id !== formSalon.edificioId) return ed;
                if (editSalon.salonId) {
                    // actualizar
                    return {
                        ...ed,
                        salones: ed.salones.map((s) => (s.id === editSalon.salonId ? payload : s)),
                    };
                }
                // crear
                return { ...ed, salones: [...ed.salones, payload] };
            })
        );

        setFormSalon(emptyClassroom());
        setEditSalon({ edificioId: null, salonId: null });
    };

    const editarSalon = (edificioId, salon) => {
        setFormSalon({
            edificioId,
            numero: salon.numero,
            capacidad: String(salon.capacidad),
            tipo: salon.tipo,
        });
        setEditSalon({ edificioId, salonId: salon.id });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const eliminarSalon = (edificioId, salonId) => {
        if (!confirm("¿Eliminar este salón?")) return;
        setEdificios((arr) =>
            arr.map((ed) =>
                ed.id === edificioId ? { ...ed, salones: ed.salones.filter((s) => s.id !== salonId) } : ed
            )
        );
        if (editSalon.salonId === salonId) {
            setEditSalon({ edificioId: null, salonId: null });
            setFormSalon(emptyClassroom());
        }
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>Gestión de Lugares</h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Administrar edificios y salones
                </p>
            </div>

            <div className="grid grid--2" style={{ marginBottom: 16 }}>
                {/* Edificio */}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>{editEdificioId ? "Editar Edificio" : "Registrar Edificio"}</h3>
                    <form onSubmit={submitEdificio}>
                        <div>
                            <label>Nombre del Edificio</label>
                            <input
                                className="input"
                                name="nombre"
                                placeholder="Ej: Edificio A"
                                value={formEdificio.nombre}
                                onChange={onChangeEdificio}
                                required
                            />
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <label>Descripción</label>
                            <textarea
                                className="textarea"
                                name="descripcion"
                                placeholder="Descripción del edificio"
                                rows={3}
                                value={formEdificio.descripcion}
                                onChange={onChangeEdificio}
                            />
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                            <button type="submit" className="btn btn--primary">
                                {editEdificioId ? "Actualizar Edificio" : "Agregar Edificio"}
                            </button>
                            {editEdificioId && (
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setEditEdificioId(null);
                                        setFormEdificio(emptyBuilding());
                                    }}
                                >
                                    Cancelar edición
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Salon */}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>{editSalon.salonId ? "Editar Salón" : "Registrar Salón"}</h3>

                    <form onSubmit={submitSalon}>
                        <div>
                            <label>Edificio</label>
                            <select
                                className="select"
                                name="edificioId"
                                value={formSalon.edificioId}
                                onChange={onChangeSalon}
                                required
                            >
                                <option value="">Seleccionar edificio...</option>
                                {optionsEdificios.map((op) => (
                                    <option key={op.value} value={op.value}>{op.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form__row form__row--2" style={{ marginTop: 12 }}>
                            <div>
                                <label>Número de Salón</label>
                                <input
                                    className="input"
                                    name="numero"
                                    placeholder="Ej: 101"
                                    value={formSalon.numero}
                                    onChange={onChangeSalon}
                                    required
                                />
                            </div>
                            <div>
                                <label>Capacidad</label>
                                <input
                                    className="input"
                                    name="capacidad"
                                    inputMode="numeric"
                                    placeholder="30"
                                    value={formSalon.capacidad}
                                    onChange={onChangeSalon}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <label>Tipo de Salón</label>
                            <select
                                className="select"
                                name="tipo"
                                value={formSalon.tipo}
                                onChange={onChangeSalon}
                            >
                                {TIPOS_SALON.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                            <button type="submit" className="btn btn--primary">
                                {editSalon.salonId ? "Actualizar Salón" : "Agregar Salón"}
                            </button>
                            {editSalon.salonId && (
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setEditSalon({ edificioId: null, salonId: null });
                                        setFormSalon(emptyClassroom());
                                    }}
                                >
                                    Cancelar edición
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* listado */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Edificios y Salones Registrados</h3>

                <div className="grid" style={{ gap: 16 }}>
                    {edificios.map((ed) => (
                        <div key={ed.id} className="card" style={{ borderColor: "var(--border)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{ed.nombre}</div>
                                    {ed.descripcion && <div className="form__hint">{ed.descripcion}</div>}
                                </div>
                                <div>
                                    <button className="link-btn" onClick={() => editarEdificio(ed)}>Editar</button>
                                    <button className="link-btn link-btn--danger" onClick={() => eliminarEdificio(ed.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {/* Salones */}
                            <div className="grid" style={{ gap: 8, marginTop: 10 }}>
                                {ed.salones.length === 0 && <div className="form__hint">Sin salones registrados.</div>}
                                {ed.salones.map((s) => (
                                    <div key={s.id} className="card" style={{ padding: 10 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{s.numero}</div>
                                                <div className="form__hint">
                                                    {s.tipo} • <span style={{ color: "#16a34a" }}>{s.capacidad} lugares</span>
                                                </div>
                                            </div>
                                            <div>
                                                <button className="link-btn" onClick={() => editarSalon(ed.id, s)}>Editar</button>
                                                <button
                                                    className="link-btn link-btn--danger"
                                                    onClick={() => eliminarSalon(ed.id, s.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {edificios.length === 0 && <div className="form__hint">Aún no hay edificios.</div>}
                </div>
            </div>
        </>
    );
}
