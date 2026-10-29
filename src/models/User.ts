import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  // Enlace directo a la empresa (Tenant) que pagó la suscripción
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, 
  
  // Roles internos de la empresa cliente
  role: { type: String, enum: ['ADMIN', 'SALES_REP'], default: 'SALES_REP' },
  
  // Control de acceso (si la empresa deja de pagar, isActive pasa a false y nadie entra)
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

// Índice para asegurar búsquedas rápidas al verificar el límite de 5 usuarios
UserSchema.index({ companyId: 1 });

export default mongoose.model('User', UserSchema);
