import express from 'express';
import docentes from './docentes.js'

const app = express();

app.use(express.json());

const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    // const docente = JSON.stringify(docentes);
    const docente = docentes;
    console.log(docente);
    res.json(docente);


});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});