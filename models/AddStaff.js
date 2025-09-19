import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  role: { type: String, enum: ["admin", "staff"], default: "staff" },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // plain text for now
});

export default mongoose.model("AddStaff", staffSchema);
