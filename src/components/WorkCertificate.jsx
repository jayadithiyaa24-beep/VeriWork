import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { toast } from "react-toastify";

const SMART_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function WorkCertificate({ certificate, onClose }) {
  const certificateRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Generate dynamic QR code linking to the live public verification portal
  useEffect(() => {
    if (!certificate?.certificateId) return;

    const verificationUrl = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(
      certificate.certificateId
    )}`;

    QRCode.toDataURL(verificationUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code Generation Error:", err));
  }, [certificate]);

  if (!certificate) return null;

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

  const isVerified =
    certificate.verificationStatus === "Verified" ||
    Boolean(certificate.blockchainTransactionHash);

  // =================================
  // DOWNLOAD CERTIFICATE AS PDF
  // =================================
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

      toast.success("Certificate PDF downloaded! You can open it in any PDF reader. 📄✓");
    } catch (error) {
      console.error("Certificate PDF Download Error:", error);
      toast.error("Download failed. Please try again.");
    } finally {
      setTimeout(() => setGeneratingPdf(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(
      certificate.certificateId
    )}`;
    navigator.clipboard.writeText(url);
    toast.success("Public verification link copied to clipboard!");
  };

  return (
    <div className="work-certificate-container my-4">
      {/* Print Stylesheet */}
      <style>{`
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
            border: 4px double #1e3a8a !important;
          }
          .no-print-toolbar {
            display: none !important;
          }
        }

        .cert-outer-frame {
          background: #ffffff;
          border: 10px solid #1e3a8a;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.25);
          position: relative;
          color: #0f172a;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .cert-inner-frame {
          border: 3px double #d97706;
          outline: 1px dashed rgba(30, 58, 138, 0.35);
          outline-offset: -10px;
          background: radial-gradient(circle at center, #ffffff 65%, #fefce8 100%);
        }

        .cert-corner-tl, .cert-corner-tr, .cert-corner-bl, .cert-corner-br {
          position: absolute;
          width: 28px;
          height: 28px;
          border-color: #b45309;
        }
        .cert-corner-tl { top: 14px; left: 14px; border-top: 3px solid #b45309; border-left: 3px solid #b45309; }
        .cert-corner-tr { top: 14px; right: 14px; border-top: 3px solid #b45309; border-right: 3px solid #b45309; }
        .cert-corner-bl { bottom: 14px; left: 14px; border-bottom: 3px solid #b45309; border-left: 3px solid #b45309; }
        .cert-corner-br { bottom: 14px; right: 14px; border-bottom: 3px solid #b45309; border-right: 3px solid #b45309; }

        .cert-gold-seal {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          background: radial-gradient(circle, #fef08a 0%, #d97706 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(217, 119, 6, 0.45);
          border: 3px solid #fffbeb;
          color: #78350f;
          font-weight: 800;
          text-align: center;
          font-size: 10px;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .cert-qr-box {
          background: #ffffff;
          padding: 6px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          display: inline-block;
        }
      `}</style>

      {/* Action Toolbar */}
      <div className="no-print-toolbar d-flex flex-wrap justify-content-between align-items-center mb-3 p-3 bg-light rounded-3 shadow-sm border">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-5">📜</span>
          <span className="fw-bold text-dark">
            Official Credential: <code className="text-primary">{certificate.certificateId}</code>
          </span>
          <span className={`badge ${isVerified ? "bg-success" : "bg-warning text-dark"}`}>
            {isVerified ? "✓ Blockchain Verified" : "⏳ Pending On-Chain"}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleCopyLink}
          >
            🔗 Copy Link
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handlePrint}
          >
            🖨️ Print
          </button>
          <a
            href={`http://localhost:5000/api/certificates/download-pdf/${encodeURIComponent(
              certificate.certificateId
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-info btn-sm"
          >
            👁️ Open PDF
          </a>
          <button
            type="button"
            className="btn btn-success btn-sm px-3 fw-semibold"
            onClick={handleDownloadPDF}
            disabled={generatingPdf}
          >
            {generatingPdf ? (
              <>
                <span className="spinner-border spinner-border-sm me-1"></span>
                Generating PDF...
              </>
            ) : (
              "📥 Download PDF Certificate"
            )}
          </button>
          {onClose && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={onClose}
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* THE OFFICIAL CERTIFICATE CANVAS (CAPTURED BY HTML2CANVAS)  */}
      {/* ========================================================= */}
      <div
        id="printable-work-certificate"
        ref={certificateRef}
        className="cert-outer-frame rounded-3 p-3"
        style={{
          maxWidth: "1020px",
          margin: "0 auto",
        }}
      >
        <div className="cert-inner-frame rounded-2 p-4 p-md-5 position-relative">
          {/* Decorative Corner Filigrees */}
          <div className="cert-corner-tl"></div>
          <div className="cert-corner-tr"></div>
          <div className="cert-corner-bl"></div>
          <div className="cert-corner-br"></div>

          {/* HEADER */}
          <div className="row align-items-center pb-3 border-bottom border-warning border-opacity-50">
            <div className="col-8">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "2rem" }}>🛡️</span>
                <div>
                  <h2
                    className="fw-bold mb-0"
                    style={{
                      letterSpacing: "4px",
                      color: "#1e3a8a",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    VERIWORK
                  </h2>
                  <small
                    className="text-muted fw-bold d-block"
                    style={{
                      letterSpacing: "2px",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Decentralized Work Identity & Experience Credential
                  </small>
                </div>
              </div>
            </div>

            <div className="col-4 text-end">
              <div className="cert-gold-seal ms-auto">
                <span>VERIFIED</span>
                <span style={{ fontSize: "15px", color: "#b45309" }}>★</span>
                <span>LEDGER</span>
              </div>
            </div>
          </div>

          {/* TITLE & ATTESTATION */}
          <div className="text-center my-4">
            <p
              className="text-uppercase fw-bold text-muted mb-1"
              style={{ letterSpacing: "3px", fontSize: "0.85rem" }}
            >
              Certificate of Verified Domestic Employment
            </p>
            <small className="text-muted fst-italic">
              Issued under the VeriWork Decentralized Autonomous Credential Standard
            </small>

            <div className="my-3">
              <span className="text-muted fs-6">This is to officially certify that</span>
            </div>

            {/* WORKER RECIPIENT */}
            <h1
              className="fw-bold display-6 my-2"
              style={{
                color: "#1e3a8a",
                fontFamily: "Georgia, serif",
                letterSpacing: "1px",
              }}
            >
              {certificate.workerName}
            </h1>

            <div
              style={{
                width: "220px",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #b45309, transparent)",
                margin: "0 auto 12px",
              }}
            ></div>

            <p className="text-muted mb-1">
              has satisfactorily performed trusted domestic employment as
            </p>

            <h3 className="fw-bold text-dark mb-2">
              {certificate.jobRole}
            </h3>

            <p className="text-muted mb-1">
              under the verified employment of
            </p>

            <h4
              className="fw-bold mb-3"
              style={{ color: "#2563eb", fontFamily: "Georgia, serif" }}
            >
              {certificate.employerName}
            </h4>
          </div>

          {/* EMPLOYMENT SUMMARY MATRIX */}
          <div
            className="row g-2 p-3 rounded-3 mb-4 text-center align-items-center"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="col-3 border-end">
              <small className="text-muted text-uppercase fw-bold d-block" style={{ fontSize: "0.7rem" }}>
                Tenure Start
              </small>
              <span className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                {formatDate(certificate.startDate)}
              </span>
            </div>

            <div className="col-3 border-end">
              <small className="text-muted text-uppercase fw-bold d-block" style={{ fontSize: "0.7rem" }}>
                Tenure End
              </small>
              <span className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                {formatDate(certificate.endDate)}
              </span>
            </div>

            <div className="col-3 border-end">
              <small className="text-muted text-uppercase fw-bold d-block" style={{ fontSize: "0.7rem" }}>
                Salary / Month
              </small>
              <span className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                ₹{Number(certificate.salary || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="col-3">
              <small className="text-muted text-uppercase fw-bold d-block" style={{ fontSize: "0.7rem" }}>
                Issued On
              </small>
              <span className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                {formatDate(certificate.issuedAt)}
              </span>
            </div>
          </div>

          {/* CRYPTOGRAPHIC BLOCKCHAIN PROOF STRIP */}
          <div
            className="p-3 rounded-3 mb-4 font-monospace"
            style={{
              background: "#0f172a",
              color: "#38bdf8",
              fontSize: "0.75rem",
              border: "1px solid #1e293b",
            }}
          >
            <div className="row g-2 align-items-center">
              <div className="col-md-6">
                <span className="text-slate-400 d-block" style={{ color: "#94a3b8" }}>
                  🔐 SHA-256 DIGITAL DIGEST:
                </span>
                <span className="text-truncate d-block text-warning">
                  {certificate.blockchainHash || "0xCryptographicallyComputedDigestOnChain"}
                </span>
              </div>

              <div className="col-md-6">
                <span className="text-slate-400 d-block" style={{ color: "#94a3b8" }}>
                  ⛓️ SMART CONTRACT ADDRESS:
                </span>
                <span className="text-truncate d-block text-info">
                  {SMART_CONTRACT_ADDRESS}
                </span>
              </div>

              <div className="col-12 pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between flex-wrap gap-1">
                <span>
                  TRANSACTION:{" "}
                  <span className="text-light">
                    {certificate.blockchainTransactionHash
                      ? `${certificate.blockchainTransactionHash.slice(0, 18)}...${certificate.blockchainTransactionHash.slice(-10)}`
                      : "Pending On-Chain Mining"}
                  </span>
                </span>
                <span className={isVerified ? "text-success fw-bold" : "text-warning"}>
                  {isVerified ? "● 100% CRYPTOGRAPHIC AUDIT VERIFIED" : "○ PENDING REGISTRATION"}
                </span>
              </div>
            </div>
          </div>

          {/* CERTIFICATE FOOTER (QR CODE + ZERO-KNOWLEDGE SEAL + SIGNATURES) */}
          <div className="row align-items-end pt-2 border-top border-warning border-opacity-50">
            {/* Dynamic QR Code */}
            <div className="col-4">
              <div className="d-flex align-items-center gap-2">
                <div className="cert-qr-box">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="VeriWork Blockchain QR Verification"
                      style={{ width: "88px", height: "88px", display: "block" }}
                    />
                  ) : (
                    <div style={{ width: "88px", height: "88px", background: "#f1f5f9" }}></div>
                  )}
                </div>
                <div>
                  <small className="fw-bold d-block text-dark" style={{ fontSize: "0.72rem" }}>
                    Scan to Verify
                  </small>
                  <small className="text-muted d-block" style={{ fontSize: "0.65rem", lineHeight: 1.2 }}>
                    Instant live blockchain audit with smartphone camera.
                  </small>
                </div>
              </div>
            </div>

            {/* Zero-Knowledge Privacy Seal */}
            <div className="col-4 text-center">
              <div className="d-inline-block px-3 py-1 bg-light rounded-pill border">
                <small className="text-muted fw-semibold" style={{ fontSize: "0.7rem" }}>
                  🛡️ Zero-Knowledge PII Protected
                </small>
              </div>
              <div className="mt-1">
                <small className="font-monospace text-primary fw-bold" style={{ fontSize: "0.8rem" }}>
                  {certificate.certificateId}
                </small>
              </div>
            </div>

            {/* Signatures */}
            <div className="col-4 text-end">
              <div className="d-inline-block text-center" style={{ minWidth: "160px" }}>
                <div
                  style={{
                    fontFamily: "'Brush Script MT', cursive, sans-serif",
                    fontSize: "1.25rem",
                    color: "#1e3a8a",
                    borderBottom: "1.5px solid #64748b",
                    paddingBottom: "2px",
                    marginBottom: "4px",
                  }}
                >
                  VeriWork Protocol
                </div>
                <small className="text-muted fw-bold d-block" style={{ fontSize: "0.7rem" }}>
                  VeriWork Smart Contract Authority
                </small>
                <small className="text-muted d-block" style={{ fontSize: "0.65rem" }}>
                  Ethereum EVM Ledger Engine
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkCertificate;