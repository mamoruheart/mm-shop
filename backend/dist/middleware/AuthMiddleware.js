"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthMiddleware = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
            console.log(!!err);
            if (!!err) {
                res.status(403).json({ msg: 'Cookie expired' });
            }
            else {
                if (authData)
                    next();
                else
                    res.status(401).json({ msg: 'You are not logged in' });
            }
        });
    }
    else
        res.status(401);
};
exports.AuthMiddleware = AuthMiddleware;
