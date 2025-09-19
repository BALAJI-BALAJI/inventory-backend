import express from "express";
import AddStaff from "../models/AddStaff.js";


const router = express.Router();

// Admin creates staff user
router.post("/", async (req, res) => {
  try {
    const { role, name, phone, username, password } = req.body;
    const user = new AddStaff({ role, name, phone, username, password });
    await user.save();
    res.json({ message: "User created successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all staff users
router.get("/", async (req, res) => {
  const users = await AddStaff.find();
  res.json(users);
});

export default router;
