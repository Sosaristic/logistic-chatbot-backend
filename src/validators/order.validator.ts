import { z } from 'zod';

export const createOrderBodySchema = z.object({
  contact: z.object({
    firstName: z
      .string({ required_error: 'First Name is required' })
      .min(3, { message: 'Must be 3 characters long' }),
    lastName: z
      .string({ required_error: 'Last Name is required' })
      .min(3, { message: 'Must be 3 characters long' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    phone: z
      .string({ required_error: 'Phone is required' })
      .min(10, { message: 'Must be 10 characters long' }),
    address: z
      .string({ required_error: 'Address is required' })
      .min(10, { message: 'Must be 10 characters long' }),
  }),
  products: z.array(
    z.object({
      title: z
        .string({ required_error: 'Title is required' })
        .min(3, { message: 'Must be 3 characters long' }),
      description: z
        .string({ required_error: 'Description is required' })
        .min(10, { message: 'Must be 10 characters long' }),
      price: z
        .number({ required_error: 'Price is required' })
        .min(1, { message: 'Must be at least 1' }),
      quantity: z
        .number({ required_error: 'Quantity is required' })
        .min(1, { message: 'Must be at least 1' }),
      image: z
        .string({ required_error: 'Image is required' })
        .min(10, { message: 'Must be 10 characters long' }),
      rate: z.object({
        count: z.number({ required_error: 'Count is required' }),
        rate: z.number({ required_error: 'Rate is required' }),
      }),
    })
  ),
  totalAmount: z.number({ required_error: 'Total Amount is required' }),
  date: z.string({ required_error: 'Date is required' }),
});
