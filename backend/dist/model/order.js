"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const OrderSchema = new mongoose_2.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true
    },
    stepNo: {
        type: Number,
        required: true
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Product",
                required: true
            },
            amount: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    billAddress: {
        city: {
            type: String
        },
        state: {
            type: String
        },
        zip: {
            type: String
        }
    },
    payment: {
        type: String,
        required: true
    },
    deliveryAddress: {
        city: {
            type: String
        },
        state: {
            type: String
        },
        zip: {
            type: String
        }
    },
    ffl: {
        type: String,
        required: true
    },
    date_added: {
        type: Date,
        default: Date.now
    },
    user_confirm: {
        type: Boolean,
        default: false
    }
});
exports.default = mongoose_1.default.model("Order", OrderSchema);
//# sourceMappingURL=order.js.map