"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderBodySchema = void 0;
var zod_1 = require("zod");
exports.createOrderBodySchema = zod_1.z.object({
    contact: zod_1.z.object({
        firstName: zod_1.z
            .string({ required_error: 'First Name is required' })
            .min(3, { message: 'Must be 3 characters long' }),
        lastName: zod_1.z
            .string({ required_error: 'Last Name is required' })
            .min(3, { message: 'Must be 3 characters long' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email format' }),
        phone: zod_1.z
            .string({ required_error: 'Phone is required' })
            .min(10, { message: 'Must be 10 characters long' }),
        address: zod_1.z
            .string({ required_error: 'Address is required' })
            .min(10, { message: 'Must be 10 characters long' }),
    }),
    products: zod_1.z.array(zod_1.z.object({
        title: zod_1.z
            .string({ required_error: 'Title is required' })
            .min(3, { message: 'Must be 3 characters long' }),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .min(10, { message: 'Must be 10 characters long' }),
        price: zod_1.z
            .number({ required_error: 'Price is required' })
            .min(1, { message: 'Must be at least 1' }),
        quantity: zod_1.z
            .number({ required_error: 'Quantity is required' })
            .min(1, { message: 'Must be at least 1' }),
        image: zod_1.z
            .string({ required_error: 'Image is required' })
            .min(10, { message: 'Must be 10 characters long' }),
        rating: zod_1.z.object({
            count: zod_1.z.number({ required_error: 'Count is required' }),
            rate: zod_1.z.number({ required_error: 'Rate is required' }),
        }),
    })),
    totalAmount: zod_1.z.number({ required_error: 'Total Amount is required' }),
    date: zod_1.z.string({ required_error: 'Date is required' }),
});
//# sourceMappingURL=order.validator.js.map