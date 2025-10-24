import { useState, useEffect } from "react";
import { useToast } from "../../components/ui/NotificacionFlotante";
import { 
    obtenerMaterias, 
    crearMateria, 
    actualizarMateria, 
    eliminarMateria 
} from "../../services/materiaService";
import SearchInput from "../../components/ui/SearchInput";
import { useSearch } from "../../hooks/useSearch";

function emptyForm() {
    return {
        nombre_materia: ""
    };
}

export default function Materias() {
    const [materias, setMaterias] = useState([]);
    const [form, setForm] = useState(emptyForm());
    const [editingId, setEditingId] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const { notify } = useToast();
    
    // Usar el hook de búsqueda
    const materiasFiltradas = useSearch(materias, busqueda, ["nombre_materia"]);

    useEffect(() => {
        cargarMaterias();
    }, []);

    const cargarMaterias = async () => {
        try {
            setCargando(true);
            const data = await obtenerMaterias();
            setMaterias(data.materias || []);
        } catch (error) {
            console.error("Error al cargar materias:", error);
            notify({ type: 'error', message: 'Error al cargar el catálogo de materias' });
        } finally {
            setCargando(false);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!form.nombre_materia.trim()) {
            notify({ type: 'error', message: 'El nombre de la materia es obligatorio' });
            return;
        }

        try {
            setCargando(true);

            if (editingId) {
                await actualizarMateria(editingId, form);
                notify({ type: 'success', message: 'Materia actualizada exitosamente' });
                setEditingId(null);
            } else {
                await crearMateria(form);
                notify({ type: 'success', message: 'Materia agregada al catálogo exitosamente' });
            }

            setForm(emptyForm());
            cargarMaterias();
        } catch (error) {
            console.error("Error al guardar materia:", error);
            notify({ type: 'error', message: error.response?.data?.mensaje || 'Error al guardar la materia' });
        } finally {
            setCargando(false);
        }
    };

    const onEdit = (materia) => {
        setForm({
            nombre_materia: materia.nombre_materia
        });
        setEditingId(materia.materia_id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = async (id) => {
        if (!confirm("¿Eliminar esta materia del catálogo? Solo se puede eliminar si no está asignada a ninguna carrera.")) return;

        try {
            setCargando(true);
            await eliminarMateria(id);
            notify({ type: 'success', message: 'Materia eliminada exitosamente' });
            cargarMaterias();

            if (editingId === id) {
                setEditingId(null);
                setForm(emptyForm());
            }
        } catch (error) {
            console.error("Error al eliminar materia:", error);
            notify({ type: 'error', message: error.response?.data?.mensaje || 'Error al eliminar la materia' });
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>Catálogo de Materias</h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Gestionar materias globales para asignar a carreras
                </p>
            </div>

            <div className="grid grid--2" style={{ marginBottom: 16, gap: 16 }}>
                {/* Formulario */}
                <div className="card">
                    <h3 style={{ marginTop: 0 }}>
                        {editingId ? "Editar Materia" : "Agregar Nueva Materia"}
                    </h3>
                    
                    <form onSubmit={onSubmit}>
                        <div style={{ marginBottom: 12 }}>
                            <label>Nombre de la Materia *</label>
                            <input
                                className="input"
                                name="nombre_materia"
                                placeholder="Ej: Matemáticas I"
                                value={form.nombre_materia}
                                onChange={onChange}
                                required
                                disabled={cargando}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button 
                                type="submit" 
                                className="btn btn--primary"
                                disabled={cargando}
                            >
                                {cargando ? "Guardando..." : editingId ? "Actualizar" : "Agregar"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm(emptyForm());
                                    }}
                                    disabled={cargando}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Listado */}
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <h3 style={{ margin: 0 }}>Materias Registradas ({materias.length})</h3>
                    </div>

                    {/* Buscador */}
                    <div style={{ marginBottom: 12 }}>
                        <SearchInput
                            value={busqueda}
                            onChange={setBusqueda}
                            placeholder=" Buscar materia..."
                            disabled={cargando}
                        />
                    </div>

                    {cargando ? (
                        <div className="form__hint">Cargando...</div>
                    ) : (
                        <div style={{ maxHeight: 500, overflowY: "auto" }}>
                            {materiasFiltradas.length === 0 ? (
                                <div className="form__hint">
                                    {busqueda ? "No se encontraron materias" : "Aún no hay materias en el catálogo"}
                                </div>
                            ) : (
                                materiasFiltradas.map((m) => (
                                    <div key={m.materia_id} className="card" style={{ marginBottom: 8, padding: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600 }}>{m.nombre_materia}</div>
                                                {m.descripcion && (
                                                    <div className="form__hint" style={{ marginTop: 4 }}>
                                                        {m.descripcion}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: "flex", gap: 4 }}>
                                                <button 
                                                    className="link-btn" 
                                                    onClick={() => onEdit(m)}
                                                    disabled={cargando}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="link-btn link-btn--danger"
                                                    onClick={() => onDelete(m.materia_id)}
                                                    disabled={cargando}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Información adicional */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>¿Cómo funciona?</h3>
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                    <li>Agrega materias aquí una sola vez al catálogo global</li>
                    <li>Luego, al crear o editar una carrera, selecciona las materias del catálogo</li>
                    <li>La misma materia puede asignarse a múltiples carreras en diferentes semestres</li>
                    <li>No puedes eliminar una materia si está asignada a alguna carrera</li>
                </ul>
            </div>
        </>
    );
}
