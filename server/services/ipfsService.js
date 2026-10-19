const PINATA_UPLOAD_URL =
  "https://uploads.pinata.cloud/v3/files";

const uploadToIPFS = async ({
  buffer,
  filename,
  contentType = "application/pdf",
}) => {
  if (!process.env.PINATA_JWT) {
    throw new Error("PINATA_JWT is not configured");
  }

  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("A non-empty file buffer is required");
  }

  if (!filename) {
    throw new Error("A filename is required");
  }

  const formData = new FormData();

  formData.append(
    "file",
    new Blob([buffer], { type: contentType }),
    filename
  );

  const response = await fetch(PINATA_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Pinata upload failed (${response.status}): ${result.error?.message ||
      result.message ||
      "Unknown error"
      }`
    );
  }

  const cid = result.data?.cid;

  if (!cid) {
    throw new Error(
      "Pinata upload succeeded but returned no CID"
    );
  }

  return {
    cid,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
    size: result.data.size,
    mimeType: contentType,
  };
};

const downloadFromIPFS = async (cid) => {
  if (typeof cid !== "string" || !cid.trim()) {
    throw new Error("A valid IPFS CID is required");
  }

  const validCid =
    /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid) ||
    /^b[a-z2-7]{20,}$/.test(cid);

  if (!validCid) {
    throw new Error("Invalid IPFS CID format");
  }

  const configuredGateway =
    process.env.PINATA_GATEWAY_URL;

  if (!configuredGateway) {
    throw new Error(
      "PINATA_GATEWAY_URL is not configured"
    );
  }

  let gatewayUrl;

  try {
    gatewayUrl = new URL(configuredGateway);
  } catch {
    throw new Error("PINATA_GATEWAY_URL is invalid");
  }

  if (
    gatewayUrl.protocol !== "https:" ||
    gatewayUrl.username ||
    gatewayUrl.password ||
    gatewayUrl.search ||
    gatewayUrl.hash
  ) {
    throw new Error(
      "PINATA_GATEWAY_URL must be a clean HTTPS gateway URL"
    );
  }

  const baseUrl = gatewayUrl.href.replace(/\/+$/, "");
  const fileUrl =
    `${baseUrl}/ipfs/${encodeURIComponent(cid)}`;

  const headers = {};

  if (process.env.PINATA_GATEWAY_TOKEN) {
    headers["x-pinata-gateway-token"] =
      process.env.PINATA_GATEWAY_TOKEN;
  }

  const response = await fetch(fileUrl, {
    method: "GET",
    headers,
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(
      `IPFS download failed with HTTP ${response.status}`
    );
  }

  const contentLength = Number(
    response.headers.get("content-length")
  );

  const maxFileSize = 25 * 1024 * 1024;

  if (
    Number.isFinite(contentLength) &&
    contentLength > maxFileSize
  ) {
    throw new Error("IPFS file exceeds the 25 MB limit");
  }

  const arrayBuffer = await response.arrayBuffer();

  if (arrayBuffer.byteLength === 0) {
    throw new Error("The IPFS file is empty");
  }

  if (arrayBuffer.byteLength > maxFileSize) {
    throw new Error("IPFS file exceeds the 25 MB limit");
  }

  return Buffer.from(arrayBuffer);
};

module.exports = {
  uploadToIPFS,
  downloadFromIPFS,
};