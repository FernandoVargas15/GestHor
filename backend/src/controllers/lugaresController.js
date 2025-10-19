import { dbConnection as db } from '../config/database.js';

const obtenerEdificios = async (req, res) => {
    try {
        const edificios = await db.any('SELECT * FROM edificios');
        
        // Obtener salones de cada edificio
        for (let edificio of edificios) {
            const salones = await db.any(
                'SELECT * FROM salones WHERE edificio_id = $1',
                [edificio.id]
            );
            edificio.salones = salones;
        }
        
        res.json(edificios);
    } catch (error) {
        console.error('Error al obtener edificios:', error);
        res.status(500).json({ error: 'Error al obtener edificios' });
    }
};

const crearEdificio = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const nuevoEdificio = await db.one(
            'INSERT INTO edificios (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre, descripcion]
        );
        res.status(201).json(nuevoEdificio);
    } catch (error) {
        console.error('Error al crear edificio:', error);
        res.status(500).json({ error: 'Error al crear edificio' });
    }
};

const actualizarEdificio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const edificioActualizado = await db.one(
            'UPDATE edificios SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
            [nombre, descripcion, id]
        );
        res.json(edificioActualizado);
    } catch (error) {
        console.error('Error al actualizar edificio:', error);
        res.status(500).json({ error: 'Error al actualizar edificio' });
    }
};

const eliminarEdificio = async (req, res) => {
    try {
        const { id } = req.params;
        await db.none('DELETE FROM edificios WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar edificio:', error);
        res.status(500).json({ error: 'Error al eliminar edificio' });
    }
};

const crearSalon = async (req, res) => {
    try {
        const { edificioId, numero, capacidad, tipo } = req.body;
        const nuevoSalon = await db.one(
            'INSERT INTO salones (edificio_id, numero, capacidad, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
            [edificioId, numero, capacidad, tipo]
        );
        res.status(201).json(nuevoSalon);
    } catch (error) {
        console.error('Error al crear salón:', error);
        res.status(500).json({ error: 'Error al crear salón' });
    }
};

const actualizarSalon = async (req, res) => {
    try {
        const { id } = req.params;
        const { numero, capacidad, tipo } = req.body;
        const salonActualizado = await db.one(
            'UPDATE salones SET numero = $1, capacidad = $2, tipo = $3 WHERE id = $4 RETURNING *',
            [numero, capacidad, tipo, id]
        );
        res.json(salonActualizado);
    } catch (error) {
        console.error('Error al actualizar salón:', error);
        res.status(500).json({ error: 'Error al actualizar salón' });
    }
};

const eliminarSalon = async (req, res) => {
    try {
        const { id } = req.params;
        await db.none('DELETE FROM salones WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar salón:', error);
        res.status(500).json({ error: 'Error al eliminar salón' });
    }
};

export {
    obtenerEdificios,
    crearEdificio,
    actualizarEdificio,
    eliminarEdificio,
    crearSalon,
    actualizarSalon,
    eliminarSalon
};
