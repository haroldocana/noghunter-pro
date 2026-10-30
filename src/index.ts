import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database'; 
import nogRoutes from './routes/nogRoutes';
import paymentRoutes from './routes/paymentRoutes';
import authRoutes from './routes/authRoutes'; // <-- NUEVO: Importar el sistema de login

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

// Montar las rutas
app.use('/api', nogRoutes);
app.use('/api', paymentRoutes);
app.use('/api/auth', authRoutes); // <-- NUEVO: La URL del login será /api/auth/login

app.get('/', (req, res) => {
  res.json({ status: 'API de NOGHunter Pro funcionando al 100%' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});
