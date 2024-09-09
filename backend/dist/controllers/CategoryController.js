"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_category = exports.update_category = exports.post_category = exports.get_category = void 0;
const category_1 = __importDefault(require("../model/category"));
const get_category = (req, res) => {
    category_1.default.find().then((category) => res.json(category));
};
exports.get_category = get_category;
const post_category = (req, res) => {
    const newCategory = new category_1.default(req.body);
    newCategory.save().then((category) => res.json(category));
};
exports.post_category = post_category;
const update_category = (req, res) => {
    category_1.default.findByIdAndUpdate({ _id: req.params.id }, req.body).then((category) => {
        category_1.default.findOne({ _id: req.params.id }).then((category) => {
            res.json(category);
        });
    });
};
exports.update_category = update_category;
const delete_category = (req, res) => {
    category_1.default.findByIdAndDelete({ _id: req.params.id }).then((category) => {
        res.json({ success: true });
    });
};
exports.delete_category = delete_category;
//# sourceMappingURL=CategoryController.js.map