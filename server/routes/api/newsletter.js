const express = require("express");
const router = express.Router();

const mailchimp = require("../../services/mailchimp");
const mailgun = require("../../services/mailgun");

router.post("/subscribe", async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }

    const result = await mailchimp.subscribeToNewsletter(email);
    if (result.status === 400) {
      return res.status(400).json({ error: result.title });
    }

    await mailgun.sendEmail(email, "newsletter-subscription");

    res.status(200).json({
      success: true,
      message: "You have successfully subscribed to the newsletter"
    });
  } catch (err) {
    console.error("[POST] - (/newsletter/subscribe):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

module.exports = router;
