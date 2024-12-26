import { z } from 'zod';

export const loginBodySchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Must be 8 or more characters long' }),
});

export const signUpBodySchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Must be 8 or more characters long' }),
  vendor_name: z.string({ required_error: 'vendor_name is required' }),
});

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
