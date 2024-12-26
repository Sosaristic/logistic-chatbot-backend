import mongoose, { Document } from 'mongoose';

interface ContactType extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
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
