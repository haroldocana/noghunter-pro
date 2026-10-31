import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Permitir peticiones desde cualquier origen (fundamental si el frontend corre por separado)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==========================================
// CONFIGURACIÓN DE CONEXIÓN A MONGODB ATLAS
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
// REGISTRO DE RUTAS DE LA API
// ==========================================
app.use('/api/auth', authRoutes);

// Ruta de prueba para verificar estado
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Ruta base temporal para verificar que la API responde
app.get('/', (req, res) => {
  res.json({ message: 'NOGHunter Pro API funcionando correctamente.' });
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
