const express = require("express");
const router = express.Router();

const Cart = require("../../models/cart");
const Product = require("../../models/product");
const auth = require("../../middleware/auth");
const store = require("../../utils/store");

router.post("/add", auth, async (req, res) => {
  try {
    const user = req.user._id;
    const items = req.body.products;

    const products = store.caculateItemsSalesTax(items);

    const cart = new Cart({
      user,
      products
    });

    const cartDoc = await cart.save();

    decreaseQuantity(products);

    res.status(200).json({
      success: true,
      cartId: cartDoc.id
    });
  } catch (err) {
    console.error("[POST] - (/cart/add):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.delete("/delete/:cartId", auth, async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.cartId });

    res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error("[DELETE] - (/cart/delete/:cartId):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.post("/add/:cartId", auth, async (req, res) => {
  try {
    const product = req.body.product;
    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $push: { products: product } }).exec();

    res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error("[POST] - (/cart/add/:cartId):", err?.message);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.delete("/delete/:cartId/:productId", auth, async (req, res) => {
  try {
    const product = { product: req.params.productId };
    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $pull: { products: product } }).exec();

    res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error(
      "[DELETE] - (/cart/delete/:cartId/:productId):",
      err?.message
    );
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

const decreaseQuantity = (products) => {
  try {
    let bulkOptions = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity } }
        }
      };
    });

    Product.bulkWrite(bulkOptions);
  } catch (err) {
    console.error("decreaseQuantity:", err?.message);
  }
};

module.exports = router;
