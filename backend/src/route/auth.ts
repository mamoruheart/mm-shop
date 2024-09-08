import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import {
  get_user,
  login,
  changeInfo,
  signup
} from "../controllers/AuthController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import passport from "../config/Passport";
import User from "../model/user";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = Router();

router.post("/changeInfo", AuthMiddleware, changeInfo);

router.post("/signup", signup);

router.post("/login", login);

router.get("/get_user", AuthMiddleware, get_user);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"]
  })
);

router.post("/auth/google/callback", async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ msg: "Invalid Google token" });
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        password: payload.sub,
        name: payload.name,
        email: payload.email,
        state: 0
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h"
    });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
    console.log(error);
  }
});

router.get("/auth/apple", passport.authenticate("apple"));

router.get(
  "/auth/apple/callback",
  passport.authenticate("apple", { failureRedirect: "/login" }),
  (req, res) => {
    //-- Successful authentication, redirect to frontend or send response
    res.redirect("/");
  }
);

export default router;
