import mongoose, { Schema } from 'mongoose';

const RuleSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  ruleName: { type: String, required: true },
  includeKeywords: [{ type: String }],
  excludeKeywords: [{ type: String }],
  magaCodes: [{ type: String }], 
  unspscCodes: [{ type: String }],
  targetInstitutions: [{ type: String }], 
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Rule', RuleSchema);
