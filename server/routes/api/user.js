const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const { ROLES } = require("../../constants");

//-- API: search users
router.get("/search", auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { search } = req.query;
    const regex = new RegExp(search, "i");

    const users = await User.find(
      {
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { email: { $regex: regex } }
        ]
      },
      { password: 0, _id: 0 }
    ).populate("merchant", "name");

    res.status(200).json({
      users
    });
  } catch (err) {
    console.error("[GET] - (/user/search):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

//-- API: fetch users
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({}, { password: 0, _id: 0, googleId: 0 })
      .sort("-created")
      .populate("merchant", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (err) {
    console.error("[GET] - (/user/):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = req.user._id;
    const userDoc = await User.findById(user, { password: 0 }).populate({
      path: "merchant",
      model: "Merchant",
      populate: {
        path: "brand",
        model: "Brand"
      }
    });

    res.status(200).json({
      user: userDoc
    });
  } catch (err) {
    console.error("[GET] - (/user/me):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const user = req.user._id;
    const update = req.body.profile;
    const query = { _id: user };

    const userDoc = await User.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: "Your profile is successfully updated!",
      user: userDoc
    });
  } catch (err) {
    console.error("[PUT] - (/user/):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

module.exports = router;
