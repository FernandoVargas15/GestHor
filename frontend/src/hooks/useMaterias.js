import { useState, useEffect } from "react";
import { 
    obtenerMaterias,
    asignarMateriaACarrera,
    desasignarMateriaDeCarrera
} from "../services/materiaService";

export function useMaterias() {
    const [catalogoMaterias, setCatalogoMaterias] = useState([]);
    const [cargando, setCargando] = useState(false);

    const cargarMaterias = async () => {
        try {
            setCargando(true);
            const data = await obtenerMaterias();
            setCatalogoMaterias(data.materias || []);
        } catch (error) {
            console.error("Error al cargar materias:", error);
            alert("Error al cargar el catálogo de materias");
        } finally {
            setCargando(false);
        }
    };

    const asignarMateria = async (carreraId, materiaId, semestre) => {
        try {
            setCargando(true);
            await asignarMateriaACarrera(carreraId, materiaId, semestre);
            alert("Materia asignada exitosamente");
        } catch (error) {
            console.error("Error al asignar materia:", error);
            alert(error.response?.data?.mensaje || "Error al asignar materia");
            throw error;
        } finally {
            setCargando(false);
        }
    };

    const desasignarMateria = async (carreraId, materiaId, semestre) => {
        if (!confirm("¿Desasignar esta materia del semestre?")) return false;

        try {
            setCargando(true);
            await desasignarMateriaDeCarrera(carreraId, materiaId, semestre);
            alert("Materia desasignada exitosamente");
            return true;
        } catch (error) {
            console.error("Error al desasignar materia:", error);
            alert("Error al desasignar materia");
            return false;
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarMaterias();
    }, []);

    return {
        catalogoMaterias,
        cargando,
        cargarMaterias,
        asignarMateria,
        desasignarMateria
    };
}
