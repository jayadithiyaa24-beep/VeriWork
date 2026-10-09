import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { toast } from "react-toastify";
import {
  FaShieldAlt,
  FaLink,
  FaPrint,
  FaDownload,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaQrcode,
  FaLock,
  FaCube,
  FaFingerprint,
  FaEthereum,
  FaCertificate,
} from "react-icons/fa";

const SMART_CONTRACT_ADDRESS =
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function WorkCertificate({ certificate, onClose }) {
  const certificateRef = useRef(null);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  /* =========================================================
     GENERATE VERIFICATION QR
  ========================================================= */

  useEffect(() => {
    if (!certificate?.certificateId) return;

    const verificationUrl = `${window.location.origin
      }/verify-certificate?id=${encodeURIComponent(
        certificate.certificateId
      )}`;

    QRCode.toDataURL(verificationUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: "#183C2F",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) =>
        console.error("QR Code Generation Error:", err)
      );
  }, [certificate]);

  /* =========================================================
     SAFETY
  ========================================================= */

  if (!certificate) return null;

  /* =========================================================
     DATE FORMATTER
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "Present";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  /* =========================================================
     VERIFICATION STATUS
  ========================================================= */

  const isVerified =
    certificate.verificationStatus === "Verified" ||
    Boolean(certificate.blockchainTransactionHash);

  /* =========================================================
     DOWNLOAD CERTIFICATE PDF
  ========================================================= */

  const handleDownloadPDF = () => {
    try {
      setGeneratingPdf(true);

      toast.info("Downloading official cryptographic PDF...");

      const downloadUrl = `http://localhost:5000/api/certificates/download-pdf/${encodeURIComponent(
        certificate.certificateId
      )}`;

      const a = document.createElement("a");

      a.href = downloadUrl;
      a.download = `${certificate.certificateId}.pdf`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success(
        "Certificate PDF downloaded! You can open it in any PDF reader. 📄✓"
      );
    } catch (error) {
      console.error(
        "Certificate PDF Download Error:",
        error
      );

      toast.error("Download failed. Please try again.");
    } finally {
      setTimeout(() => setGeneratingPdf(false), 800);
    }
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================================
     COPY VERIFICATION LINK
  ========================================================= */

  const handleCopyLink = () => {
    const url = `${window.location.origin
      }/verify-certificate?id=${encodeURIComponent(
        certificate.certificateId
      )}`;

    navigator.clipboard.writeText(url);

    toast.success(
      "Public verification link copied to clipboard!"
    );
  };

  /* =========================================================
     TRANSACTION DISPLAY
  ========================================================= */

  const transactionHash =
    certificate.blockchainTransactionHash
      ? `${certificate.blockchainTransactionHash.slice(
        0,
        18
      )}...${certificate.blockchainTransactionHash.slice(-10)}`
      : "Pending On-Chain Mining";

  return (
    <div className="vw-work-certificate-page">
      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .vw-work-certificate-page {
          position: relative;
          width: 100%;
          padding: 20px 0 50px;
          background: var(--color-bg);
          color: var(--color-text);
        }


        /* =====================================================
           TOOLBAR
        ===================================================== */

        .vw-certificate-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          padding: 16px 18px;
          margin-bottom: 24px;

          background: rgba(255, 255, 255, 0.72);

          border: 1px solid rgba(43, 38, 37, 0.08);
          border-radius: 18px;

          box-shadow:
            0 8px 28px rgba(43, 38, 37, 0.045);

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }


        .vw-certificate-toolbar-left {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }


        .vw-certificate-toolbar-icon {
          width: 40px;
          height: 40px;

          flex: 0 0 auto;

          display: flex;
          align-items: center;
          justify-content: center;

          color: var(--color-forest) !important;

          background: rgba(122, 139, 123, 0.13);

          border-radius: 12px;
        }


        .vw-certificate-toolbar-info {
          min-width: 0;
        }


        .vw-certificate-toolbar-eyebrow {
          margin-bottom: 2px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.64rem;
          font-weight: 800;

          letter-spacing: 0.13em;
          text-transform: uppercase;
        }


        .vw-certificate-toolbar-id {
          display: flex;
          align-items: center;
          gap: 7px;

          min-width: 0;

          font-family: var(--font-sans);
          font-size: 0.83rem;
          font-weight: 700;
        }


        .vw-certificate-toolbar-id code {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          color: var(--color-forest) !important;

          font-family: monospace;
          font-size: 0.76rem;
        }


        .vw-certificate-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          padding: 6px 10px;

          border-radius: 999px;

          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 800;

          white-space: nowrap;
        }


        .vw-certificate-status.verified {
          color: #285b3d !important;
          background: #e8f2e9;
          border: 1px solid #cfe2d2;
        }


        .vw-certificate-status.pending {
          color: #805d19 !important;
          background: #faf0d8;
          border: 1px solid #ead7a9;
        }


        .vw-certificate-toolbar-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 7px;

          flex-wrap: wrap;
        }


        .vw-certificate-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;

          min-height: 36px;
          padding: 7px 12px;

          border-radius: 10px;

          font-family: var(--font-sans);
          font-size: 0.7rem;
          font-weight: 750;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }


        .vw-certificate-action:hover {
          transform: translateY(-1px);
        }


        .vw-certificate-action.secondary {
          color: var(--color-text) !important;

          background: rgba(255, 255, 255, 0.7);

          border: 1px solid rgba(43, 38, 37, 0.12);
        }


        .vw-certificate-action.secondary svg {
          color: var(--color-forest) !important;
        }


        .vw-certificate-action.primary {
          color: #ffffff !important;

          background: var(--color-forest);

          border: 1px solid var(--color-forest);

          box-shadow:
            0 5px 14px rgba(38, 72, 58, 0.18);
        }


        .vw-certificate-action.primary svg {
          color: #ffffff !important;
        }


        .vw-certificate-action.danger {
          color: #9a4d45 !important;

          background: #fff7f5;

          border: 1px solid #ecd4cf;
        }


        /* =====================================================
           CERTIFICATE CANVAS
        ===================================================== */

        .vw-certificate-paper {
          position: relative;

          width: 100%;
          max-width: 1040px;

          margin: 0 auto;

          padding: 9px;

          background:
            linear-gradient(
              145deg,
              #315c49,
              #183c2f 45%,
              #315c49
            );

          border-radius: 24px;

          box-shadow:
            0 22px 55px rgba(43, 38, 37, 0.16);
        }


        .vw-certificate-inner {
          position: relative;

          overflow: hidden;

          padding: 8px;

          background:
            linear-gradient(
              135deg,
              #f8f5ec,
              #fffdf8 45%,
              #f5f1e6
            );

          border-radius: 18px;

          border: 1px solid rgba(255, 255, 255, 0.5);
        }


        .vw-certificate-content {
          position: relative;

          overflow: hidden;

          padding: 38px 44px 32px;

          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(122, 139, 123, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 90% 85%,
              rgba(212, 163, 89, 0.10),
              transparent 25%
            ),
            #fffdf8;

          border:
            1px solid rgba(43, 38, 37, 0.12);

          border-radius: 13px;
        }


        /* =====================================================
           DECORATIVE CORNERS
        ===================================================== */

        .vw-cert-corner {
          position: absolute;

          width: 34px;
          height: 34px;

          border-color: var(--color-ochre);

          opacity: 0.75;

          pointer-events: none;
        }


        .vw-cert-corner.tl {
          top: 17px;
          left: 17px;

          border-top: 2px solid;
          border-left: 2px solid;
        }


        .vw-cert-corner.tr {
          top: 17px;
          right: 17px;

          border-top: 2px solid;
          border-right: 2px solid;
        }


        .vw-cert-corner.bl {
          bottom: 17px;
          left: 17px;

          border-bottom: 2px solid;
          border-left: 2px solid;
        }


        .vw-cert-corner.br {
          bottom: 17px;
          right: 17px;

          border-bottom: 2px solid;
          border-right: 2px solid;
        }


        /* =====================================================
           CERTIFICATE HEADER
        ===================================================== */

        .vw-certificate-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 25px;

          padding-bottom: 22px;

          border-bottom:
            1px solid rgba(43, 38, 37, 0.12);
        }


        .vw-certificate-brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }


        .vw-certificate-brand-icon {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #ffffff !important;

          background: var(--color-forest);

          border-radius: 14px;

          box-shadow:
            0 8px 20px rgba(38, 72, 58, 0.18);
        }


        .vw-certificate-brand-icon svg {
          color: #ffffff !important;
        }


        .vw-certificate-brand-name {
          margin: 0;

          color: var(--color-forest) !important;

          font-family: var(--font-serif);

          font-size: 1.65rem;
          font-weight: 700;

          line-height: 1;

          letter-spacing: 0.07em;
        }


        .vw-certificate-brand-subtitle {
          margin-top: 5px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.62rem;
          font-weight: 700;

          letter-spacing: 0.11em;

          text-transform: uppercase;
        }


        .vw-certificate-seal {
          width: 76px;
          height: 76px;

          flex: 0 0 auto;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          color: var(--color-forest) !important;

          background:
            radial-gradient(
              circle,
              #f9eed5 0%,
              #e5c78e 70%,
              #d4a359 100%
            );

          border:
            4px solid #fffaf0;

          outline:
            1px solid rgba(212, 163, 89, 0.55);

          border-radius: 50%;

          box-shadow:
            0 6px 18px rgba(212, 163, 89, 0.2);

          font-family: var(--font-sans);

          font-size: 0.48rem;
          font-weight: 900;

          line-height: 1.2;

          letter-spacing: 0.08em;

          text-align: center;

          text-transform: uppercase;
        }


        .vw-certificate-seal svg {
          margin: 3px 0;

          color: var(--color-forest) !important;
        }


        /* =====================================================
           CERTIFICATE TITLE
        ===================================================== */

        .vw-certificate-title-section {
          padding: 34px 0 25px;

          text-align: center;
        }


        .vw-certificate-eyebrow {
          margin-bottom: 10px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.68rem;
          font-weight: 800;

          letter-spacing: 0.19em;

          text-transform: uppercase;
        }


        .vw-certificate-main-title {
          margin: 0;

          color: var(--color-forest) !important;

          font-family: var(--font-serif);

          font-size: clamp(1.8rem, 3.3vw, 2.75rem);

          font-weight: 700;

          line-height: 1.08;

          letter-spacing: -0.025em;
        }


        .vw-certificate-standard {
          margin-top: 9px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.66rem;

          font-style: italic;
        }


        .vw-certificate-attestation {
          margin: 21px 0 9px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.85rem;
        }


        .vw-certificate-worker-name {
          margin: 0;

          color: var(--color-text) !important;

          font-family: var(--font-serif);

          font-size: clamp(2rem, 4vw, 3.25rem);

          font-weight: 700;

          line-height: 1.05;
        }


        .vw-certificate-title-line {
          width: 190px;
          height: 2px;

          margin: 14px auto;

          background:
            linear-gradient(
              90deg,
              transparent,
              var(--color-ochre),
              transparent
            );
        }


        .vw-certificate-role-intro {
          margin: 0 0 5px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.78rem;
        }


        .vw-certificate-role {
          margin: 0;

          color: var(--color-forest) !important;

          font-family: var(--font-serif);

          font-size: 1.35rem;

          font-weight: 700;
        }


        .vw-certificate-employer-intro {
          margin: 17px 0 5px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.78rem;
        }


        .vw-certificate-employer {
          margin: 0;

          color: #85652d !important;

          font-family: var(--font-serif);

          font-size: 1.12rem;

          font-weight: 700;
        }


        /* =====================================================
           EMPLOYMENT MATRIX
        ===================================================== */

        .vw-certificate-summary {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          margin: 24px 0;

          background: rgba(239, 236, 230, 0.55);

          border:
            1px solid rgba(43, 38, 37, 0.09);

          border-radius: 14px;

          overflow: hidden;
        }


        .vw-certificate-summary-item {
          padding: 15px 12px;

          text-align: center;
        }


        .vw-certificate-summary-item
          + .vw-certificate-summary-item {
          border-left:
            1px solid rgba(43, 38, 37, 0.09);
        }


        .vw-summary-label {
          display: block;

          margin-bottom: 5px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.58rem;
          font-weight: 800;

          letter-spacing: 0.08em;

          text-transform: uppercase;
        }


        .vw-summary-value {
          display: block;

          color: var(--color-text) !important;

          font-family: var(--font-sans);

          font-size: 0.72rem;
          font-weight: 750;

          line-height: 1.35;
        }


        /* =====================================================
           BLOCKCHAIN PROOF
        ===================================================== */

        .vw-blockchain-proof {
          position: relative;

          padding: 18px 19px;

          margin-bottom: 25px;

          background:
            linear-gradient(
              135deg,
              #183c2f,
              #214c3b
            );

          border-radius: 15px;

          border:
            1px solid rgba(255, 255, 255, 0.07);

          box-shadow:
            0 8px 20px rgba(24, 60, 47, 0.12);

          overflow: hidden;
        }


        .vw-blockchain-proof::after {
          content: "";

          position: absolute;

          width: 180px;
          height: 180px;

          right: -80px;
          top: -90px;

          background: rgba(212, 163, 89, 0.08);

          border-radius: 50%;
        }


        .vw-proof-grid {
          position: relative;

          z-index: 1;

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 14px;
        }


        .vw-proof-item {
          min-width: 0;
        }


        .vw-proof-label {
          display: flex;
          align-items: center;
          gap: 7px;

          margin-bottom: 6px;

          color: rgba(255, 255, 255, 0.58) !important;

          font-family: var(--font-sans);

          font-size: 0.58rem;
          font-weight: 800;

          letter-spacing: 0.08em;

          text-transform: uppercase;
        }


        .vw-proof-label svg {
          color: #d4a359 !important;
        }


        .vw-proof-value {
          display: block;

          color: #ffffff !important;

          font-family: monospace;

          font-size: 0.66rem;

          line-height: 1.45;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }


        .vw-proof-value.hash {
          color: #e4c47f !important;
        }


        .vw-proof-bottom {
          position: relative;

          z-index: 1;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-top: 15px;
          padding-top: 12px;

          border-top:
            1px solid rgba(255, 255, 255, 0.12);
        }


        .vw-proof-transaction {
          min-width: 0;

          color: rgba(255, 255, 255, 0.62) !important;

          font-family: monospace;

          font-size: 0.59rem;
        }


        .vw-proof-transaction strong {
          color: #ffffff !important;
        }


        .vw-proof-verified {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          color: #c9e5cf !important;

          font-family: var(--font-sans);

          font-size: 0.6rem;
          font-weight: 800;

          white-space: nowrap;
        }


        .vw-proof-verified.pending {
          color: #e5cb92 !important;
        }


        /* =====================================================
           CERTIFICATE FOOTER
        ===================================================== */

        .vw-certificate-footer {
          display: grid;

          grid-template-columns:
            1.25fr 1fr 1.25fr;

          align-items: end;

          gap: 25px;

          padding-top: 21px;

          border-top:
            1px solid rgba(43, 38, 37, 0.12);
        }


        /* =====================================================
           QR
        ===================================================== */

        .vw-certificate-qr {
          display: flex;
          align-items: center;
          gap: 11px;
        }


        .vw-qr-box {
          flex: 0 0 auto;

          width: 82px;
          height: 82px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 5px;

          background: #ffffff;

          border:
            1px solid rgba(43, 38, 37, 0.12);

          border-radius: 9px;

          box-shadow:
            0 3px 10px rgba(43, 38, 37, 0.06);
        }


        .vw-qr-box img {
          width: 100%;
          height: 100%;

          display: block;
        }


        .vw-qr-copy-title {
          display: block;

          margin-bottom: 4px;

          color: var(--color-text) !important;

          font-family: var(--font-sans);

          font-size: 0.68rem;
          font-weight: 800;
        }


        .vw-qr-copy-text {
          display: block;

          max-width: 145px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.58rem;

          line-height: 1.35;
        }


        /* =====================================================
           PRIVACY SEAL
        ===================================================== */

        .vw-certificate-privacy {
          text-align: center;
        }


        .vw-privacy-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          padding: 7px 11px;

          color: var(--color-forest) !important;

          background: rgba(122, 139, 123, 0.10);

          border:
            1px solid rgba(122, 139, 123, 0.22);

          border-radius: 999px;

          font-family: var(--font-sans);

          font-size: 0.57rem;
          font-weight: 800;
        }


        .vw-privacy-pill svg {
          color: var(--color-forest) !important;
        }


        .vw-certificate-id {
          margin-top: 7px;

          color: var(--color-forest) !important;

          font-family: monospace;

          font-size: 0.67rem;
          font-weight: 800;
        }


        /* =====================================================
           SIGNATURE
        ===================================================== */

        .vw-certificate-signature {
          text-align: right;
        }


        .vw-signature-script {
          display: inline-block;

          min-width: 155px;

          padding-bottom: 4px;

          margin-bottom: 5px;

          color: var(--color-forest) !important;

          border-bottom:
            1px solid rgba(43, 38, 37, 0.35);

          font-family:
            "Brush Script MT",
            cursive;

          font-size: 1.15rem;
        }


        .vw-signature-title {
          display: block;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.6rem;
          font-weight: 750;
        }


        .vw-signature-subtitle {
          display: block;

          margin-top: 2px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: 0.55rem;
        }


        /* =====================================================
           RESPONSIVE TOOLBAR
        ===================================================== */

        @media (max-width: 991.98px) {

          .vw-certificate-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }


          .vw-certificate-toolbar-actions {
            width: 100%;
            justify-content: flex-start;
          }


          .vw-certificate-content {
            padding: 32px 30px 28px;
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 767.98px) {

          .vw-work-certificate-page {
            padding-top: 10px;
            padding-bottom: 30px;
          }


          .vw-certificate-toolbar {
            padding: 14px;

            border-radius: 15px;
          }


          .vw-certificate-toolbar-left {
            width: 100%;
          }


          .vw-certificate-toolbar-actions {
            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            width: 100%;
          }


          .vw-certificate-action {
            width: 100%;
          }


          .vw-certificate-paper {
            padding: 6px;

            border-radius: 17px;
          }


          .vw-certificate-inner {
            padding: 5px;

            border-radius: 13px;
          }


          .vw-certificate-content {
            padding: 28px 20px 24px;

            border-radius: 10px;
          }


          .vw-certificate-header {
            align-items: flex-start;
          }


          .vw-certificate-brand-name {
            font-size: 1.35rem;
          }


          .vw-certificate-brand-subtitle {
            font-size: 0.52rem;
          }


          .vw-certificate-seal {
            width: 62px;
            height: 62px;
          }


          .vw-certificate-summary {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }


          .vw-certificate-summary-item {
            padding: 13px 9px;
          }


          .vw-certificate-summary-item
            + .vw-certificate-summary-item {
            border-left: 0;
          }


          .vw-certificate-summary-item:nth-child(odd) {
            border-right:
              1px solid rgba(43, 38, 37, 0.09);
          }


          .vw-certificate-summary-item:nth-child(-n + 2) {
            border-bottom:
              1px solid rgba(43, 38, 37, 0.09);
          }


          .vw-proof-grid {
            grid-template-columns:
              1fr;
          }


          .vw-proof-bottom {
            align-items: flex-start;
            flex-direction: column;
          }


          .vw-certificate-footer {
            grid-template-columns:
              1fr;

            gap: 22px;
          }


          .vw-certificate-privacy {
            text-align: left;
          }


          .vw-certificate-signature {
            text-align: left;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 480px) {

          .vw-certificate-toolbar-actions {
            grid-template-columns: 1fr;
          }


          .vw-certificate-content {
            padding: 24px 15px 20px;
          }


          .vw-certificate-header {
            gap: 12px;
          }


          .vw-certificate-brand {
            gap: 8px;
          }


          .vw-certificate-brand-icon {
            width: 40px;
            height: 40px;
          }


          .vw-certificate-brand-name {
            font-size: 1.18rem;
          }


          .vw-certificate-brand-subtitle {
            max-width: 180px;

            line-height: 1.35;
          }


          .vw-certificate-seal {
            width: 55px;
            height: 55px;

            font-size: 0.39rem;
          }


          .vw-certificate-title-section {
            padding-top: 28px;
          }


          .vw-certificate-main-title {
            font-size: 1.55rem;
          }


          .vw-certificate-worker-name {
            font-size: 2rem;
          }


          .vw-certificate-role {
            font-size: 1.12rem;
          }


          .vw-certificate-employer {
            font-size: 1rem;
          }


          .vw-certificate-qr {
            align-items: flex-start;
          }


          .vw-qr-box {
            width: 70px;
            height: 70px;
          }

        }


        /* =====================================================
           PRINT
        ===================================================== */

        @media print {

          body * {
            visibility: hidden !important;
          }


          #printable-work-certificate,
          #printable-work-certificate * {
            visibility: visible !important;
          }


          #printable-work-certificate {
            position: absolute !important;

            left: 0 !important;
            top: 0 !important;

            width: 100% !important;

            margin: 0 !important;
            padding: 0 !important;

            box-shadow: none !important;

            border: none !important;
          }


          .no-print-toolbar {
            display: none !important;
          }


          .vw-certificate-page,
          .vw-work-certificate-page {
            padding: 0 !important;

            background: #ffffff !important;
          }


          .vw-certificate-paper {
            max-width: none !important;

            padding: 0 !important;

            background: #ffffff !important;

            box-shadow: none !important;

            border-radius: 0 !important;
          }


          .vw-certificate-inner {
            padding: 0 !important;

            border: none !important;

            border-radius: 0 !important;
          }


          .vw-certificate-content {
            border-radius: 0 !important;

            box-shadow: none !important;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .vw-certificate-action {
            transition: none !important;
          }

          .vw-certificate-action:hover {
            transform: none !important;
          }

        }

      `}</style>

      <div className="container">
        {/* =====================================================
            ACTION TOOLBAR
        ===================================================== */}

        <div className="no-print-toolbar vw-certificate-toolbar">
          <div className="vw-certificate-toolbar-left">

            <div className="vw-certificate-toolbar-icon">
              <FaCertificate size={17} />
            </div>

            <div className="vw-certificate-toolbar-info">

              <div className="vw-certificate-toolbar-eyebrow">
                Official Work Credential
              </div>

              <div className="vw-certificate-toolbar-id">
                <span>ID</span>

                <code>
                  {certificate.certificateId}
                </code>

                <span
                  className={`vw-certificate-status ${isVerified
                      ? "verified"
                      : "pending"
                    }`}
                >
                  {isVerified ? (
                    <>
                      <FaCheckCircle />
                      Blockchain Verified
                    </>
                  ) : (
                    <>
                      <FaClock />
                      Pending On-Chain
                    </>
                  )}
                </span>
              </div>

            </div>
          </div>


          <div className="vw-certificate-toolbar-actions">

            <button
              type="button"
              className="vw-certificate-action secondary"
              onClick={handleCopyLink}
            >
              <FaLink />
              Copy Link
            </button>


            <button
              type="button"
              className="vw-certificate-action secondary"
              onClick={handlePrint}
            >
              <FaPrint />
              Print
            </button>


            <a
              href={`http://localhost:5000/api/certificates/download-pdf/${encodeURIComponent(
                certificate.certificateId
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="vw-certificate-action secondary"
            >
              <FaCertificate />
              Open PDF
            </a>


            <button
              type="button"
              className="vw-certificate-action primary"
              onClick={handleDownloadPDF}
              disabled={generatingPdf}
            >
              {generatingPdf ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  />
                  Generating...
                </>
              ) : (
                <>
                  <FaDownload />
                  Download PDF
                </>
              )}
            </button>


            {onClose && (
              <button
                type="button"
                className="vw-certificate-action danger"
                onClick={onClose}
              >
                <FaTimes />
                Close
              </button>
            )}

          </div>
        </div>


        {/* =====================================================
            OFFICIAL CERTIFICATE
        ===================================================== */}

        <div
          id="printable-work-certificate"
          ref={certificateRef}
          className="vw-certificate-paper"
        >

          <div className="vw-certificate-inner">

            <div className="vw-certificate-content">

              {/* Decorative corners */}

              <div className="vw-cert-corner tl" />
              <div className="vw-cert-corner tr" />
              <div className="vw-cert-corner bl" />
              <div className="vw-cert-corner br" />


              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="vw-certificate-header">

                <div className="vw-certificate-brand">

                  <div className="vw-certificate-brand-icon">
                    <FaShieldAlt size={22} />
                  </div>

                  <div>

                    <h2 className="vw-certificate-brand-name">
                      VERIWORK
                    </h2>

                    <div className="vw-certificate-brand-subtitle">
                      Decentralized Work Identity & Experience Credential
                    </div>

                  </div>

                </div>


                <div className="vw-certificate-seal">

                  <FaShieldAlt size={17} />

                  <span>VERIFIED</span>

                  <span>LEDGER</span>

                </div>

              </div>


              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="vw-certificate-title-section">

                <div className="vw-certificate-eyebrow">
                  Certificate of Verified Domestic Employment
                </div>

                <h1 className="vw-certificate-main-title">
                  Work Experience Credential
                </h1>

                <div className="vw-certificate-standard">
                  Issued under the VeriWork Decentralized Autonomous
                  Credential Standard
                </div>


                <div className="vw-certificate-attestation">
                  This is to officially certify that
                </div>


                <h2 className="vw-certificate-worker-name">
                  {certificate.workerName}
                </h2>


                <div className="vw-certificate-title-line" />


                <p className="vw-certificate-role-intro">
                  has satisfactorily performed trusted domestic
                  employment as
                </p>


                <h3 className="vw-certificate-role">
                  {certificate.jobRole}
                </h3>


                <p className="vw-certificate-employer-intro">
                  under the verified employment of
                </p>


                <h4 className="vw-certificate-employer">
                  {certificate.employerName}
                </h4>

              </div>


              {/* =================================================
                  EMPLOYMENT SUMMARY
              ================================================= */}

              <div className="vw-certificate-summary">

                <div className="vw-certificate-summary-item">
                  <span className="vw-summary-label">
                    Tenure Start
                  </span>

                  <span className="vw-summary-value">
                    {formatDate(certificate.startDate)}
                  </span>
                </div>


                <div className="vw-certificate-summary-item">
                  <span className="vw-summary-label">
                    Tenure End
                  </span>

                  <span className="vw-summary-value">
                    {formatDate(certificate.endDate)}
                  </span>
                </div>


                <div className="vw-certificate-summary-item">
                  <span className="vw-summary-label">
                    Salary / Month
                  </span>

                  <span className="vw-summary-value">
                    ₹
                    {Number(
                      certificate.salary || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>


                <div className="vw-certificate-summary-item">
                  <span className="vw-summary-label">
                    Issued On
                  </span>

                  <span className="vw-summary-value">
                    {formatDate(certificate.issuedAt)}
                  </span>
                </div>

              </div>


              {/* =================================================
                  BLOCKCHAIN PROOF
              ================================================= */}

              <div className="vw-blockchain-proof">

                <div className="vw-proof-grid">

                  <div className="vw-proof-item">

                    <div className="vw-proof-label">
                      <FaFingerprint />
                      SHA-256 Digital Digest
                    </div>

                    <span className="vw-proof-value hash">
                      {certificate.blockchainHash ||
                        "0xCryptographicallyComputedDigestOnChain"}
                    </span>

                  </div>


                  <div className="vw-proof-item">

                    <div className="vw-proof-label">
                      <FaCube />
                      Smart Contract Address
                    </div>

                    <span className="vw-proof-value">
                      {SMART_CONTRACT_ADDRESS}
                    </span>

                  </div>

                </div>


                <div className="vw-proof-bottom">

                  <div className="vw-proof-transaction">
                    <FaEthereum
                      style={{
                        marginRight: "5px",
                        color: "#d4a359",
                      }}
                    />

                    TRANSACTION:{" "}

                    <strong>
                      {transactionHash}
                    </strong>
                  </div>


                  <div
                    className={`vw-proof-verified ${!isVerified ? "pending" : ""
                      }`}
                  >
                    {isVerified ? (
                      <>
                        <FaCheckCircle />
                        100% CRYPTOGRAPHIC AUDIT VERIFIED
                      </>
                    ) : (
                      <>
                        <FaClock />
                        PENDING REGISTRATION
                      </>
                    )}
                  </div>

                </div>

              </div>


              {/* =================================================
                  CERTIFICATE FOOTER
              ================================================= */}

              <div className="vw-certificate-footer">

                {/* QR */}

                <div className="vw-certificate-qr">

                  <div className="vw-qr-box">

                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="VeriWork Blockchain QR Verification"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#f1eee6",
                        }}
                      />
                    )}

                  </div>


                  <div>

                    <span className="vw-qr-copy-title">
                      <FaQrcode
                        style={{
                          marginRight: "5px",
                          color:
                            "var(--color-forest)",
                        }}
                      />
                      Scan to Verify
                    </span>

                    <span className="vw-qr-copy-text">
                      Instant live verification using a
                      smartphone camera.
                    </span>

                  </div>

                </div>


                {/* Privacy */}

                <div className="vw-certificate-privacy">

                  <div className="vw-privacy-pill">
                    <FaLock />
                    Zero-Knowledge PII Protected
                  </div>

                  <div className="vw-certificate-id">
                    {certificate.certificateId}
                  </div>

                </div>


                {/* Signature */}

                <div className="vw-certificate-signature">

                  <div className="vw-signature-script">
                    VeriWork Protocol
                  </div>

                  <span className="vw-signature-title">
                    VeriWork Smart Contract Authority
                  </span>

                  <span className="vw-signature-subtitle">
                    Ethereum EVM Ledger Engine
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default WorkCertificate;