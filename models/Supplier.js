import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: String,
  contact: String,
  address: String,
});

export default mongoose.model("Supplier", supplierSchema);
