"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_order = exports.update_order = exports.post_order = exports.get_order = void 0;
const order_1 = __importDefault(require("../model/order"));
const get_order = (req, res) => {
    console.log(req.params.id);
    if (req.params.id == "undefined")
        order_1.default.find()
            .sort({ date_added: -1 })
            .then((orders) => {
            res.status(200).json(orders);
        })
            .catch((err) => {
            console.error(err);
            res
                .status(500)
                .json({ error: "An error occurred while fetching orders" });
        });
    else
        order_1.default.find()
            .sort({ date_added: -1 })
            .then((orders) => {
            res
                .status(200)
                .json(orders.filter((item) => String(item.user) === req.params.id));
        })
            .catch((err) => {
            console.error(err);
            res
                .status(500)
                .json({ error: "An error occurred while fetching orders" });
        });
};
exports.get_order = get_order;
const post_order = (req, res) => {
    var _a;
    const newOrder = new order_1.default(JSON.parse(req.body.order));
    newOrder.ffl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    console.log(newOrder);
    newOrder.save().then((order) => {
        res.json(order);
        console.log(order);
    });
};
exports.post_order = post_order;
const update_order = (req, res) => {
    if (req.body.action == "1")
        order_1.default.findByIdAndUpdate({ _id: req.params.id }, { $set: { stepNo: req.body.stepNo, user_confirm: false } }).then((order) => {
            order_1.default.find()
                .sort({ date_added: -1 })
                .then((orders) => res.json(orders));
        });
    else if (req.body.action == "0") {
        order_1.default.findByIdAndUpdate({ _id: req.params.id }, { $set: { user_confirm: true } }).then((order) => {
            order_1.default.find()
                .sort({ date_added: -1 })
                .then((orders) => res.json(orders));
        });
    }
};
exports.update_order = update_order;
const delete_order = (req, res) => {
    order_1.default.findByIdAndDelete({ _id: req.params.id }).then((order) => {
        res.json({ success: true });
    });
};
exports.delete_order = delete_order;
//# sourceMappingURL=OrderController.js.map