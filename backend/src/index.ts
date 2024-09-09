import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

import authRouter from "./route/auth";
import productRouter from "./route/product";
import categoryRouter from "./route/category";
import customerRouter from "./route/customer";
import orderRouter from "./route/order";

dotenv.config({
  path: path.resolve(__dirname, "..", ".env")
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/customer", customerRouter);
app.use("/order", orderRouter);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.dbURI
    : "mongodb://127.0.0.1:27017/mmshop";
const port = process.env.PORT || 3000;

mongoose
  .connect(dbURI!)
  .then((res) => {
    console.log("MongoDB connected:", dbURI);
    app.listen(port, () => console.log("Server is running on port", port));
  })
  .catch((err) => console.log("Failed to connect MongoDB:", err));
