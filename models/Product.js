import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  costPrice: Number,
  sellingPrice: Number,
  quantity: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId, // reference to category
    ref: "Category",
  },
});

export default mongoose.model("Product", ProductSchema);
