import mongoose, { Document, Schema } from 'mongoose';

export interface AdminType extends Document {
  email: string;
  password: string;
  email_verified: boolean;
  refresh_token: string;
  type: 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema: Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email_verified: {
      type: Boolean,
      default: true,
    },
    refresh_token: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      required: true,
      enum: ['admin', 'super-admin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

export const AdminModel = mongoose.model<AdminType>('Admin', adminSchema);
