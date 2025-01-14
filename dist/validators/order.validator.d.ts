import { z } from 'zod';
export declare const createOrderBodySchema: z.ZodObject<{
    contact: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        address: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        address?: string;
    }, {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        address?: string;
    }>;
    products: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        price: z.ZodNumber;
        quantity: z.ZodNumber;
        image: z.ZodString;
        rate: z.ZodObject<{
            count: z.ZodNumber;
            rate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            rate?: number;
            count?: number;
        }, {
            rate?: number;
            count?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        description?: string;
        title?: string;
        price?: number;
        quantity?: number;
        image?: string;
        rate?: {
            rate?: number;
            count?: number;
        };
    }, {
        description?: string;
        title?: string;
        price?: number;
        quantity?: number;
        image?: string;
        rate?: {
            rate?: number;
            count?: number;
        };
    }>, "many">;
    totalAmount: z.ZodNumber;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date?: string;
    contact?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        address?: string;
    };
    products?: {
        description?: string;
        title?: string;
        price?: number;
        quantity?: number;
        image?: string;
        rate?: {
            rate?: number;
            count?: number;
        };
    }[];
    totalAmount?: number;
}, {
    date?: string;
    contact?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        address?: string;
    };
    products?: {
        description?: string;
        title?: string;
        price?: number;
        quantity?: number;
        image?: string;
        rate?: {
            rate?: number;
            count?: number;
        };
    }[];
    totalAmount?: number;
}>;