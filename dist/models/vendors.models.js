"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var vendorSchema = new mongoose_1.default.Schema({
    vendor_name: {
        type: String,
    },
    first_name: {
        type: String,
    },
    type: {
        type: String,
        required: true,
        enum: ['vendor', 'driver'],
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    api_key: {
        type: String,
    },
    email_verified: {
        type: Boolean,
    },
    refresh_token: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.VendorModel = mongoose_1.default.model('Vendor', vendorSchema);
//# sourceMappingURL=vendors.models.js.map