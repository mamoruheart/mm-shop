"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_customer = exports.update_customer = exports.post_customer = exports.get_customer = void 0;
const user_1 = __importDefault(require("../model/user"));
const get_customer = (req, res) => {
    user_1.default.find()
        .sort({ date_added: -1 })
        .then((customers) => res.json(customers));
};
exports.get_customer = get_customer;
const post_customer = (req, res) => {
    const newData = req.body;
    const newCustomer = new user_1.default(newData);
    console.log(newCustomer);
    console.log(req.body);
    newCustomer.save();
    (0, exports.get_customer)(req, res);
};
exports.post_customer = post_customer;
const update_customer = (req, res) => {
    const newData = req.body;
    user_1.default.findByIdAndUpdate({ _id: req.params.id }, { $set: { state: newData.state } }).then((customer) => {
        user_1.default.findOne({ _id: req.params.id }).then((customer) => {
            (0, exports.get_customer)(req, res);
        });
    });
};
exports.update_customer = update_customer;
const delete_customer = (req, res) => {
    user_1.default.findByIdAndDelete({ _id: req.params.id }).then((customer) => {
        (0, exports.get_customer)(req, res);
    });
};
exports.delete_customer = delete_customer;
//# sourceMappingURL=CustomerController.js.map