import React from "react";
import { FaCheckCircle, FaIdCard, FaShieldAlt, FaQrcode, FaWallet, FaTools, FaBriefcase } from "react-icons/fa";

function DigitalIdentityCard({ worker }) {
  if (!worker) return null;

  const maskedAadhaar = worker.aadhaar
    ? `XXXX-XXXX-${worker.aadhaar.slice(-4)}`
    : "Verified ID";

  const skillsList = worker.skills
    ? worker.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Domestic Helper", "VeriWork Verified"];

  return (
    <div className="vw-card p-0 shadow-lg position-relative overflow-hidden style-card" style={{ maxWidth: "480px", margin: "0 auto", borderRadius: "20px" }}>
      {/* Card Header Background */}
      <div 
        className="p-4 text-white position-relative"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div 
              className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "36px", height: "36px", fontSize: "18px" }}
            >
              V
            </div>
            <span className="fw-bold fs-5 tracking-wide">VeriWork ID</span>
          </div>
          <span className="badge bg-emerald-500 text-white bg-success px-3 py-2 rounded-pill d-flex align-items-center gap-1 shadow-sm fs-7">
            <FaCheckCircle color="#fff" size={13} /> VERIFIED IDENTITY
          </span>
        </div>

        {/* Profile Identity Block */}
        <div className="d-flex align-items-center gap-3 mt-3">
          <div 
            className="rounded-circle border border-3 border-white shadow bg-light text-primary d-flex align-items-center justify-content-center fw-bold fs-2"
            style={{ width: "72px", height: "72px", flexShrink: 0 }}
          >
            {worker.fullName ? worker.fullName.charAt(0).toUpperCase() : "W"}
          </div>
          <div>
            <h4 className="text-white fw-bold mb-1">{worker.fullName || "Registered Worker"}</h4>
            <div className="text-white-50 fs-7 d-flex align-items-center gap-2">
              <FaIdCard /> ID: <code className="text-white bg-white-20 px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>VW-8921-{worker._id ? worker._id.slice(-4) : "8812"}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 bg-white">
        <div className="row g-3 mb-3">
          <div className="col-6">
            <div className="p-2.5 rounded-3 bg-light border border-light">
              <small className="text-muted d-block mb-1 fs-7">Aadhaar Status</small>
              <span className="fw-semibold text-dark fs-7 d-flex align-items-center gap-1">
                <FaShieldAlt className="text-primary" /> {maskedAadhaar}
              </span>
            </div>
          </div>
          <div className="col-6">
            <div className="p-2.5 rounded-3 bg-light border border-light">
              <small className="text-muted d-block mb-1 fs-7">Experience</small>
              <span className="fw-semibold text-dark fs-7 d-flex align-items-center gap-1">
                <FaBriefcase className="text-success" /> {worker.experience || "0"} Years
              </span>
            </div>
          </div>
        </div>

        {/* Skills Pills */}
        <div className="mb-3">
          <small className="text-muted d-block mb-2 fs-7 fw-medium d-flex align-items-center gap-1">
            <FaTools className="text-primary" /> Verified Skills & Qualifications
          </small>
          <div className="d-flex flex-wrap gap-1.5">
            {skillsList.map((skill, index) => (
              <span key={index} className="vw-badge vw-badge-blue">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Wallet Address & Security Code */}
        <div className="p-3 rounded-3 bg-slate-50 border border-slate-200 d-flex align-items-center justify-content-between mt-3" style={{ background: "#f8fafc" }}>
          <div>
            <small className="text-muted d-block fs-8 fw-semibold text-uppercase">Blockchain Ledger</small>
            <div className="text-dark fw-mono fs-7 text-truncate style-mono" style={{ maxWidth: "240px", fontFamily: "monospace" }}>
              <FaWallet className="me-1 text-primary" />
              {worker.walletAddress ? `${worker.walletAddress.slice(0, 8)}...${worker.walletAddress.slice(-6)}` : "Verified Cryptographic Ledger"}
            </div>
          </div>
          <div className="text-end">
            <FaQrcode size={36} className="text-dark opacity-75" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitalIdentityCard;
