import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Attendance from "./models/Attendance.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Hospital Admin",
      email: "admin@hospital.com",
      password: adminPassword,
      role: "admin",
      department: "Administration",
    });

    // Create staff users
    const staffPassword = await bcrypt.hash("staff123", 10);
    const staff = await User.insertMany([
      {
        name: "Dr. Sarah Johnson",
        email: "sarah@hospital.com",
        password: staffPassword,
        role: "staff",
        department: "Emergency",
      },
      {
        name: "Nurse Mike Wilson",
        email: "mike@hospital.com",
        password: staffPassword,
        role: "staff",
        department: "Surgery",
      },
      {
        name: "Dr. Emily Davis",
        email: "emily@hospital.com",
        password: staffPassword,
        role: "staff",
        department: "Cardiology",
      },
      {
        name: "John Smith",
        email: "john@hospital.com",
        password: staffPassword,
        role: "staff",
        department: "Laboratory",
      },
      {
        name: "Lisa Brown",
        email: "lisa@hospital.com",
        password: staffPassword,
        role: "staff",
        department: "Radiology",
      },
    ]);

    console.log("👤 Created users:");
    console.log("Admin:", admin.email);
    staff.forEach(s => console.log("Staff:", s.email));

    // Create some sample attendance records for the past few days
    const today = new Date();
    const attendanceRecords = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Add attendance for some staff members
      staff.forEach((staffMember, index) => {
        // Not everyone attends every day (simulate real scenario)
        if (Math.random() > 0.1) { // 90% attendance rate
          const checkInHour = 8 + Math.floor(Math.random() * 2); // 8-9 AM
          const checkInMinute = Math.floor(Math.random() * 60);
          const checkOutHour = 16 + Math.floor(Math.random() * 3); // 4-6 PM
          const checkOutMinute = Math.floor(Math.random() * 60);
          
          const checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}:00`;
          const checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}:00`;
          
          const workingHours = Math.round((checkOutHour - checkInHour + (checkOutMinute - checkInMinute) / 60) * 100) / 100;
          const status = checkInHour >= 9 ? 'late' : 'present';

          attendanceRecords.push({
            userId: staffMember._id,
            date: dateString,
            checkIn,
            checkOut,
            status,
            workingHours,
          });
        }
      });
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`📊 Created ${attendanceRecords.length} attendance records`);

    console.log("\n🎉 Seed data created successfully!");
    console.log("\n📝 Demo Login Credentials:");
    console.log("Admin: admin@hospital.com / admin123");
    console.log("Staff: sarah@hospital.com / staff123");
    console.log("Staff: mike@hospital.com / staff123");
    console.log("Staff: emily@hospital.com / staff123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();