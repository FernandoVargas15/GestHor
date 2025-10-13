export default function CarreraList({ carreras, onSelect, onDelete, cargando }) {
    if (cargando && carreras.length === 0) {
        return <div className="form__hint">Cargando...</div>;
    }

    if (carreras.length === 0) {
        return <div className="form__hint">Aún no hay carreras registradas.</div>;
    }

    return (
        <div className="grid" style={{ gap: 12 }}>
            {carreras.map((c) => (
                <div key={c.carrera_id} className="card" style={{ borderColor: "var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700 }}>{c.nombre_carrera}</div>
                            <div className="form__hint">Semestres: {c.total_semestres}</div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button 
                                className="btn" 
                                onClick={() => onSelect(c)}
                                disabled={cargando}
                            >
                                 Gestionar Materias
                            </button>
                            <button
                                className="link-btn link-btn--danger"
                                onClick={() => onDelete(c.carrera_id)}
                                disabled={cargando}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
