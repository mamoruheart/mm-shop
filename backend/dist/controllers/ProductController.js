"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_product = exports.update_product = exports.post_product = exports.get_product = void 0;
const product_1 = __importDefault(require("../model/product"));
const parseRequest = (req) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const newData = {
        category: req.body.category,
        description: String(req.body.description),
        price: +req.body.price,
        title: String(req.body.name),
        actionType: (_a = req.body.actionType) !== null && _a !== void 0 ? _a : 'None',
        barrelLength: (_b = +req.body.barrelLength) !== null && _b !== void 0 ? _b : 0,
        caliber: (_c = +req.body.caliber) !== null && _c !== void 0 ? _c : 0,
        magazineCapacity: (_d = +req.body.magazineCapacity) !== null && _d !== void 0 ? _d : 0,
        overAllLength: (_e = +req.body.overAllLength) !== null && _e !== void 0 ? _e : 0,
        stockType: (_f = String(req.body.stockType)) !== null && _f !== void 0 ? _f : '',
        weight: (_g = +req.body.weight) !== null && _g !== void 0 ? _g : 0,
        images: req.body.images ? req.body.images.split('|') : []
    };
    const files = req.files;
    console.log(files);
    if (!!files)
        if (files.length != 0) {
            const fileUrls = files.map(file => ({
                filename: file.filename,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));
            newData.images = [];
            fileUrls.map((fileUrl) => {
                newData.images.push(fileUrl.filename);
            });
        }
    return newData;
};
const get_product = (req, res) => {
    product_1.default.find().populate('category').sort({ date_added: -1 }).then(products => res.json(products));
};
exports.get_product = get_product;
const post_product = (req, res) => {
    console.log('aaaaaaaaaasdfsadf');
    const newData = parseRequest(req);
    const newProduct = new product_1.default(newData);
    console.log(newProduct);
    console.log(req.body);
    newProduct.save();
    (0, exports.get_product)(req, res);
};
exports.post_product = post_product;
const update_product = (req, res) => {
    const newData = parseRequest(req);
    product_1.default.findByIdAndUpdate({ _id: req.params.id }, newData).then(product => {
        product_1.default.findOne({ _id: req.params.id }).then(product => {
            (0, exports.get_product)(req, res);
        });
    });
};
exports.update_product = update_product;
const delete_product = (req, res) => {
    console.log('delete', req.body);
    product_1.default.findByIdAndDelete({ _id: req.params.id }).then(product => {
        (0, exports.get_product)(req, res);
    });
};
exports.delete_product = delete_product;
