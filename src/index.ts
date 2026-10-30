import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
// ... importa tus otras rutas o modelos aquí si los tienes en este mismo archivo

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Tus rutas de la API
app.use('/api/auth', authRoutes);
// app.use('/api/tenants', tenantRoutes); // Tus demás rutas

// Conectar a MongoDB y arrancar el servidor Express de forma estable
const PORT = process.env.PORT || 10000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo exitosamente en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error crítico al iniciar la base de datos:', err);
  });
