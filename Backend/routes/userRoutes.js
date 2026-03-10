import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all users (Admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    
    // Format the response to match frontend expectations
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET staff only (Admin only)
router.get("/staff", protect, adminOnly, async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");
    
    // Format the response to match frontend expectations
    const formattedStaff = staff.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    }));
    
    res.json(formattedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new staff (Admin only)
router.post("/create-staff", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "staff",
      department,
    });

    res.status(201).json({
      message: "Staff created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE user (Admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.department = department || user.department;
    user.role = role || user.role;

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE user (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;