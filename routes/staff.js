import express from "express";
import Staff from "../models/Staff.js";

const router = express.Router();

// ➤ Create staff
router.post("/", async (req, res) => {
  const { name, phone, username, password, role } = req.body;

  if (!name || !phone || !username || !password) {
    return res.status(400).json({ error: "All fields except role are required" });
  }

  try {
    const existingUser = await Staff.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const staff = new Staff({ name, phone, username, password, role });
    await staff.save();

    // ✅ Include password in response
    res.status(201).json(staff);
  } catch (err) {
    console.error("Error saving staff:", err.message);
    res.status(500).json({ error: "Failed to add staff" });
  }
});

// ➤ Staff login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Identifier and password are required" });
  }

  try {
    const user = await Staff.findOne({
      $or: [{ username: identifier }, { phone: identifier }],
    });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ Include password in login response
    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      username: user.username,
      role: user.role,
      password: user.password, // included now
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// ➤ Get all staff
router.get("/", async (req, res) => {
  try {
    // ✅ Include password for all staff
    const staff = await Staff.find(); 
    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err.message);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

// ➤ Delete staff by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    res.json({ message: "Staff deleted" });
  } catch (err) {
    console.error("Error deleting staff:", err.message);
    res.status(500).json({ error: "Failed to delete staff" });
  }
});

export default router;
