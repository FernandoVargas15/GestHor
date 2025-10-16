import { useEffect, useMemo, useState } from "react";
import * as lugaresService from "../../services/lugaresService";

const TIPOS_SALON = ["Aula Regular", "Laboratorio", "Auditorio", "Taller"];

function emptyBuilding() {
    return { nombre: "", descripcion: "" };
}
function emptyClassroom() {
    return { edificioId: "", numero: "", capacidad: "", tipo: TIPOS_SALON[0] };
}

export default function Lugares() {
    const [edificios, setEdificios] = useState([]);
    const [formEdificio, setFormEdificio] = useState(emptyBuilding());
    const [editEdificioId, setEditEdificioId] = useState(null);

    const [formSalon, setFormSalon] = useState(emptyClassroom());
    const [editSalon, setEditSalon] = useState({ edificioId: null, salonId: null });

    // Cargar edificios al montar
    useEffect(() => {
        cargarEdificios();
    }, []);

    const cargarEdificios = async () => {
        try {
            const data = await lugaresService.obtenerEdificios();
            setEdificios(data);
        } catch (error) {
            console.error("Error al cargar edificios:", error);
            alert("Error al cargar edificios");
        }
    };

    // ======= VALIDACIONES =======
    const onChangeEdificio = (e) => {
        const { name, value } = e.target;
        setFormEdificio((f) => ({ ...f, [name]: value }));
    };

    const validarEdificio = () => {
        if (!formEdificio.nombre.trim()) return "El nombre del edificio es obligatorio.";
        return null;
    };

    const onChangeSalon = (e) => {
        const { name, value } = e.target;
        setFormSalon((f) => ({
            ...f,
            [name]: name === "capacidad" ? value.replace(/\D/g, "") : value,
        }));
    };

    const validarSalon = () => {
        if (!formSalon.edificioId) return "Selecciona un edificio.";
        if (!formSalon.numero.trim()) return "El número/nombre del salón es obligatorio.";
        if (!formSalon.capacidad) return "La capacidad es obligatoria.";
        return null;
    };

    // ======= CRUD EDIFICIOS =======
    const submitEdificio = async (e) => {
        e.preventDefault();
        const err = validarEdificio();
        if (err) return alert(err);

        try {
            if (editEdificioId) {
                const edificioActualizado = await lugaresService.actualizarEdificio(
                    editEdificioId,
                    formEdificio
                );
                setEdificios((prev) =>
                    prev.map((ed) =>
                        ed.id === editEdificioId
                            ? { ...edificioActualizado, salones: ed.salones }
                            : ed
                    )
                );
                setEditEdificioId(null);
            } else {
                const nuevoEdificio = await lugaresService.crearEdificio(formEdificio);
                setEdificios((prev) => [...prev, { ...nuevoEdificio, salones: [] }]);
            }
            setFormEdificio(emptyBuilding());
        } catch (error) {
            console.error("Error al guardar edificio:", error);
            alert("Error al guardar edificio");
        }
    };

    const editarEdificio = (ed) => {
        setEditEdificioId(ed.id);
        setFormEdificio({ nombre: ed.nombre, descripcion: ed.descripcion || "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const eliminarEdificio = async (id) => {
        if (!confirm("¿Está seguro de eliminar este edificio?")) return;
        try {
            await lugaresService.eliminarEdificio(id);
            setEdificios((prev) => prev.filter((ed) => ed.id !== id));
        } catch (error) {
            console.error("Error al eliminar edificio:", error);
            alert("Error al eliminar edificio");
        }
    };

    // ======= CRUD SALONES =======
    const submitSalon = async (e) => {
        e.preventDefault();
        const err = validarSalon();
        if (err) return alert(err);

        try {
            if (editSalon.salonId) {
                const salonActualizado = await lugaresService.actualizarSalon(
                    editSalon.salonId,
                    formSalon
                );
                setEdificios((prev) =>
                    prev.map((ed) =>
                        ed.id === editSalon.edificioId
                            ? {
                                  ...ed,
                                  salones: ed.salones.map((s) =>
                                      s.id === editSalon.salonId ? salonActualizado : s
                                  ),
                              }
                            : ed
                    )
                );
                setEditSalon({ edificioId: null, salonId: null });
            } else {
                const nuevoSalon = await lugaresService.crearSalon(formSalon);
                setEdificios((prev) =>
                    prev.map((ed) =>
                        ed.id === formSalon.edificioId
                            ? { ...ed, salones: [...ed.salones, nuevoSalon] }
                            : ed
                    )
                );
            }
            setFormSalon(emptyClassroom());
        } catch (error) {
            console.error("Error al guardar salón:", error);
            alert("Error al guardar salón");
        }
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

    const eliminarSalon = async (edificioId, salonId) => {
        if (!confirm("¿Está seguro de eliminar este salón?")) return;

        try {
            await lugaresService.eliminarSalon(salonId);
            setEdificios((prev) =>
                prev.map((ed) =>
                    ed.id === edificioId
                        ? { ...ed, salones: ed.salones.filter((s) => s.id !== salonId) }
                        : ed
                )
            );
        } catch (error) {
            console.error("Error al eliminar salón:", error);
            alert("Error al eliminar salón");
        }
    };

    const optionsEdificios = useMemo(
        () => edificios.map((e) => ({ value: e.id, label: e.nombre })),
        [edificios]
    );

    // ======= RENDER =======
    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>
                    Gestión de Lugares
                </h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Administrar edificios y salones
                </p>
            </div>

            <div className="grid grid--2" style={{ marginBottom: 16 }}>
                {/* Edificio */}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>
                        {editEdificioId ? "Editar Edificio" : "Registrar Edificio"}
                    </h3>
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
                                {editEdificioId
                                    ? "Actualizar Edificio"
                                    : "Agregar Edificio"}
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
                    <h3 style={{ marginTop: 0 }}>
                        {editSalon.salonId ? "Editar Salón" : "Registrar Salón"}
                    </h3>

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
                                    <option key={op.value} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div
                            className="form__row form__row--2"
                            style={{ marginTop: 12 }}
                        >
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
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                            <button type="submit" className="btn btn--primary">
                                {editSalon.salonId
                                    ? "Actualizar Salón"
                                    : "Agregar Salón"}
                            </button>
                            {editSalon.salonId && (
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setEditSalon({
                                            edificioId: null,
                                            salonId: null,
                                        });
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

            {/* Listado */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Edificios y Salones Registrados</h3>
                <div className="grid" style={{ gap: 16 }}>
                    {edificios.map((ed) => (
                        <div
                            key={ed.id}
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
                                    <div style={{ fontWeight: 700 }}>
                                        {ed.nombre}
                                    </div>
                                    {ed.descripcion && (
                                        <div className="form__hint">
                                            {ed.descripcion}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <button
                                        className="link-btn"
                                        onClick={() => editarEdificio(ed)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="link-btn link-btn--danger"
                                        onClick={() =>
                                            eliminarEdificio(ed.id)
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {/* Salones */}
                            <div
                                className="grid"
                                style={{ gap: 8, marginTop: 10 }}
                            >
                                {ed.salones.length === 0 && (
                                    <div className="form__hint">
                                        Sin salones registrados.
                                    </div>
                                )}
                                {ed.salones.map((s) => (
                                    <div
                                        key={s.id}
                                        className="card"
                                        style={{ padding: 10 }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600 }}>
                                                    {s.numero}
                                                </div>
                                                <div className="form__hint">
                                                    {s.tipo} •{" "}
                                                    <span
                                                        style={{
                                                            color: "#16a34a",
                                                        }}
                                                    >
                                                        {s.capacidad} lugares
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    className="link-btn"
                                                    onClick={() =>
                                                        editarSalon(ed.id, s)
                                                    }
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="link-btn link-btn--danger"
                                                    onClick={() =>
                                                        eliminarSalon(
                                                            ed.id,
                                                            s.id
                                                        )
                                                    }
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

                    {edificios.length === 0 && (
                        <div className="form__hint">
                            Aún no hay edificios.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
