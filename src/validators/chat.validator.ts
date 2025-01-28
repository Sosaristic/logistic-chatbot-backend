import { z } from 'zod';

export const createChatBodySchema = z.object({
  message: z
    .string({ required_error: 'Message is required' })
    .min(3, { message: 'Must be 3 characters long' }),
});
