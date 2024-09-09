"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const ProductSchema = new mongoose_2.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Category",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date_added: {
        type: Date,
        default: Date.now
    },
    caliber: {
        type: Number
    },
    actionType: {
        type: String,
        enum: [
            "Bolt-Action",
            "Lever-action",
            "Semi-Automatic",
            "Automatic",
            "Pump-Action",
            "Break-Action",
            "None",
            "Extra"
        ],
        required: true
    },
    barrelLength: {
        type: Number
    },
    overAllLength: {},
    weight: {
        type: Number
    },
    magazineCapacity: {
        type: Number
    },
    stockType: {
        type: String
    },
    images: {
        type: [String]
    }
});
exports.default = mongoose_1.default.model("Product", ProductSchema);
//# sourceMappingURL=product.js.map