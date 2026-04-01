import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { protect, adminOnly } from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS configuration - Allow all Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://akhospital-attendance.netlify.app",
    ];
    
    // Allow all Vercel deployments (production and preview)
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ✅ Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);

// ✅ Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.json({
    message: "Hospital Attendance API Running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ Protected admin dashboard
app.get("/api/admin/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin Dashboard" });
});

// ✅ Protected staff dashboard
app.get("/api/staff/dashboard", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}` });
});

// ✅ 404 handler (FIXED ❗ NO "*")
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);

  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// ✅ Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin}`);
});