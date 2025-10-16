import { useMemo } from "react";

/**
 * Hook personalizado para filtrar items basado en un término de búsqueda
 * 
 * @param {Array} items - Array de objetos a filtrar
 * @param {string} searchTerm - Término de búsqueda
 * @param {Array<string>} searchKeys - Array con los nombres de las propiedades donde buscar
 * @returns {Array} - Array filtrado
 * 
 * @example
 * const filteredCarreras = useSearch(carreras, "ingenieria", ["nombre_carrera"]);
 * const filteredMaterias = useSearch(materias, "calc", ["nombre_materia", "codigo"]);
 */
export const useSearch = (items = [], searchTerm = "", searchKeys = []) => {
    return useMemo(() => {
        if (!searchTerm.trim()) {
            return items;
        }

        const termLower = searchTerm.toLowerCase().trim();

        return items.filter((item) => {
            // Si no hay keys especificadas, buscar en todas las propiedades string
            if (searchKeys.length === 0) {
                return Object.values(item).some((value) => {
                    if (typeof value === "string") {
                        return value.toLowerCase().includes(termLower);
                    }
                    return false;
                });
            }

            // Buscar en las keys especificadas
            return searchKeys.some((key) => {
                const value = item[key];
                if (typeof value === "string") {
                    return value.toLowerCase().includes(termLower);
                }
                if (typeof value === "number") {
                    return value.toString().includes(termLower);
                }
                return false;
            });
        });
    }, [items, searchTerm, searchKeys]);
};
