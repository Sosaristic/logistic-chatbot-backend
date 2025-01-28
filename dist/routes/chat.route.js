"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var chat_controller_1 = require("../controllers/chat.controller");
var router = (0, express_1.Router)();
router.post('/conversation', chat_controller_1.handleChats);
exports.default = router;
//# sourceMappingURL=chat.route.js.map