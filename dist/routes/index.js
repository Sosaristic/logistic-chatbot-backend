"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = exports.authRoutes = void 0;
var auth_routes_1 = require("./auth.routes");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_routes_1).default; } });
var order_routes_1 = require("./order.routes");
Object.defineProperty(exports, "orderRoutes", { enumerable: true, get: function () { return __importDefault(order_routes_1).default; } });
//# sourceMappingURL=index.js.map