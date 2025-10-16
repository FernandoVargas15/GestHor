import { useState } from "react";

export default function SearchInput({
    value = "",
    onChange,
    placeholder = " Buscar...",
    disabled = false,
    className = "",
    showClearButton = true
}) {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const handleClear = () => {
        if (onChange) {
            onChange("");
        }
    };

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <input
                type="text"
                className={`input ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                style={{
                    width: "100%",
                    paddingRight: showClearButton && value ? "40px" : undefined
                }}
            />
            {showClearButton && value && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        color: "var(--muted)",
                        cursor: "pointer",
                        fontSize: "18px",
                        padding: "4px 8px",
                        lineHeight: 1,
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "var(--text)"}
                    onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
                    title="Limpiar búsqueda"
                >
                    ×
                </button>
            )}
        </div>
    );
}
