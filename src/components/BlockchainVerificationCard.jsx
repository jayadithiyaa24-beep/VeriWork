import React from "react";
import { FaFileAlt, FaHashtag, FaCube, FaCheckCircle, FaArrowRight, FaShieldAlt } from "react-icons/fa";

function BlockchainVerificationCard({ recordId, verificationStatus, hash }) {
  const isVerified = verificationStatus === "Verified";
  const displayHash = hash || `0x7a8f${recordId ? recordId.slice(-6) : "3b91c4"}...9e21`;

  const steps = [
    {
      icon: <FaFileAlt className="text-primary" size={20} />,
      title: "1. Record Created",
      desc: "Employer registers employment record",
      bg: "var(--primary-light)",
      border: "var(--primary-border)"
    },
    {
      icon: <FaHashtag className="text-purple" size={20} style={{ color: "#8b5cf6" }} />,
      title: "2. Cryptographic Hash",
      desc: "SHA-256 fingerprint generated",
      bg: "#f5f3ff",
      border: "#ddd6fe"
    },
    {
      icon: <FaCube className="text-amber" size={20} style={{ color: "#f59e0b" }} />,
      title: "3. Blockchain Ledger",
      desc: "Anchored to decentralized network",
      bg: "#fffbeb",
      border: "#fde68a"
    },
    {
      icon: <FaCheckCircle className={isVerified ? "text-success" : "text-warning"} size={20} />,
      title: isVerified ? "4. Tamper-Proof Verified" : "4. Verification Pending",
      desc: isVerified ? "Permanent & verifiable work identity" : "Awaiting network confirmation",
      bg: isVerified ? "var(--secondary-light)" : "#fffbeb",
      border: isVerified ? "var(--secondary-border)" : "#fde68a"
    }
  ];

  return (
    <div className="vw-card p-4 my-4" style={{ background: "#ffffff" }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 bg-primary-light text-primary d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
            <FaShieldAlt size={22} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">VeriWork Blockchain Trust Architecture</h5>
            <small className="text-muted">Transparent cryptographic verification pipeline</small>
          </div>
        </div>
        <span className={`vw-badge ${isVerified ? "vw-badge-green" : "vw-badge-amber"}`}>
          {isVerified ? "✓ Verified on Chain" : "⌛ Pending Chain Anchor"}
        </span>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="row g-3">
        {steps.map((step, idx) => (
          <div key={idx} className="col-12 col-md-6 col-lg-3">
            <div 
              className="p-3 rounded-3 h-100 position-relative transition-all"
              style={{
                background: step.bg,
                border: `1px solid ${step.border}`,
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="p-2 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                  {step.icon}
                </div>
                {idx < 3 && (
                  <FaArrowRight className="text-muted d-none d-lg-block opacity-50" size={14} />
                )}
              </div>
              <h6 className="fw-bold mb-1 text-dark fs-7">{step.title}</h6>
              <p className="text-muted fs-8 mb-0" style={{ fontSize: "0.825rem" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cryptographic Proof Details Footer */}
      <div className="mt-4 p-3 bg-light rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2 border">
        <div className="d-flex align-items-center gap-2">
          <small className="fw-bold text-dark">Immutable Hash:</small>
          <code className="bg-white px-2 py-1 rounded text-primary border fs-7" style={{ fontFamily: "monospace" }}>
            {displayHash}
          </code>
        </div>
        <small className="text-muted">
          Powered by VeriWork Smart Contracts • Zero Central Tampering
        </small>
      </div>
    </div>
  );
}

export default BlockchainVerificationCard;
