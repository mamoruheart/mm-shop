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
exports.get_user = exports.changeInfo = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../model/user"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ msg: "Please enter mandatory fields" });
            return;
        }
        user_1.default.findOne({ email }).then((user) => {
            if (user)
                return res.status(400).json({ msg: "User already exists" });
            const newUser = new user_1.default({
                name,
                email,
                password,
                phone,
                state: 0
            });
            //-- create salt and hash
            bcrypt_1.default.genSalt(10, (err, salt) => {
                bcrypt_1.default.hash(password, salt, (err, hash) => {
                    if (err)
                        throw err;
                    newUser.password = hash;
                    newUser.save().then((user) => {
                        jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                            if (err)
                                throw err;
                            res.json({
                                token,
                                user
                            });
                        });
                    });
                });
            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Signup error" });
    }
});
exports.signup = signup;
const login = (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ msg: "Please type in all the data" });
        return;
    }
    user_1.default.findOne({ email }).then((user) => {
        if (!user || user == null) {
            res.status(400).json({ msg: "Invalid email or password" });
            return;
        }
        bcrypt_1.default.compare(password, user.password).then((isMatch) => {
            if (isMatch)
                jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                    if (err)
                        throw err;
                    res.json({
                        token,
                        user: {
                            id: user === null || user === void 0 ? void 0 : user.id,
                            name: user === null || user === void 0 ? void 0 : user.name,
                            email: user === null || user === void 0 ? void 0 : user.email,
                            phone: user === null || user === void 0 ? void 0 : user.phone,
                            state: user === null || user === void 0 ? void 0 : user.state
                        }
                    });
                });
            else
                res.status(403).json({ msg: "Invalid Password" });
        });
    });
};
exports.login = login;
const changeInfo = (req, res) => {
    const { fname, lname, email, phone, password, passwordConfirm } = req.body;
    console.log(email);
    if (!email || !fname || !lname || !phone || !password || !passwordConfirm) {
        res.status(400).json({ msg: "Please type in all the data" });
        return;
    }
    user_1.default.findOne({ email }).then((user) => {
        console.log(user);
        if (!user || user == null) {
            res.status(400).json({ msg: "Invalid email or password" });
            return;
        }
        if (password !== passwordConfirm) {
            res.status(400).json({ msg: "Confirm Password is not same" });
            return;
        }
        if (password) {
            bcrypt_1.default
                .genSalt(10)
                .then((salt) => bcrypt_1.default.hash(password, salt))
                .then((hash) => {
                const updatedUser = user_1.default.findByIdAndUpdate(user.id, {
                    $set: { email, password: hash, phone, name: fname + lname }
                }).then(() => {
                    res.status(200).json({ msg: "Operation Successful" });
                });
            })
                .catch((err) => {
                console.error(err);
                res.status(500).json({ msg: "Password hashing error" });
            });
        }
    });
};
exports.changeInfo = changeInfo;
const get_user = (req, res) => {
    user_1.default.findById(req.body.id)
        .select("-password")
        .then((user) => res.json(user));
};
exports.get_user = get_user;
//# sourceMappingURL=AuthController.js.map