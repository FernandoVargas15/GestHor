import React, { useEffect, useState } from 'react';
import {
    obtenerPeriodos,
    crearPeriodo,
    actualizarPeriodo,
    eliminarPeriodo,
} from '../../services/periodoService';

export default function Periodos() {
    const [periodos, setPeriodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ nombre: '', fecha_inicio: '', fecha_fin: '' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');

    const fetchPeriodos = async () => {
        setLoading(true);
        try {
            const res = await obtenerPeriodos();
            setPeriodos(res.periodos || []);
        } catch (err) {
            console.error(err);
            setError('No se pudieron obtener los periodos');
        } finally {
            setLoading(false);
        }
    };

    const fetchWithFilters = async () => {
        setLoading(true);
        try {
            const res = await obtenerPeriodos({ start: filterStart || undefined, end: filterEnd || undefined });
            setPeriodos(res.periodos || []);
        } catch (err) {
            console.error(err);
            setError('No se pudieron obtener los periodos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriodos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editingId) {
                await actualizarPeriodo(editingId, form);
                setEditingId(null);
            } else {
                await crearPeriodo(form);
            }
            setForm({ nombre: '', fecha_inicio: '', fecha_fin: '' });
            await fetchPeriodos();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || 'Error al guardar');
        }
    };

    const handleSelectChange = (e) => {
        const id = e.target.value;
        if (!id) {
            setEditingId(null);
            setForm({ nombre: '', fecha_inicio: '', fecha_fin: '' });
            return;
        }
        const p = periodos.find((x) => String(x.id_periodo) === String(id));
        if (p) {
            setEditingId(p.id_periodo);
            setForm({ nombre: p.nombre || '', fecha_inicio: p.fecha_inicio || '', fecha_fin: p.fecha_fin || '' });
        }
    };

    const handleEdit = (p) => {
        setEditingId(p.id_periodo);
        setForm({ nombre: p.nombre || '', fecha_inicio: p.fecha_inicio || '', fecha_fin: p.fecha_fin || '' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar periodo? Esto puede afectar horarios/disponibilidades.')) return;
        try {
            await eliminarPeriodo(id);
            await fetchPeriodos();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || 'Error al eliminar');
        }
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: 12 }}>Periodos Académicos</h2>

            <div className="form__row form__row--2" style={{ marginBottom: 16 }}>
                <div>
                    <label className="form__label">Seleccionar periodo</label>
                    <select className="select" onChange={handleSelectChange} value={editingId || ''}>
                        <option value="">-- Nuevo periodo --</option>
                        {periodos.map((p) => (
                            <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="form__label">Filtro: Fecha inicio desde</label>
                    <input className="input" type="date" value={filterStart || ''} onChange={(e) => setFilterStart(e.target.value)} />
                </div>
                <div>
                    <label className="form__label">Filtro: Fecha fin hasta</label>
                    <input className="input" type="date" value={filterEnd || ''} onChange={(e) => setFilterEnd(e.target.value)} />
                </div>
                <div style={{ alignSelf: 'end' }}>
                    <button className="btn" type="button" onClick={() => fetchWithFilters()}>Aplicar filtros</button>
                    <button className="btn" type="button" onClick={() => { setFilterStart(''); setFilterEnd(''); fetchPeriodos(); }}>Limpiar</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
                <form onSubmit={handleSubmit} className="card">
                    <div className="form__row">
                        <div>
                            <label className="form__label">Nombre</label>
                            <input className="input" name="nombre" value={form.nombre} onChange={handleChange} required />
                        </div>
                        <div className="form__row--2" style={{ marginTop: 8 }}>
                            <div>
                                <label className="form__label">Fecha inicio</label>
                                <input className="input" type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="form__label">Fecha fin</label>
                                <input className="input" type="date" name="fecha_fin" value={form.fecha_fin} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button className="btn btn--primary" type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
                        {editingId && <button className="btn" type="button" onClick={() => { setEditingId(null); setForm({ nombre: '', fecha_inicio: '', fecha_fin: '' }); }}>Cancelar</button>}
                    </div>

                    {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                </form>

                <div>
                    <h3 style={{ marginTop: 0 }}>Lista</h3>
                    {loading ? (
                        <div>Cargando...</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th style={{ width: 150 }}>Fecha inicio</th>
                                    <th style={{ width: 150 }}>Fecha fin</th>
                                    <th style={{ width: 180 }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periodos.map((p) => (
                                    <tr key={p.id_periodo}>
                                        <td>{p.nombre}</td>
                                        <td>{p.fecha_inicio || '-'}</td>
                                        <td>{p.fecha_fin || '-'}</td>
                                        <td>
                                            <button className="link-btn" onClick={() => handleEdit(p)}>Editar</button>
                                            <button className="link-btn link-btn--danger" onClick={() => handleDelete(p.id_periodo)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                                {periodos.length === 0 && (
                                    <tr>
                                        <td colSpan={4}>No hay periodos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
