"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var contactSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});
var productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    rating: {
        count: {
            type: Number,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
    },
});
var orderSchema = new mongoose_1.default.Schema({
    contact: {
        type: contactSchema,
        required: true,
    },
    vendor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    products: {
        type: [productSchema],
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        default: new Date().toISOString(),
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in transit', 'delivered'],
        default: 'pending',
    },
    trackingId: {
        type: String,
    },
});
exports.Order = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=order.model.js.map