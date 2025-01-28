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
exports.handleChats = void 0;
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var sendResponse_1 = require("../utils/sendResponse");
var chat_validator_1 = require("../validators/chat.validator");
var openai_1 = __importDefault(require("openai"));
var uuid_1 = require("uuid");
// Initialize OpenAI client
var openai = new openai_1.default({
    apiKey: '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',
});
var sessionState = {};
var systemPrompt = "\nYou are a logistics chatbot. Your job is to help users with their requests by understanding their intent and collecting required information. \nIf the user doesn't provide all necessary parameters, politely ask them for the missing ones.\n\nHere are the intents and required parameters:\n1. Track delivery:\n   - Required: trackingNumber\n2. Check order status:\n   - Required: orderID or trackingNumber\n3. Update delivery details:\n   - Required: orderID, newAddress\n4. General inquiry:\n   - No parameters required.\n\nRespond with JSON in this format:\n{\n  \"intent\": \"extracted intent\",\n  \"parameters\": {\n    \"param1\": \"value1\",\n    \"param2\": \"value2\"\n  },\n  \"missingParameters\": [\"paramName1\", \"paramName2\"], // List of missing parameters\n  \"followUpMessage\": \"Message to ask user for missing parameters\" // Optional message to continue the conversation\n}\n";
exports.handleChats = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, completion, userId, nextParam, responseMessage, missingParam, aiResponse, _a, intent, parameters, missingParameters, followUpMessage, responseMessage, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                message = chat_validator_1.createChatBodySchema.parse(req.body).message;
                completion = openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    store: true,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message },
                    ],
                });
                completion.then(function (result) { return console.log(result.choices[0].message); });
                (0, sendResponse_1.sendResponse)(res, 200, message, 'Chat Response', null);
                return [2 /*return*/];
            case 1:
                responseMessage = _b.sent();
                sessionState[userId] = {
                    intent: null,
                    parameters: {},
                    missingParameters: [],
                }; // Reset the session state after processing
                return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 200, responseMessage, 'Chat Response', null)];
            case 2:
                missingParam = sessionState[userId].missingParameters[0];
                return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 200, "Please provide your ".concat(missingParam, "."), 'Chat Response', null)];
            case 3:
                _b.trys.push([3, 6, , 7]);
                return [4 /*yield*/, openai.chat.completions.create({
                        model: 'gpt-4o-mini-2024-07-18',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: message },
                        ],
                        temperature: 0.7,
                        max_tokens: 200,
                    })];
            case 4:
                aiResponse = _b.sent();
                _a = JSON.parse(aiResponse.choices[0].message.content), intent = _a.intent, parameters = _a.parameters, missingParameters = _a.missingParameters, followUpMessage = _a.followUpMessage;
                // Store the intent, parameters, and missing parameters for the user
                sessionState[userId].intent = intent;
                sessionState[userId].parameters = parameters;
                sessionState[userId].missingParameters = missingParameters;
                // If parameters are missing, ask for the first one
                if (missingParameters.length > 0) {
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 200, followUpMessage || "Can you provide your ".concat(missingParameters[0], "?"), 'Chat Response', null)];
                }
                return [4 /*yield*/, processIntent(intent, parameters)];
            case 5:
                responseMessage = _b.sent();
                sessionState[userId] = {
                    intent: null,
                    parameters: {},
                    missingParameters: [],
                }; // Reset session state after processing
                return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 200, responseMessage, 'Chat Response', null)];
            case 6:
                error_1 = _b.sent();
                console.error('Error handling chat:', error_1);
                return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 500, 'Something went wrong. Please try again.', 'Error', null)];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Helper function to process the intent and parameters
var processIntent = function (intent, parameters) { return __awaiter(void 0, void 0, void 0, function () {
    var trackingNumber;
    return __generator(this, function (_a) {
        if (intent === 'track_order') {
            trackingNumber = parameters['trackingNumber'];
            // Simulating a database query or processing logic here
            // In a real application, you might query a database to get the tracking information
            return [2 /*return*/, "Your order with tracking number ".concat(trackingNumber, " is in transit.")];
        }
        // Default response if the intent doesn't match any known ones
        return [2 /*return*/, 'I am not sure how to process that request. Can you clarify?'];
    });
}); };
//# sourceMappingURL=chat.controller.js.map