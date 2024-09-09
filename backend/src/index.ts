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

dotenv.config();

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

//-- used in production to serve client files
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//-- connecting to mongoDB and then running server on port 4000
const dbURI = process.env.dbURI;
const port = process.env.PORT || 3000;
console.log(dbURI);
mongoose
  .connect(dbURI!)
  .then((res) => app.listen(port))
  .catch((err) => console.log(err));

console.log(`Server is on port ${port}`);
console.log(`mongodb connected`);
