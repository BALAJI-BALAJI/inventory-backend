import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "mysecret";

// ✅ Hardcoded admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

// Register staff (optional)
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Prevent registering admin from DB
    if (username === ADMIN_USERNAME) {
      return res.status(400).json({ message: "Admin is reserved, cannot register" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, role });
    await user.save();

    res.json({ message: "User created" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Hardcoded admin check
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username: ADMIN_USERNAME, role: "admin" }, SECRET, {
        expiresIn: "1h",
      });
      return res.json({
        success: true,
        token,
        user: { username: ADMIN_USERNAME, role: "admin" },
      });
    }

    // ✅ Staff login from DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
