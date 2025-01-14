"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.register = exports.login = void 0;
var auth_validators_1 = require("../validators/auth.validators");
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var vendors_models_1 = require("../models/vendors.models");
var error_1 = __importDefault(require("../lib/utils/error"));
var helpers_1 = require("../utils/helpers");
var send_email_1 = __importDefault(require("../services/send_email"));
var sendResponse_1 = require("../utils/sendResponse");
exports.login = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordMatched, accessToken, refreshToken, userData, hashedToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = auth_validators_1.loginBodySchema.parse(req.body), email = _a.email, password = _a.password;
                return [4 /*yield*/, vendors_models_1.VendorModel.findOne({ email: email }).select('+password')];
            case 1:
                user = _b.sent();
                if (!user) {
                    throw new error_1.default('invalid credentials', 401);
                }
                isPasswordMatched = (0, helpers_1.comparePassword)(password, user.password);
                if (!isPasswordMatched) {
                    throw new error_1.default('invalid credentials', 401);
                }
                if (!user.email_verified) {
                    throw new error_1.default('email not verified', 401);
                }
                accessToken = (0, helpers_1.createJWT)({ userId: user._id.toString(), role: 'vendor' }, { expiresIn: '2m' });
                refreshToken = (0, helpers_1.createJWT)({ userId: user._id.toString(), role: 'vendor' }, { expiresIn: '7d' });
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 5 * 60 * 1000,
                    partitioned: true,
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    partitioned: true,
                });
                userData = {
                    userId: user._id.toString(),
                    email: user.email,
                    vendor_name: user.vendor_name,
                };
                return [4 /*yield*/, (0, helpers_1.hashPassword)(refreshToken)];
            case 2:
                hashedToken = _b.sent();
                user.refresh_token = hashedToken;
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                (0, sendResponse_1.sendResponse)(res, 200, userData, 'User logged in successfully', null);
                return [2 /*return*/];
        }
    });
}); });
exports.register = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, email, password, vendor_name, existingUser, hashedPass, user, token, verificationLink;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = auth_validators_1.signUpBodySchema.parse(req.body);
                email = data.email, password = data.password, vendor_name = data.vendor_name;
                return [4 /*yield*/, vendors_models_1.VendorModel.findOne({ email: email })];
            case 1:
                existingUser = _a.sent();
                if (existingUser) {
                    throw new error_1.default('User already exists', 409);
                }
                return [4 /*yield*/, (0, helpers_1.hashPassword)(password)];
            case 2:
                hashedPass = _a.sent();
                return [4 /*yield*/, vendors_models_1.VendorModel.create({
                        email: email,
                        password: hashedPass,
                        vendor_name: vendor_name,
                    })];
            case 3:
                user = _a.sent();
                token = (0, helpers_1.createJWT)({ userId: user._id.toString(), role: 'vendor' }, { expiresIn: '15m' });
                verificationLink = "".concat(process.env.CLIENT_URL, "/verify-email?token=").concat(token);
                (0, send_email_1.default)({
                    templateName: 'verify-email',
                    email: email,
                    subject: 'Verify Your Email Address',
                    variables: {
                        name: vendor_name,
                        verificationLink: verificationLink,
                    },
                });
                (0, sendResponse_1.sendResponse)(res, 201, null, 'User created successfully', null);
                return [2 /*return*/];
        }
    });
}); });
exports.verifyEmail = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, token, decoded, apiKey, hashedApi, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = auth_validators_1.verifyEmailBodySchema.parse(req.body);
                token = data.token;
                decoded = (0, helpers_1.verifyJWT)(token);
                apiKey = (0, helpers_1.generateRandomString)(32);
                hashedApi = (0, helpers_1.hashAPIKey)(apiKey);
                return [4 /*yield*/, vendors_models_1.VendorModel.findByIdAndUpdate(decoded.userId, {
                        email_verified: true,
                        api_key: hashedApi,
                    })];
            case 1:
                user = _a.sent();
                (0, send_email_1.default)({
                    templateName: 'email-verified',
                    email: user.email,
                    subject: 'Email Verified',
                    variables: {
                        name: user.vendor_name,
                        loginUrl: "".concat(process.env.CLIENT_URL, "/login"),
                    },
                });
                (0, sendResponse_1.sendResponse)(res, 200, null, 'Email has successfully been verified');
                return [2 /*return*/];
        }
    });
}); });
exports.forgotPassword = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, email, user, token, link;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = auth_validators_1.forgotPasswordBodySchema.parse(req.body);
                email = data.email;
                return [4 /*yield*/, vendors_models_1.VendorModel.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new error_1.default('User not found', 401);
                }
                token = (0, helpers_1.createJWT)({
                    userId: user._id.toString(),
                }, { expiresIn: '5m' });
                link = "".concat(process.env.CLIENT_URL, "/forgot-password?token=").concat(token);
                (0, send_email_1.default)({
                    templateName: 'forgot-password',
                    subject: 'Reset Password',
                    email: user.email,
                    variables: {
                        name: user.vendor_name,
                        resetUrl: link,
                    },
                });
                (0, sendResponse_1.sendResponse)(res, 200, null, 'Verification link has been sent', null);
                return [2 /*return*/];
        }
    });
}); });
//reset password
exports.resetPassword = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, password, token, decoded, user, hashedPass;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = auth_validators_1.resetPasswordBodySchema.parse(req.body);
                password = data.password, token = data.token;
                decoded = (0, helpers_1.verifyJWT)(token);
                return [4 /*yield*/, vendors_models_1.VendorModel.findById(decoded.userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new error_1.default('User not found', 401);
                }
                return [4 /*yield*/, (0, helpers_1.hashPassword)(password)];
            case 2:
                hashedPass = _a.sent();
                return [4 /*yield*/, vendors_models_1.VendorModel.findByIdAndUpdate(user._id, { password: hashedPass })];
            case 3:
                _a.sent();
                (0, sendResponse_1.sendResponse)(res, 200, null, 'Password has been reset', null);
                return [2 /*return*/];
        }
    });
}); });
//logout
// post
exports.logout = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, decoded, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessToken = req.cookies.accessToken;
                decoded = (0, helpers_1.verifyJWT)(accessToken);
                return [4 /*yield*/, vendors_models_1.VendorModel.findById(decoded.userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new error_1.default('User not found', 401);
                }
                user.refresh_token = '';
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                (0, sendResponse_1.sendResponse)(res, 200, null, 'User logged out successfully', null);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=auth.controller.js.map