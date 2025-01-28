import mongoose, { Document } from 'mongoose';
export interface VendorType extends Document {
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
export declare const VendorModel: mongoose.Model<VendorType, {}, {}, {}, mongoose.Document<unknown, {}, VendorType> & VendorType & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
