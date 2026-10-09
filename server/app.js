
const express = require("express");
const cors = require("cors");

const workerRoutes = require("./routes/workerRoutes");
const employerRoutes = require("./routes/employerRoutes");
const employmentRoutes = require("./routes/employmentRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const {
  securityHeaders,
  rateLimit,
} = require("./middleware/securityMiddleware");

const app = express();

// =================================
// SECURITY & COMMON MIDDLEWARE
// =================================

app.use(securityHeaders);

// Allow the deployed frontend and local development frontend.
const allowedOrigins = [
  "https://veriworkblockchain.netlify.app",
  "http://localhost:5173",
  "http://localhost:4173",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

// Limit request body size.
app.use(express.json({ limit: "1mb" }));

// General API rate limiter: 300 requests per 15 minutes.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message:
    "Too many requests from this IP. Please try again after 15 minutes.",
});

app.use("/api", generalLimiter);

// =================================
// TEST ROUTE
// =================================

app.get("/", (req, res) => {
  res.send("VeriWork Backend Running");
});

// =================================
// API ROUTES
// =================================

app.use("/api/workers", workerRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/employment", employmentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
