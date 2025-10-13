import { useState } from "react";

export default function AutocompleteInput({ 
    items, 
    onSelect, 
    placeholder = "Buscar...", 
    disabled = false,
    getItemKey,
    getItemLabel 
}) {
    const [busqueda, setBusqueda] = useState("");
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

    const itemsFiltrados = items.filter(item => 
        getItemLabel(item).toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleSelect = (item) => {
        onSelect(item);
        setBusqueda("");
        setMostrarSugerencias(false);
    };

    return (
        <div style={{ position: "relative" }}>
            <input
                className="input"
                placeholder={placeholder}
                value={busqueda}
                onChange={(e) => {
                    setBusqueda(e.target.value);
                    setMostrarSugerencias(e.target.value.length > 0);
                }}
                onFocus={() => busqueda.length > 0 && setMostrarSugerencias(true)}
                disabled={disabled}
            />
            
            {mostrarSugerencias && busqueda && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    maxHeight: 200,
                    overflowY: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    marginTop: 4
                }}>
                    {itemsFiltrados.length === 0 ? (
                        <div style={{ padding: 12, color: "var(--text-muted)", textAlign: "center" }}>
                            No se encontraron resultados con "{busqueda}"
                        </div>
                    ) : (
                        itemsFiltrados.map((item) => (
                            <div
                                key={getItemKey(item)}
                                onClick={() => handleSelect(item)}
                                style={{
                                    padding: "10px 12px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid var(--border)",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-secondary)"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                            >
                                {getItemLabel(item)}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
