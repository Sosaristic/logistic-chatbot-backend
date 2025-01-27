import { z } from 'zod';

export const loginBodySchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Must be 8 or more characters long' }),
});

export const signUpBodySchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Must be 8 or more characters long' }),
    type: z.enum(['vendor', 'driver'], { required_error: 'type is required' }),
    vendor_name: z.string().optional(), // vendor_name is optional but conditionally required
    first_name: z.string().optional(), // first_name is optional but conditionally required
    last_name: z.string().optional(), // last_name is optional but conditionally required
  })
  .refine(
    (data) => {
      if (data.type === 'vendor') {
        return !!data.vendor_name; // Ensure vendor_name exists for vendor type
      }
      if (data.type === 'driver') {
        return !!data.first_name && !!data.last_name; // Ensure first_name and last_name exist for driver type
      }
      return true;
    },
    {
      message: 'Invalid data for the selected type',
      path: ['type'], // Point to the 'type' field for clarity
    }
  );

export const verifyEmailBodySchema = z.object({
  token: z.string({ required_error: 'Token is required' }),
});

export const forgotPasswordBodySchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email' }),
});

export const resetPasswordBodySchema = z.object({
  token: z.string({ required_error: 'token is required' }),
  password: z.string({ required_error: 'password is required' }),
});
