import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import cron from 'node-cron';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
// 🚀 1. Importamos las rutas de NOGs (Buscador y Analizador) y pagos (Pasarela)
import nogRoutes from './routes/nogRoutes';
import paymentRoutes from './routes/paymentRoutes';

// 🚀 2. Importamos el motor de scraping real para Guatecompras
import { sincronizarConcursosGuatecompras } from './scraper/guatecomprasScraper';

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

    // 🚀 Sincronización inicial automática al conectar la base de datos
    sincronizarConcursosGuatecompras().catch(err => {
      console.error('⚠️ Error en la sincronización inicial de Guatecompras:', err);
    });

  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
  }
};

// ==========================================
// 2. PROGRAMACIÓN DE TAREAS AUTOMÁTICAS (CRON)
// ==========================================
// Sincronizar automáticamente los concursos de Guatecompras cada 4 horas
cron.schedule('0 */4 * * *', () => {
  console.log('⏰ Ejecutando tarea programada: Sincronización de Guatecompras...');
  sincronizarConcursosGuatecompras();
});

// ==========================================
// 3. RUTAS DE LA API (BACKEND)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 🚀 Montamos las rutas en el servidor Express
app.use('/api', nogRoutes);           // Expone /api/nogs y /api/nogs/:identifier
app.use('/api', paymentRoutes);       // Expone /api/payments/webhook

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ==========================================
// 4. SERVIR EL FRONTEND (REACT/VITE)
// ==========================================
const frontendPath = path.join(process.cwd(), 'frontend', 'dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ==========================================
// 5. ARRANQUE DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 10000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en el puerto ${PORT}`);
  });
});
