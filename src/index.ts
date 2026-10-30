import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/database'; 
import nogRoutes from './routes/nogRoutes';
import paymentRoutes from './routes/paymentRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

connectDB();

// Montar las rutas de la API
app.use('/api', nogRoutes);
app.use('/api', paymentRoutes);
app.use('/api/auth', authRoutes);

// Ruta de estado de la API
app.get('/api/health', (req, res) => {
  res.json({ status: 'API de NOGHunter Pro funcionando al 100%' });
});

// ==========================================
// BUSCADOR INTELIGENTE Y SERVIDOR DEL FRONTEND
// ==========================================
const possibleFrontendPaths = [
  path.join(process.cwd(), 'frontend/dist'),
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, 'frontend/dist'),
  path.join(process.cwd(), 'dist')
];

const frontendPath = possibleFrontendPaths.find(p => fs.existsSync(p));

if (frontendPath) {
  console.log(`Frontend encontrado en: ${frontendPath}`);
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.warn('Advertencia: No se encontró la carpeta dist del frontend.');
  app.get('/', (req, res) => {
    res.send('Backend activo, pero falta compilar el frontend.');
  });
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});
