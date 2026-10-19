const PINATA_UPLOAD_URL =
  "https://uploads.pinata.cloud/v3/files";
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 30000;

class IpfsError extends Error {
  constructor(message, statusCode = 502, isUpstream = true) {
    super(message);
    this.name = "IpfsError";
    this.statusCode = statusCode;
    this.isUpstream = isUpstream;
  }
}

function isValidCid(cid) {
  if (typeof cid !== "string" || !cid.trim()) {
    return false;
  }
  const trimmed = cid.trim();
  return (
    /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(trimmed) ||
    /^b[a-z2-7]{20,}$/.test(trimmed)
  );
}

function normalizeGatewayUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    throw new IpfsError("PINATA_GATEWAY_URL is not configured", 500, false);
  }

  let trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new IpfsError("PINATA_GATEWAY_URL is invalid", 500, false);
  }

  if (parsed.protocol !== "https:") {
    throw new IpfsError(
      "PINATA_GATEWAY_URL must use HTTPS protocol",
      500,
      false
    );
  }

  if (
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new IpfsError(
      "PINATA_GATEWAY_URL must be a clean HTTPS gateway URL",
      500,
      false
    );
  }

  return parsed.origin;
}

function isHtmlPayload(buffer, contentTypeHeader) {
  if (contentTypeHeader && typeof contentTypeHeader === "string") {
    const lower = contentTypeHeader.toLowerCase();
    if (
      lower.includes("text/html") ||
      lower.includes("application/xhtml+xml")
    ) {
      return true;
    }
  }

  if (Buffer.isBuffer(buffer) && buffer.length > 0) {
    const snippet = buffer
      .subarray(0, 100)
      .toString("ascii")
      .toLowerCase()
      .trim();
    if (
      snippet.startsWith("<!doctype html") ||
      snippet.startsWith("<html") ||
      snippet.startsWith("<head")
    ) {
      return true;
    }
  }

  return false;
}

async function fetchViaPinataPrivateDownloadLink(cid, gatewayOrigin) {
  if (!process.env.PINATA_JWT) {
    return null;
  }

  try {
    const targetFileUrl = `${gatewayOrigin}/files/${encodeURIComponent(cid)}`;
    const linkResponse = await fetch(
      "https://api.pinata.cloud/v3/files/private/download_link",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: targetFileUrl,
          expires: 300,
          date: Math.floor(Date.now() / 1000),
          method: "GET",
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!linkResponse.ok) {
      return null;
    }

    const linkResult = await linkResponse.json();
    const signedUrl = linkResult?.data;
    if (!signedUrl || typeof signedUrl !== "string") {
      return null;
    }

    const fileResponse = await fetch(signedUrl, {
      method: "GET",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!fileResponse.ok) {
      return null;
    }

    const arrayBuf = await fileResponse.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    if (
      buf.length === 0 ||
      isHtmlPayload(buf, fileResponse.headers.get("content-type"))
    ) {
      return null;
    }

    return buf;
  } catch {
    return null;
  }
}

const uploadToIPFS = async ({
  buffer,
  filename,
  contentType = "application/octet-stream",
}) => {
  if (!process.env.PINATA_JWT) {
    throw new IpfsError("PINATA_JWT is not configured", 500, false);
  }

  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new IpfsError("A non-empty file buffer is required", 400, false);
  }

  if (!filename || typeof filename !== "string" || !filename.trim()) {
    throw new IpfsError("A filename is required", 400, false);
  }

  const formData = new FormData();

  formData.append(
    "file",
    new Blob([buffer], { type: contentType }),
    filename.trim()
  );

  // In Pinata V3 API, omitting network defaults to "private".
  // Passing "public" ensures the file is pinned to public IPFS and the account's pinset,
  // making it available on the dedicated gateway and resolving ERR_ID:00006.
  formData.append("network", "public");

  let response;
  try {
    response = await fetch(PINATA_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    const isTimeout =
      err.name === "TimeoutError" || err.name === "AbortError";
    throw new IpfsError(
      isTimeout
        ? "Pinata upload timed out"
        : `Pinata upload network request failed: ${err.message}`,
      isTimeout ? 503 : 502
    );
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new IpfsError(
      `Pinata upload failed with HTTP ${response.status} (non-JSON response)`,
      response.status >= 500 ? 502 : 400
    );
  }

  if (!response.ok) {
    const errMsg =
      result.error?.message ||
      result.message ||
      `HTTP ${response.status}`;
    throw new IpfsError(
      `Pinata upload failed (${response.status}): ${errMsg}`,
      response.status >= 500 ? 502 : 400
    );
  }

  const cid = result.data?.cid;

  if (!cid || typeof cid !== "string") {
    throw new IpfsError(
      "Pinata upload succeeded but returned no CID",
      502
    );
  }

  let gatewayBaseUrl = "https://gateway.pinata.cloud";
  if (process.env.PINATA_GATEWAY_URL) {
    try {
      gatewayBaseUrl = normalizeGatewayUrl(
        process.env.PINATA_GATEWAY_URL
      );
    } catch {
      // fallback to default
    }
  }

  return {
    cid,
    gatewayUrl: `${gatewayBaseUrl}/ipfs/${cid}`,
    size: result.data?.size || buffer.length,
    mimeType: contentType,
  };
};

const downloadFromIPFS = async (cid) => {
  if (typeof cid !== "string" || !cid.trim()) {
    throw new IpfsError("A valid IPFS CID is required", 400, false);
  }

  const trimmedCid = cid.trim();

  if (!isValidCid(trimmedCid)) {
    throw new IpfsError("Invalid IPFS CID format", 400, false);
  }

  const configuredGateway = process.env.PINATA_GATEWAY_URL;
  if (!configuredGateway) {
    throw new IpfsError(
      "PINATA_GATEWAY_URL is not configured",
      500,
      false
    );
  }

  const gatewayOrigin = normalizeGatewayUrl(configuredGateway);

  let fileUrl = `${gatewayOrigin}/ipfs/${encodeURIComponent(trimmedCid)}`;

  const headers = {
    Accept: "application/octet-stream, */*",
  };

  if (process.env.PINATA_GATEWAY_TOKEN) {
    const token = process.env.PINATA_GATEWAY_TOKEN.trim();
    headers["x-pinata-gateway-token"] = token;
    fileUrl += `?pinataGatewayToken=${encodeURIComponent(token)}`;
  }

  let response;
  try {
    response = await fetch(fileUrl, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    const isTimeout =
      err.name === "TimeoutError" || err.name === "AbortError";
    throw new IpfsError(
      isTimeout
        ? "IPFS gateway request timed out"
        : `IPFS gateway request failed: ${err.message}`,
      isTimeout ? 503 : 502
    );
  }

  // If dedicated gateway returns 403 or 404, check if it was uploaded to Pinata private network
  // and can be resolved using Pinata V3 private download link
  if (
    !response.ok &&
    (response.status === 403 || response.status === 404) &&
    process.env.PINATA_JWT
  ) {
    const privateBuffer = await fetchViaPinataPrivateDownloadLink(
      trimmedCid,
      gatewayOrigin
    );
    if (privateBuffer) {
      return privateBuffer;
    }
  }

  if (!response.ok) {
    if (response.status === 403) {
      throw new IpfsError(
        "IPFS download failed with HTTP 403: Gateway access forbidden or content not pinned to gateway account",
        502
      );
    }
    if (response.status === 404) {
      throw new IpfsError(
        "IPFS download failed with HTTP 404: Content not found on IPFS gateway",
        502
      );
    }
    if (response.status === 429) {
      throw new IpfsError(
        "IPFS download failed with HTTP 429: Gateway rate limit exceeded",
        503
      );
    }
    if (response.status >= 500) {
      throw new IpfsError(
        `IPFS download failed with HTTP ${response.status}: Upstream gateway error`,
        502
      );
    }
    throw new IpfsError(
      `IPFS download failed with HTTP ${response.status}`,
      502
    );
  }

  const contentType = response.headers.get("content-type");
  if (
    contentType &&
    (contentType.toLowerCase().includes("text/html") ||
      contentType.toLowerCase().includes("application/xhtml+xml"))
  ) {
    throw new IpfsError(
      "IPFS gateway returned HTML error page instead of file bytes",
      502
    );
  }

  const contentLength = Number(
    response.headers.get("content-length")
  );

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_FILE_SIZE
  ) {
    throw new IpfsError(
      "IPFS file exceeds the 25 MB limit",
      502
    );
  }

  let arrayBuffer;
  try {
    arrayBuffer = await response.arrayBuffer();
  } catch (readErr) {
    throw new IpfsError(
      `Failed to read IPFS gateway response: ${readErr.message}`,
      502
    );
  }

  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new IpfsError("The IPFS file is empty", 502);
  }

  if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
    throw new IpfsError(
      "IPFS file exceeds the 25 MB limit",
      502
    );
  }

  const buffer = Buffer.from(arrayBuffer);

  if (isHtmlPayload(buffer, contentType)) {
    throw new IpfsError(
      "IPFS gateway returned HTML error page instead of file bytes",
      502
    );
  }

  return buffer;
};

module.exports = {
  uploadToIPFS,
  downloadFromIPFS,
  IpfsError,
  isValidCid,
  normalizeGatewayUrl,
};