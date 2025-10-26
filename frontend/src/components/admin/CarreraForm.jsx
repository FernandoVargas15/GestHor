export default function CarreraForm({ form, onChange, onSubmit, cargando }) {
    return (
        <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>Crear Nueva Carrera</h3>

            <form onSubmit={onSubmit}>
                <div className="form__row form__row--2">
                    <div>
                        <label>Nombre de la Carrera *</label>
                        <input
                            className="input"
                            name="nombre"
                            placeholder="Ej: Ingeniería en Sistemas"
                            value={form.nombre}
                            onChange={onChange}
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div>
                        <label>Número de Semestres</label>
                        <select
                            className="select"
                            name="semestres"
                            value={form.semestres || ""}
                            onChange={onChange}
                            required
                            disabled={cargando}
                        >
                            <option value="">Seleccionar...</option>
                            {[6, 7, 8, 9, 10].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn btn--primary"
                    disabled={cargando}
                    style={{ marginTop: 12 }}
                >
                    {cargando ? "Creando..." : "Crear Carrera"}
                </button>
            </form>
        </div>
    );
}
