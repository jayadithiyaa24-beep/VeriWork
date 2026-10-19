
const {
    createCipheriv,
    createDecipheriv,
    randomBytes,
} = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey() {
    const encodedKey = process.env.IPFS_ENCRYPTION_KEY;

    if (!encodedKey) {
        throw new Error("IPFS_ENCRYPTION_KEY is not configured");
    }

    const key = Buffer.from(encodedKey, "base64");

    if (
        key.length !== 32 ||
        key.toString("base64") !== encodedKey
    ) {
        throw new Error(
            "IPFS_ENCRYPTION_KEY must be a valid Base64-encoded 32-byte key"
        );
    }

    return key;
}

function encryptBuffer(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("A non-empty buffer is required");
    }

    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);

    const cipher = createCipheriv(ALGORITHM, key, iv);

    const encryptedBuffer = Buffer.concat([
        cipher.update(buffer),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
        encryptedBuffer,
        algorithm: ALGORITHM,
        iv: iv.toString("base64"),
        authTag: authTag.toString("base64"),
    };
}

function decryptBuffer({
    encryptedBuffer,
    iv,
    authTag,
}) {
    if (
        !Buffer.isBuffer(encryptedBuffer) ||
        encryptedBuffer.length === 0
    ) {
        throw new Error("A non-empty encrypted buffer is required");
    }

    if (!iv || !authTag) {
        throw new Error("Encryption metadata is incomplete");
    }

    const key = getEncryptionKey();
    const ivBuffer = Buffer.from(iv, "base64");
    const authTagBuffer = Buffer.from(authTag, "base64");

    if (
        ivBuffer.length !== IV_LENGTH ||
        ivBuffer.toString("base64") !== iv
    ) {
        throw new Error("Invalid encryption IV");
    }

    if (
        authTagBuffer.length !== 16 ||
        authTagBuffer.toString("base64") !== authTag
    ) {
        throw new Error("Invalid authentication tag");
    }

    const decipher = createDecipheriv(
        ALGORITHM,
        key,
        ivBuffer
    );

    decipher.setAuthTag(authTagBuffer);

    return Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
    ]);
}

module.exports = {
    encryptBuffer,
    decryptBuffer,
};