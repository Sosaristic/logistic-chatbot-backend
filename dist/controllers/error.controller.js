"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorValidators_1 = require("../validators/ErrorValidators");
var mongoose_1 = __importDefault(require("mongoose"));
var errorController = function (error, req, res, next) {
    var validator = new ErrorValidators_1.ErrorValidators(res, error);
    if (error.name == 'ZodError') {
        return validator.zodValidator();
    }
    else if (error.isOperational) {
        return validator.customValidator();
    }
    else if (error instanceof mongoose_1.default.Error.CastError) {
        return validator.mongooseValidator(); // Added method to handle Mongoose CastError
    }
    else if (error instanceof mongoose_1.default.Error.ValidationError) {
        return validator.mongooseValidator(); // Handle Mongoose ValidationError
    }
    else {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
var errorHandlerMiddleware = function (err, req, res, next) {
    errorController(err, req, res, next);
};
exports.default = errorHandlerMiddleware;
//# sourceMappingURL=error.controller.js.map