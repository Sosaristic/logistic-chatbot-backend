"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var compression_1 = __importDefault(require("compression"));
var routes_1 = require("./routes");
var error_controller_1 = __importDefault(require("./controllers/error.controller"));
var error_1 = __importDefault(require("./lib/utils/error"));
var auth_middleware_1 = require("./middlewares/auth.middleware");
dotenv_1.default.config();
var app = (0, express_1.default)();
var corsOptions = {
    credentials: true,
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5173',
        process.env.CLIENT_URL,
    ],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, compression_1.default)({
    level: 6,
    threshold: 10 * 1000,
}));
app.get('/', function (req, res) {
    res.status(200).json({ message: 'Hello World' });
});
app.use('/api/v1/auth', routes_1.authRoutes);
app.use('/api/v1/order', routes_1.orderRoutes);
app.get('/protected', auth_middleware_1.authMiddleWare, function (req, res) {
    res.status(200).json({ message: "You're logged in!" });
});
app.all('*', function (req, res, next) {
    var err = new error_1.default("Can't find ".concat(req.originalUrl, " on the server!"), 404);
    next(err);
});
app.use(error_controller_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map