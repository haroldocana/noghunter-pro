import mongoose, { Schema } from 'mongoose';

const AlertSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  nogId: { type: Schema.Types.ObjectId, ref: 'Nog', required: true },
  matchedRuleId: { type: Schema.Types.ObjectId, ref: 'Rule' },
  userStatus: { type: String, enum: ['Sin Revisar', 'Participar', 'Seguir', 'Descartar'], default: 'Sin Revisar' },
  notifiedViaEmail: { type: Boolean, default: false },
  pushedToCrm: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Alert', AlertSchema);
