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

PARA INICIAR EL SERVICIO WEB
sudo systemctl start postgresql

ABRIR EN http://localhost/pgadmin4/

PARA CERRARLO 
sudo systemctl enable postgresql

# BASE DE DATOS
ejecutar el .sql dentro de 'Query tool' de pgAdmin4 web con el nombre de GesThor la BDTS 

# env
debe estar en la carpeta backend

DB_USER=postgres
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=5432
DB_NAME=GesThor