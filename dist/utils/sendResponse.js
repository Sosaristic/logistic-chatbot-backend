"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
var sendResponse = function (res, statusCode, data, message, error) {
    if (data === void 0) { data = null; }
    if (message === void 0) { message = ''; }
    if (error === void 0) { error = null; }
    var response = {
        status: error ? 'error' : 'success',
        message: message || (error ? 'An error occurred' : 'Request was successful'),
        data: data,
        error: error,
    };
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map