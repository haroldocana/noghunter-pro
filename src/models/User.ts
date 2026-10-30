import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  // required: false permite que el usuario MASTER exista sin estar atado a una empresa cliente
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
  
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, 
  
  // Roles internos (MASTER es para Comptech)
  role: { type: String, enum: ['MASTER', 'ADMIN', 'SALES_REP'], default: 'SALES_REP' },
  
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

UserSchema.index({ companyId: 1 });

export default mongoose.model('User', UserSchema);
