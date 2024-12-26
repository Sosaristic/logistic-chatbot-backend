import mongoose, { Document, Schema } from 'mongoose';

export interface VendorType extends Document {
  email: string;
  vendor_name: string;
  password: string;
  api_key: string;
  email_verified: boolean;
  refresh_token: string;
}

const vendorSchema: Schema = new mongoose.Schema(
  {
    vendor_name: {
      type: String,
      required: true,
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

export const VendorModel = mongoose.model<VendorType>('Vendor', vendorSchema);
