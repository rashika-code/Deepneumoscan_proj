import { Schema, model, Document } from 'mongoose';

export interface IHistory extends Document {
  userId: string;
  type: 'assessment' | 'xray';
  referenceId: string;
  createdAt: Date;
}

const HistorySchema = new Schema<IHistory>({
  userId: { type: String, required: true },
  type: { type: String, enum: ['assessment', 'xray'], required: true },
  referenceId: { type: String, required: true },
}, { timestamps: true });

export default model<IHistory>('History', HistorySchema);