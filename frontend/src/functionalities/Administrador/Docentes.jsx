import { useState, useEffect } from "react";
import { useToast } from "../../components/ui/NotificacionFlotante";
import { obtenerDocentes, crearDocente, actualizarDocente, eliminarDocente } from "../../services/docenteService";
import { obtenerTiposContrato } from "./tipoContratoService";
import SearchInput from "../../components/ui/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import TiposContrato from "./TiposContrato"; // Importamos el componente de gestión

function emptyForm() {
    return {
        nombres: "",
        apellidos: "",
        matricula: "",
        email: "",
        grado_academico: "",
        numero_plaza: "",
        numero_contrato: "",
        direccion: "",
        telefono: "",
        tipo_contrato_id: "", // Campo nuevo para la prioridad
    };
}

export default function Docentes() {
    const [docentes, setDocentes] = useState([]);
    const [form, setForm] = useState(emptyForm());
    const [editingId, setEditingId] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [tiposContrato, setTiposContrato] = useState([]);
    const { notify } = useToast();
    
    // Buscar en nombres, apellidos, matricula y email
    const docentesFiltrados = useSearch(docentes, busqueda, ["nombres", "apellidos", "matricula", "email"]);

    useEffect(() => {
        cargarDocentes();
        cargarTiposContrato();
    }, []);

    const cargarDocentes = async () => {
        try {
            const data = await obtenerDocentes();
            setDocentes(data.docentes || []);
        } catch (error) {
            console.error("Error al cargar docentes:", error);
        }
    };

    const cargarTiposContrato = async () => {
        try {
            const data = await obtenerTiposContrato();
            setTiposContrato(data.tiposContrato || []);
        } catch (error) {
            console.error("Error al cargar tipos de contrato:", error);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            tipo_contrato_id: form.tipo_contrato_id ? parseInt(form.tipo_contrato_id) : null,
        };

        try {
            if (editingId) {
                await actualizarDocente(editingId, payload);
                    notify({ type: 'success', message: 'Docente actualizado' });
                setEditingId(null);
            } else {
                await crearDocente(payload);
                    notify({ type: 'success', message: 'Docente creado' });
            }
            setForm(emptyForm());
            // Recargamos ambos para mantener la consistencia
            cargarDocentes();
        } catch (error) {
            notify({ type: 'error', message: error.response?.data?.mensaje || 'Error' });
        }
    };

    const onEdit = (doc) => {
        setForm({
            nombres: doc.nombres || "",
            apellidos: doc.apellidos || "",
            matricula: doc.matricula || "",
            email: doc.email || "",
            grado_academico: doc.grado_academico || "",
            numero_plaza: doc.numero_plaza || "",
            numero_contrato: doc.numero_contrato || "",
            direccion: doc.direccion || "",
            telefono: doc.telefono || "",
            tipo_contrato_id: doc.tipo_contrato_id || "", // Asignamos el tipo de contrato al editar
        });
        setEditingId(doc.profesor_id);
    };

    const onDelete = async (id) => {
        if (!confirm("¿Eliminar?")) return;
        try {
            await eliminarDocente(id);
            cargarDocentes();
        } catch (error) {
            notify({ type: 'error', message: 'Error al eliminar' });
        }
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>Gestión de Docentes</h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Administra los docentes y sus niveles de prioridad de contratación.
                </p>
            </div>
            <div className="grid grid--2" style={{ marginBottom: 24 }}>
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>{editingId ? "Editar Docente" : "Registrar Docente"}</h3>
                    <form onSubmit={onSubmit}>
                        <div className="form__row form__row--2">
                            <div>
                                <label>Nombres</label>
                                <input className="input" name="nombres" value={form.nombres} onChange={onChange} required />
                            </div>
                            <div>
                                <label>Apellidos</label>
                                <input className="input" name="apellidos" value={form.apellidos} onChange={onChange} required />
                            </div>
                        </div>
                        <div className="form__row form__row--2">
                            <div>
                                <label>Matrícula</label>
                                <input className="input" name="matricula" value={form.matricula} onChange={onChange} required />
                            </div>
                            <div>
                                <label>Email</label>
                                <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />
                            </div>
                        </div>
                        <div><label>Grado Académico</label><input className="input" name="grado_academico" value={form.grado_academico} onChange={onChange} /></div>
                        <div className="form__row form__row--2">
                            <div><label>No. Plaza</label><input className="input" name="numero_plaza" value={form.numero_plaza} onChange={onChange} /></div>
                            <div><label>No. Contrato</label><input className="input" name="numero_contrato" value={form.numero_contrato} onChange={onChange} /></div>
                        </div>
                        <div><label>Dirección</label><textarea className="textarea" name="direccion" value={form.direccion} onChange={onChange} /></div>
                        <div><label>Teléfono</label><input type="text" className="input" name="telefono" value={form.telefono} onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                                onChange(e);
                            }
                        }}
                            maxLength={10}
                        /></div>

                        {/* === CAMPO NUEVO PARA TIPO DE CONTRATO === */}
                        <div style={{ marginTop: 12 }}>
                            <label>Tipo de Contrato (Prioridad)</label>
                            <select
                                className="select"
                                name="tipo_contrato_id"
                                value={form.tipo_contrato_id}
                                onChange={onChange}
                            >
                                <option value="">Sin asignar</option>
                                {tiposContrato.map((tipo) => (
                                    <option key={tipo.tipo_contrato_id} value={tipo.tipo_contrato_id}>
                                        {tipo.nombre_tipo} (Prioridad: {tipo.nivel_prioridad})
                                    </option>
                                ))}
                            </select>
                            <div className="form__hint">Define la prioridad del docente para la asignación de horarios.</div>
                        </div>

                        <button type="submit" className="btn btn--primary" style={{ marginTop: 16 }}>{editingId ? "Actualizar" : "Guardar"}</button>
                        {editingId && <button type="button" className="btn" style={{ marginTop: 16, marginLeft: 8 }} onClick={() => { setEditingId(null); setForm(emptyForm()); }}>Cancelar</button>}
                    </form>
                </div>
                <div className="card">
                    <h3>Registrados ({docentes.length})</h3>
                    
                    {/* Buscador */}
                    {docentes.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                            <SearchInput
                                value={busqueda}
                                onChange={setBusqueda}
                                placeholder=" Buscar docente (nombre, matrícula, email)..."
                            />
                        </div>
                    )}
                    
                    {docentesFiltrados.length === 0 && busqueda ? (
                        <div className="form__hint">
                            No se encontraron docentes que coincidan con "{busqueda}"
                        </div>
                    ) : (
                        docentesFiltrados.map((d) => (
                            <div key={d.profesor_id} className="card" style={{ marginBottom: 8 }}>
                                <div><strong>{d.nombres} {d.apellidos}</strong></div>
                                <div className="form__hint">Mat: {d.matricula} | Email: {d.email}</div>
                                {d.nombre_tipo && (
                                    <div className="form__hint" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                                        Contrato: {d.nombre_tipo} (Prioridad {d.nivel_prioridad})
                                    </div>
                                )}
                                <div style={{ marginTop: 8 }}>
                                    <button className="link-btn" onClick={() => onEdit(d)}>Editar</button>
                                    <button className="link-btn link-btn--danger" onClick={() => onDelete(d.profesor_id)}>Eliminar</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <TiposContrato />
        </>
    );
}
