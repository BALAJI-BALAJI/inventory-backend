import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  description: { type: String }, // ✅ Added description field
});

export default mongoose.model("Supplier", supplierSchema);
