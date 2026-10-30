import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db'; // Asegúrate de ajustar la ruta según tu estructura
import nogRoutes from './routes/nogRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Habilitar CORS para que tu frontend en Render se comunique con el backend
app.use(cors({
  origin: '*', // O puedes poner la URL exacta de tu frontend: 'https://noghunter-pro-1.onrender.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Conexión a la Base de Datos y arranque
connectDB();

// Rutas de la API
app.use('/api', nogRoutes);

// Ruta de prueba raíz
app.get('/', (req, res) => {
  res.json({ status: 'API de NOGHunter Pro funcionando al 100%' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});
