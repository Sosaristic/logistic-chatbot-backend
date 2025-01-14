"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var order_controller_1 = require("../controllers/order.controller");
var router = (0, express_1.Router)();
router.post('/place-order', order_controller_1.placeOrder);
exports.default = router;
//# sourceMappingURL=order.routes.js.map