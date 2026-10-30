import mongoose, { Schema } from 'mongoose';

const CompanySchema = new Schema({
  name: { type: String, required: true },
  nit: { type: String, required: true, unique: true },
  
  // Control de Suscripción Anual y Pagos
  subscriptionStatus: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'PENDING'], default: 'PENDING' },
  subscriptionEnd: { type: Date },
  paymentGatewayId: { type: String }, // ID de Pagalo o QPayPro
  
  // Límites del Plan y Bolsón de Inteligencia Artificial
  maxUsers: { type: Number, default: 5 },
  aiQuotaTotal: { type: Number, default: 50000 },
  aiQuotaUsed: { type: Number, default: 0 },
  
  // Integración automatizada con CRMs corporativos
  deliveryMethod: { type: String, enum: ['CRM', 'EMAIL', 'DASHBOARD'], default: 'DASHBOARD' }, 
  crmType: { type: String, enum: ['ZOHO', 'HUBSPOT', 'PIPEDRIVE', 'SALESFORCE', 'WEBHOOK', 'NONE'], default: 'NONE' },
  crmWebhookUrl: { type: String },
  crmApiKey: { type: String }, 
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Company', CompanySchema);
