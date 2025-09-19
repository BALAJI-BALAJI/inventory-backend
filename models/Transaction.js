import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: String,
  type: { type: String, enum: ["IN", "OUT"] },
  qty: Number,
  costPrice: Number,
  sellingPrice: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);
