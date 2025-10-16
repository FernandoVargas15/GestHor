import express from 'express';

const app = express();

app.use(express.json());

const port = 3000;

app.use(express.json());



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});