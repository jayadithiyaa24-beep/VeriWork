const {
    generateCertificatePdfBuffer,
} = require("./pdfService");

const { encryptBuffer } = require("./encryptionService");
const { uploadToIPFS } = require("./ipfsService");

async function uploadCertificatePdfToIPFS(certificate) {
    if (!certificate || !certificate.certificateId) {
        throw new Error("A valid certificate is required");
    }

    // 1. Generate the complete certificate PDF in memory.
    const pdfBuffer = await generateCertificatePdfBuffer(certificate);

    // 2. Encrypt the PDF before sending it to IPFS.
    const encrypted = encryptBuffer(pdfBuffer);

    // 3. Upload only the encrypted PDF to Pinata.
    const upload = await uploadToIPFS({
        buffer: encrypted.encryptedBuffer,
        filename: `${certificate.certificateId}.pdf.enc`,
        contentType: "application/octet-stream",
    });

    // 4. Return the metadata needed for MongoDB.
    return {
        ipfsCid: upload.cid,
        ipfsUrl: upload.gatewayUrl,
        ipfsStatus: "Uploaded",
        ipfsUploadedAt: new Date(),
        ipfsEncryptionAlgorithm: encrypted.algorithm,
        ipfsEncryptionIv: encrypted.iv,
        ipfsEncryptionAuthTag: encrypted.authTag,
    };
}

module.exports = {
    uploadCertificatePdfToIPFS,
};
