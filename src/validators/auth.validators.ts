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
    type: z.enum(['vendor', 'driver'], { required_error: 'Type is required' }),
    vendor_name: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    state: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'vendor' && !data.vendor_name) {
      ctx.addIssue({
        path: ['vendor_name'],
        message: 'Vendor name is required for vendors',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.type === 'driver') {
      if (!data.first_name) {
        ctx.addIssue({
          path: ['first_name'],
          message: 'First name is required for drivers',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.last_name) {
        ctx.addIssue({
          path: ['last_name'],
          message: 'Last name is required for drivers',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.state) {
        ctx.addIssue({
          path: ['state'],
          message: 'State is required for drivers',
          code: z.ZodIssueCode.custom,
        });
      }
    }
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
