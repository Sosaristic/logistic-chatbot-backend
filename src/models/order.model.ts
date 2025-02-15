import mongoose, { Document, Mongoose } from 'mongoose';
import { UserType } from './users.models';

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
  vendor: UserType;
  driver: UserType;
  date: string;
  status: 'pending' | 'assigned' | 'in transit' | 'delivered';
  trackingId: string;
}

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    count: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
  },
});

const orderSchema = new mongoose.Schema<OrderType>({
  contact: {
    type: contactSchema,
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: {
    type: [productSchema],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: new Date().toISOString(),
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in transit', 'delivered'],
    default: 'pending',
  },
  trackingId: {
    type: String,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
});

export const Order = mongoose.model<OrderType>('Order', orderSchema);
