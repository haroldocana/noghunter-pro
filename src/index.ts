import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
app.use(express.json());

// Inicializar la conexión a MongoDB Atlas
connectDB();

app.get('/', (req, res) => {
  res.send('Motor NOGHunter Pro activo y conectado a la base de datos.');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor de NOGHunter Pro escuchando en el puerto ${PORT}`);
});
