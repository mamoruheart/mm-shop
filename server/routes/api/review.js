const express = require("express");
const router = express.Router();

const Review = require("../../models/review");
const Product = require("../../models/product");
const auth = require("../../middleware/auth");
const { REVIEW_STATUS } = require("../../constants");

router.post("/add", auth, async (req, res) => {
  try {
    const user = req.user;

    const review = new Review({
      ...req.body,
      user: user._id
    });

    const reviewDoc = await review.save();

    res.status(200).json({
      success: true,
      message: `Your review has been added successfully and will appear when approved!`,
      review: reviewDoc
    });
  } catch (err) {
    console.error("[POST] - (/review/add):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

//-- API: fetch all reviews
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find()
      .sort("-created")
      .populate({
        path: "user",
        select: "firstName"
      })
      .populate({
        path: "product",
        select: "name slug imageUrl"
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Review.countDocuments();

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (err) {
    console.error("[GET] - (/review/):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const productDoc = await Product.findOne({ slug: req.params.slug });

    const hasNoBrand =
      productDoc?.brand === null || productDoc?.brand?.isActive === false;

    if (!productDoc || hasNoBrand) {
      return res.status(404).json({
        message: "No product found."
      });
    }

    const reviews = await Review.find({
      product: productDoc._id,
      status: REVIEW_STATUS.Approved
    })
      .populate({
        path: "user",
        select: "firstName"
      })
      .sort("-created");

    res.status(200).json({
      reviews
    });
  } catch (err) {
    console.error("[GET] - (/review/:slug):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const update = req.body;
    const query = { _id: reviewId };

    await Review.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: "review has been updated successfully!"
    });
  } catch (err) {
    console.error("[PUT] - (/review/:id):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

//-- API: approve review
router.put("/approve/:reviewId", auth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const query = { _id: reviewId };
    const update = {
      status: REVIEW_STATUS.Approved,
      isActive: true
    };

    await Review.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error("[PUT] - (/review/approve/:reviewId):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

//-- API: reject review
router.put("/reject/:reviewId", auth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const query = { _id: reviewId };
    const update = {
      status: REVIEW_STATUS.Rejected
    };

    await Review.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error("[PUT] - (/review/reject/:reviewId):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const review = await Review.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `review has been deleted successfully!`,
      review
    });
  } catch (err) {
    console.error("[DELETE] - (/review/delete/:id):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

module.exports = router;
