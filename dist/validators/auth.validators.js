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
exports.signUpBodySchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email format' }),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Must be 8 or more characters long' }),
    vendor_name: zod_1.z.string({ required_error: 'vendor_name is required' }),
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