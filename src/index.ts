import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/authRoutes';
// 1. Importamos adminRoutes (este es el nombre correcto de tu archivo)
import adminRoutes from './routes/adminRoutes';

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

// 2. Montamos la ruta de adminRoutes en /api/admin
app.use('/api/admin', adminRoutes);

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
