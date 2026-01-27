import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import judgeRoutes from "./routes/judgeRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// =========================
// CORS CONFIG
// =========================
const allowedOrigins = [
  "http://localhost:3000",
  "https://codecoach-owuk5cbng-prabhakars-projects-d5c60e82.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies
};

app.use(cors(corsOptions));

// =========================
// PARSERS
// =========================
app.use(express.json());
app.use(cookieParser());

// =========================
// ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/user", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the CodeCoach AI Backend API");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Not Found" });
});

// Centralized error-handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ status: "error", message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
