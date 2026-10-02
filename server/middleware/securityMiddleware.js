// ===================================================
// VERIWORK SECURITY & RATE LIMITING MIDDLEWARE (STEP 11)
// ===================================================

// In-memory sliding window rate limiter (zero external dependencies)
const requestCounts = new Map();

/**
 * Creates a rate limiter middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default 15 mins)
 * @param {number} options.max - Max requests per window per IP
 * @param {string} options.message - Error message when limit reached
 */
const rateLimit = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 mins
  const max = options.max || 100;
  const message = options.message || "Too many requests, please try again later.";

  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global";
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    const clientData = requestCounts.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
    } else {
      clientData.count += 1;
    }

    requestCounts.set(key, clientData);

    // Set standard rate limit headers
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - clientData.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(clientData.resetTime / 1000));

    if (clientData.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((clientData.resetTime - now) / 1000),
      });
    }

    next();
  };
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
};

// Periodically clean up stale rate limiter entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 30 * 60 * 1000);

module.exports = {
  rateLimit,
  securityHeaders,
};
