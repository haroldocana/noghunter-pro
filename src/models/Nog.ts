import mongoose, { Schema } from 'mongoose';

const NogSchema = new Schema({
  identifier: { type: String, unique: true }, // NOG o NPG
  title: { type: String, required: true },
  buyerEntity: { type: String, required: true },
  category: { type: String }, // Ej: 'c' (Computación), 'f' (Limpieza)
  
  // Estados y Tipos
  publicationType: { type: String, enum: ['PROYECTO_BASES', 'NOG_OFICIAL', 'NPG_DIRECTA'] },
  status: { type: String, enum: ['VIGENTE', 'EVALUACION', 'ADJUDICADO', 'ANULADO', 'DESIERTO', 'PRESCINDIDO'], default: 'VIGENTE' },
  
  // 1. Criterios de Evaluación (Extraídos de las bases)
  evaluationCriteria: [{
    factor: { type: String }, // Ej: "Precio", "Tiempo de Entrega", "Experiencia"
    weight: { type: Number }  // Ej: 40, 30, 30 (Suma 100%)
  }],

  // 2. Inteligencia de Competencia e Histórico (El Cierre)
  strategyIntelligence: {
    isRenewal: { type: Boolean, default: false }, // ¿Es un servicio recurrente de años anteriores?
    previousWinner: { type: String }, // Quién tiene el contrato actual
    previousAmount: { type: Number }, // En cuánto se cerró el año pasado
    priceToBeat: { type: Number }, // El techo financiero recomendado para ganar hoy
  },

  // Análisis general de Gemini
  matchScore: { type: Number },
  summary: [{ type: String }],
  isNewAlert: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Nog', NogSchema);
