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
exports.generateTrackingId = exports.hashAPIKey = exports.generateRandomString = exports.verifyJWT = exports.createJWT = exports.comparePassword = exports.hashPassword = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var error_1 = __importDefault(require("../../lib/utils/error"));
var crypto_1 = __importDefault(require("crypto"));
var hashPassword = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var salt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcrypt_1.default.genSalt(Number(process.env.SALT_ROUNDS))];
            case 1:
                salt = _a.sent();
                if (salt) {
                    return [2 /*return*/, bcrypt_1.default.hash(password, salt)];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.hashPassword = hashPassword;
var comparePassword = function (password, hash) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, bcrypt_1.default.compare(password, hash)];
    });
}); };
exports.comparePassword = comparePassword;
var createJWT = function (user, options) {
    return jsonwebtoken_1.default.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, options);
};
exports.createJWT = createJWT;
var verifyJWT = function (token) {
    try {
        var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new error_1.default('invalid token', 403);
    }
};
exports.verifyJWT = verifyJWT;
var generateRandomString = function (length) {
    return crypto_1.default.randomBytes(length).toString('hex');
};
exports.generateRandomString = generateRandomString;
var hashAPIKey = function (apiKey) {
    return crypto_1.default.createHash('sha256').update(apiKey).digest('hex');
};
exports.hashAPIKey = hashAPIKey;
var generateTrackingId = function (length) {
    if (length === void 0) { length = 12; }
    var digits = '0123456789';
    var trackingId = '';
    for (var i = 0; i < length; i++) {
        trackingId += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return trackingId;
};
exports.generateTrackingId = generateTrackingId;
//# sourceMappingURL=index.js.map