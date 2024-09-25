const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");

const keys = require("../../config/keys");
const auth = require("../../middleware/auth");
const User = require("../../models/user");
const mailchimp = require("../../services/mailchimp");
const mailgun = require("../../services/mailgun");
const { EMAIL_PROVIDER } = require("../../constants");

const { jwtSecret, tokenLife, myBearerPrefix } = keys.jwt;
const { key, listKey } = keys.mailchimp;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }
    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ error: "No user found for this email address." });
    }
    if (user && user.provider !== EMAIL_PROVIDER.Email) {
      return res.status(400).send({
        error: `That email address is already in use using ${user.provider} provider.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Password Incorrect."
      });
    }

    const payload = {
      id: user.id
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: tokenLife });
    if (!token) {
      throw new Error("Failed to sign token");
    }

    res.status(200).json({
      success: true,
      token: `${myBearerPrefix} ${token}`,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("[POST] - (/auth/login):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, firstName, lastName, password, isSubscribed } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }
    if (!firstName || !lastName) {
      return res.status(400).json({ error: "You must enter your full name." });
    }
    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "That email address is already in use." });
    }

    let subscribed = false;
    if (isSubscribed) {
      if (key && listKey) {
        const result = await mailchimp.subscribeToNewsletter(email);

        if (result.status === "subscribed") {
          subscribed = true;
        }
      }
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    const registeredUser = await user.save();

    const payload = {
      id: registeredUser.id
    };

    await mailgun.sendEmail(
      registeredUser.email,
      "signup",
      null,
      registeredUser
    );

    const token = jwt.sign(payload, jwtSecret, { expiresIn: tokenLife });

    res.status(200).json({
      success: true,
      subscribed,
      token: `${myBearerPrefix} ${token}`,
      user: {
        id: registeredUser.id,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        email: registeredUser.email,
        role: registeredUser.role
      }
    });
  } catch (err) {
    console.error("[POST] - (/auth/register):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .send({ error: "No user found for this email address." });
    }

    const buffer = crypto.randomBytes(48);
    const resetToken = buffer.toString("hex");
    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 3600000;

    existingUser.save();

    await mailgun.sendEmail(
      existingUser.email,
      "reset",
      req.headers.host,
      resetToken
    );

    res.status(200).json({
      success: true,
      message: "Please check your email for the link to reset your password."
    });
  } catch (err) {
    console.error("[POST] - (/auth/forgot):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.post("/reset/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const resetUser = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!resetUser) {
      return res.status(400).json({
        error:
          "Your token has expired. Please attempt to reset your password again."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    resetUser.password = hash;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save();

    await mailgun.sendEmail(resetUser.email, "reset-confirmation");

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password."
    });
  } catch (err) {
    console.error("[POST] - (/auth/reset/:token):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.post("/reset", auth, async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const email = req.user.email;

    if (!email) {
      return res.status(401).send("Unauthenticated");
    }
    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "That email address is already in use." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Please enter your correct old password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(confirmPassword, salt);
    existingUser.password = hash;

    existingUser.save();

    await mailgun.sendEmail(existingUser.email, "reset-confirmation");

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password."
    });
  } catch (err) {
    console.error("[POST] - (/auth/reset):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//     accessType: "offline",
//     approvalPrompt: "force"
//   })
// );
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${keys.app.clientURL}/login`,
    session: false
  }),
  (req, res) => {
    try {
      const payload = {
        id: req.user.id
      };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: tokenLife });
      const jwtToken = `${myBearerPrefix} ${token}`;
      //-- send token to frontend
      res.redirect(`${keys.app.clientURL}/auth/success?token=${jwtToken}`);
    } catch (err) {
      console.error("[GET] - (/auth/google/callback):", err?.message);
      res.status(400).json({
        error: "Your request could not be processed. Please try again."
      });
    }
  }
);

router.get(
  "/apple",
  passport.authenticate("apple", {
    session: false,
    scope: ["public_profile", "email"]
  })
);

router.get(
  "/apple/callback",
  passport.authenticate("apple", {
    failureRedirect: `${keys.app.clientURL}/login`,
    session: false
  }),
  (req, res) => {
    try {
      const payload = {
        id: req.user.id
      };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: tokenLife });
      const jwtToken = `${myBearerPrefix} ${token}`;
      res.redirect(`${keys.app.clientURL}/auth/success?token=${jwtToken}`);
    } catch (err) {
      console.error("[GET] - (/auth/apple/callback):", err?.message);
      res.status(400).json({
        error: "Your request could not be processed. Please try again."
      });
    }
  }
);

module.exports = router;
