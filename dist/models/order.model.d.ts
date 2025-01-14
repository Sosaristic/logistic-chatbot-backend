import mongoose, { Document } from 'mongoose';
import { VendorType } from './vendors.models';
interface ContactType extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}
interface ProductType extends Document {
    title: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    rate: {
        count: number;
        rate: number;
    };
    id: number;
}
interface OrderType extends Document {
    contact: ContactType;
    products: ProductType[];
    totalAmount: number;
    vendor: VendorType;
    date: string;
    status: 'pending' | 'assigned' | 'in transit' | 'delivered';
    trackingId: string;
}
export declare const Order: mongoose.Model<OrderType, {}, {}, {}, mongoose.Document<unknown, {}, OrderType> & OrderType & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
