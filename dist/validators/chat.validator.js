"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatBodySchema = void 0;
var zod_1 = require("zod");
exports.createChatBodySchema = zod_1.z.object({
    message: zod_1.z
        .string({ required_error: 'Message is required' })
        .min(3, { message: 'Must be 3 characters long' }),
});
//# sourceMappingURL=chat.validator.js.map