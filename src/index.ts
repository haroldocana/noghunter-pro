import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURACIÓN DE CONEXIÓN A MONGODB ATLAS
// ==========================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 30000, // Margen para despertar el clúster gratuito
      socketTimeoutMS: 45000,
    });
    console.log(`✔ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    // No usamos process.exit(1) para evitar que Render apague la app por un fallo temporal de red
  }
};

// ==========================================
// REGISTRO DE RUTAS DE LA API
// ==========================================
app.use('/api/auth', authRoutes);

// Ruta de prueba para verificar estado
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 10000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en el puerto ${PORT}`);
  });
});
