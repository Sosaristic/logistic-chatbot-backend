"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorValidators = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var ErrorValidators = /** @class */ (function () {
    function ErrorValidators(res, error) {
        this.res = res;
        this.error = error;
        this.res = res;
        this.error = error;
    }
    ErrorValidators.prototype.zodValidator = function () {
        var errors = this.error.errors;
        var message = errors.map(function (error) { return error.message; }).join(',');
        return this.res
            .status(400)
            .json({ status: 'invalid_input', message: message, statusCode: 400 });
    };
    ErrorValidators.prototype.customValidator = function () {
        var error = this.error;
        var message = error.message;
        var statusCode = error.statusCode;
        return this.res.status(error.statusCode).json({
            status: error.status,
            message: message,
            statusCode: statusCode,
        });
    };
    // Mongoose error handling (CastError, ValidationError)
    ErrorValidators.prototype.mongooseValidator = function () {
        if (this.error instanceof mongoose_1.default.Error.CastError) {
            var message = "Invalid ".concat(this.error.path, " format"); // Example: Invalid ObjectId format
            return this.res.status(400).json({
                status: 'invalid_input',
                message: message,
                statusCode: 400,
            });
        }
        if (this.error instanceof mongoose_1.default.Error.ValidationError) {
            var message = Object.values(this.error.errors)
                .map(function (err) { return err.message; })
                .join(',');
            return this.res.status(400).json({
                status: 'validation_error',
                message: message,
                statusCode: 400,
            });
        }
        // In case the error is another type of mongoose error
        return this.res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            statusCode: 500,
        });
    };
    return ErrorValidators;
}());
exports.ErrorValidators = ErrorValidators;
//# sourceMappingURL=ErrorValidators.js.map