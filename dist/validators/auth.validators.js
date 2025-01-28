"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordBodySchema = exports.forgotPasswordBodySchema = exports.verifyEmailBodySchema = exports.signUpBodySchema = exports.loginBodySchema = void 0;
var zod_1 = require("zod");
exports.loginBodySchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email format' }),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Must be 8 or more characters long' }),
});
exports.signUpBodySchema = zod_1.z
    .object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email format' }),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Must be 8 or more characters long' }),
    type: zod_1.z.enum(['vendor', 'driver'], { required_error: 'type is required' }),
    vendor_name: zod_1.z.string().optional(), // vendor_name is optional but conditionally required
    first_name: zod_1.z.string().optional(), // first_name is optional but conditionally required
    last_name: zod_1.z.string().optional(), // last_name is optional but conditionally required
})
    .refine(function (data) {
    if (data.type === 'vendor') {
        return !!data.vendor_name; // Ensure vendor_name exists for vendor type
    }
    if (data.type === 'driver') {
        return !!data.first_name && !!data.last_name; // Ensure first_name and last_name exist for driver type
    }
    return true;
}, {
    message: 'Invalid data for the selected type',
    path: ['type'], // Point to the 'type' field for clarity
});
exports.verifyEmailBodySchema = zod_1.z.object({
    token: zod_1.z.string({ required_error: 'Token is required' }),
});
exports.forgotPasswordBodySchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email' }),
});
exports.resetPasswordBodySchema = zod_1.z.object({
    token: zod_1.z.string({ required_error: 'token is required' }),
    password: zod_1.z.string({ required_error: 'password is required' }),
});
//# sourceMappingURL=auth.validators.js.map