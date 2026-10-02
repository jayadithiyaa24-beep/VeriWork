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

// Security headers (OWASP standards)
app.use(securityHeaders);

// CORS configuration
app.use(cors());

// Body parser with size limits to prevent payload floods
app.use(express.json({ limit: "1mb" }));

// General API rate limiter (300 requests per 15 mins)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests from this IP. Please try again after 15 minutes.",
});

// Stricter rate limiter for authentication routes (login / register: 30 requests per 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many login/registration attempts. Please wait 15 minutes before trying again.",
});

app.use("/api", generalLimiter);


// =================================
// TEST ROUTE
// =================================

app.get("/", (req, res) => {
  res.send("🚀 Backend Running");
});


// =================================
// API ROUTES
// =================================

app.use("/api/workers", workerRoutes);

app.use("/api/employers", employerRoutes);

app.use(
  "/api/employment",
  employmentRoutes
);

app.use(
  "/api/certificates",
  certificateRoutes
);

app.use(
  "/api/ratings",
  ratingRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

module.exports = app;