import { Schema, model, Document } from 'mongoose';

export interface IXrayResult extends Document {
  userId: string;
  imageUrl: string;
  age: number;
  gender: string;
  smoking: boolean;
  medicalHistory: string;
  prediction: 'Pneumonia' | 'Normal';
  confidence: number;
  modelUsed: 'KNN' | 'SVM';
}

const XrayResultSchema = new Schema<IXrayResult>({
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  smoking: { type: Boolean, required: true },
  medicalHistory: String,
  prediction: { type: String, enum: ['Pneumonia', 'Normal'], required: true },
  confidence: { type: Number, required: true },
  modelUsed: { type: String, enum: ['KNN', 'SVM'], required: true },
}, { timestamps: true });

export default model<IXrayResult>('XrayResult', XrayResultSchema);