const router = require("express").Router();

const authRoutes = require("./auth");
const userRoutes = require("./user");
const addressRoutes = require("./address");
const newsletterRoutes = require("./newsletter");
const productRoutes = require("./product");
const categoryRoutes = require("./category");
const brandRoutes = require("./brand");
const contactRoutes = require("./contact");
const merchantRoutes = require("./merchant");
const cartRoutes = require("./cart");
const orderRoutes = require("./order");
const reviewRoutes = require("./review");
const wishlistRoutes = require("./wishlist");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/address", addressRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/product", productRoutes);
router.use("/category", categoryRoutes);
router.use("/brand", brandRoutes);
router.use("/contact", contactRoutes);
router.use("/merchant", merchantRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/review", reviewRoutes);
router.use("/wishlist", wishlistRoutes);

module.exports = router;
