import mongoose, { Schema, Document } from 'mongoose';

const CompanySchema = new Schema({
  name: { type: String, required: true },
  nit: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['Intro', 'Pro', 'Max'], default: 'Intro' },
  webhookUrl: { type: String }, 
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Company', CompanySchema);
