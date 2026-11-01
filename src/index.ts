import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
// 🚀 1. Importamos las rutas de NOGs (Buscador y Analizador) y pagos (Pasarela)
import nogRoutes from './routes/nogRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// 1. CONFIGURACIÓN DE CONEXIÓN A MONGODB
// ==========================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`✔ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
  }
};

// ==========================================
// 2. RUTAS DE LA API (BACKEND)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 🚀 2. Montamos las nuevas rutas en el servidor Express
app.use('/api', nogRoutes);           // Expone /api/nogs y /api/nogs/:identifier
app.use('/api', paymentRoutes);       // Expone /api/payments/webhook

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ==========================================
// 3. SERVIR EL FRONTEND (REACT/VITE)
// ==========================================
const frontendPath = path.join(process.cwd(), 'frontend', 'dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ==========================================
// 4. ARRANQUE DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 10000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en el puerto ${PORT}`);
  });
});
