import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import path from "path";
import logger from "./middleware/logger.js";
import { dbConnection } from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import pgRoutes from "./routes/pg.js";
import bookingRoutes from "./routes/booking.js";

// Import models and middleware for legacy routes
import { protect, authorize } from "./middleware/auth.js";
import { PG } from "./models/PG.js";
import { Booking } from "./models/Booking.js";

// Initialize express app
const app = express();

// Connect to MongoDB
dbConnection();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// Static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/bookings", bookingRoutes);

// ---------------------------------------------------------------------
// Legacy frontend aliases (temporary) to support old clients calling:
//   GET /api/owner/pgs        -> canonical: GET /api/pgs/owner/mine
//   GET /api/owner/bookings   -> canonical: GET /api/bookings/owner/mine
// These keep older builds working while frontend is migrated.
// ---------------------------------------------------------------------
app.get(
  "/api/owner/pgs",
  protect,
  authorize("owner"),
  async (req, res) => {
    try {
      logger.info("LEGACY /api/owner/pgs HIT for user " + req.user._id);
      const pgs = await PG.find({ owner_id: req.user._id }).sort({
        createdAt: -1,
      });
      return res.json({ pgs });
    } catch (err) {
      logger.error("Error on legacy /api/owner/pgs", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

app.get(
  "/api/owner/bookings",
  protect,
  authorize("owner"),
  async (req, res) => {
    try {
      logger.info("LEGACY /api/owner/bookings HIT for user " + req.user._id);
      if (!Booking) {
        logger.info('Booking model unavailable; returning empty bookings array for legacy alias.');
        return res.json({ bookings: [] });
      }
      const bookings = await Booking.find({ owner_id: req.user._id }).sort({
        createdAt: -1,
      });
      return res.json({ bookings });
    } catch (err) {
      logger.error("Error on legacy /api/owner/bookings", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// Simple health endpoints without plugin
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const uptime = process.uptime();

  res.json({
    status: dbState === 1 ? "healthy" : "unhealthy",
    uptime: Math.floor(uptime),
    database: {
      connected: dbState === 1,
      state: ["disconnected", "connected", "connecting", "disconnecting"][dbState],
    },
    memory: process.memoryUsage().heapUsed,
  });
});

// Quick status endpoint
app.get("/health/simple", (req, res) => {
  res
    .status(mongoose.connection.readyState === 1 ? 200 : 503)
    .send(mongoose.connection.readyState === 1 ? "OK" : "ERROR");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Debug: list registered routes (helps confirm available endpoints)
function listRoutes(app) {
  const routes = [];
  const stack = app._router && app._router.stack ? app._router.stack : [];
  stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${middleware.route.path}`);
    } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${handler.route.path}`);
        }
      });
    }
  });
  logger.info('Registered routes:\n' + routes.join('\n'));
}

// call after routes are registered but before listen()
listRoutes(app);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
