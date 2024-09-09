"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = __importDefault(require("./route/auth"));
const product_1 = __importDefault(require("./route/product"));
const category_1 = __importDefault(require("./route/category"));
const customer_1 = __importDefault(require("./route/customer"));
const order_1 = __importDefault(require("./route/order"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "..", ".env")
});
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/", auth_1.default);
app.use("/product", product_1.default);
app.use("/category", category_1.default);
app.use("/customer", customer_1.default);
app.use("/order", order_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "client", "build", "index.html"));
    });
}
const dbURI = process.env.NODE_ENV === "production"
    ? process.env.dbURI
    : "mongodb://127.0.0.1:27017/mmshop";
const port = process.env.PORT || 3000;
mongoose_1.default
    .connect(dbURI)
    .then((res) => {
    console.log("MongoDB connected:", dbURI);
    app.listen(port, () => console.log("Server is running on port", port));
})
    .catch((err) => console.log("Failed to connect MongoDB:", err));
//# sourceMappingURL=index.js.map