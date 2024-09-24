const express = require("express");
const router = express.Router();

const Address = require("../../models/address");
const auth = require("../../middleware/auth");

//-- API: add address
router.post("/add", auth, async (req, res) => {
  try {
    const user = req.user;

    const address = new Address({
      ...req.body,
      user: user._id
    });
    const addressDoc = await address.save();

    res.status(200).json({
      success: true,
      message: "Address has been added successfully!",
      address: addressDoc
    });
  } catch (err) {
    console.error("[POST] - (/address/add):", err);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

//-- API: fetch all addresses
router.get("/", auth, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });

    res.status(200).json({
      addresses
    });
  } catch (err) {
    console.error("[GET] - (/address/):", err);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const addressId = req.params.id;

    const addressDoc = await Address.findOne({ _id: addressId });
    if (!addressDoc) {
      res.status(404).json({
        message: `Cannot find Address with the id: ${addressId}.`
      });
    }

    res.status(200).json({
      address: addressDoc
    });
  } catch (err) {
    console.error("[GET] - (/address/:id):", err);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const addressId = req.params.id;
    const update = req.body;
    const query = { _id: addressId };

    await Address.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: "Address has been updated successfully!"
    });
  } catch (err) {
    console.error("[PUT] - (/address/:id):", err);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const address = await Address.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `Address has been deleted successfully!`,
      address
    });
  } catch (err) {
    console.error("[DELETE] - (/address/delete/:id):", err);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

module.exports = router;
