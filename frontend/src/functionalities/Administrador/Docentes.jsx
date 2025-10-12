import { useState, useEffect } from "react";
import { obtenerDocentes, crearDocente, actualizarDocente, eliminarDocente } from "../../services/docenteService";

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
    };
}

export default function Docentes() {
    const [docentes, setDocentes] = useState([]);
    const [form, setForm] = useState(emptyForm());
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        cargarDocentes();
    }, []);

    const cargarDocentes = async () => {
        try {
            const data = await obtenerDocentes();
            setDocentes(data.docentes || []);
        } catch (error) {
            console.error("Error al cargar docentes:", error);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await actualizarDocente(editingId, form);
                alert("Docente actualizado");
                setEditingId(null);
            } else {
                await crearDocente(form);
                alert("Docente creado");
            }
            setForm(emptyForm());
            cargarDocentes();
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error");
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
        });
        setEditingId(doc.profesor_id);
    };

    const onDelete = async (id) => {
        if (!confirm("¿Eliminar?")) return;
        try {
            await eliminarDocente(id);
            cargarDocentes();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    return (
        <>
            <h2>Gestión de Docentes</h2>
            <div className="grid grid--2">
                <div className="card">
                    <h3>Formulario</h3>
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
                            // Solo permite números y máximo 10 dígitos
                            if (/^\d{0,10}$/.test(value)) {
                                onChange(e);
                            }
                        }}
                            maxLength={10}
                        /></div>
                        <button type="submit" className="btn btn--primary">{editingId ? "Actualizar" : "Guardar"}</button>
                        {editingId && <button type="button" className="btn" onClick={() => { setEditingId(null); setForm(emptyForm()); }}>Cancelar</button>}
                    </form>
                </div>
                <div className="card">
                    <h3>Registrados ({docentes.length})</h3>
                    {docentes.map((d) => (
                        <div key={d.profesor_id} className="card">
                            <div><strong>{d.nombres} {d.apellidos}</strong></div>
                            <div>Mat: {d.matricula}</div>
                            <div>Email: {d.email}</div>
                            <button className="link-btn" onClick={() => onEdit(d)}>Editar</button>
                            <button className="link-btn link-btn--danger" onClick={() => onDelete(d.profesor_id)}>Eliminar</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
