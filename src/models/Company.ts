import mongoose, { Schema, Document } from 'mongoose';

const CompanySchema = new Schema({
  name: { type: String, required: true },
  nit: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['Intro', 'Pro', 'Max'], default: 'Intro' },
  
  // Novedad: ¿Cómo recibe los datos este cliente?
  deliveryMethod: { type: String, enum: ['CRM', 'EMAIL', 'DASHBOARD'], default: 'EMAIL' }, 
  webhookUrl: { type: String }, // Solo se usa si es 'CRM'
  contactEmail: { type: String }, // Solo se usa si es 'EMAIL'
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Company', CompanySchema);
