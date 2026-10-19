const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { adminProtect } = require("../middleware/adminAuth");
const { rateLimit, securityHeaders } = require("../middleware/securityMiddleware");

describe("8. Admin Authorization and Security Middleware Tests", () => {
  const originalAdminKey = process.env.ADMIN_API_KEY;
  const originalJwtSecret = process.env.JWT_SECRET;
  const TEST_ADMIN_KEY = "test-veriwork-admin-secret-key-12345";
  const TEST_JWT_SECRET = "test-jwt-secret-xyz-789";

  before(() => {
    process.env.ADMIN_API_KEY = TEST_ADMIN_KEY;
    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  after(() => {
    process.env.ADMIN_API_KEY = originalAdminKey;
    process.env.JWT_SECRET = originalJwtSecret;
  });

  it("should reject requests without admin key or JWT (HTTP 401)", () => {
    const req = {
      headers: {},
      query: {},
    };
    let responseStatus = null;
    let responseBody = null;
    let nextCalled = false;

    const res = {
      status(code) {
        responseStatus = code;
        return {
          json(body) {
            responseBody = body;
          },
        };
      },
    };

    adminProtect(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(responseStatus, 401);
    assert.equal(responseBody.success, false);
    assert.match(responseBody.message, /Admin authorization required/i);
  });

  it("should reject requests with invalid x-admin-key (HTTP 401)", () => {
    const req = {
      headers: { "x-admin-key": "wrong-key-value" },
      query: {},
    };
    let responseStatus = null;
    let responseBody = null;
    let nextCalled = false;

    const res = {
      status(code) {
        responseStatus = code;
        return {
          json(body) {
            responseBody = body;
          },
        };
      },
    };

    adminProtect(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(responseStatus, 401);
    assert.equal(responseBody.success, false);
  });

  it("should fail closed (HTTP 500) if ADMIN_API_KEY is not configured in environment", () => {
    delete process.env.ADMIN_API_KEY;
    const req = {
      headers: { "x-admin-key": "some-key" },
    };
    let responseStatus = null;
    let responseBody = null;
    let nextCalled = false;

    const res = {
      status(code) {
        responseStatus = code;
        return {
          json(body) {
            responseBody = body;
          },
        };
      },
    };

    adminProtect(req, res, () => {
      nextCalled = true;
    });

    // Restore test admin key immediately
    process.env.ADMIN_API_KEY = TEST_ADMIN_KEY;

    assert.equal(nextCalled, false);
    assert.equal(responseStatus, 500);
    assert.equal(responseBody.success, false);
    assert.match(responseBody.message, /ADMIN_API_KEY is required/i);
  });

  it("should never accept JWT_SECRET as an admin key fallback (HTTP 401)", () => {
    const req = {
      headers: { "x-admin-key": TEST_JWT_SECRET }, // Attempting to use JWT_SECRET as key
    };
    let responseStatus = null;
    let responseBody = null;
    let nextCalled = false;

    const res = {
      status(code) {
        responseStatus = code;
        return {
          json(body) {
            responseBody = body;
          },
        };
      },
    };

    adminProtect(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(responseStatus, 401);
    assert.equal(responseBody.success, false);
  });

  it("should authorize requests with valid x-admin-key header", () => {
    const req = {
      headers: { "x-admin-key": TEST_ADMIN_KEY },
      query: {},
    };
    let nextCalled = false;
    const res = {};

    adminProtect(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });

  it("should authorize requests with valid Bearer JWT admin token", () => {
    const adminToken = jwt.sign(
      { id: "admin-1", role: "admin" },
      TEST_JWT_SECRET,
      { expiresIn: "1h" }
    );

    const req = {
      headers: { authorization: `Bearer ${adminToken}` },
      query: {},
    };
    let nextCalled = false;
    const res = {};

    adminProtect(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.user.role, "admin");
  });

  it("should reject Bearer JWT token if role is not admin", () => {
    const workerToken = jwt.sign(
      { id: "worker-1", role: "worker" },
      TEST_JWT_SECRET,
      { expiresIn: "1h" }
    );

    const req = {
      headers: { authorization: `Bearer ${workerToken}` },
      query: {},
    };
    let responseStatus = null;
    let responseBody = null;
    let nextCalled = false;

    const res = {
      status(code) {
        responseStatus = code;
        return {
          json(body) {
            responseBody = body;
          },
        };
      },
    };

    adminProtect(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(responseStatus, 401);
  });

  it("should apply security headers properly", () => {
    const headers = {};
    const res = {
      setHeader(name, val) {
        headers[name] = val;
      },
    };
    let nextCalled = false;

    securityHeaders({}, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(headers["X-Content-Type-Options"], "nosniff");
    assert.equal(headers["X-Frame-Options"], "DENY");
  });

  it("should apply rate limiter and set rate limit headers", () => {
    const limiter = rateLimit({ windowMs: 60000, max: 2 });
    const headers = {};
    const res = {
      setHeader(name, val) {
        headers[name] = val;
      },
      status(code) {
        return {
          json(body) {},
        };
      },
    };

    const req = { ip: "192.168.1.100", path: "/test" };

    // Request 1: allowed
    let next1 = false;
    limiter(req, res, () => { next1 = true; });
    assert.equal(next1, true);
    assert.equal(headers["X-RateLimit-Limit"], 2);
    assert.equal(headers["X-RateLimit-Remaining"], 1);

    // Request 2: allowed
    let next2 = false;
    limiter(req, res, () => { next2 = true; });
    assert.equal(next2, true);
    assert.equal(headers["X-RateLimit-Remaining"], 0);

    // Request 3: blocked with 429
    let next3 = false;
    let status3 = null;
    let body3 = null;
    const resBlocked = {
      setHeader() {},
      status(code) {
        status3 = code;
        return {
          json(body) { body3 = body; },
        };
      },
    };
    limiter(req, resBlocked, () => { next3 = true; });
    assert.equal(next3, false);
    assert.equal(status3, 429);
    assert.equal(body3.success, false);
  });
});
