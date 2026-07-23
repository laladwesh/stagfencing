const express = require("express");
const categoriesRouter = require("./categories");
const productsRouter = require("./products");
const authRouter = require("./auth");
const ordersRouter = require("./orders");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/orders", ordersRouter);

module.exports = router;
