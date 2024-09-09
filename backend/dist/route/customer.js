"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CustomerController_1 = require("../controllers/CustomerController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = (0, express_1.Router)();
router.get("/", CustomerController_1.get_customer);
router.post("/", CustomerController_1.post_customer);
router.put("/:id", AuthMiddleware_1.AuthMiddleware, CustomerController_1.update_customer);
router.delete("/:id", AuthMiddleware_1.AuthMiddleware, CustomerController_1.delete_customer);
exports.default = router;
//# sourceMappingURL=customer.js.map