import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "mysecret";

// ➤ Admin creates staff
router.post("/", async (req, res) => {
  const { name, phone, username, password } = req.body;

  if (!name || !phone || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const exists = await Staff.findOne({ username });
    if (exists) return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = new Staff({ name, phone, username, password: hashedPassword, role: "staff" });
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ error: "Failed to create staff" });
  }
});

// ➤ Staff login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) return res.status(400).json({ error: "All fields are required" });

  try {
    const staff = await Staff.findOne({
      $or: [{ username: identifier }, { phone: identifier }],
    });

    if (!staff) return res.status(200).json({ success: false, message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, staff.password);
    if (!isValid) return res.status(200).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: staff._id, role: staff.role }, SECRET, { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        username: staff.username,
        phone: staff.phone,
        role: staff.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ➤ Delete a staff by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const staff = await Staff.findByIdAndDelete(id);
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    res.json({ success: true, message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete staff" });
  }
});

// ➤ Get all staff (for Admin only)
router.get("/", async (req, res) => {
  const staff = await Staff.find();
  res.json(staff);
});

export default router;
