const express = require("express");
const categoriesRouter = require("./categories");
const productsRouter = require("./products");
const authRouter = require("./auth");
const ordersRouter = require("./orders");
const uploadsRouter = require("./uploads");
const cartRouter = require("./cart");
const paymentsRouter = require("./payments");
const servicesRouter = require("./services");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/orders", ordersRouter);
router.use("/uploads", uploadsRouter);
router.use("/cart", cartRouter);
router.use("/payments", paymentsRouter);
router.use("/services", servicesRouter);

module.exports = router;
