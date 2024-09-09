"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const multer_1 = require("../config/multer");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = (0, express_1.Router)();
router.get("/:id", AuthMiddleware_1.AuthMiddleware, OrderController_1.get_order);
router.post("/", AuthMiddleware_1.AuthMiddleware, multer_1.upload.single("file"), OrderController_1.post_order);
router.put("/:id", AuthMiddleware_1.AuthMiddleware, multer_1.upload.single("file"), OrderController_1.update_order);
router.delete("/:id", AuthMiddleware_1.AuthMiddleware, OrderController_1.delete_order);
exports.default = router;
//# sourceMappingURL=order.js.map