import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { connectDB } from './config/database';
import { runNogHunterMotor } from './scraper/guatecompras';
import nogRoutes from './routes/nogRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Activar las rutas de la API para conectar el Frontend (React) con la Base de Datos
app.use(nogRoutes);

// Programar el Scraper para que corra de Lunes a Viernes a las 8:00 AM, 12:00 PM y 4:00 PM
cron.schedule('0 8,12,16 * * 1-5', async () => {
  console.log('⏰ Ejecutando tarea programada: Extracción de Guatecompras');
  await runNogHunterMotor();
});

app.get('/', (req, res) => {
  res.send('Motor NOGHunter Pro activo, conectado a BD y con extracciones programadas.');
});

// Ruta manual para forzar la búsqueda sin esperar la hora programada (Ideal para tus pruebas)
app.get('/api/trigger-scraper', async (req, res) => {
  res.json({ message: 'Scraper iniciado en segundo plano.' });
  await runNogHunterMotor();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor de NOGHunter Pro escuchando en el puerto ${PORT}`);
});
