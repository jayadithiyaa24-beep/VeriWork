const { describe, it, before, after, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

const {
  encryptBuffer,
  decryptBuffer,
} = require("../services/encryptionService");

const {
  uploadToIPFS,
  downloadFromIPFS,
  IpfsError,
  isValidCid,
  normalizeGatewayUrl,
} = require("../services/ipfsService");

const {
  uploadCertificatePdfToIPFS,
} = require("../services/certificateIpfsService");

const {
  generateCertificatePdfBuffer,
} = require("../services/pdfService");

const {
  createCertificateHash,
} = require("../services/blockchainService");

// Sample valid test keys and CIDs
const TEST_KEY = crypto.randomBytes(32).toString("base64");
const SAMPLE_CID = "bafkreih3enbyqbnafe3mtzjf7kulbpfwiqnpyaaqvbdguisj422pihduua";
const SAMPLE_QM_CID = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
const TEST_GATEWAY = "https://white-leading-marmot-708.mypinata.cloud";

describe("1. Encryption and Decryption Round Trip (AES-256-GCM)", () => {
  before(() => {
    process.env.IPFS_ENCRYPTION_KEY = TEST_KEY;
  });

  it("should encrypt and decrypt a buffer successfully", () => {
    const originalText = "%PDF-1.4 Mock VeriWork Certificate Payload Data";
    const originalBuffer = Buffer.from(originalText, "utf-8");

    const encrypted = encryptBuffer(originalBuffer);

    assert.ok(Buffer.isBuffer(encrypted.encryptedBuffer));
    assert.strictEqual(encrypted.algorithm, "aes-256-gcm");
    assert.ok(typeof encrypted.iv === "string" && encrypted.iv.length > 0);
    assert.ok(typeof encrypted.authTag === "string" && encrypted.authTag.length > 0);

    const decrypted = decryptBuffer({
      encryptedBuffer: encrypted.encryptedBuffer,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
    });

    assert.ok(Buffer.isBuffer(decrypted));
    assert.strictEqual(decrypted.toString("utf-8"), originalText);
  });

  it("should use a fresh, unique IV for every encryption call", () => {
    const data = Buffer.from("Identical certificate data");
    const enc1 = encryptBuffer(data);
    const enc2 = encryptBuffer(data);

    assert.notStrictEqual(enc1.iv, enc2.iv);
    assert.notStrictEqual(enc1.encryptedBuffer.toString("hex"), enc2.encryptedBuffer.toString("hex"));
  });

  it("should fail securely when authentication tag is tampered", () => {
    const data = Buffer.from("%PDF-1.4 Genuine Certificate Content");
    const encrypted = encryptBuffer(data);

    const tamperedAuthTag = crypto.randomBytes(16).toString("base64");

    assert.throws(
      () => {
        decryptBuffer({
          encryptedBuffer: encrypted.encryptedBuffer,
          iv: encrypted.iv,
          authTag: tamperedAuthTag,
        });
      },
      (err) => {
        return err.message.includes("authenticate") || err.message.includes("Unsupported state");
      }
    );
  });

  it("should fail securely when ciphertext buffer is tampered", () => {
    const data = Buffer.from("%PDF-1.4 Genuine Certificate Content");
    const encrypted = encryptBuffer(data);

    const tamperedBuffer = Buffer.from(encrypted.encryptedBuffer);
    tamperedBuffer[0] ^= 0xff; // Flip bits

    assert.throws(() => {
      decryptBuffer({
        encryptedBuffer: tamperedBuffer,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      });
    });
  });

  it("should fail securely when decrypted with a different key", () => {
    const data = Buffer.from("%PDF-1.4 Genuine Certificate Content");
    const encrypted = encryptBuffer(data);

    const wrongKey = crypto.randomBytes(32).toString("base64");
    process.env.IPFS_ENCRYPTION_KEY = wrongKey;

    try {
      assert.throws(() => {
        decryptBuffer({
          encryptedBuffer: encrypted.encryptedBuffer,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
        });
      });
    } finally {
      process.env.IPFS_ENCRYPTION_KEY = TEST_KEY;
    }
  });

  it("should reject empty or invalid buffers in encryptBuffer", () => {
    assert.throws(() => encryptBuffer(null), /non-empty buffer/i);
    assert.throws(() => encryptBuffer(Buffer.alloc(0)), /non-empty buffer/i);
    assert.throws(() => encryptBuffer("not a buffer"), /non-empty buffer/i);
  });

  it("should reject missing metadata in decryptBuffer", () => {
    const dummyBuf = Buffer.from("encrypted");
    assert.throws(() => decryptBuffer({ encryptedBuffer: null }), /non-empty encrypted buffer/i);
    assert.throws(() => decryptBuffer({ encryptedBuffer: dummyBuf, iv: null }), /incomplete/i);
    assert.throws(() => decryptBuffer({ encryptedBuffer: dummyBuf, iv: "abc", authTag: null }), /incomplete/i);
  });
});

describe("2. CID Validation and Gateway URL Normalization", () => {
  it("should validate standard v0 and v1 IPFS CIDs", () => {
    assert.strictEqual(isValidCid(SAMPLE_CID), true);
    assert.strictEqual(isValidCid(SAMPLE_QM_CID), true);
    assert.strictEqual(isValidCid("bafybeicg2abbnakv2b4kuh2w26k34t2q6nff47vffk52m2xnd4w5n6qsq4"), true);

    assert.strictEqual(isValidCid("invalid-cid"), false);
    assert.strictEqual(isValidCid(""), false);
    assert.strictEqual(isValidCid(null), false);
    assert.strictEqual(isValidCid(12345), false);
  });

  it("should normalize gateway URLs cleanly", () => {
    assert.strictEqual(
      normalizeGatewayUrl("https://white-leading-marmot-708.mypinata.cloud"),
      "https://white-leading-marmot-708.mypinata.cloud"
    );
    assert.strictEqual(
      normalizeGatewayUrl("https://white-leading-marmot-708.mypinata.cloud/"),
      "https://white-leading-marmot-708.mypinata.cloud"
    );
    assert.strictEqual(
      normalizeGatewayUrl("white-leading-marmot-708.mypinata.cloud"),
      "https://white-leading-marmot-708.mypinata.cloud"
    );

    assert.throws(() => normalizeGatewayUrl(""), /not configured/i);
    assert.throws(() => normalizeGatewayUrl("http://insecure.gateway.com"), /HTTPS/i);
    assert.throws(() => normalizeGatewayUrl("https://user:pass@gateway.com"), /clean HTTPS/i);
  });
});

describe("3. IPFS Upload Service (Pinata V3 API)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.PINATA_JWT = "mock_pinata_jwt_token";
    process.env.PINATA_GATEWAY_URL = TEST_GATEWAY;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should upload encrypted bytes to Pinata V3 with network=public", async () => {
    let capturedBody = null;
    let capturedHeaders = null;

    global.fetch = async (url, options) => {
      assert.strictEqual(url, "https://uploads.pinata.cloud/v3/files");
      capturedHeaders = options.headers;
      capturedBody = options.body;

      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            cid: SAMPLE_CID,
            size: 1024,
          },
        }),
      };
    };

    const mockBuffer = Buffer.from("encrypted-certificate-bytes");
    const result = await uploadToIPFS({
      buffer: mockBuffer,
      filename: "VW-CERT-2026-TEST.pdf.enc",
      contentType: "application/octet-stream",
    });

    assert.strictEqual(result.cid, SAMPLE_CID);
    assert.strictEqual(result.gatewayUrl, `${TEST_GATEWAY}/ipfs/${SAMPLE_CID}`);
    assert.strictEqual(capturedHeaders.Authorization, "Bearer mock_pinata_jwt_token");

    // Verify network was explicitly set to public
    assert.ok(capturedBody instanceof FormData);
    assert.strictEqual(capturedBody.get("network"), "public");
  });

  it("should accurately report Pinata upload failures", async () => {
    global.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        error: { message: "Invalid JWT token" },
      }),
    });

    const mockBuffer = Buffer.from("encrypted-bytes");
    await assert.rejects(
      async () => {
        await uploadToIPFS({
          buffer: mockBuffer,
          filename: "test.pdf.enc",
        });
      },
      (err) => {
        assert.ok(err instanceof IpfsError || err instanceof Error);
        assert.ok(err.message.includes("401") || err.message.includes("Invalid JWT"));
        return true;
      }
    );
  });
});

describe("4. IPFS Download Service and Gateway Fallback", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.PINATA_JWT = "mock_pinata_jwt_token";
    process.env.PINATA_GATEWAY_URL = TEST_GATEWAY;
    delete process.env.PINATA_GATEWAY_TOKEN;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should download valid encrypted bytes from dedicated gateway", async () => {
    const expectedBuffer = Buffer.from("mock-encrypted-pdf-bytes");

    global.fetch = async (url, options) => {
      assert.strictEqual(url, `${TEST_GATEWAY}/ipfs/${SAMPLE_CID}`);
      return {
        ok: true,
        status: 200,
        headers: new Headers({
          "content-type": "application/octet-stream",
          "content-length": String(expectedBuffer.length),
        }),
        arrayBuffer: async () => Uint8Array.from(expectedBuffer).buffer,
      };
    };

    const downloaded = await downloadFromIPFS(SAMPLE_CID);
    assert.ok(Buffer.isBuffer(downloaded));
    assert.strictEqual(downloaded.toString(), expectedBuffer.toString());
  });

  it("should pass gateway token in both header and query param when configured", async () => {
    process.env.PINATA_GATEWAY_TOKEN = "secret_gateway_token";
    let requestedUrl = "";
    let requestedHeaders = {};

    global.fetch = async (url, options) => {
      requestedUrl = url;
      requestedHeaders = options.headers;
      const buf = Buffer.from("bytes");
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/octet-stream" }),
        arrayBuffer: async () => buf.buffer,
      };
    };

    await downloadFromIPFS(SAMPLE_CID);
    assert.ok(requestedUrl.includes("pinataGatewayToken=secret_gateway_token"));
    assert.strictEqual(requestedHeaders["x-pinata-gateway-token"], "secret_gateway_token");
  });

  it("should reject gateway HTML error pages securely", async () => {
    const htmlError = "<!DOCTYPE html><html><body>Error 403 Forbidden</body></html>";

    global.fetch = async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "text/html" }),
      arrayBuffer: async () => Buffer.from(htmlError).buffer,
    });

    await assert.rejects(
      async () => {
        await downloadFromIPFS(SAMPLE_CID);
      },
      (err) => {
        assert.ok(err.message.includes("HTML error page"));
        return true;
      }
    );
  });

  it("should fallback to Pinata V3 private download link when gateway returns 403 ERR_ID:00006", async () => {
    const privateEncryptedBytes = Buffer.from("private-encrypted-certificate-bytes");
    let fallbackAttempted = false;

    global.fetch = async (url, options) => {
      // Step 1: Initial dedicated gateway request fails with 403 ERR_ID:00006
      if (url.includes("/ipfs/")) {
        return {
          ok: false,
          status: 403,
          headers: new Headers({ "content-type": "text/plain" }),
          text: async () => "The owner of this gateway does not have this content pinned - ERR_ID:00006",
        };
      }

      // Step 2: Fallback generates private download link
      if (url === "https://api.pinata.cloud/v3/files/private/download_link") {
        fallbackAttempted = true;
        assert.strictEqual(options.method, "POST");
        const body = JSON.parse(options.body);
        assert.ok(body.url.includes(`/files/${SAMPLE_CID}`));

        return {
          ok: true,
          status: 200,
          json: async () => ({
            data: "https://signed.mypinata.cloud/temporary/signed-url",
          }),
        };
      }

      // Step 3: Fetching the signed URL
      if (url === "https://signed.mypinata.cloud/temporary/signed-url") {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/octet-stream" }),
          arrayBuffer: async () => Uint8Array.from(privateEncryptedBytes).buffer,
        };
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    };

    const downloaded = await downloadFromIPFS(SAMPLE_CID);
    assert.strictEqual(fallbackAttempted, true);
    assert.strictEqual(downloaded.toString(), privateEncryptedBytes.toString());
  });

  it("should reject invalid CIDs before sending any network request", async () => {
    let fetchCalled = false;
    global.fetch = async () => {
      fetchCalled = true;
    };

    await assert.rejects(async () => {
      await downloadFromIPFS("not-a-cid");
    }, /invalid ipfs cid format/i);

    assert.strictEqual(fetchCalled, false);
  });
});

describe("5. End-to-End PDF Generation, Encryption, and IPFS Upload Workflow", () => {
  const originalFetch = global.fetch;

  before(() => {
    process.env.IPFS_ENCRYPTION_KEY = TEST_KEY;
    process.env.PINATA_JWT = "mock_jwt";
    process.env.PINATA_GATEWAY_URL = TEST_GATEWAY;
  });

  after(() => {
    global.fetch = originalFetch;
  });

  it("should generate a valid PDF starting with %PDF-", async () => {
    const mockCert = {
      certificateId: "VW-CERT-2026-TEST01",
      workerName: "Rani Devi",
      employerName: "Sharma Family",
      jobRole: "Cook & Housekeeper",
      salary: 15000,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      issuedAt: new Date(),
      verificationStatus: "Verified",
      blockchainHash: "0x" + "a".repeat(64),
      blockchainTransactionHash: "0x" + "b".repeat(64),
    };

    const pdfBuffer = await generateCertificatePdfBuffer(mockCert);
    assert.ok(Buffer.isBuffer(pdfBuffer));
    assert.ok(pdfBuffer.length > 500);
    assert.strictEqual(pdfBuffer.subarray(0, 5).toString("ascii"), "%PDF-");
  });

  it("should generate, encrypt, and upload certificate metadata to IPFS", async () => {
    const mockCert = {
      certificateId: "VW-CERT-2026-TEST02",
      workerName: "Anita Kumari",
      employerName: "Verma Household",
      jobRole: "Caregiver",
      salary: 18000,
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-11-30"),
      issuedAt: new Date(),
      verificationStatus: "Verified",
      blockchainHash: "0x" + "1".repeat(64),
      blockchainTransactionHash: "0x" + "2".repeat(64),
    };

    let uploadedPayload = null;

    global.fetch = async (url, options) => {
      uploadedPayload = options.body;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            cid: SAMPLE_CID,
            size: 5000,
          },
        }),
      };
    };

    const metadata = await uploadCertificatePdfToIPFS(mockCert);

    assert.strictEqual(metadata.ipfsCid, SAMPLE_CID);
    assert.strictEqual(metadata.ipfsStatus, "Uploaded");
    assert.strictEqual(metadata.ipfsEncryptionAlgorithm, "aes-256-gcm");
    assert.ok(metadata.ipfsEncryptionIv);
    assert.ok(metadata.ipfsEncryptionAuthTag);
    assert.ok(metadata.ipfsUploadedAt instanceof Date);

    // Verify uploaded payload was encrypted bytes (does NOT start with plaintext %PDF-)
    const uploadedBlob = uploadedPayload.get("file");
    const uploadedArrayBuf = await uploadedBlob.arrayBuffer();
    const uploadedBuf = Buffer.from(uploadedArrayBuf);
    assert.notStrictEqual(uploadedBuf.subarray(0, 5).toString("ascii"), "%PDF-");

    // Decrypt the uploaded bytes using the returned metadata and verify original PDF
    const decryptedPdf = decryptBuffer({
      encryptedBuffer: uploadedBuf,
      iv: metadata.ipfsEncryptionIv,
      authTag: metadata.ipfsEncryptionAuthTag,
    });

    assert.strictEqual(decryptedPdf.subarray(0, 5).toString("ascii"), "%PDF-");
  });
});

describe("6. Controller Authorization and Error Codes Verification", () => {
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

describe("7. Controller HTTP Endpoint Tests for downloadEncryptedCertificatePdf", () => {
  const Certificate = require("../models/Certificate");
  const { downloadEncryptedCertificatePdf } = require("../controllers/certificateController");
  const originalFindOne = Certificate.findOne;
  const originalFetch = global.fetch;

  const mockWorkerId = "507f1f77bcf86cd799439011";
  const mockEmployerId = "507f1f77bcf86cd799439022";
  const mockCertificateId = "VW-CERT-2026-TEST77";

  let validPdfBytes;
  let encryptedPdfBytes;
  let validIv;
  let validAuthTag;

  before(async () => {
    process.env.IPFS_ENCRYPTION_KEY = TEST_KEY;
    process.env.PINATA_GATEWAY_URL = TEST_GATEWAY;

    validPdfBytes = Buffer.from("%PDF-1.4 Official VeriWork Test Certificate");
    const enc = encryptBuffer(validPdfBytes);
    encryptedPdfBytes = enc.encryptedBuffer;
    validIv = enc.iv;
    validAuthTag = enc.authTag;
  });

  after(() => {
    Certificate.findOne = originalFindOne;
    global.fetch = originalFetch;
  });

  function createMockResponse() {
    return {
      statusCode: null,
      headers: {},
      sentData: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.sentData = data;
        return this;
      },
      send(data) {
        this.sentData = data;
        return this;
      },
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
      },
    };
  }

  it("should return 400 if certificateId is missing", async () => {
    const req = { params: {}, user: { id: mockWorkerId, role: "worker" } };
    const res = createMockResponse();

    await downloadEncryptedCertificatePdf(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.sentData.success, false);
  });

  it("should return 404 if certificate is not found", async () => {
    Certificate.findOne = async () => null;

    const req = { params: { certificateId: "VW-CERT-UNKNOWN" }, user: { id: mockWorkerId, role: "worker" } };
    const res = createMockResponse();

    await downloadEncryptedCertificatePdf(req, res);
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.sentData.success, false);
  });

  it("should return 403 if user is unauthorized (neither worker nor employer)", async () => {
    Certificate.findOne = async () => ({
      certificateId: mockCertificateId,
      workerId: { toString: () => mockWorkerId },
      employerId: { toString: () => mockEmployerId },
      ipfsStatus: "Uploaded",
      ipfsCid: SAMPLE_CID,
      ipfsEncryptionAlgorithm: "aes-256-gcm",
      ipfsEncryptionIv: validIv,
      ipfsEncryptionAuthTag: validAuthTag,
    });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: "507f1f77bcf86cd799439099", role: "worker" }, // unauthorized user
    };
    const res = createMockResponse();

    await downloadEncryptedCertificatePdf(req, res);
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.sentData.success, false);
    assert.ok(res.sentData.message.includes("not authorized"));
  });

  it("should return 409 if certificate has not yet been uploaded to IPFS", async () => {
    Certificate.findOne = async () => ({
      certificateId: mockCertificateId,
      workerId: { toString: () => mockWorkerId },
      employerId: { toString: () => mockEmployerId },
      ipfsStatus: "Pending", // Not uploaded yet
      ipfsCid: null,
    });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: mockWorkerId, role: "worker" },
    };
    const res = createMockResponse();

    await downloadEncryptedCertificatePdf(req, res);
    assert.strictEqual(res.statusCode, 409);
    assert.strictEqual(res.sentData.success, false);
    assert.ok(res.sentData.message.includes("not yet been uploaded"));
  });

  it("should return 500 if encryption metadata is incomplete in database", async () => {
    Certificate.findOne = async () => ({
      certificateId: mockCertificateId,
      workerId: { toString: () => mockWorkerId },
      employerId: { toString: () => mockEmployerId },
      ipfsStatus: "Uploaded",
      ipfsCid: SAMPLE_CID,
      ipfsEncryptionAlgorithm: "aes-256-gcm",
      ipfsEncryptionIv: null, // missing IV
      ipfsEncryptionAuthTag: null,
    });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: mockWorkerId, role: "worker" },
    };
    const res = createMockResponse();

    await downloadEncryptedCertificatePdf(req, res);
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.sentData.success, false);
    assert.ok(res.sentData.message.includes("metadata is incomplete"));
  });

  it("should allow the associated worker to download their certificate PDF (HTTP 200)", async () => {
    Certificate.findOne = async () => ({
      certificateId: mockCertificateId,
      workerId: { toString: () => mockWorkerId },
      employerId: { toString: () => mockEmployerId },
      ipfsStatus: "Uploaded",
      ipfsCid: SAMPLE_CID,
      ipfsEncryptionAlgorithm: "aes-256-gcm",
      ipfsEncryptionIv: validIv,
      ipfsEncryptionAuthTag: validAuthTag,
    });

    global.fetch = async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/octet-stream" }),
      arrayBuffer: async () => Uint8Array.from(encryptedPdfBytes).buffer,
    });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: mockWorkerId, role: "worker" },
    };
    const res = createMockResponse();

    await downloadEncryptedCertificatePdf(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers["content-type"], "application/pdf");
    assert.strictEqual(res.headers["cache-control"], "private, no-store");
    assert.ok(res.headers["content-disposition"].includes(`${mockCertificateId}.pdf`));
    assert.ok(Buffer.isBuffer(res.sentData));
    assert.strictEqual(res.sentData.subarray(0, 5).toString("ascii"), "%PDF-");
  });

  it("should allow the associated employer to download their certificate PDF (HTTP 200)", async () => {
    Certificate.findOne = async () => ({
      certificateId: mockCertificateId,
      workerId: { toString: () => mockWorkerId },
      employerId: { toString: () => mockEmployerId },
      ipfsStatus: "Uploaded",
      ipfsCid: SAMPLE_CID,
      ipfsEncryptionAlgorithm: "aes-256-gcm",
      ipfsEncryptionIv: validIv,
      ipfsEncryptionAuthTag: validAuthTag,
    });

    global.fetch = async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/octet-stream" }),
      arrayBuffer: async () => Uint8Array.from(encryptedPdfBytes).buffer,
    });

    const req = {
      params: { certificateId: mockCertificateId },
      user: { id: mockEmployerId, role: "employer" },
    };
    const res = createMockResponse();

    await downloadEncryptedCertificatePdf(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers["content-type"], "application/pdf");
    assert.ok(Buffer.isBuffer(res.sentData));
    assert.strictEqual(res.sentData.subarray(0, 5).toString("ascii"), "%PDF-");
  });
});
