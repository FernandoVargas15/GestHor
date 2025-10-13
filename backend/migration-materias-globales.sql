-- =====================================================
-- SCRIPT SQL PARA pgAdmin: Catálogo de Materias
-- =====================================================
-- Copiar y ejecutar todo este script en pgAdmin (Query Tool)

-- 1. Crear tabla para el catálogo global de materias (SIN descripcion)
CREATE TABLE IF NOT EXISTS public.materias_catalogo (
    materia_id SERIAL PRIMARY KEY,
    nombre_materia VARCHAR(255) NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear tabla de relación N:N entre carreras y materias
CREATE TABLE IF NOT EXISTS public.carrera_materias (
    carrera_id INTEGER NOT NULL REFERENCES public.carreras(carrera_id) ON DELETE CASCADE,
    materia_id INTEGER NOT NULL REFERENCES public.materias_catalogo(materia_id) ON DELETE CASCADE,
    numero_semestre INTEGER NOT NULL,
    PRIMARY KEY (carrera_id, materia_id, numero_semestre),
    CONSTRAINT check_semestre_positivo CHECK (numero_semestre > 0)
);

-- 3. Migrar datos existentes de tabla materias (si los hay)
INSERT INTO public.materias_catalogo (nombre_materia)
SELECT DISTINCT nombre_materia
FROM public.materias
WHERE NOT EXISTS (
    SELECT 1 FROM public.materias_catalogo mc 
    WHERE mc.nombre_materia = materias.nombre_materia
)
ON CONFLICT (nombre_materia) DO NOTHING;

-- 4. Migrar relaciones carrera-materia
INSERT INTO public.carrera_materias (carrera_id, materia_id, numero_semestre)
SELECT 
    m.carrera_id,
    mc.materia_id,
    m.numero_semestre
FROM public.materias m
JOIN public.materias_catalogo mc ON m.nombre_materia = mc.nombre_materia
ON CONFLICT (carrera_id, materia_id, numero_semestre) DO NOTHING;
