import mongoose, { Schema } from 'mongoose';

const NogSchema = new Schema({
  nogNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  buyerEntity: { type: String, required: true },
  publicationDate: { type: Date },
  closingDate: { type: Date, required: true },
  status: { type: String, enum: ['Vigente', 'Evaluando', 'Adjudicado', 'Desierto'] },
  items: [{
    description: String,
    quantity: Number,
    magaCode: String
  }],
  sourceUrl: { type: String }
});

export default mongoose.model('Nog', NogSchema);
