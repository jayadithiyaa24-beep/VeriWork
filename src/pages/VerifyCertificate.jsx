import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { verifyCertificate } from "../services/certificateService";

function VerifyCertificate() {
  const certificateCardRef = useRef(null);
  const { certificateId: paramCertId } = useParams();
  const [searchParams] = useSearchParams();

  const queryCertId = searchParams.get("id") || searchParams.get("certificateId") || "";
  const initialCertId = (paramCertId || queryCertId || "").trim();

  const [certificateId, setCertificateId] = useState(initialCertId);
  const [certificate, setCertificate] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [verified, setVerified] = useState(false);
  const [blockchainVerified, setBlockchainVerified] = useState(false);
  const [hashMatches, setHashMatches] = useState(false);
  const [onChainDetails, setOnChainDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");

  // =================================
  // RUN VERIFICATION
  // =================================
  const performVerification = async (idToVerify) => {
    const trimmedId = (idToVerify || "").trim();

    if (!trimmedId) {
      setError("Please enter a Certificate ID.");
      setCertificate(null);
      setVerified(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCertificate(null);
      setVerified(false);
      setBlockchainVerified(false);
      setHashMatches(false);
      setOnChainDetails(null);

      const response = await verifyCertificate(trimmedId);

      setCertificate(response.certificate);
      setVerified(Boolean(response.verified));
      setBlockchainVerified(Boolean(response.blockchainVerified));
      setHashMatches(Boolean(response.hashMatches));
      setOnChainDetails(response.onChainDetails || null);

      if (response.verified) {
        toast.success("Certificate cryptographically verified on blockchain!");
      } else if (response.certificate && !response.certificate.blockchainTransactionHash) {
        toast.warn("Certificate exists but is pending blockchain registration.");
      } else if (!response.hashMatches) {
        toast.error("Tamper Alert: Data hash mismatch detected!");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setCertificate(null);
      setVerified(false);

      if (err.response?.status === 404) {
        setError("Certificate not found. Please double-check the Certificate ID.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to verify certificate. Please check your network connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify if ID is in URL
  useEffect(() => {
    if (initialCertId) {
      setCertificateId(initialCertId);
      performVerification(initialCertId);
    }
  }, [paramCertId, queryCertId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    performVerification(certificateId);
  };

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.info(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(""), 2500);
  };

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(
      certificate?.certificateId || certificateId
    )}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Public verification link copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate dynamic QR code linking to this live verification URL
  useEffect(() => {
    if (!certificate?.certificateId) {
      setQrCodeUrl("");
      return;
    }

    const verificationUrl = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(
      certificate.certificateId
    )}`;

    QRCode.toDataURL(verificationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [certificate]);

  // =================================
  // DOWNLOAD HIGH-RES PDF WITH QR CODE
  // =================================
  const handleDownloadPDF = () => {
    try {
      setDownloadingPdf(true);
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
    } catch (err) {
      console.error("PDF Download Error:", err);
      toast.error("Download failed. Please try again.");
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  const handleReset = () => {
    setCertificateId("");
    setCertificate(null);
    setVerified(false);
    setOnChainDetails(null);
    setError("");
  };

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

  const formatTimestamp = (sec) => {
    if (!sec) return "N/A";
    return new Date(sec * 1000).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const verificationUrl = certificate
    ? `${window.location.origin}/verify-certificate?id=${certificate.certificateId}`
    : "";

  return (
    <div
      className="verify-page-wrapper py-5"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        minHeight: "100vh",
        color: "#f8fafc",
      }}
    >
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .verify-page-wrapper {
            background: white !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .certificate-paper {
            box-shadow: none !important;
            border: 4px double #1e3a8a !important;
            page-break-inside: avoid;
          }
        }
        .cert-card-shadow {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
        }
        .cert-inner-border {
          border: 2px dashed rgba(37, 99, 235, 0.35);
          position: relative;
        }
        .gold-seal {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, #fde047 0%, #ca8a04 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(234, 179, 8, 0.6);
          border: 3px solid #fef08a;
          color: #713f12;
          font-weight: bold;
          text-align: center;
          font-size: 11px;
          line-height: 1.2;
          text-transform: uppercase;
        }
        .hash-box {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 10px 14px;
          font-family: monospace;
          word-break: break-all;
          font-size: 0.85rem;
          color: #38bdf8;
        }
      `}</style>

      <div className="container">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="text-center mb-5 no-print">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-25 border border-primary border-opacity-50 text-info small mb-3">
            <span className="spinner-grow spinner-grow-sm text-info" role="status"></span>
            Ethereum / EVM Smart Contract Verification
          </div>

          <h1
            className="fw-bold display-5"
            style={{
              letterSpacing: "1px",
              background: "linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VeriWork Public Trust Portal
          </h1>

          <p className="text-slate-300 fs-5 mt-2" style={{ color: "#94a3b8" }}>
            Cryptographically verify authentic work history & proof of employment for domestic workers.
          </p>
        </div>

        {/* ================================= */}
        {/* VERIFICATION FORM */}
        {/* ================================= */}
        <div
          className="card border-0 cert-card-shadow mx-auto mb-5 no-print"
          style={{
            maxWidth: "760px",
            background: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="fw-semibold text-light">
                  Enter VeriWork Certificate ID
                </label>
                {certificateId && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-muted p-0 text-decoration-none"
                    onClick={handleReset}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="input-group input-group-lg shadow-sm">
                <span
                  className="input-group-text border-0"
                  style={{ background: "#334155", color: "#94a3b8" }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control border-0 font-monospace text-uppercase"
                  style={{
                    background: "#1e293b",
                    color: "#f8fafc",
                    fontSize: "1rem",
                  }}
                  placeholder="VW-CERT-2026-XXXXXXXX"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    border: "none",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Verifying...
                    </>
                  ) : (
                    "Verify On Blockchain"
                  )}
                </button>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 small text-muted">
                <span>
                  🛡️ Immutable Smart Contract Ledger: <code>0x9fE4...a6e0</code>
                </span>
                <span className="text-info">
                  🔒 Zero-Knowledge Privacy Protected
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* ================================= */}
        {/* ERROR STATE */}
        {/* ================================= */}
        {error && (
          <div
            className="alert alert-danger mx-auto mb-5 no-print d-flex align-items-start gap-3 shadow-lg"
            style={{
              maxWidth: "760px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              borderRadius: "12px",
            }}
          >
            <div className="fs-3">✕</div>
            <div>
              <h5 className="fw-bold mb-1 text-danger">Verification Failed</h5>
              <div>{error}</div>
              <div className="small mt-2" style={{ color: "#fca5a5" }}>
                Make sure the Certificate ID matches the exact format issued by VeriWork (e.g., <code>VW-CERT-YYYY-XXXX</code>).
              </div>
            </div>
          </div>
        )}

        {/* ================================= */}
        {/* VERIFICATION RESULT */}
        {/* ================================= */}
        {certificate && (
          <div className="mx-auto" style={{ maxWidth: "960px" }}>
            {/* STATUS BANNER */}
            <div
              className={`p-4 rounded-4 mb-4 text-center cert-card-shadow no-print ${
                verified
                  ? "border border-success"
                  : certificate.verificationStatus === "Verified"
                  ? "border border-warning"
                  : "border border-secondary"
              }`}
              style={{
                background: verified
                  ? "radial-gradient(ellipse at top, rgba(16, 185, 129, 0.22) 0%, rgba(15, 23, 42, 0.95) 100%)"
                  : "radial-gradient(ellipse at top, rgba(234, 179, 8, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
              }}
            >
              <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3"
                style={{
                  background: verified ? "rgba(16, 185, 129, 0.2)" : "rgba(234, 179, 8, 0.2)",
                  width: "70px",
                  height: "70px",
                }}
              >
                <span className="fs-1">{verified ? "✓" : "⏳"}</span>
              </div>

              <h2 className={`fw-bold mb-2 ${verified ? "text-success" : "text-warning"}`}>
                {verified
                  ? "Authentic & Blockchain Verified"
                  : "Certificate Found (Pending Blockchain Registration)"}
              </h2>

              <p className="text-slate-300 mx-auto mb-3" style={{ maxWidth: "680px", color: "#cbd5e1" }}>
                {verified
                  ? "This digital work credential is authentic, valid, and cryptographically anchored into the Ethereum / EVM blockchain smart contract. The cryptographic digest matches the smart contract storage with 100% fidelity."
                  : "This work certificate exists in the VeriWork database, but its blockchain registration transaction is still pending final confirmation by the employer."}
              </p>

              {/* SECURITY CHECKS PILLS */}
              <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                <span className={`badge px-3 py-2 ${hashMatches ? "bg-success" : "bg-danger"}`}>
                  {hashMatches ? "✓ SHA-256 Hash Intact" : "✕ Tamper Warning"}
                </span>
                <span className={`badge px-3 py-2 ${blockchainVerified ? "bg-success" : "bg-warning text-dark"}`}>
                  {blockchainVerified ? "✓ Smart Contract Ledger Verified" : "⏳ Pending On-Chain Confirmation"}
                </span>
                <span className="badge px-3 py-2 bg-info text-dark">
                  🛡️ Privacy Guard Active (PII Redacted)
                </span>
              </div>

              {/* ACTION TOOLBAR */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 pt-3 border-top border-secondary border-opacity-25">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm px-3"
                  onClick={handleShareLink}
                >
                  🔗 Copy Public Link
                </button>
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm px-3"
                  onClick={handlePrint}
                >
                  🖨️ Print Certificate
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
                  disabled={downloadingPdf}
                >
                  {downloadingPdf ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Downloading PDF...
                    </>
                  ) : (
                    "📥 Download PDF & QR"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={handleReset}
                >
                  🔄 Verify Another
                </button>
              </div>
            </div>

            {/* ================================= */}
            {/* OFFICIAL DIGITAL CERTIFICATE CARD */}
            {/* (Clean, printable layout) */}
            {/* ================================= */}
            <div
              id="printable-work-certificate"
              ref={certificateCardRef}
              className="certificate-paper cert-card-shadow rounded-4 p-4 p-md-5 mb-5 position-relative"
              style={{
                background: "#ffffff",
                color: "#0f172a",
                border: "8px solid #1e3a8a",
                borderRadius: "20px",
              }}
            >
              <div className="cert-inner-border p-4 p-md-5 rounded-3">
                {/* CERTIFICATE HEADER */}
                <div className="row align-items-center mb-4 pb-3 border-bottom">
                  <div className="col-8">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fs-3">🛡️</span>
                      <h3
                        className="fw-bold mb-0"
                        style={{
                          letterSpacing: "2px",
                          color: "#1e3a8a",
                          fontFamily: "serif",
                        }}
                      >
                        VERIWORK
                      </h3>
                    </div>
                    <small className="text-muted text-uppercase tracking-wider fw-semibold" style={{ letterSpacing: "1px" }}>
                      Decentralized Work Identity & Experience Credential
                    </small>
                  </div>

                  <div className="col-4 text-end">
                    <div className="gold-seal ms-auto">
                      <div>
                        <div>VERIFIED</div>
                        <div style={{ fontSize: "16px" }}>★</div>
                        <div>LEDGER</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CERTIFICATE BODY */}
                <div className="text-center my-4 py-2">
                  <p className="text-muted text-uppercase fw-semibold mb-2" style={{ letterSpacing: "2px", fontSize: "0.85rem" }}>
                    Official Certificate of Verified Employment
                  </p>

                  <h5 className="text-muted fw-normal">This is to certify that</h5>

                  <h1
                    className="fw-bold my-3 display-6"
                    style={{
                      color: "#1e3a8a",
                      fontFamily: "serif",
                      borderBottom: "2px solid #e2e8f0",
                      display: "inline-block",
                      paddingBottom: "8px",
                      minWidth: "280px",
                    }}
                  >
                    {certificate.workerName}
                  </h1>

                  <p className="text-muted fs-6 mb-1">
                    has successfully rendered trusted domestic services as a
                  </p>

                  <h3 className="fw-bold text-dark my-2">
                    {certificate.jobRole}
                  </h3>

                  <p className="text-muted fs-6">
                    under the verified employment of
                  </p>

                  <h4 className="fw-semibold text-primary mb-4">
                    {certificate.employerName}
                  </h4>
                </div>

                {/* DETAILS GRID */}
                <div className="row g-3 p-3 rounded-3 mb-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="col-sm-6 col-md-3 text-center border-end">
                    <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                      Registered Salary
                    </small>
                    <span className="fw-bold text-dark fs-6">
                      ₹{certificate.salary ? Number(certificate.salary).toLocaleString("en-IN") : "N/A"}/mo
                    </span>
                  </div>

                  <div className="col-sm-6 col-md-3 text-center border-end">
                    <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                      Service Start
                    </small>
                    <span className="fw-bold text-dark fs-6">
                      {formatDate(certificate.startDate)}
                    </span>
                  </div>

                  <div className="col-sm-6 col-md-3 text-center border-end">
                    <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                      Service End
                    </small>
                    <span className="fw-bold text-dark fs-6">
                      {formatDate(certificate.endDate)}
                    </span>
                  </div>

                  <div className="col-sm-6 col-md-3 text-center">
                    <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                      Issued On
                    </small>
                    <span className="fw-bold text-dark fs-6">
                      {formatDate(certificate.issuedAt)}
                    </span>
                  </div>
                </div>

                {/* PRIVACY BADGE NOTICE */}
                <div className="p-2 mb-4 rounded text-center small text-muted bg-white border border-light">
                  🛡️ <strong>Zero-Knowledge Privacy Standard:</strong> Aadhaar numbers, residential addresses, and private phone numbers remain confidential in compliance with worker safety guidelines.
                </div>

                {/* CERTIFICATE FOOTER */}
                <div className="row align-items-end pt-3 border-top g-3">
                  <div className="col-md-5">
                    <small className="text-muted d-block">Credential Identifier:</small>
                    <span className="fw-bold font-monospace text-primary fs-6">
                      {certificate.certificateId}
                    </span>
                    <div className="small text-muted mt-1">
                      Status:{" "}
                      <span className={verified ? "text-success fw-bold" : "text-warning fw-bold"}>
                        {verified ? "● Cryptographically Sealed & Immutable" : "○ Pending Final Anchor"}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-4 text-center">
                    <div className="d-inline-flex align-items-center gap-2 text-start">
                      <div
                        style={{
                          background: "#ffffff",
                          padding: "4px",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        }}
                      >
                        {qrCodeUrl ? (
                          <img
                            src={qrCodeUrl}
                            alt="Verification QR"
                            style={{ width: "70px", height: "70px", display: "block" }}
                          />
                        ) : (
                          <div style={{ width: "70px", height: "70px", background: "#f1f5f9" }} />
                        )}
                      </div>
                      <div>
                        <small className="fw-bold d-block text-dark" style={{ fontSize: "0.72rem" }}>
                          Scan to Verify
                        </small>
                        <small className="text-muted d-block" style={{ fontSize: "0.62rem", lineHeight: 1.2 }}>
                          Instant audit on Ethereum Smart Contract
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 text-md-end mt-2 mt-md-0">
                    <div className="d-inline-block text-center">
                      <div
                        style={{
                          borderBottom: "1px solid #94a3b8",
                          width: "140px",
                          marginBottom: "4px",
                        }}
                      ></div>
                      <small className="text-muted d-block fw-semibold" style={{ fontSize: "0.75rem" }}>
                        VeriWork Autonomous Protocol
                      </small>
                      <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                        Smart Contract Engine v2.0
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================= */}
            {/* CRYPTOGRAPHIC PROOF & BLOCKCHAIN AUDIT SECTION */}
            {/* ================================= */}
            <div
              className="card border-0 cert-card-shadow rounded-4 mb-5 no-print"
              style={{
                background: "rgba(30, 41, 59, 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-3">🔗</span>
                    <div>
                      <h4 className="fw-bold text-light mb-0">Cryptographic Blockchain Proof</h4>
                      <small className="text-muted">
                        Independent decentralized ledger validation data
                      </small>
                    </div>
                  </div>

                  <span className={`badge px-3 py-2 ${verified ? "bg-success" : "bg-warning text-dark"}`}>
                    {verified ? "✓ Ledger Match: 100%" : "Pending Registration"}
                  </span>
                </div>

                <div className="row g-4">
                  {/* CERTIFICATE ID */}
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="small text-muted fw-semibold">Certificate ID</label>
                      <button
                        className="btn btn-link btn-sm p-0 text-info text-decoration-none"
                        onClick={() => handleCopy(certificate.certificateId, "Certificate ID")}
                      >
                        {copiedField === "Certificate ID" ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="hash-box">{certificate.certificateId}</div>
                  </div>

                  {/* DIGITAL FINGERPRINT (SHA-256 HASH) */}
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="small text-muted fw-semibold">
                        SHA-256 Digital Fingerprint
                      </label>
                      <button
                        className="btn btn-link btn-sm p-0 text-info text-decoration-none"
                        onClick={() =>
                          handleCopy(
                            certificate.blockchainHash || onChainDetails?.certificateHash,
                            "SHA-256 Hash"
                          )
                        }
                      >
                        {copiedField === "SHA-256 Hash" ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="hash-box">
                      {certificate.blockchainHash || onChainDetails?.certificateHash || "Not yet computed"}
                    </div>
                  </div>

                  {/* BLOCKCHAIN TRANSACTION HASH */}
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="small text-muted fw-semibold">
                        Transaction Hash (TxHash)
                      </label>
                      {certificate.blockchainTransactionHash && (
                        <button
                          className="btn btn-link btn-sm p-0 text-info text-decoration-none"
                          onClick={() =>
                            handleCopy(certificate.blockchainTransactionHash, "Transaction Hash")
                          }
                        >
                          {copiedField === "Transaction Hash" ? "✓ Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                    <div className="hash-box">
                      {certificate.blockchainTransactionHash || "Pending blockchain submission"}
                    </div>
                  </div>

                  {/* SMART CONTRACT ADDRESS */}
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="small text-muted fw-semibold">
                        Smart Contract Address (VeriWorkCertificate.sol)
                      </label>
                      {onChainDetails?.contractAddress && (
                        <button
                          className="btn btn-link btn-sm p-0 text-info text-decoration-none"
                          onClick={() =>
                            handleCopy(onChainDetails.contractAddress, "Contract Address")
                          }
                        >
                          {copiedField === "Contract Address" ? "✓ Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                    <div className="hash-box">
                      {onChainDetails?.contractAddress || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"}
                    </div>
                  </div>

                  {/* REGISTERED BY (ISSUER WALLET) */}
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="small text-muted fw-semibold">
                        Authorized Issuer Wallet Address
                      </label>
                      {onChainDetails?.registeredBy && (
                        <button
                          className="btn btn-link btn-sm p-0 text-info text-decoration-none"
                          onClick={() =>
                            handleCopy(onChainDetails.registeredBy, "Issuer Wallet")
                          }
                        >
                          {copiedField === "Issuer Wallet" ? "✓ Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                    <div className="hash-box">
                      {onChainDetails?.registeredBy || "Pending anchor verification"}
                    </div>
                  </div>

                  {/* BLOCKCHAIN TIMESTAMP */}
                  <div className="col-md-6">
                    <label className="small text-muted fw-semibold mb-1 d-block">
                      On-Chain Block Timestamp
                    </label>
                    <div className="hash-box">
                      {onChainDetails?.registeredAt
                        ? `${formatTimestamp(onChainDetails.registeredAt)} (Unix: ${onChainDetails.registeredAt})`
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {/* 3-LAYER SECURITY VERIFICATION CHECKLIST */}
                <div
                  className="mt-4 p-4 rounded-3"
                  style={{ background: "#0f172a", border: "1px solid #334155" }}
                >
                  <h6 className="fw-bold text-light mb-3">
                    🛡️ Multi-Layer Cryptographic Verification Audit
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-success fs-5">✓</span>
                        <div>
                          <strong className="d-block text-slate-200 small">
                            Layer 1: Identity & Role
                          </strong>
                          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Authentic employment record validated in VeriWork.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="d-flex align-items-center gap-2">
                        <span className={hashMatches ? "text-success fs-5" : "text-danger fs-5"}>
                          {hashMatches ? "✓" : "✕"}
                        </span>
                        <div>
                          <strong className="d-block text-slate-200 small">
                            Layer 2: SHA-256 Digest
                          </strong>
                          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Computed digest matches stored blockchain fingerprint.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="d-flex align-items-center gap-2">
                        <span className={blockchainVerified ? "text-success fs-5" : "text-warning fs-5"}>
                          {blockchainVerified ? "✓" : "⏳"}
                        </span>
                        <div>
                          <strong className="d-block text-slate-200 small">
                            Layer 3: Smart Contract
                          </strong>
                          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Confirmed by EVM smart contract on local blockchain.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SHARE URL BOX */}
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div className="small text-muted">
                    Share this verification link with prospective employers or organizations:
                  </div>
                  <button
                    className="btn btn-outline-info btn-sm px-3"
                    onClick={handleShareLink}
                  >
                    📋 Copy Public Verification Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================= */}
        {/* HOW VERIFICATION WORKS (FAQ / INFO) */}
        {/* ================================= */}
        {!certificate && !loading && (
          <div
            className="row g-4 mt-2 mx-auto no-print"
            style={{ maxWidth: "1000px" }}
          >
            <div className="col-md-4">
              <div
                className="p-4 rounded-4 h-100"
                style={{
                  background: "rgba(30, 41, 59, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="fs-2 mb-2">📜</div>
                <h5 className="fw-bold text-light">1. Work Record Created</h5>
                <p className="small text-muted mb-0">
                  When a domestic worker completes employment, the registered employer issues a verified employment credential.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="p-4 rounded-4 h-100"
                style={{
                  background: "rgba(30, 41, 59, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="fs-2 mb-2">🔐</div>
                <h5 className="fw-bold text-light">2. Cryptographic Digest</h5>
                <p className="small text-muted mb-0">
                  A deterministic SHA-256 hash is generated from employment parameters and sealed on the Ethereum EVM smart contract.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="p-4 rounded-4 h-100"
                style={{
                  background: "rgba(30, 41, 59, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="fs-2 mb-2">✓</div>
                <h5 className="fw-bold text-light">3. Independent Trust</h5>
                <p className="small text-muted mb-0">
                  Any future employer or agency can independently verify authentic experience without exposing private Aadhaar or phone numbers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyCertificate;