import express from "express";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// ✅ Get all products (with category populated)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category"); // populate category details
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add product (with category)
router.post("/", async (req, res) => {
  try {
    const { name, costPrice, sellingPrice, quantity, category } = req.body;

    const product = new Product({
      name,
      costPrice,
      sellingPrice,
      quantity,
      category, // category _id from frontend
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update product (edit/sell)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("category");

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
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
