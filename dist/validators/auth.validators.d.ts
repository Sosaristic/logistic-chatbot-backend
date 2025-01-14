import { z } from 'zod';
export declare const loginBodySchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export declare const signUpBodySchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    vendor_name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
    vendor_name?: string;
}, {
    email?: string;
    password?: string;
    vendor_name?: string;
}>;
export declare const verifyEmailBodySchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token?: string;
}, {
    token?: string;
}>;
export declare const forgotPasswordBodySchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
}, {
    email?: string;
}>;
export declare const resetPasswordBodySchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password?: string;
    token?: string;
}, {
    password?: string;
    token?: string;
}>;
