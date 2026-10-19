const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const SMART_CONTRACT_ADDRESS =
  process.env.BLOCKCHAIN_CONTRACT_ADDRESS || "Not configured";

async function createCertificateDocument(certificate) {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 20,
    info: {
      Title: `VeriWork Certificate - ${certificate.certificateId}`,
      Author: "VeriWork Decentralized Protocol",
      Subject: "Decentralized Work Identity & Experience Credential",
      Keywords: "VeriWork, Blockchain, Smart Contract, Ethereum, Work Identity",
    },
  });

  const width = doc.page.width;
  const height = doc.page.height;

  // Outer and inner borders
  doc.rect(14, 14, width - 28, height - 28)
    .lineWidth(4).stroke("#1e3a8a");

  doc.rect(20, 20, width - 40, height - 40)
    .lineWidth(1.5).stroke("#d97706");

  // Decorative corners
  const cornerSize = 15;

  doc.moveTo(25, 25 + cornerSize)
    .lineTo(25, 25).lineTo(25 + cornerSize, 25)
    .lineWidth(2).stroke("#b45309");

  doc.moveTo(width - 25 - cornerSize, 25)
    .lineTo(width - 25, 25)
    .lineTo(width - 25, 25 + cornerSize)
    .lineWidth(2).stroke("#b45309");

  doc.moveTo(25, height - 25 - cornerSize)
    .lineTo(25, height - 25)
    .lineTo(25 + cornerSize, height - 25)
    .lineWidth(2).stroke("#b45309");

  doc.moveTo(width - 25 - cornerSize, height - 25)
    .lineTo(width - 25, height - 25)
    .lineTo(width - 25, height - 25 - cornerSize)
    .lineWidth(2).stroke("#b45309");

  // Header
  doc.fillColor("#1e3a8a").fontSize(26).font("Helvetica-Bold")
    .text("VERIWORK", 0, 40, {
      align: "center",
      characterSpacing: 3,
    });

  doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold")
    .text("DECENTRALIZED WORK IDENTITY & EXPERIENCE CREDENTIAL", {
      align: "center",
      characterSpacing: 1.5,
    });

  doc.moveDown(0.4);

  doc.fillColor("#b45309").fontSize(10).font("Helvetica-Bold")
    .text("OFFICIAL CERTIFICATE OF VERIFIED DOMESTIC EMPLOYMENT", {
      align: "center",
      characterSpacing: 1,
    });

  doc.fillColor("#94a3b8").fontSize(7.5).font("Helvetica-Oblique")
    .text("Issued under the VeriWork Autonomous Blockchain Credential Standard", {
      align: "center",
    });

  doc.moveDown(0.6);

  // Worker and employment details
  doc.fillColor("#475569").fontSize(11).font("Helvetica")
    .text("This is to officially certify that", { align: "center" });

  doc.moveDown(0.2);

  doc.fillColor("#1e3a8a").fontSize(23).font("Helvetica-Bold")
    .text(certificate.workerName || "Domestic Worker", {
      align: "center",
    });

  const centerX = width / 2;

  doc.moveTo(centerX - 100, doc.y + 2)
    .lineTo(centerX + 100, doc.y + 2)
    .lineWidth(1).stroke("#cbd5e1");

  doc.moveDown(0.4);

  doc.fillColor("#475569").fontSize(11).font("Helvetica")
    .text("has satisfactorily rendered trusted domestic services as", {
      align: "center",
    });

  doc.moveDown(0.15);

  doc.fillColor("#0f172a").fontSize(15).font("Helvetica-Bold")
    .text(certificate.jobRole || "Domestic Assistant", {
      align: "center",
    });

  doc.moveDown(0.15);

  doc.fillColor("#475569").fontSize(11).font("Helvetica")
    .text("under the verified domestic employment of", {
      align: "center",
    });

  doc.moveDown(0.15);

  doc.fillColor("#2563eb").fontSize(15).font("Helvetica-Bold")
    .text(certificate.employerName || "Verified Employer", {
      align: "center",
    });

  doc.moveDown(0.5);

  const formatDate = (date) => {
    if (!date) return "Present";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const tableY = doc.y;
  const tableWidth = width - 140;
  const tableX = 70;
  const colWidth = tableWidth / 4;

  doc.rect(tableX, tableY, tableWidth, 34)
    .fillAndStroke("#f8fafc", "#e2e8f0");

  const renderCol = (title, value, index) => {
    const x = tableX + index * colWidth;

    doc.fillColor("#64748b").fontSize(7).font("Helvetica-Bold")
      .text(title.toUpperCase(), x, tableY + 5, {
        width: colWidth,
        align: "center",
      });

    doc.fillColor("#0f172a").fontSize(9.5).font("Helvetica-Bold")
      .text(value, x, tableY + 17, {
        width: colWidth,
        align: "center",
      });

    if (index < 3) {
      doc.moveTo(x + colWidth, tableY)
        .lineTo(x + colWidth, tableY + 34)
        .lineWidth(1).stroke("#e2e8f0");
    }
  };

  renderCol("Tenure Start", formatDate(certificate.startDate), 0);
  renderCol("Tenure End", formatDate(certificate.endDate), 1);
  renderCol(
    "Monthly Salary",
    `Rs. ${Number(certificate.salary || 0).toLocaleString("en-IN")}`,
    2
  );
  renderCol("Issue Date", formatDate(certificate.issuedAt), 3);

  // QR verification code
  const bottomY = height - 130;
  const clientOrigin =
    process.env.CLIENT_URL || "http://localhost:5173";

  const verificationUrl =
    `${clientOrigin}/verify-certificate?id=${encodeURIComponent(
      certificate.certificateId
    )}`;

  const qrBuffer = await QRCode.toBuffer(verificationUrl, {
    width: 90,
    margin: 1,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });

  doc.image(qrBuffer, 45, bottomY - 5, {
    width: 85,
    height: 85,
  });

  doc.fillColor("#0f172a").fontSize(7.5).font("Helvetica-Bold")
    .text("Scan to Verify", 40, bottomY + 83, {
      width: 95,
      align: "center",
    });

  doc.fillColor("#64748b").fontSize(6.5).font("Helvetica")
    .text("Instant Smart Contract Audit", 40, bottomY + 92, {
      width: 95,
      align: "center",
    });

  // Blockchain information
  const ledgerX = 145;
  const ledgerWidth = width - 335;

  doc.rect(ledgerX, bottomY - 5, ledgerWidth, 90)
    .fillAndStroke("#0f172a", "#334155");

  doc.fillColor("#38bdf8").fontSize(7.5).font("Courier-Bold")
    .text("ETHEREUM SMART CONTRACT CRYPTOGRAPHIC PROOF",
      ledgerX + 10, bottomY + 2);

  doc.fillColor("#94a3b8").fontSize(6.8).font("Courier")
    .text(`Certificate ID : ${certificate.certificateId}`,
      ledgerX + 10, bottomY + 16);

  doc.text(`Keccak-256 Hash : ${certificate.blockchainHash || "Not available"
    }`, ledgerX + 10, bottomY + 28);

  doc.text(`Contract Addr  : ${SMART_CONTRACT_ADDRESS}`,
    ledgerX + 10, bottomY + 40);

  const txHash = certificate.blockchainTransactionHash;
  const txText = txHash
    ? txHash.length > 55
      ? `${txHash.slice(0, 52)}...`
      : txHash
    : "Transaction hash unavailable";

  doc.text(`Transaction    : ${txText}`,
    ledgerX + 10, bottomY + 52);

  const isVerified =
    certificate.verificationStatus === "Verified" &&
    Boolean(certificate.blockchainHash);

  doc.fillColor(isVerified ? "#22c55e" : "#facc15")
    .font("Courier-Bold")
    .text(
      isVerified
        ? "Audit Status   : VERIFIED IN VERIWORK RECORD"
        : "Audit Status   : VERIFICATION REQUIRED",
      ledgerX + 10,
      bottomY + 66
    );

  // Protocol signature
  const sigX = width - 165;

  doc.fillColor("#1e3a8a").fontSize(13).font("Helvetica-Bold")
    .text("VeriWork Protocol", sigX, bottomY + 28, {
      width: 130,
      align: "center",
    });

  doc.moveTo(sigX, bottomY + 44)
    .lineTo(sigX + 130, bottomY + 44)
    .lineWidth(1).stroke("#94a3b8");

  doc.fillColor("#475569").fontSize(7.5).font("Helvetica-Bold")
    .text("VeriWork Certificate Service", sigX, bottomY + 48, {
      width: 130,
      align: "center",
    });

  doc.fillColor("#64748b").fontSize(6.5).font("Helvetica")
    .text("Ethereum Sepolia Network", sigX, bottomY + 58, {
      width: 130,
      align: "center",
    });

  return doc;
}

/**
 * Existing API: stream the PDF to the caller.
 * The caller remains responsible for ending the destination stream.
 */
async function generateCertificatePdf(certificate, outputStream) {
  const doc = await createCertificateDocument(certificate);
  doc.pipe(outputStream);
  doc.end();
}

/**
 * New API: return the complete PDF as a Buffer for encryption.
 */
async function generateCertificatePdfBuffer(certificate) {
  const doc = await createCertificateDocument(certificate);

  return new Promise((resolve, reject) => {
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.once("end", () => resolve(Buffer.concat(chunks)));
    doc.once("error", reject);

    doc.end();
  });
}

module.exports = {
  generateCertificatePdf,
  generateCertificatePdfBuffer,
};
