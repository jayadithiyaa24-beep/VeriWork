import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { verifyCertificate } from "../services/certificateService";

function VerifyCertificate() {
  const certificateCardRef = useRef(null);

  const { certificateId: paramCertId } = useParams();
  const [searchParams] = useSearchParams();

  const queryCertId =
    searchParams.get("id") ||
    searchParams.get("certificateId") ||
    "";

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

  // =========================================================
  // RUN VERIFICATION
  // =========================================================

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
        toast.success(
          "Certificate cryptographically verified on blockchain!"
        );
      } else if (
        response.certificate &&
        !response.certificate.blockchainTransactionHash
      ) {
        toast.warn(
          "Certificate exists but is pending blockchain registration."
        );
      } else if (!response.hashMatches) {
        toast.error("Tamper Alert: Data hash mismatch detected!");
      }
    } catch (err) {
      console.error("Verification failed:", err);

      setCertificate(null);
      setVerified(false);

      if (err.response?.status === 404) {
        setError(
          "Certificate not found. Please double-check the Certificate ID."
        );
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

  // =========================================================
  // AUTO VERIFY FROM URL
  // =========================================================

  useEffect(() => {
    if (initialCertId) {
      setCertificateId(initialCertId);
      performVerification(initialCertId);
    }
  }, [paramCertId, queryCertId]);

  // =========================================================
  // FORM SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();
    performVerification(certificateId);
  };

  // =========================================================
  // COPY
  // =========================================================

  const handleCopy = (text, label) => {
    if (!text) return;

    navigator.clipboard.writeText(text);
    setCopiedField(label);

    toast.info(`Copied ${label} to clipboard!`);

    setTimeout(() => setCopiedField(""), 2500);
  };

  // =========================================================
  // SHARE
  // =========================================================

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(
      certificate?.certificateId || certificateId
    )}`;

    navigator.clipboard.writeText(shareUrl);

    toast.success("Public verification link copied to clipboard!");
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================================
  // QR CODE
  // =========================================================

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
        dark: "#2B2625",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [certificate]);

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

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

      toast.success(
        "Certificate PDF downloaded! You can open it in any PDF reader. 📄✓"
      );
    } catch (err) {
      console.error("PDF Download Error:", err);
      toast.error("Download failed. Please try again.");
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    setCertificateId("");
    setCertificate(null);
    setVerified(false);
    setBlockchainVerified(false);
    setHashMatches(false);
    setOnChainDetails(null);
    setError("");
    setQrCodeUrl("");
  };

  // =========================================================
  // DATE FORMATTING
  // =========================================================

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

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="vw-verify-page">
      <style>{`
        .vw-verify-page {
          min-height: 100vh;
          padding: 72px 0 90px;
          background:
            radial-gradient(
              circle at 12% 8%,
              rgba(212, 163, 89, 0.10),
              transparent 24%
            ),
            radial-gradient(
              circle at 88% 12%,
              rgba(63, 85, 71, 0.09),
              transparent 26%
            ),
            var(--color-bg, #EFECE6);
          color: var(--color-text, #2B2625);
        }

        .vw-verify-page * {
          box-sizing: border-box;
        }

        .vw-verify-shell {
          max-width: 1160px;
          margin: 0 auto;
        }

        /* =========================
           HEADER
        ========================= */

        .vw-verify-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(43,38,37,0.08);
          box-shadow: 0 8px 22px rgba(43,38,37,0.05);
          color: var(--color-forest, #3F5547) !important;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .vw-verify-eyebrow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-ochre, #D4A359);
          box-shadow: 0 0 0 4px rgba(212,163,89,0.13);
        }

        .vw-verify-title {
          margin: 20px auto 0;
          max-width: 820px;
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          line-height: 0.98;
          letter-spacing: -0.045em;
          color: var(--color-text, #2B2625) !important;
        }

        .vw-verify-title span {
          color: var(--color-forest, #3F5547) !important;
        }

        .vw-verify-subtitle {
          max-width: 720px;
          margin: 20px auto 0;
          color: var(--color-text-muted, #756F68) !important;
          font-size: 1.03rem;
          line-height: 1.75;
        }

        /* =========================
           SEARCH
        ========================= */

        .vw-verify-search {
          max-width: 820px;
          margin: 42px auto 0;
          padding: 9px;
          border-radius: 22px;
          background: rgba(255,255,255,0.80);
          border: 1px solid rgba(43,38,37,0.08);
          box-shadow: 0 18px 50px rgba(43,38,37,0.09);
        }

        .vw-verify-search-inner {
          display: flex;
          align-items: stretch;
          gap: 8px;
        }

        .vw-verify-input-wrap {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 17px;
          border-radius: 15px;
          background: #F7F5F0;
          border: 1px solid rgba(43,38,37,0.08);
        }

        .vw-verify-input-icon {
          color: var(--color-forest, #3F5547);
          font-size: 1.1rem;
        }

        .vw-verify-input {
          width: 100%;
          min-width: 0;
          height: 56px;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--color-text, #2B2625) !important;
          font-family: monospace;
          font-size: 0.92rem;
          font-weight: 700;
        }

        .vw-verify-input::placeholder {
          color: #9A948C !important;
          font-weight: 500;
        }

        .vw-verify-clear {
          border: 0;
          background: transparent;
          color: #8A837B !important;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .vw-verify-button {
          min-height: 58px;
          padding: 0 25px;
          border: 0;
          border-radius: 15px;
          background: var(--color-forest, #3F5547);
          color: #fff !important;
          font-weight: 800;
          font-size: 0.9rem;
          box-shadow: 0 10px 24px rgba(63,85,71,0.18);
          transition: 0.2s ease;
          white-space: nowrap;
        }

        .vw-verify-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #34483B;
          box-shadow: 0 14px 28px rgba(63,85,71,0.23);
        }

        .vw-verify-button:disabled {
          opacity: 0.72;
          cursor: wait;
        }

        .vw-verify-helper {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 13px 5px 3px;
          font-size: 0.72rem;
          color: #807970 !important;
        }

        .vw-verify-helper span {
          color: inherit !important;
        }

        .vw-verify-helper strong {
          color: var(--color-forest, #3F5547) !important;
        }

        /* =========================
           ERROR
        ========================= */

        .vw-verify-error {
          max-width: 820px;
          margin: 20px auto 0;
          padding: 18px 20px;
          display: flex;
          gap: 13px;
          align-items: flex-start;
          border-radius: 17px;
          background: rgba(177,58,47,0.08);
          border: 1px solid rgba(177,58,47,0.18);
          color: #9B4037 !important;
        }

        .vw-verify-error * {
          color: inherit !important;
        }

        /* =========================
           RESULT
        ========================= */

        .vw-verify-result {
          margin-top: 48px;
        }

        .vw-status-card {
          padding: 30px;
          border-radius: 25px;
          text-align: center;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(43,38,37,0.08);
          box-shadow: 0 18px 45px rgba(43,38,37,0.08);
        }

        .vw-status-card.verified {
          border-color: rgba(63,85,71,0.25);
        }

        .vw-status-card.pending {
          border-color: rgba(212,163,89,0.32);
        }

        .vw-status-icon {
          width: 68px;
          height: 68px;
          margin: 0 auto 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #E6EEE8;
          color: var(--color-forest, #3F5547) !important;
          font-size: 1.8rem;
          font-weight: 900;
        }

        .vw-status-card.pending .vw-status-icon {
          background: #F8EEDC;
          color: #B77725 !important;
        }

        .vw-status-title {
          margin: 0;
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          color: var(--color-text, #2B2625) !important;
        }

        .vw-status-card.verified .vw-status-title {
          color: var(--color-forest, #3F5547) !important;
        }

        .vw-status-card.pending .vw-status-title {
          color: #A86D24 !important;
        }

        .vw-status-description {
          max-width: 720px;
          margin: 12px auto 0;
          color: #756F68 !important;
          line-height: 1.7;
        }

        /* =========================
           SECURITY
        ========================= */

        .vw-security-pills {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 20px;
        }

        .vw-security-pill {
          padding: 8px 12px;
          border-radius: 999px;
          background: #EEF2EE;
          color: var(--color-forest, #3F5547) !important;
          font-size: 0.72rem;
          font-weight: 800;
          border: 1px solid rgba(63,85,71,0.10);
        }

        .vw-security-pill.warning {
          background: #F8EEDC;
          color: #9A671F !important;
        }

        .vw-security-pill.danger {
          background: #F8E8E5;
          color: #9B4037 !important;
        }

        /* =========================
           ACTION BUTTONS
        ========================= */

        .vw-action-row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 25px;
          padding-top: 22px;
          border-top: 1px solid rgba(43,38,37,0.08);
        }

        .vw-action-btn {
          min-height: 40px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(43,38,37,0.12);
          background: #fff;
          color: var(--color-text, #2B2625) !important;
          text-decoration: none;
          font-size: 0.76rem;
          font-weight: 750;
          transition: 0.2s ease;
        }

        .vw-action-btn:hover {
          transform: translateY(-2px);
          background: #F7F4ED;
          color: var(--color-text, #2B2625) !important;
        }

        .vw-action-btn.primary {
          background: var(--color-forest, #3F5547);
          color: #fff !important;
          border-color: transparent;
        }

        .vw-action-btn.ochre {
          background: var(--color-ochre, #D4A359);
          color: #fff !important;
          border-color: transparent;
        }

        /* =========================
           CERTIFICATE
        ========================= */

        .vw-certificate {
          margin-top: 26px;
          padding: 9px;
          border-radius: 27px;
          background: #E6E0D5;
          box-shadow: 0 25px 65px rgba(43,38,37,0.13);
        }

        .vw-certificate-inner {
          position: relative;
          padding: 42px 46px;
          border-radius: 21px;
          background: #FCFBF8;
          border: 1px solid rgba(63,85,71,0.18);
        }

        .vw-certificate-inner::before {
          content: "";
          position: absolute;
          inset: 13px;
          border: 1px solid rgba(212,163,89,0.35);
          border-radius: 15px;
          pointer-events: none;
        }

        .vw-cert-brand {
          color: var(--color-forest, #3F5547) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
        }

        .vw-cert-kicker {
          color: #817A72 !important;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .vw-cert-seal {
          width: 82px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #E5C27B 0%,
            #C58A38 72%,
            #A66D25 100%
          );
          border: 4px solid #F5E4BC;
          color: #fff;
          box-shadow: 0 8px 20px rgba(166,109,37,0.18);
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: center;
          line-height: 1.2;
        }

        .vw-cert-title {
          color: var(--color-forest, #3F5547) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(1.8rem, 3vw, 2.7rem);
        }

        .vw-cert-worker {
          display: inline-block;
          margin: 10px 0 7px;
          padding-bottom: 7px;
          border-bottom: 2px solid rgba(63,85,71,0.25);
          color: var(--color-text, #2B2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
        }

        .vw-cert-role {
          color: var(--color-text, #2B2625) !important;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .vw-cert-employer {
          color: var(--color-forest, #3F5547) !important;
          font-size: 1.05rem;
          font-weight: 800;
        }

        .vw-cert-details {
          margin-top: 25px;
          padding: 18px;
          border-radius: 16px;
          background: #F2F4EF;
          border: 1px solid rgba(63,85,71,0.09);
        }

        .vw-cert-detail {
          padding: 5px 13px;
          border-right: 1px solid rgba(43,38,37,0.10);
        }

        .vw-cert-detail:last-child {
          border-right: 0;
        }

        .vw-cert-detail-label {
          display: block;
          color: #898279 !important;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .vw-cert-detail-value {
          color: var(--color-text, #2B2625) !important;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .vw-privacy-note {
          padding: 11px 15px;
          margin-top: 18px;
          border-radius: 12px;
          background: #F8F4EA;
          border: 1px solid rgba(212,163,89,0.16);
          color: #756F68 !important;
          font-size: 0.72rem;
          line-height: 1.55;
        }

        .vw-cert-footer {
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid rgba(43,38,37,0.10);
        }

        .vw-cert-id {
          color: var(--color-forest, #3F5547) !important;
          font-family: monospace;
          font-size: 0.78rem;
          font-weight: 800;
          word-break: break-all;
        }

        .vw-qr-box {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid rgba(43,38,37,0.10);
        }

        .vw-qr-box img,
        .vw-qr-placeholder {
          width: 70px;
          height: 70px;
          display: block;
        }

        .vw-qr-placeholder {
          background: #F0EEE9;
        }

        .vw-qr-copy strong,
        .vw-qr-copy small {
          display: block;
        }

        .vw-qr-copy strong {
          color: var(--color-text, #2B2625) !important;
          font-size: 0.7rem;
        }

        .vw-qr-copy small {
          max-width: 160px;
          color: #817A72 !important;
          font-size: 0.6rem;
          line-height: 1.25;
        }

        /* =========================
           BLOCKCHAIN PROOF
        ========================= */

        .vw-proof-card {
          margin-top: 28px;
          padding: 30px;
          border-radius: 25px;
          background: #26382F;
          color: #fff;
          box-shadow: 0 20px 48px rgba(43,38,37,0.12);
        }

        .vw-proof-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 25px;
        }

        .vw-proof-heading h3 {
          margin: 0;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.65rem;
          color: #fff !important;
        }

        .vw-proof-heading p {
          margin: 4px 0 0;
          color: rgba(255,255,255,0.62) !important;
          font-size: 0.76rem;
        }

        .vw-proof-status {
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          color: #DCE9DF !important;
          font-size: 0.68rem;
          font-weight: 800;
        }

        .vw-proof-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .vw-proof-item {
          padding: 16px;
          border-radius: 15px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .vw-proof-item-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
        }

        .vw-proof-label {
          color: rgba(255,255,255,0.68) !important;
          font-size: 0.67rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .vw-copy-btn {
          padding: 0;
          border: 0;
          background: transparent;
          color: #E0B66D !important;
          font-size: 0.68rem;
          font-weight: 800;
        }

        .vw-hash {
          padding: 11px 12px;
          border-radius: 9px;
          background: #18251F;
          border: 1px solid rgba(255,255,255,0.07);
          color: #D8E4DB !important;
          font-family: monospace;
          font-size: 0.68rem;
          line-height: 1.45;
          word-break: break-all;
        }

        .vw-audit {
          margin-top: 20px;
          padding: 20px;
          border-radius: 16px;
          background: rgba(0,0,0,0.14);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .vw-audit-title {
          margin-bottom: 15px;
          color: #fff !important;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .vw-audit-step {
          height: 100%;
          padding: 13px;
          border-radius: 12px;
          background: rgba(255,255,255,0.045);
        }

        .vw-audit-check {
          color: #9FC8A7 !important;
          font-size: 1rem;
          font-weight: 900;
        }

        .vw-audit-step strong {
          display: block;
          margin-bottom: 3px;
          color: #fff !important;
          font-size: 0.72rem;
        }

        .vw-audit-step span:last-child {
          color: rgba(255,255,255,0.58) !important;
          font-size: 0.67rem;
          line-height: 1.45;
        }

        .vw-share-row {
          margin-top: 20px;
          padding-top: 17px;
          border-top: 1px solid rgba(255,255,255,0.09);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
        }

        .vw-share-row p {
          margin: 0;
          color: rgba(255,255,255,0.62) !important;
          font-size: 0.72rem;
        }

        /* =========================
           EMPTY STATE
        ========================= */

        .vw-empty-info {
          margin-top: 48px;
        }

        .vw-info-heading {
          margin-bottom: 25px;
          text-align: center;
        }

        .vw-info-heading .eyebrow {
          color: #B77C2D !important;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .vw-info-heading h2 {
          margin: 8px 0 0;
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(1.9rem, 3vw, 2.6rem);
          color: var(--color-text, #2B2625) !important;
        }

        .vw-info-card {
          height: 100%;
          padding: 25px;
          border-radius: 20px;
          background: rgba(255,255,255,0.62);
          border: 1px solid rgba(43,38,37,0.08);
          box-shadow: 0 12px 30px rgba(43,38,37,0.045);
        }

        .vw-info-number {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border-radius: 12px;
          background: #E6EEE8;
          color: var(--color-forest, #3F5547) !important;
          font-weight: 900;
          font-size: 0.8rem;
        }

        .vw-info-card h3 {
          margin-bottom: 8px;
          color: var(--color-text, #2B2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.25rem;
        }

        .vw-info-card p {
          margin: 0;
          color: #756F68 !important;
          font-size: 0.78rem;
          line-height: 1.7;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 767px) {
          .vw-verify-page {
            padding: 45px 0 65px;
          }

          .vw-verify-search {
            margin-top: 30px;
            padding: 8px;
          }

          .vw-verify-search-inner {
            flex-direction: column;
          }

          .vw-verify-button {
            width: 100%;
          }

          .vw-verify-helper {
            flex-direction: column;
            gap: 5px;
          }

          .vw-status-card,
          .vw-proof-card {
            padding: 22px;
          }

          .vw-certificate-inner {
            padding: 30px 20px;
          }

          .vw-cert-detail {
            border-right: 0;
            border-bottom: 1px solid rgba(43,38,37,0.08);
            padding: 11px 5px;
          }

          .vw-cert-detail:last-child {
            border-bottom: 0;
          }

          .vw-proof-grid {
            grid-template-columns: 1fr;
          }

          .vw-cert-footer {
            text-align: center;
          }

          .vw-qr-box {
            margin-top: 15px;
          }
        }

        /* =========================
           PRINT
        ========================= */

        @media print {
          body {
            background: #fff !important;
          }

          .vw-verify-page {
            padding: 0 !important;
            background: #fff !important;
          }

          .no-print {
            display: none !important;
          }

          .vw-certificate {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: #fff !important;
          }

          .vw-certificate-inner {
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="container">
        <div className="vw-verify-shell">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="text-center no-print">
            <div className="vw-verify-eyebrow">
              <span className="vw-verify-eyebrow-dot"></span>
              <span>PUBLIC VERIFICATION PORTAL</span>
            </div>

            <h1 className="vw-verify-title">
              Verify a <span>Trusted Work Identity.</span>
            </h1>

            <p className="vw-verify-subtitle">
              Independently verify authentic work history and proof of
              employment through VeriWork's certificate and blockchain
              verification system.
            </p>
          </header>

          {/* =====================================================
              SEARCH FORM
          ===================================================== */}

          <section className="vw-verify-search no-print">
            <form onSubmit={handleSubmit}>
              <div className="vw-verify-search-inner">

                <div className="vw-verify-input-wrap">
                  <span className="vw-verify-input-icon">⌕</span>

                  <input
                    type="text"
                    className="vw-verify-input"
                    placeholder="VW-CERT-2026-XXXXXXXX"
                    value={certificateId}
                    onChange={(e) =>
                      setCertificateId(e.target.value.toUpperCase())
                    }
                    required
                    aria-label="Certificate ID"
                  />

                  {certificateId && (
                    <button
                      type="button"
                      className="vw-verify-clear"
                      onClick={handleReset}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="vw-verify-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Verifying...
                    </>
                  ) : (
                    "Verify Certificate"
                  )}
                </button>

              </div>

              <div className="vw-verify-helper">
                <span>
                  🛡️ Immutable Smart Contract Ledger:{" "}
                  <strong>0x9fE4...a6e0</strong>
                </span>

                <span>
                  🔒 Zero-Knowledge Privacy Protected
                </span>
              </div>
            </form>
          </section>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (
            <div className="vw-verify-error no-print">
              <div className="fs-4">!</div>

              <div>
                <strong>Verification Failed</strong>

                <div className="mt-1">
                  {error}
                </div>

                <small>
                  Make sure the Certificate ID matches the exact format issued
                  by VeriWork (e.g., VW-CERT-YYYY-XXXX).
                </small>
              </div>
            </div>
          )}

          {/* =====================================================
              VERIFIED RESULT
          ===================================================== */}

          {certificate && (
            <main className="vw-verify-result">

              {/* ================= STATUS ================= */}

              <section
                className={`vw-status-card no-print ${verified ? "verified" : "pending"
                  }`}
              >
                <div className="vw-status-icon">
                  {verified ? "✓" : "⏳"}
                </div>

                <h2 className="vw-status-title">
                  {verified
                    ? "Authentic & Blockchain Verified"
                    : "Certificate Found — Pending Blockchain Registration"}
                </h2>

                <p className="vw-status-description">
                  {verified
                    ? "This digital work credential is authentic, valid, and cryptographically anchored into the Ethereum / EVM blockchain smart contract. The cryptographic digest matches the smart contract storage with 100% fidelity."
                    : "This work certificate exists in the VeriWork database, but its blockchain registration transaction is still pending final confirmation by the employer."}
                </p>

                <div className="vw-security-pills">

                  <span
                    className={`vw-security-pill ${hashMatches ? "" : "danger"
                      }`}
                  >
                    {hashMatches
                      ? "✓ SHA-256 Hash Intact"
                      : "✕ Tamper Warning"}
                  </span>

                  <span
                    className={`vw-security-pill ${blockchainVerified ? "" : "warning"
                      }`}
                  >
                    {blockchainVerified
                      ? "✓ Smart Contract Ledger Verified"
                      : "⏳ Pending On-Chain Confirmation"}
                  </span>

                  <span className="vw-security-pill">
                    🛡️ Privacy Guard Active (PII Redacted)
                  </span>

                </div>

                {/* ACTIONS */}

                <div className="vw-action-row">

                  <button
                    type="button"
                    className="vw-action-btn"
                    onClick={handleShareLink}
                  >
                    🔗 Copy Public Link
                  </button>

                  <button
                    type="button"
                    className="vw-action-btn"
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
                    className="vw-action-btn"
                  >
                    👁️ Open PDF
                  </a>

                  <button
                    type="button"
                    className="vw-action-btn ochre"
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
                    className="vw-action-btn"
                    onClick={handleReset}
                  >
                    🔄 Verify Another
                  </button>

                </div>
              </section>

              {/* =================================================
                  OFFICIAL CERTIFICATE
              ================================================= */}

              <section
                id="printable-work-certificate"
                ref={certificateCardRef}
                className="vw-certificate certificate-paper"
              >
                <div className="vw-certificate-inner">

                  {/* CERTIFICATE HEADER */}

                  <div className="row align-items-center pb-4 border-bottom">

                    <div className="col-8">
                      <div className="vw-cert-brand">
                        ✦ VeriWork
                      </div>

                      <div className="vw-cert-kicker mt-2">
                        Decentralized Work Identity & Experience Credential
                      </div>
                    </div>

                    <div className="col-4 text-end">
                      <div className="vw-cert-seal ms-auto">
                        <div>
                          VERIFIED
                          <br />
                          <span style={{ fontSize: "17px" }}>
                            ★
                          </span>
                          <br />
                          LEDGER
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* CERTIFICATE BODY */}

                  <div className="text-center py-4">

                    <div className="vw-cert-kicker mb-2">
                      Official Certificate of Verified Employment
                    </div>

                    <h2 className="vw-cert-title mb-2">
                      Trusted Work Credential
                    </h2>

                    <div className="text-muted mb-1">
                      This is to certify that
                    </div>

                    <div className="vw-cert-worker">
                      {certificate.workerName}
                    </div>

                    <div className="text-muted mt-2">
                      has successfully rendered trusted domestic services as a
                    </div>

                    <div className="vw-cert-role my-2">
                      {certificate.jobRole}
                    </div>

                    <div className="text-muted">
                      under the verified employment of
                    </div>

                    <div className="vw-cert-employer mt-2">
                      {certificate.employerName}
                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="vw-cert-details">

                    <div className="row g-0">

                      <div className="col-sm-6 col-md-3 text-center vw-cert-detail">
                        <span className="vw-cert-detail-label">
                          Registered Salary
                        </span>

                        <span className="vw-cert-detail-value">
                          ₹
                          {certificate.salary
                            ? Number(
                              certificate.salary
                            ).toLocaleString("en-IN")
                            : "N/A"}
                          /mo
                        </span>
                      </div>

                      <div className="col-sm-6 col-md-3 text-center vw-cert-detail">
                        <span className="vw-cert-detail-label">
                          Service Start
                        </span>

                        <span className="vw-cert-detail-value">
                          {formatDate(certificate.startDate)}
                        </span>
                      </div>

                      <div className="col-sm-6 col-md-3 text-center vw-cert-detail">
                        <span className="vw-cert-detail-label">
                          Service End
                        </span>

                        <span className="vw-cert-detail-value">
                          {formatDate(certificate.endDate)}
                        </span>
                      </div>

                      <div className="col-sm-6 col-md-3 text-center vw-cert-detail">
                        <span className="vw-cert-detail-label">
                          Issued On
                        </span>

                        <span className="vw-cert-detail-value">
                          {formatDate(certificate.issuedAt)}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* PRIVACY */}

                  <div className="vw-privacy-note text-center">
                    🛡️{" "}
                    <strong>
                      Zero-Knowledge Privacy Standard:
                    </strong>{" "}
                    Aadhaar numbers, residential addresses, and private phone
                    numbers remain confidential in compliance with worker safety
                    guidelines.
                  </div>

                  {/* CERTIFICATE FOOTER */}

                  <div className="vw-cert-footer">

                    <div className="row align-items-end g-4">

                      <div className="col-md-5">

                        <small className="text-muted d-block">
                          Credential Identifier:
                        </small>

                        <div className="vw-cert-id mt-1">
                          {certificate.certificateId}
                        </div>

                        <div className="small text-muted mt-2">
                          Status:{" "}
                          <strong
                            className={
                              verified
                                ? "text-success"
                                : "text-warning"
                            }
                          >
                            {verified
                              ? "● Cryptographically Sealed & Immutable"
                              : "○ Pending Final Anchor"}
                          </strong>
                        </div>

                      </div>

                      <div className="col-md-4 text-center">

                        <div className="vw-qr-box text-start">

                          {qrCodeUrl ? (
                            <img
                              src={qrCodeUrl}
                              alt="Verification QR"
                            />
                          ) : (
                            <div className="vw-qr-placeholder"></div>
                          )}

                          <div className="vw-qr-copy">
                            <strong>
                              Scan to Verify
                            </strong>

                            <small>
                              Instant audit on Ethereum Smart Contract
                            </small>
                          </div>

                        </div>

                      </div>

                      <div className="col-md-3 text-md-end">

                        <small className="text-muted d-block fw-semibold">
                          VeriWork Autonomous Protocol
                        </small>

                        <small className="text-muted">
                          Smart Contract Engine v2.0
                        </small>

                      </div>

                    </div>

                  </div>

                </div>
              </section>

              {/* =================================================
                  BLOCKCHAIN PROOF
              ================================================= */}

              <section className="vw-proof-card no-print">

                <div className="vw-proof-heading">

                  <div>
                    <h3>
                      Cryptographic Blockchain Proof
                    </h3>

                    <p>
                      Independent decentralized ledger validation data
                    </p>
                  </div>

                  <span className="vw-proof-status">
                    {verified
                      ? "✓ Ledger Match: 100%"
                      : "Pending Registration"}
                  </span>

                </div>

                <div className="vw-proof-grid">

                  {/* CERTIFICATE ID */}

                  <div className="vw-proof-item">

                    <div className="vw-proof-item-head">

                      <span className="vw-proof-label">
                        CERTIFICATE ID
                      </span>

                      <button
                        type="button"
                        className="vw-copy-btn"
                        onClick={() =>
                          handleCopy(
                            certificate.certificateId,
                            "Certificate ID"
                          )
                        }
                      >
                        {copiedField === "Certificate ID"
                          ? "✓ Copied"
                          : "Copy"}
                      </button>

                    </div>

                    <div className="vw-hash">
                      {certificate.certificateId}
                    </div>

                  </div>

                  {/* SHA HASH */}

                  <div className="vw-proof-item">

                    <div className="vw-proof-item-head">

                      <span className="vw-proof-label">
                        SHA-256 DIGITAL FINGERPRINT
                      </span>

                      <button
                        type="button"
                        className="vw-copy-btn"
                        onClick={() =>
                          handleCopy(
                            certificate.blockchainHash ||
                            onChainDetails?.certificateHash,
                            "SHA-256 Hash"
                          )
                        }
                      >
                        {copiedField === "SHA-256 Hash"
                          ? "✓ Copied"
                          : "Copy"}
                      </button>

                    </div>

                    <div className="vw-hash">
                      {certificate.blockchainHash ||
                        onChainDetails?.certificateHash ||
                        "Not yet computed"}
                    </div>

                  </div>

                  {/* TRANSACTION HASH */}

                  <div className="vw-proof-item">

                    <div className="vw-proof-item-head">

                      <span className="vw-proof-label">
                        TRANSACTION HASH (TXHASH)
                      </span>

                      {certificate.blockchainTransactionHash && (
                        <button
                          type="button"
                          className="vw-copy-btn"
                          onClick={() =>
                            handleCopy(
                              certificate.blockchainTransactionHash,
                              "Transaction Hash"
                            )
                          }
                        >
                          {copiedField === "Transaction Hash"
                            ? "✓ Copied"
                            : "Copy"}
                        </button>
                      )}

                    </div>

                    <div className="vw-hash">
                      {certificate.blockchainTransactionHash ||
                        "Pending blockchain submission"}
                    </div>

                  </div>

                  {/* CONTRACT */}

                  <div className="vw-proof-item">

                    <div className="vw-proof-item-head">

                      <span className="vw-proof-label">
                        SMART CONTRACT ADDRESS
                      </span>

                      {onChainDetails?.contractAddress && (
                        <button
                          type="button"
                          className="vw-copy-btn"
                          onClick={() =>
                            handleCopy(
                              onChainDetails.contractAddress,
                              "Contract Address"
                            )
                          }
                        >
                          {copiedField === "Contract Address"
                            ? "✓ Copied"
                            : "Copy"}
                        </button>
                      )}

                    </div>

                    <div className="vw-hash">
                      {onChainDetails?.contractAddress ||
                        "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"}
                    </div>

                  </div>

                  {/* ISSUER */}

                  <div className="vw-proof-item">

                    <div className="vw-proof-item-head">

                      <span className="vw-proof-label">
                        AUTHORIZED ISSUER WALLET
                      </span>

                      {onChainDetails?.registeredBy && (
                        <button
                          type="button"
                          className="vw-copy-btn"
                          onClick={() =>
                            handleCopy(
                              onChainDetails.registeredBy,
                              "Issuer Wallet"
                            )
                          }
                        >
                          {copiedField === "Issuer Wallet"
                            ? "✓ Copied"
                            : "Copy"}
                        </button>
                      )}

                    </div>

                    <div className="vw-hash">
                      {onChainDetails?.registeredBy ||
                        "Pending anchor verification"}
                    </div>

                  </div>

                  {/* TIMESTAMP */}

                  <div className="vw-proof-item">

                    <div className="vw-proof-item-head">

                      <span className="vw-proof-label">
                        ON-CHAIN BLOCK TIMESTAMP
                      </span>

                    </div>

                    <div className="vw-hash">
                      {onChainDetails?.registeredAt
                        ? `${formatTimestamp(
                          onChainDetails.registeredAt
                        )} (Unix: ${onChainDetails.registeredAt
                        })`
                        : "N/A"}
                    </div>

                  </div>

                </div>

                {/* SECURITY AUDIT */}

                <div className="vw-audit">

                  <div className="vw-audit-title">
                    🛡️ Multi-Layer Cryptographic Verification Audit
                  </div>

                  <div className="row g-3">

                    <div className="col-md-4">

                      <div className="vw-audit-step">

                        <span className="vw-audit-check">
                          ✓
                        </span>

                        <strong>
                          Layer 1: Identity & Role
                        </strong>

                        <span>
                          Authentic employment record validated in VeriWork.
                        </span>

                      </div>

                    </div>

                    <div className="col-md-4">

                      <div className="vw-audit-step">

                        <span
                          className={`vw-audit-check ${hashMatches ? "" : "text-danger"
                            }`}
                        >
                          {hashMatches ? "✓" : "✕"}
                        </span>

                        <strong>
                          Layer 2: SHA-256 Digest
                        </strong>

                        <span>
                          Computed digest matches stored blockchain fingerprint.
                        </span>

                      </div>

                    </div>

                    <div className="col-md-4">

                      <div className="vw-audit-step">

                        <span className="vw-audit-check">
                          {blockchainVerified ? "✓" : "⏳"}
                        </span>

                        <strong>
                          Layer 3: Smart Contract
                        </strong>

                        <span>
                          Confirmed by EVM smart contract on local blockchain.
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                {/* SHARE */}

                <div className="vw-share-row">

                  <p>
                    Share this verification link with prospective employers or
                    organizations.
                  </p>

                  <button
                    type="button"
                    className="vw-action-btn ochre"
                    onClick={handleShareLink}
                  >
                    📋 Copy Public Verification Link
                  </button>

                </div>

              </section>
            </main>
          )}

          {/* =====================================================
              HOW VERIFICATION WORKS
          ===================================================== */}

          {!certificate && !loading && (
            <section className="vw-empty-info no-print">

              <div className="vw-info-heading">

                <div className="eyebrow">
                  HOW VERIFICATION WORKS
                </div>

                <h2>
                  Trust, explained simply.
                </h2>

              </div>

              <div className="row g-4">

                <div className="col-md-4">

                  <div className="vw-info-card">

                    <div className="vw-info-number">
                      01
                    </div>

                    <h3>
                      Work Record Created
                    </h3>

                    <p>
                      When a domestic worker completes employment, the
                      registered employer issues a verified employment
                      credential.
                    </p>

                  </div>

                </div>

                <div className="col-md-4">

                  <div className="vw-info-card">

                    <div className="vw-info-number">
                      02
                    </div>

                    <h3>
                      Cryptographic Digest
                    </h3>

                    <p>
                      A deterministic SHA-256 hash is generated from employment
                      parameters and sealed on the Ethereum EVM smart contract.
                    </p>

                  </div>

                </div>

                <div className="col-md-4">

                  <div className="vw-info-card">

                    <div className="vw-info-number">
                      03
                    </div>

                    <h3>
                      Independent Trust
                    </h3>

                    <p>
                      Any future employer or agency can independently verify
                      authentic experience without exposing private Aadhaar or
                      phone numbers.
                    </p>

                  </div>

                </div>

              </div>

            </section>
          )}

        </div>
      </div>
    </div>
  );
}

export default VerifyCertificate;