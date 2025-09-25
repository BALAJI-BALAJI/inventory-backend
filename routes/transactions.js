import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// POST a new transaction
router.post("/", async (req, res) => {
  try {
    const newTransaction = await Transaction.create(req.body);
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /transactions
router.delete("/", async (req, res) => {
  try {
    await Transaction.deleteMany({});
    res.json({ message: "All transactions cleared." });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear transactions" });
  }
});


export default router;
