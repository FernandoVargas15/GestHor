import { useState } from "react";
import SearchInput from "../ui/SearchInput";
import { useSearch } from "../../hooks/useSearch";

export default function CarreraList({ carreras, onSelect, onDelete, cargando }) {
    const [searchTerm, setSearchTerm] = useState("");
    const carrerasFiltradas = useSearch(carreras, searchTerm, ["nombre_carrera"]);

    if (cargando && carreras.length === 0) {
        return <div className="form__hint">Cargando...</div>;
    }

    if (carreras.length === 0) {
        return <div className="form__hint">Aún no hay carreras registradas.</div>;
    }

    return (
        <>
            {carreras.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder=" Buscar carrera..."
                        disabled={cargando}
                    />
                </div>
            )}

            {carrerasFiltradas.length === 0 && searchTerm ? (
                <div className="form__hint">
                    No se encontraron carreras que coincidan con "{searchTerm}"
                </div>
            ) : (
                <div className="grid" style={{ gap: 12 }}>
                    {carrerasFiltradas.map((c) => (
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
            )}
        </>
    );
}
