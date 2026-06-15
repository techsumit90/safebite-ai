import mongoose, { Document, Schema } from 'mongoose';

export interface IScan extends Document {
  userId: mongoose.Types.ObjectId;
  productName: string;
  imageUri?: string;
  safetyScore: number;
  riskLevel: 'Safe' | 'Caution' | 'Unsafe';
  harmfulIngredients: string[];
  nutritionalWarnings: string[];
  personalizedExplanation: string;
  ingredientsList: string;
  nutritionFacts: {
    calories?: number;
    fat?: string;
    saturatedFat?: string;
    sodium?: string;
    carbohydrates?: string;
    sugar?: string;
    protein?: string;
  };
  scannedAt: Date;
}

const ScanSchema = new Schema<IScan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  imageUri: { type: String },
  safetyScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['Safe', 'Caution', 'Unsafe'], required: true },
  harmfulIngredients: [{ type: String }],
  nutritionalWarnings: [{ type: String }],
  personalizedExplanation: { type: String, required: true },
  ingredientsList: { type: String, required: true },
  nutritionFacts: {
    calories: { type: Number },
    fat: { type: String },
    saturatedFat: { type: String },
    sodium: { type: String },
    carbohydrates: { type: String },
    sugar: { type: String },
    protein: { type: String },
  },
  scannedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IScan>('Scan', ScanSchema);
