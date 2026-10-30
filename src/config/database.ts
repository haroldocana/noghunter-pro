import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // La variable MONGO_URI se configurará en Render de forma segura
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 30000, // Tiempo de espera ampliado a 30s para despertar el clúster
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};
