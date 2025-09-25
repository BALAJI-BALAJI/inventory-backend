import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },       // ✅ name
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "staff" },     // ✅ role
});

export default mongoose.model("Staff", staffSchema);
