import mongoose, { Document, Schema } from 'mongoose';

export interface UserType extends Document {
  email: string;
  vendor_name: string;
  first_name: string;
  type: string;
  last_name: string;
  password: string;
  api_key: string;
  email_verified: boolean;
  refresh_token: string;
}

const userSchema: Schema = new mongoose.Schema(
  {
    vendor_name: {
      type: String,
    },
    first_name: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ['vendor', 'driver'],
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    api_key: {
      type: String,
    },
    email_verified: {
      type: Boolean,
    },
    refresh_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<UserType>('User', userSchema);
