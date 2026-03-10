import express from "express";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Staff Check-in
router.post("/checkin", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date();
    const checkInTime = currentTime.toLocaleTimeString();

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "You have already checked in today"
      });
    }

    // Determine if late (assuming work starts at 9 AM)
    const workStartTime = new Date();
    workStartTime.setHours(9, 0, 0, 0);
    const status = currentTime > workStartTime ? "late" : "present";

    const attendance = await Attendance.create({
      userId: req.user._id,
      date: today,
      checkIn: checkInTime,
      status
    });

    res.json({
      message: "Check-in successful",
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Staff Check-out
router.post("/checkout", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const checkOutTime = new Date().toLocaleTimeString();

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({
        message: "You have not checked in today"
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "You have already checked out today"
      });
    }

    // Calculate working hours
    const checkInTime = new Date(`${today} ${attendance.checkIn}`);
    const checkOutTimeObj = new Date(`${today} ${checkOutTime}`);
    const workingHours = Math.round((checkOutTimeObj - checkInTime) / (1000 * 60 * 60) * 100) / 100;

    attendance.checkOut = checkOutTime;
    attendance.workingHours = workingHours;

    await attendance.save();

    res.json({
      message: "Check-out successful",
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get my attendance
router.get("/my", protect, async (req, res) => {
  try {
    const attendance = await Attendance.find({
      userId: req.user._id
    });

    res.json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get today's attendance status
router.get("/today", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    res.json({
      hasCheckedIn: !!attendance,
      hasCheckedOut: attendance?.checkOut ? true : false,
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Admin: Get all attendance
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("userId", "name email");

    res.json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Admin: Get attendance by date range
router.get("/range", protect, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const attendance = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("userId", "name email department");

    res.json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Admin: Get attendance statistics
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    const totalStaff = await User.countDocuments({ role: "staff" });
    const presentToday = await Attendance.countDocuments({ date: today });
    const lateToday = await Attendance.countDocuments({ date: today, status: "late" });
    
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyAttendance = await Attendance.countDocuments({
      date: { $regex: `^${thisMonth}` }
    });

    res.json({
      totalStaff,
      presentToday,
      absentToday: totalStaff - presentToday,
      lateToday,
      monthlyAttendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Admin: Mark staff absent
router.post("/mark-absent", protect, adminOnly, async (req, res) => {
  try {
    const { userId, date } = req.body;
    
    const existingAttendance = await Attendance.findOne({ userId, date });
    
    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance record already exists for this date"
      });
    }

    const attendance = await Attendance.create({
      userId,
      date,
      checkIn: "00:00:00",
      status: "absent"
    });

    res.json({
      message: "Staff marked as absent",
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;