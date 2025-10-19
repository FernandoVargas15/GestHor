import { useEffect, useMemo, useState } from "react";
import * as lugaresService from "../../services/lugaresService";

const TIPOS_EDIFICIO = ["Académico", "Laboratorio", "Administrativo"];
const TIPOS_SALON = ["Aula", "Laboratorio", "Salas de usos múltiples", "Taller"];

function emptyLugar() {
    return { nombre_lugar: "", tipo_lugar: "" };
}

function emptyEdificio() {
    return { lugar_id: "", nombre_edificio: "", tipo_edificio: "" };
}

function emptySalon() {
    return { edificio_id: "", nombre_salon: "", tipo_salon: "" };
}

export default function Lugares() {
    const [lugares, setLugares] = useState([]);
    const [formLugar, setFormLugar] = useState(emptyLugar());
    const [editLugarId, setEditLugarId] = useState(null);

    const [formEdificio, setFormEdificio] = useState(emptyEdificio());
    const [editEdificioId, setEditEdificioId] = useState(null);

    const [formSalon, setFormSalon] = useState(emptySalon());
    const [editSalonId, setEditSalonId] = useState(null);

    useEffect(() => {
        cargarEstructura();
    }, []);

    const cargarEstructura = async () => {
        try {
            const data = await lugaresService.obtenerEstructura();
            // API devuelve { ok: true, lugares: [...] }
            setLugares(data.lugares || []);
        } catch (error) {
            console.error("Error al cargar lugares:", error);
            alert("Error al cargar lugares");
        }
    };

    // ======= VALIDACIONES =======
    // ======= handlers de formulario =======
    const onChangeLugar = (e) => {
        const { name, value } = e.target;
        setFormLugar((f) => ({ ...f, [name]: value }));
    };

    const validarLugar = () => {
        if (!formLugar.nombre_lugar.trim()) return "El nombre del lugar es obligatorio.";
        return null;
    };

    const onChangeEdificio = (e) => {
        const { name, value } = e.target;
        setFormEdificio((f) => ({ ...f, [name]: value }));
    };

    const validarEdificio = () => {
        if (!formEdificio.lugar_id) return "Selecciona un lugar.";
        if (!formEdificio.nombre_edificio.trim()) return "El nombre del edificio es obligatorio.";
        return null;
    };

    const onChangeSalon = (e) => {
        const { name, value } = e.target;
        setFormSalon((f) => ({ ...f, [name]: value }));
    };

    const validarSalon = () => {
        if (!formSalon.edificio_id) return "Selecciona un edificio.";
        if (!formSalon.nombre_salon.trim()) return "El nombre del salón es obligatorio.";
        return null;
    };

    // ======= CRUD LUGARES =======
    const submitLugar = async (e) => {
        e.preventDefault();
        const err = validarLugar();
        if (err) return alert(err);

        try {
            if (editLugarId) {
                const actualizado = await lugaresService.actualizarLugar(editLugarId, formLugar);
                // actualizar en memoria
                setLugares((prev) => prev.map((l) => (l.lugar_id === editLugarId ? { ...l, ...actualizado.lugar } : l)));
                setEditLugarId(null);
            } else {
                const nuevo = await lugaresService.crearLugar(formLugar);
                // recargar estructura para mantener consistencia
                await cargarEstructura();
            }
            setFormLugar(emptyLugar());
        } catch (error) {
            console.error("Error al guardar lugar:", error);
            alert(error.message || "Error al guardar lugar");
        }
    };

    const editarLugar = (lugar) => {
        setEditLugarId(lugar.lugar_id);
        setFormLugar({ nombre_lugar: lugar.nombre_lugar, tipo_lugar: lugar.tipo_lugar || "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const eliminarLugar = async (id) => {
        if (!confirm("¿Está seguro de eliminar este lugar y todos sus edificios/salones?")) return;
        try {
            await lugaresService.eliminarLugar(id);
            setLugares((prev) => prev.filter((l) => l.lugar_id !== id));
        } catch (error) {
            console.error("Error al eliminar lugar:", error);
            alert("Error al eliminar lugar");
        }
    };

    // ======= CRUD EDIFICIOS =======
    const submitEdificio = async (e) => {
        e.preventDefault();
        const err = validarEdificio();
        if (err) return alert(err);

        try {
            if (editEdificioId) {
                const actualizado = await lugaresService.actualizarEdificio(editEdificioId, {
                    nombre_edificio: formEdificio.nombre_edificio,
                    tipo_edificio: formEdificio.tipo_edificio,
                });
                await cargarEstructura();
                setEditEdificioId(null);
            } else {
                await lugaresService.crearEdificio({
                    lugar_id: formEdificio.lugar_id,
                    nombre_edificio: formEdificio.nombre_edificio,
                    tipo_edificio: formEdificio.tipo_edificio,
                });
                await cargarEstructura();
            }
            setFormEdificio(emptyEdificio());
        } catch (error) {
            console.error("Error al guardar edificio:", error);
            alert(error.message || "Error al guardar edificio");
        }
    };

    const editarEdificio = (lugarId, edificio) => {
        setEditEdificioId(edificio.edificio_id);
        setFormEdificio({ lugar_id: lugarId, nombre_edificio: edificio.nombre_edificio, tipo_edificio: edificio.tipo_edificio || "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const eliminarEdificio = async (id) => {
        if (!confirm("¿Está seguro de eliminar este edificio y sus salones?")) return;
        try {
            await lugaresService.eliminarEdificio(id);
            await cargarEstructura();
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
            if (editSalonId) {
                await lugaresService.actualizarSalon(editSalonId, {
                    nombre_salon: formSalon.nombre_salon,
                    tipo_salon: formSalon.tipo_salon,
                });
                await cargarEstructura();
                setEditSalonId(null);
            } else {
                await lugaresService.crearSalon({
                    edificio_id: formSalon.edificio_id,
                    nombre_salon: formSalon.nombre_salon,
                    tipo_salon: formSalon.tipo_salon,
                });
                await cargarEstructura();
            }
            setFormSalon(emptySalon());
        } catch (error) {
            console.error("Error al guardar salón:", error);
            alert(error.message || "Error al guardar salón");
        }
    };

    const editarSalon = (edificioId, salon) => {
        setEditSalonId(salon.salon_id);
        setFormSalon({ edificio_id: edificioId, nombre_salon: salon.nombre_salon, tipo_salon: salon.tipo_salon || "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const eliminarSalon = async (salonId) => {
        if (!confirm("¿Está seguro de eliminar este salón?")) return;
        try {
            await lugaresService.eliminarSalon(salonId);
            await cargarEstructura();
        } catch (error) {
            console.error("Error al eliminar salón:", error);
            alert("Error al eliminar salón");
        }
    };

    const optionsLugares = useMemo(() => lugares.map((l) => ({ value: l.lugar_id, label: l.nombre_lugar })), [lugares]);

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
                {/* Lugar */}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>{editLugarId ? "Editar Lugar" : "Registrar Lugar"}</h3>
                    <form onSubmit={submitLugar}>
                        <div>
                            <label>Nombre del Lugar</label>
                            <input className="input" name="nombre_lugar" placeholder="Ej: Facultad de Ingeniería" value={formLugar.nombre_lugar} onChange={onChangeLugar} required />
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <label>Tipo de Lugar</label>
                            <input className="input" name="tipo_lugar" placeholder="Ej: Facultad" value={formLugar.tipo_lugar} onChange={onChangeLugar} />
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                            <button type="submit" className="btn btn--primary">{editLugarId ? "Actualizar Lugar" : "Agregar Lugar"}</button>
                            {editLugarId && (
                                <button type="button" className="btn" onClick={() => { setEditLugarId(null); setFormLugar(emptyLugar()); }}>Cancelar edición</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Edificio */}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>{editEdificioId ? "Editar Edificio" : "Registrar Edificio"}</h3>
                    <form onSubmit={submitEdificio}>
                        <div>
                            <label>Lugar</label>
                            <select className="select" name="lugar_id" value={formEdificio.lugar_id} onChange={onChangeEdificio} required>
                                <option value="">Seleccionar lugar...</option>
                                {optionsLugares.map((op) => (<option key={op.value} value={op.value}>{op.label}</option>))}
                            </select>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <label>Nombre del Edificio</label>
                            <input className="input" name="nombre_edificio" placeholder="Ej: Edificio A" value={formEdificio.nombre_edificio} onChange={onChangeEdificio} required />
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <label>Tipo de Edificio</label>
                            <select className="select" name="tipo_edificio" value={formEdificio.tipo_edificio} onChange={onChangeEdificio}>
                                {TIPOS_EDIFICIO.map((t) => (<option key={t} value={t}>{t}</option>))}
                            </select>
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                            <button type="submit" className="btn btn--primary">{editEdificioId ? "Actualizar Edificio" : "Agregar Edificio"}</button>
                            {editEdificioId && (
                                <button type="button" className="btn" onClick={() => { setEditEdificioId(null); setFormEdificio(emptyEdificio()); }}>Cancelar edición</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Salon */}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>{editSalonId ? "Editar Salón" : "Registrar Salón"}</h3>
                    <form onSubmit={submitSalon}>
                        <div>
                            <label>Edificio</label>
                            <select className="select" name="edificio_id" value={formSalon.edificio_id} onChange={onChangeSalon} required>
                                <option value="">Seleccionar edificio...</option>
                                {lugares.flatMap(l => l.edificios || []).map((ed) => (
                                    <option key={ed.edificio_id} value={ed.edificio_id}>{ed.nombre_edificio} — {lugares.find(x => x.lugar_id === ed.lugar_id)?.nombre_lugar || ''}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <label>Nombre del Salón</label>
                            <input className="input" name="nombre_salon" placeholder="Ej: 101 / LabComp" value={formSalon.nombre_salon} onChange={onChangeSalon} required />
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <label>Tipo de Salón</label>
                            <select className="select" name="tipo_salon" value={formSalon.tipo_salon} onChange={onChangeSalon}>
                                {TIPOS_SALON.map((t) => (<option key={t} value={t}>{t}</option>))}
                            </select>
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                            <button type="submit" className="btn btn--primary">{editSalonId ? "Actualizar Salón" : "Agregar Salón"}</button>
                            {editSalonId && (
                                <button type="button" className="btn" onClick={() => { setEditSalonId(null); setFormSalon(emptySalon()); }}>Cancelar edición</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Listado */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Edificios y Salones Registrados</h3>
                <div className="grid" style={{ gap: 16 }}>
                    {lugares.length === 0 && (
                        <div className="form__hint">Aún no hay lugares.</div>
                    )}

                    {lugares.map((lugar) => (
                        <div key={lugar.lugar_id} className="card" style={{ borderColor: "var(--border)" }}>
                            <div style={{ marginBottom: 8 }}>
                                <div style={{ fontWeight: 700 }}>{lugar.nombre_lugar}</div>
                                {lugar.tipo_lugar && <div className="form__hint">{lugar.tipo_lugar}</div>}
                            </div>

                            {(lugar.edificios || []).length === 0 && (
                                <div className="form__hint">Sin edificios registrados en este lugar.</div>
                            )}

                            {(lugar.edificios || []).map((ed) => (
                                <div key={ed.edificio_id} className="card" style={{ marginBottom: 10, padding: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{ed.nombre_edificio}</div>
                                            {ed.tipo_edificio && <div className="form__hint">{ed.tipo_edificio}</div>}
                                        </div>
                                        <div>
                                            <button className="link-btn" onClick={() => editarEdificio(lugar.lugar_id, ed)}>Editar</button>
                                            <button className="link-btn link-btn--danger" onClick={() => eliminarEdificio(ed.edificio_id)}>Eliminar</button>
                                        </div>
                                    </div>

                                    {/* Salones */}
                                    <div className="grid" style={{ gap: 8, marginTop: 10 }}>
                                        {(ed.salones || []).length === 0 && (
                                            <div className="form__hint">Sin salones registrados.</div>
                                        )}
                                        {(ed.salones || []).map((s) => (
                                            <div key={s.salon_id} className="card" style={{ padding: 10 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{s.nombre_salon}</div>
                                                        <div className="form__hint">{s.tipo_salon || ""}</div>
                                                    </div>
                                                    <div>
                                                        <button className="link-btn" onClick={() => editarSalon(ed.edificio_id, s)}>Editar</button>
                                                        <button className="link-btn link-btn--danger" onClick={() => eliminarSalon(s.salon_id)}>Eliminar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
