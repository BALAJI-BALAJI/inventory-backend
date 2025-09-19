import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ⚠️ hash with bcrypt for production
  role: { type: String, enum: ["admin", "staff"], default: "staff" },
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
