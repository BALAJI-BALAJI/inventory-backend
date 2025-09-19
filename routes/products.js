import express from "express";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add product
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Update product (for edit or sell)
router.put("/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

  // If selling (quantity reduced), log transaction
  if (req.body.soldQty) {
    const t = new Transaction({
      productId: product._id,
      productName: product.name,
      type: "OUT",
      qty: req.body.soldQty,
      sellingPrice: product.sellingPrice,
      costPrice: product.costPrice,
    });
    await t.save();
  }

  res.json(product);
});

// Delete product
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
