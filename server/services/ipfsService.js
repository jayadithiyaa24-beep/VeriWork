
const PINATA_UPLOAD_URL = "https://uploads.pinata.cloud/v3/files";

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
      `Pinata upload failed (${response.status}): ${
        result.error?.message || result.message || "Unknown error"
      }`
    );
  }

  const cid = result.data?.cid;

  if (!cid) {
    throw new Error("Pinata upload succeeded but returned no CID");
  }

  return {
    cid,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
    size: result.data.size,
    mimeType: contentType,
  };
};

module.exports = { uploadToIPFS };
