import { Schema, model, Document } from 'mongoose';

export type AssessmentType = 'self' | 'curing';

export interface IAssessment extends Document {
  userId: string;
  type: AssessmentType;
  answers: Record<string, string>;
  score?: number;
  riskLevel?: 'Low' | 'Moderate' | 'High';
}

const AssessmentSchema = new Schema<IAssessment>({
  userId: { type: String, required: true },
  type: { type: String, enum: ['self', 'curing'], required: true },
  answers: { type: Object, required: true },
  score: Number,
  riskLevel: String,
}, { timestamps: true });

export default model<IAssessment>('Assessment', AssessmentSchema);