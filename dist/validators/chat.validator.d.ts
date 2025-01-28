import { z } from 'zod';
export declare const createChatBodySchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message?: string;
}, {
    message?: string;
}>;
