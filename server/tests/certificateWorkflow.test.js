const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const zlib = require("node:zlib");
const Certificate = require("../models/Certificate");
const {
  downloadCertificatePdf,
  downloadPublicCertificatePdf,
  verifyCertificate,
} = require("../controllers/certificateController");
const { generateCertificatePdfBuffer } = require("../services/pdfService");
const blockchainService = require("../services/blockchainService");
const { createCertificateHash } = blockchainService;

describe("Certificate On-Demand PDF & Verification Tests", () => {
  const mockWorkerId = "507f1f77bcf86cd799439011";
  const mockEmployerId = "507f1f77bcf86cd799439022";
  const mockCertificateId = "VW-CERT-2026-TEST1234";

  // Calculate fixture hash with the real createCertificateHash function
  const validHash = createCertificateHash({
    certificateId: mockCertificateId,
    workerName: "Sunita Devi",
    employerName: "Sharma Family Trust",
    jobRole: "Senior Domestic Specialist",
    salary: 22000,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-01-01"),
  });

  const mockCertificateData = {
    certificateId: mockCertificateId,
    workerId: mockWorkerId,
    employerId: mockEmployerId,
    workerName: "Sunita Devi",
    employerName: "Sharma Family Trust",
    jobRole: "Senior Domestic Specialist",
    salary: 22000,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-01-01"),
    issuedAt: new Date("2025-01-05"),
    verificationStatus: "Verified",
    blockchainHash: validHash,
    blockchainTransactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  };

  function extractPdfText(buf) {
    const str = buf.toString("binary");
    const regex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;
    let allText = "";
    while ((match = regex.exec(str)) !== null) {
      try {
        const decomp = zlib.inflateSync(Buffer.from(match[1], "binary")).toString("latin1");
        const tjRegex = /\[(.*?)\]\s*TJ/g;
        let tjMatch;
        while ((tjMatch = tjRegex.exec(decomp)) !== null) {
          const hexMatches = tjMatch[1].match(/<([0-9a-fA-F]+)>/g);
          if (hexMatches) {
            allText += hexMatches.map((h) => Buffer.from(h.slice(1, -1), "hex").toString("utf8")).join("") + " ";
          }
        }
      } catch {
        // Ignore uncompressed or binary image streams
      }
    }
    return allText;
  }

const { Writable } = require("node:stream");

class MockResponse extends Writable {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.chunks = [];
    this.sentData = null;
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    callback();
  }

  _final(callback) {
    this.sentData = Buffer.concat(this.chunks);
    callback();
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(data) {
    this.sentData = data;
    return this;
  }

  send(data) {
    this.sentData = data;
    return this;
  }

  setHeader(name, value) {
    this.headers[name.toLowerCase()] = value;
  }
}

function createMockResponse() {
  return new MockResponse();
}

  // 1. PDF Buffer Generation
  it("should generate a valid PDF buffer starting with %PDF- header", async () => {
    const pdfBuffer = await generateCertificatePdfBuffer(mockCertificateData);
    assert.ok(pdfBuffer, "PDF buffer must be returned");
    assert.ok(pdfBuffer.length > 500, "PDF buffer must have valid size");
    assert.strictEqual(
      pdfBuffer.subarray(0, 5).toString("ascii"),
      "%PDF-",
      "PDF must begin with %PDF- header"
    );
  });

  // 2. Missing Certificate ID
  it("should return 400 if certificateId parameter is missing", async () => {
    const req = { params: {}, user: { id: mockWorkerId, role: "worker" } };
    const res = createMockResponse();

    await downloadCertificatePdf(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.sentData.success, false);
    assert.match(res.sentData.message, /Certificate ID is required/i);
  });

  // 3. Certificate Not Found
  it("should return 404 if certificate does not exist in database", async () => {
    const origFindOne = Certificate.findOne;
    Certificate.findOne = async () => null;

    const req = {
      params: { certificateId: "VW-CERT-NONEXISTENT" },
      user: { id: mockWorkerId, role: "worker" },
    };
    const res = createMockResponse();

    try {
      await downloadCertificatePdf(req, res);
      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.sentData.success, false);
    } finally {
      Certificate.findOne = origFindOne;
    }
  });

  // 4. Unauthorized User (Different Worker)
  it("should return 403 if caller is an unauthorized worker", async () => {
    const origFindOne = Certificate.findOne;
    Certificate.findOne = async () => ({ ...mockCertificateData });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: "507f1f77bcf86cd799439999", role: "worker" }, // Impostor
    };
    const res = createMockResponse();

    try {
      await downloadCertificatePdf(req, res);
      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.sentData.success, false);
      assert.match(res.sentData.message, /not authorized/i);
    } finally {
      Certificate.findOne = origFindOne;
    }
  });

  // 5. Unauthorized User (Different Employer)
  it("should return 403 if caller is an unauthorized employer", async () => {
    const origFindOne = Certificate.findOne;
    Certificate.findOne = async () => ({ ...mockCertificateData });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: "507f1f77bcf86cd799439888", role: "employer" }, // Impostor employer
    };
    const res = createMockResponse();

    try {
      await downloadCertificatePdf(req, res);
      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.sentData.success, false);
      assert.match(res.sentData.message, /not authorized/i);
    } finally {
      Certificate.findOne = origFindOne;
    }
  });

  const waitForStreamFinish = (stream) => {
    if (stream.sentData) return Promise.resolve();
    return new Promise((resolve) => {
      stream.once("finish", () => {
        resolve();
      });
    });
  };

  // 6. Authorized Worker Download
  it("should allow the associated worker to download their certificate PDF (HTTP 200)", async () => {
    const origFindOne = Certificate.findOne;
    Certificate.findOne = async () => ({ ...mockCertificateData });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: mockWorkerId, role: "worker" },
    };
    const res = createMockResponse();

    try {
      await downloadCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers["content-type"], "application/pdf");
      assert.ok(res.headers["content-disposition"].includes(mockCertificateId));
      assert.strictEqual(res.headers["cache-control"], "private, no-store");
      assert.ok(res.sentData, "PDF data must be streamed");
      assert.strictEqual(res.sentData.subarray(0, 5).toString("ascii"), "%PDF-");
    } finally {
      Certificate.findOne = origFindOne;
    }
  });

  // 7. Authorized Employer Download
  it("should allow the associated employer to download their certificate PDF (HTTP 200)", async () => {
    const origFindOne = Certificate.findOne;
    Certificate.findOne = async () => ({ ...mockCertificateData });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: mockEmployerId, role: "employer" },
    };
    const res = createMockResponse();

    try {
      await downloadCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers["content-type"], "application/pdf");
      assert.ok(res.headers["content-disposition"].includes(mockCertificateId));
      assert.ok(res.sentData, "PDF data must be streamed");
      assert.strictEqual(res.sentData.subarray(0, 5).toString("ascii"), "%PDF-");
    } finally {
      Certificate.findOne = origFindOne;
    }
  });

  // 8. Public PDF Download - Valid certificate with matching database & on-chain hashes
  it("should independently verify valid certificate on-chain and display Verified On-Chain in public PDF", async () => {
    const origFindOne = Certificate.findOne;
    const origGetCertificate = blockchainService.getCertificateFromBlockchain;

    Certificate.findOne = async () => ({ ...mockCertificateData });
    blockchainService.getCertificateFromBlockchain = async () => ({
      certificateId: mockCertificateId,
      certificateHash: validHash,
      registeredBy: "0x1111222233334444555566667777888899990000",
      registeredAt: 1700000000,
      exists: true,
    });

    const req = {
      params: { certificateId: mockCertificateId },
    };
    const res = createMockResponse();

    try {
      await downloadPublicCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers["content-type"], "application/pdf");
      assert.ok(res.headers["content-disposition"].includes(mockCertificateId));
      assert.ok(res.sentData, "PDF data must be streamed");
      assert.strictEqual(res.sentData.subarray(0, 5).toString("ascii"), "%PDF-");

      const pdfText = extractPdfText(res.sentData);
      assert.ok(pdfText.includes("Verified On-Chain"), "Public PDF must display Verified On-Chain");
      assert.ok(
        pdfText.includes("VERIFIED ON-CHAIN (ETHEREUM SEPOLIA)"),
        "Public PDF must display on-chain audit status"
      );
      assert.ok(!pdfText.includes("NOT VERIFIED"), "Valid PDF must not claim not verified");
      assert.ok(!pdfText.includes("UNAVAILABLE"), "Valid PDF must not claim unavailable");
    } finally {
      Certificate.findOne = origFindOne;
      blockchainService.getCertificateFromBlockchain = origGetCertificate;
    }
  });

  // 8b. Modified certificate whose recomputed hash differs from stored hash
  it("should fail closed and display Not Verified when certificate data was modified", async () => {
    const origFindOne = Certificate.findOne;
    const origGetCertificate = blockchainService.getCertificateFromBlockchain;

    // Simulate tampering: job role altered in DB, but blockchainHash remains the old hash
    Certificate.findOne = async () => ({
      ...mockCertificateData,
      jobRole: "Tampered Senior Executive",
    });
    blockchainService.getCertificateFromBlockchain = async () => ({
      certificateId: mockCertificateId,
      certificateHash: validHash,
      exists: true,
    });

    const req = {
      params: { certificateId: mockCertificateId },
    };
    const res = createMockResponse();

    try {
      await downloadPublicCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers["content-type"], "application/pdf");
      const pdfText = extractPdfText(res.sentData);
      assert.ok(pdfText.includes("Not Verified"), "Tampered PDF must display Not Verified");
      assert.ok(
        pdfText.includes("NOT VERIFIED ON-CHAIN"),
        "Tampered PDF must display NOT VERIFIED ON-CHAIN in audit status"
      );
      assert.ok(
        !pdfText.includes("Verified On-Chain"),
        "Tampered PDF must not claim Verified On-Chain"
      );
    } finally {
      Certificate.findOne = origFindOne;
      blockchainService.getCertificateFromBlockchain = origGetCertificate;
    }
  });

  // 8c. Missing on-chain certificate - Null record with a successful false-returning probe
  it("should display Not Verified when getCertificateFromBlockchain returns null and probe returns false", async () => {
    const origFindOne = Certificate.findOne;
    const origGetCertificate = blockchainService.getCertificateFromBlockchain;
    const origVerifyOnBlockchain = blockchainService.verifyCertificateOnBlockchain;

    Certificate.findOne = async () => ({ ...mockCertificateData });
    // Simulate real service behavior when certificate is not on contract (returns null)
    blockchainService.getCertificateFromBlockchain = async () => null;
    // Simulate smart contract verifyCertificate returning false cleanly
    blockchainService.verifyCertificateOnBlockchain = async () => false;

    const req = {
      params: { certificateId: mockCertificateId },
    };
    const res = createMockResponse();

    try {
      await downloadPublicCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers["content-type"], "application/pdf");
      const pdfText = extractPdfText(res.sentData);
      assert.ok(pdfText.includes("Not Verified"), "Missing on-chain certificate must display Not Verified");
      assert.ok(
        pdfText.includes("NOT VERIFIED ON-CHAIN"),
        "Missing on-chain certificate must display NOT VERIFIED ON-CHAIN in audit status"
      );
      assert.ok(
        !pdfText.includes("Verified On-Chain"),
        "Missing certificate must not claim Verified On-Chain"
      );
      assert.ok(
        !pdfText.includes("UNAVAILABLE"),
        "Missing certificate must not be labeled unavailable when probe succeeds"
      );
    } finally {
      Certificate.findOne = origFindOne;
      blockchainService.getCertificateFromBlockchain = origGetCertificate;
      blockchainService.verifyCertificateOnBlockchain = origVerifyOnBlockchain;
    }
  });

  // 8d. Blockchain RPC outage - Null record with a probe that throws
  it("should display Verification Unavailable when getCertificateFromBlockchain returns null and probe throws", async () => {
    const origFindOne = Certificate.findOne;
    const origGetCertificate = blockchainService.getCertificateFromBlockchain;
    const origVerifyOnBlockchain = blockchainService.verifyCertificateOnBlockchain;

    Certificate.findOne = async () => ({ ...mockCertificateData });
    // Simulate actual service behavior catching RPC failure internally and returning null
    blockchainService.getCertificateFromBlockchain = async () => null;
    // Probe reveals the underlying RPC outage by throwing
    blockchainService.verifyCertificateOnBlockchain = async () => {
      throw new Error("RPC provider connection timeout");
    };

    const req = {
      params: { certificateId: mockCertificateId },
    };
    const res = createMockResponse();

    try {
      await downloadPublicCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers["content-type"], "application/pdf");
      const pdfText = extractPdfText(res.sentData);
      assert.ok(
        pdfText.includes("Verification Unavailable"),
        "RPC outage must display Verification Unavailable in table"
      );
      assert.ok(
        pdfText.includes("VERIFICATION UNAVAILABLE (RPC ERROR)"),
        "RPC outage must display VERIFICATION UNAVAILABLE (RPC ERROR) in audit status"
      );
      assert.ok(
        !pdfText.includes("Verified On-Chain"),
        "RPC outage PDF must never claim Verified On-Chain"
      );
    } finally {
      Certificate.findOne = origFindOne;
      blockchainService.getCertificateFromBlockchain = origGetCertificate;
      blockchainService.verifyCertificateOnBlockchain = origVerifyOnBlockchain;
    }
  });

  // 8d2. A successful probe returning true must NEVER mark a certificate as verified without full matching record
  it("should keep status Not Verified even if probe returns true when full record is missing", async () => {
    const origFindOne = Certificate.findOne;
    const origGetCertificate = blockchainService.getCertificateFromBlockchain;
    const origVerifyOnBlockchain = blockchainService.verifyCertificateOnBlockchain;

    Certificate.findOne = async () => ({ ...mockCertificateData });
    blockchainService.getCertificateFromBlockchain = async () => null;
    // Probe returns true, but full onChainRecord is null
    blockchainService.verifyCertificateOnBlockchain = async () => true;

    const req = {
      params: { certificateId: mockCertificateId },
    };
    const res = createMockResponse();

    try {
      await downloadPublicCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      const pdfText = extractPdfText(res.sentData);
      assert.ok(
        pdfText.includes("Not Verified"),
        "Probe alone must never mark certificate as verified without matching onChainRecord"
      );
      assert.ok(
        !pdfText.includes("Verified On-Chain"),
        "Certificate must not be marked Verified On-Chain without full onChainRecord match"
      );
    } finally {
      Certificate.findOne = origFindOne;
      blockchainService.getCertificateFromBlockchain = origGetCertificate;
      blockchainService.verifyCertificateOnBlockchain = origVerifyOnBlockchain;
    }
  });

  // 8e. Public salary redaction in generated PDF
  it("should redact salary from public certificate PDF", async () => {
    const origFindOne = Certificate.findOne;
    const origGetCertificate = blockchainService.getCertificateFromBlockchain;

    Certificate.findOne = async () => ({ ...mockCertificateData });
    blockchainService.getCertificateFromBlockchain = async () => ({
      certificateId: mockCertificateId,
      certificateHash: validHash,
      exists: true,
    });

    const req = {
      params: { certificateId: mockCertificateId },
    };
    const res = createMockResponse();

    try {
      await downloadPublicCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      const pdfText = extractPdfText(res.sentData);
      assert.ok(
        !pdfText.includes("22,000") && !pdfText.includes("22000"),
        "Public PDF must not contain worker salary"
      );
      assert.ok(
        !pdfText.includes("Monthly Salary"),
        "Public PDF must not contain Monthly Salary header"
      );
      assert.ok(
        pdfText.includes("VERIFICATION"),
        "Public PDF must contain VERIFICATION column header"
      );
    } finally {
      Certificate.findOne = origFindOne;
      blockchainService.getCertificateFromBlockchain = origGetCertificate;
    }
  });

  // 8f. Consistent PDF verification and audit-status labels
  it("should render strictly consistent verification and audit-status labels for all states", async () => {
    // 1. Verified state
    const bufVerified = await generateCertificatePdfBuffer(mockCertificateData, {
      isPublic: true,
      verificationStatus: "Verified On-Chain",
      isVerified: true,
    });
    const textVerified = extractPdfText(bufVerified);
    assert.ok(textVerified.includes("Verified On-Chain"));
    assert.ok(textVerified.includes("VERIFIED ON-CHAIN (ETHEREUM SEPOLIA)"));

    // 2. Not Verified state
    const bufNotVerified = await generateCertificatePdfBuffer(mockCertificateData, {
      isPublic: true,
      verificationStatus: "Not Verified",
      isVerified: false,
    });
    const textNotVerified = extractPdfText(bufNotVerified);
    assert.ok(textNotVerified.includes("Not Verified"));
    assert.ok(textNotVerified.includes("NOT VERIFIED ON-CHAIN"));

    // 3. Unavailable state
    const bufUnavailable = await generateCertificatePdfBuffer(mockCertificateData, {
      isPublic: true,
      verificationStatus: "Verification Unavailable",
      isVerified: false,
    });
    const textUnavailable = extractPdfText(bufUnavailable);
    assert.ok(textUnavailable.includes("Verification Unavailable"));
    assert.ok(textUnavailable.includes("VERIFICATION UNAVAILABLE (RPC ERROR)"));
  });

  // 8f2. Public PDF without explicit verification options defaults to Not Verified
  it("should default to Not Verified when isPublic is true without explicit successful verification options, even if database status is Verified and blockchainHash is present", async () => {
    // mockCertificateData has verificationStatus: "Verified" and blockchainHash: validHash
    assert.strictEqual(mockCertificateData.verificationStatus, "Verified");
    assert.ok(mockCertificateData.blockchainHash);

    // Call generateCertificatePdfBuffer with { isPublic: true } but NO verification options
    const buf = await generateCertificatePdfBuffer(mockCertificateData, {
      isPublic: true,
    });
    const text = extractPdfText(buf);

    assert.ok(
      text.includes("Not Verified"),
      "Public PDF without explicit verification options must display Not Verified"
    );
    assert.ok(
      text.includes("NOT VERIFIED ON-CHAIN"),
      "Public PDF without explicit verification options must display NOT VERIFIED ON-CHAIN in audit status"
    );
    assert.ok(
      !text.includes("Verified On-Chain"),
      "Public PDF must never infer Verified On-Chain from certificate properties"
    );
    assert.ok(
      !text.includes("VERIFIED IN VERIWORK RECORD"),
      "Public PDF must never claim verified in VeriWork record"
    );

    // Also verify that conflicting verification options fail closed to Not Verified
    const conflictBuf = await generateCertificatePdfBuffer(mockCertificateData, {
      isPublic: true,
      verificationStatus: "Verified On-Chain",
      isVerified: false, // Conflict!
    });
    const conflictText = extractPdfText(conflictBuf);
    assert.ok(
      conflictText.includes("Not Verified"),
      "Conflicting verification options must fail closed to Not Verified"
    );
    assert.ok(
      !conflictText.includes("Verified On-Chain"),
      "Conflicting options must never produce Verified On-Chain"
    );
  });

  // 8g. Authenticated PDF download retains monthly salary
  it("should preserve Monthly Salary in authenticated PDF downloads", async () => {
    const origFindOne = Certificate.findOne;
    Certificate.findOne = async () => ({ ...mockCertificateData });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: mockWorkerId, role: "worker" },
    };
    const res = createMockResponse();

    try {
      await downloadCertificatePdf(req, res);
      await waitForStreamFinish(res);

      assert.strictEqual(res.statusCode, 200);
      const pdfText = extractPdfText(res.sentData);
      assert.ok(
        pdfText.includes("Monthly Salary") || pdfText.includes("MONTHLY SALARY"),
        "Authenticated PDF must render Monthly Salary"
      );
      assert.ok(pdfText.includes("22,000"), "Authenticated PDF must render actual salary amount");
    } finally {
      Certificate.findOne = origFindOne;
    }
  });

  // 9. Public Certificate Verification Endpoint (Confirms Privacy Redaction)
  it("should return public metadata for valid certificate and redact private salary", async () => {
    const origFindOne = Certificate.findOne;
    const origGetCertificate = blockchainService.getCertificateFromBlockchain;

    Certificate.findOne = () => ({
      select: async () => ({ ...mockCertificateData }),
    });
    blockchainService.getCertificateFromBlockchain = async () => ({
      certificateId: mockCertificateId,
      certificateHash: validHash,
      registeredBy: "0x1111222233334444555566667777888899990000",
      registeredAt: 1700000000,
      exists: true,
    });

    const req = {
      params: { certificateId: mockCertificateId },
    };
    const res = createMockResponse();

    try {
      await verifyCertificate(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.sentData.success, true);
      assert.strictEqual(res.sentData.certificate.certificateId, mockCertificateId);
      assert.strictEqual(res.sentData.certificate.workerName, "Sunita Devi");
      assert.strictEqual(
        res.sentData.certificate.salary,
        undefined,
        "Salary must be redacted from public verification response"
      );
    } finally {
      Certificate.findOne = origFindOne;
      blockchainService.getCertificateFromBlockchain = origGetCertificate;
    }
  });

  // 10. Unauthenticated Download Rejection
  it("should reject unauthenticated download request (HTTP 401)", async () => {
    const req = {
      params: { certificateId: mockCertificateId },
      user: null, // No user attached by auth middleware
    };
    const res = createMockResponse();

    await downloadCertificatePdf(req, res);
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.sentData.success, false);
    assert.match(res.sentData.message, /Authentication required/i);
  });

  // 11. PDF Generation Error Handling
  it("should handle PDF generation errors gracefully without crashing (HTTP 500)", async () => {
    const origFindOne = Certificate.findOne;
    Certificate.findOne = async () => ({
      ...mockCertificateData,
      get startDate() {
        throw new Error("Simulated rendering failure");
      },
    });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: mockWorkerId, role: "worker" },
    };
    const res = createMockResponse();

    try {
      await downloadCertificatePdf(req, res);
      assert.strictEqual(res.statusCode, 500);
      assert.strictEqual(res.sentData.success, false);
      assert.match(res.sentData.message, /Failed to generate/i);
    } finally {
      Certificate.findOne = origFindOne;
    }
  });

  // 12. Active Certificate Workflow Independence from IPFS / Pinata
  it("should verify no active certificate controller or route imports IPFS or Pinata services", () => {
    const fs = require("node:fs");
    const path = require("node:path");

    const controllerPath = path.join(__dirname, "../controllers/certificateController.js");
    const routesPath = path.join(__dirname, "../routes/certificateRoutes.js");

    const controllerCode = fs.readFileSync(controllerPath, "utf8");
    const routesCode = fs.readFileSync(routesPath, "utf8");

    assert.doesNotMatch(
      controllerCode,
      /require\(["'].*ipfsService["']\)/i,
      "certificateController must not import ipfsService"
    );
    assert.doesNotMatch(
      controllerCode,
      /require\(["'].*certificateIpfsService["']\)/i,
      "certificateController must not import certificateIpfsService"
    );
    assert.doesNotMatch(
      controllerCode,
      /require\(["'].*encryptionService["']\)/i,
      "certificateController must not import encryptionService"
    );
    assert.doesNotMatch(
      routesCode,
      /require\(["'].*ipfsService["']\)/i,
      "certificateRoutes must not import ipfsService"
    );
  });

  // 13. Deterministic Blockchain Certificate Hash Verification
  it("should compute deterministic blockchain certificate hash", () => {
    const certData = {
      certificateId: "VW-CERT-2026-TEST03",
      workerName: "Lakshmi Bai",
      employerName: "Gupta Family",
      jobRole: "Housekeeper",
      salary: 12000,
      startDate: "2025-01-01T00:00:00.000Z",
      endDate: "2025-12-31T00:00:00.000Z",
    };

    const hash1 = createCertificateHash(certData);
    const hash2 = createCertificateHash(certData);

    assert.ok(typeof hash1 === "string" && hash1.startsWith("0x"));
    assert.strictEqual(hash1, hash2);

    // Changing salary must alter the cryptographic digest
    const alteredHash = createCertificateHash({ ...certData, salary: 13000 });
    assert.notStrictEqual(hash1, alteredHash);
  });
});
