import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  data: Buffer;
}

const PhotoSchema: Schema = new Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  data: {
    type: Buffer,
    required: true
  }
});

export default mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);
