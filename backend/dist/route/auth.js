"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const Passport_1 = __importDefault(require("../config/Passport"));
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = (0, express_1.Router)();
router.post('/changeInfo', AuthMiddleware_1.AuthMiddleware, AuthController_1.changeInfo);
router.post('/signup', AuthController_1.signup);
router.post('/login', AuthController_1.login);
router.get('/get_user', AuthMiddleware_1.AuthMiddleware, AuthController_1.get_user);
router.get('/auth/google', Passport_1.default.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.post('/auth/google/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ msg: 'Invalid Google token' });
        }
        let user = yield user_1.default.findOne({ email: payload.email });
        if (!user) {
            user = new user_1.default({
                password: payload.sub,
                name: payload.name,
                email: payload.email,
                state: 0,
            });
            yield user.save();
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user, token });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
        console.log(error);
    }
}));
// Routes
router.get('/auth/apple', Passport_1.default.authenticate('apple'));
router.get('/auth/apple/callback', Passport_1.default.authenticate('apple', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect to frontend or send response
    res.redirect('/'); // Redirect to frontend app
});
exports.default = router;
