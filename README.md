# GestHor
Para clonar el repositorio hacer lo siguiente:
git clone https://github.com/FernandoVargas15/GestHor.git

# Instalar dependencias del frontend
cd frontend/frontweb && npm install

# Instalar dependencias del backend
cd ../../backend/backapi && npm install

# Probar que el backend funciona
1. Ir dentro de la carpeta backend/backapi
2. Iniciar con el comando npm run dev
3. GestHor backend funcionando ✅
3. CTRL + C para finalizar

# Probar que el frontend funciona
1. Ir dentro de la carpeta frontend/frontweb
2. Iniciar con el comando npm run dev
3. Muesta la pagina con vite + react ✅
4. CTRL + C para finalizar

# Notas
Recuerda correr npm install después de clonar.
El backend debe estar en ejecución para que el frontend pueda comunicarse con él.


# EJECUTAR
sudo apt install postgresql postgresql-contrib
sudo apt install apache2 -y

INICIAR SERVICIOS
sudo systemctl start apache2      # Inicia pgAdmin4 (interfaz web)
sudo systemctl start postgresql   # Inicia PostgreSQL (base de datos)

ABRIR EN http://localhost/pgadmin4/

FINALIZAR SERVICIOS
sudo systemctl stop apache2       # Detiene pgAdmin4 (interfaz web)
sudo systemctl stop postgresql    # Detiene PostgreSQL (base de datos)

# BASE DE DATOS
ejecutar el .sql dentro de 'Query tool' de pgAdmin4 web con el nombre de GesThor la BDTS 

# env
debe estar en la carpeta backend

DB_USER=postgres
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=5432
DB_NAME=GesThor


# Ejecutar para actualizar la tabla profesores en postgresql web
CREATE SEQUENCE IF NOT EXISTS public.profesores_profesor_id_seq 
    AS integer 
    START WITH 1 
    INCREMENT BY 1 
    NO MINVALUE 
    NO MAXVALUE 
    CACHE 1;

ALTER SEQUENCE public.profesores_profesor_id_seq 
    OWNED BY public.profesores.profesor_id;

ALTER TABLE public.profesores 
    ALTER COLUMN profesor_id SET DEFAULT nextval('public.profesores_profesor_id_seq'::regclass);

SELECT setval('public.profesores_profesor_id_seq', 
    COALESCE((SELECT MAX(profesor_id) FROM public.profesores), 0) + 1, 
    false);

SELECT 
    column_name, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'profesores' 
  AND column_name = 'profesor_id';


# Prueba para la base de datos (admin y profesor) / Insertar en pgweb
-- ADMIN (email: admin@unach.mx / pass: 123456)
INSERT INTO usuarios (email, password, rol_id)
VALUES ('admin@unach.mx', '123456', 1);

-- PROFESOR (email: profe@unach.mx / pass: 123456)
WITH u AS (
  INSERT INTO usuarios (email, password, rol_id)
  VALUES ('profe@unach.mx', '123456', 2)
  RETURNING usuario_id
)
INSERT INTO profesores (profesor_id, nombres, apellidos, matricula)
SELECT usuario_id, 'Juan', 'Pérez', 'MAT-0001' FROM u;

# Instalar lo siguiente en el la carpeta del backend
npm install pg-promise cors dotenv

# Correos y contraseñas de los usuarios para el login (prueba)
Administrador
Correo: admin@unach.mx
Contraseña: 123456

Profesor
Correo: profe@unach.mx
Contraseña: 123456

# Recuerden levantar el backend primero y despues el frontend para probar el inicio de sesion

12/10/2025
# instalar
npm install bcrypt jsonwebtoken axios

**Ejecutar**
INSERT INTO usuarios (email, password, rol_id) 
VALUES ('admin@unach.mx', '$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G', 1)
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G';

INSERT INTO usuarios (email, password, rol_id) 
VALUES ('profe@unach.mx', '$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G', 2)
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G';



