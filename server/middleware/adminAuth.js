const jwt = require("jsonwebtoken");

/**
 * Admin authentication middleware.
 *
 * Security Requirements:
 * 1. Dedicated ADMIN_API_KEY for header-based authentication ('x-admin-key').
 * 2. Fail closed: If ADMIN_API_KEY is not configured in process.env, key-based auth must reject immediately.
 * 3. Never use JWT_SECRET as a fallback for the admin API key.
 * 4. Compatible JWT authentication: If a Bearer token is provided with role === 'admin', authorize it.
 */
const adminProtect = (req, res, next) => {
  try {
    const providedKey = req.headers["x-admin-key"];
    const configuredAdminKey = process.env.ADMIN_API_KEY;

    // 1. Key-based authentication via 'x-admin-key' header
    if (providedKey) {
      // Fail closed if server has no ADMIN_API_KEY configured
      if (!configuredAdminKey || typeof configuredAdminKey !== "string" || configuredAdminKey.trim() === "") {
        console.error("ADMIN_AUTH_ERROR: ADMIN_API_KEY environment variable is not configured on this server.");
        return res.status(500).json({
          success: false,
          message: "Admin authentication is not configured on the server. ADMIN_API_KEY is required.",
        });
      }

      if (typeof providedKey === "string" && providedKey.trim() === configuredAdminKey.trim()) {
        return next();
      }

      return res.status(401).json({
        success: false,
        message: "Invalid admin authorization key.",
      });
    }

    // 2. JWT Bearer token authentication (only if token role is explicitly 'admin')
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const jwtSecret = process.env.JWT_SECRET;

      if (jwtSecret && token) {
        try {
          const decoded = jwt.verify(token, jwtSecret);
          if (decoded && (decoded.role === "admin" || decoded.isAdmin === true)) {
            req.user = decoded;
            return next();
          }
        } catch {
          // Token invalid or expired - fall through to 401
        }
      }
    }

    // 3. Neither valid admin key nor valid admin JWT was provided
    return res.status(401).json({
      success: false,
      message: "Admin authorization required. Provide a valid 'x-admin-key' header.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin authorization check failed.",
    });
  }
};

module.exports = {
  adminProtect,
};
