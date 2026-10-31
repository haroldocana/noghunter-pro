import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/authRoutes';
// 1. Importamos las rutas de los inquilinos (tenants)
import tenantRoutes from './routes/tenantRoutes';

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

// 2. Montamos la ruta de inquilinos para que el Panel de SuperAdmin no de error 404
app.use('/api/admin/tenants', tenantRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ==========================================
// 3. SERVIR EL FRONTEND (REACT/VITE)
// ==========================================
// process.cwd() apunta a la raíz del disco en Render (/opt/render/project/src)
const frontendPath = path.join(process.cwd(), 'frontend', 'dist');

// Le decimos a Express que sirva todos los archivos de esa carpeta (CSS, JS, Fuentes, Imágenes)
app.use(express.static(frontendPath));

// Cualquier ruta que no sea /api/... devolverá tu aplicación de React
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
