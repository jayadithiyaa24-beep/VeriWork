import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAdminOverview,
  getAdminIssuers,
  authorizeAdminIssuer,
  revokeAdminIssuer,
  getAdminCertificates,
  inspectBlockchainCertificate,
} from "../services/adminService";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("issuers"); // 'issuers' | 'ledger'
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [contractInfo, setContractInfo] = useState(null);
  const [issuers, setIssuers] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Manual Issuer Authorization input
  const [manualWallet, setManualWallet] = useState("");
  const [authorizingWallet, setAuthorizingWallet] = useState(false);
  const [processingIssuerId, setProcessingIssuerId] = useState(null);

  // Inspection modal
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectionData, setInspectionData] = useState(null);

  // Load all admin data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [overviewRes, issuersRes, certsRes] = await Promise.all([
        getAdminOverview(),
        getAdminIssuers(),
        getAdminCertificates(),
      ]);

      if (overviewRes.success) {
        setStats(overviewRes.stats);
        setContractInfo(overviewRes.contractInfo);
      }
      if (issuersRes.success) {
        setIssuers(issuersRes.issuers);
      }
      if (certsRes.success) {
        setCertificates(certsRes.certificates);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      toast.error("Failed to load platform administration data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handle manual wallet authorization
  const handleAuthorizeManualWallet = async (e) => {
    e.preventDefault();
    if (!manualWallet.trim()) return;

    try {
      setAuthorizingWallet(true);
      toast.info("Sending transaction to Ethereum Smart Contract...");

      const response = await authorizeAdminIssuer({
        walletAddress: manualWallet.trim(),
      });

      toast.success(response.message || "Wallet authorized as certificate issuer! ✓");
      setManualWallet("");
      await loadAdminData();
    } catch (err) {
      console.error("Authorize Error:", err);
      toast.error(err.response?.data?.message || "Failed to authorize wallet");
    } finally {
      setAuthorizingWallet(false);
    }
  };

  // Handle row authorization
  const handleAuthorizeIssuer = async (issuer) => {
    if (!issuer.walletAddress) {
      toast.error("Employer has no wallet address configured yet.");
      return;
    }

    try {
      setProcessingIssuerId(issuer._id);
      toast.info(`Authorizing ${issuer.employerName}'s wallet on smart contract...`);

      const response = await authorizeAdminIssuer({
        walletAddress: issuer.walletAddress,
        employerId: issuer._id,
      });

      toast.success(response.message || "Issuer authorized on-chain! ✓");
      await loadAdminData();
    } catch (err) {
      console.error("Authorization Error:", err);
      toast.error(err.response?.data?.message || "Failed to authorize issuer");
    } finally {
      setProcessingIssuerId(null);
    }
  };

  // Handle row revocation
  const handleRevokeIssuer = async (issuer) => {
    if (!window.confirm(`Revoke smart contract issuer permissions for ${issuer.employerName}?`)) {
      return;
    }

    try {
      setProcessingIssuerId(issuer._id);
      toast.info(`Revoking on-chain issuer rights for ${issuer.employerName}...`);

      const response = await revokeAdminIssuer({
        walletAddress: issuer.walletAddress,
        employerId: issuer._id,
      });

      toast.success(response.message || "Issuer permissions revoked on-chain! ✓");
      await loadAdminData();
    } catch (err) {
      console.error("Revocation Error:", err);
      toast.error(err.response?.data?.message || "Failed to revoke issuer");
    } finally {
      setProcessingIssuerId(null);
    }
  };

  // Inspect on-chain certificate
  const handleInspectCertificate = async (certificateId) => {
    try {
      setInspectModalOpen(true);
      setInspectLoading(true);
      setInspectionData(null);

      const response = await inspectBlockchainCertificate(certificateId);
      setInspectionData(response);
    } catch (err) {
      console.error("Inspect Error:", err);
      toast.error("Failed to inspect blockchain certificate");
      setInspectModalOpen(false);
    } finally {
      setInspectLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.info(`Copied ${label} to clipboard!`);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <div
      className="admin-dashboard-wrapper py-5"
      style={{
        background: "#0b1329",
        minHeight: "100vh",
        color: "#f1f5f9",
      }}
    >
      <div className="container">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25 gap-3">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-25 border border-primary border-opacity-50 text-info small mb-2">
              <span className="spinner-grow spinner-grow-sm text-info" role="status"></span>
              Smart Contract Authority Protocol v2.0
            </div>
            <h2 className="fw-bold text-light mb-1">
              ⚙️ VeriWork Protocol Administration & Governance
            </h2>
            <p className="text-muted mb-0 small">
              Smart contract issuer authorization, decentralized ledger audit & system parameters.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-info btn-sm px-3"
              onClick={loadAdminData}
              disabled={loading}
            >
              🔄 Refresh Data
            </button>
            <Link to="/" className="btn btn-outline-secondary btn-sm px-3">
              🏠 Home
            </Link>
          </div>
        </div>

        {/* ================================= */}
        {/* CONTRACT INFO STRIP */}
        {/* ================================= */}
        <div
          className="card border-0 rounded-4 p-3 mb-4 font-monospace small"
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          }}
        >
          <div className="row g-2 align-items-center text-truncate">
            <div className="col-md-5">
              <span className="text-muted d-block">⛓️ SMART CONTRACT ADDRESS:</span>
              <span
                className="text-info fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => copyToClipboard(contractInfo?.address, "Contract Address")}
                title="Click to copy"
              >
                {contractInfo?.address} 📋
              </span>
            </div>
            <div className="col-md-4">
              <span className="text-muted d-block">👑 PROTOCOL OWNER SIGNER:</span>
              <span
                className="text-warning fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => copyToClipboard(contractInfo?.ownerAddress, "Owner Address")}
                title="Click to copy"
              >
                {contractInfo?.ownerAddress} 📋
              </span>
            </div>
            <div className="col-md-3 text-md-end">
              <span className="text-muted d-block">NETWORK NODE:</span>
              <span className="text-success fw-bold">● {contractInfo?.network || "Local EVM 31337"}</span>
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* METRICS OVERVIEW */}
        {/* ================================= */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div
              className="card border-0 rounded-4 p-3 h-100"
              style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted fw-bold">DOMESTIC WORKERS</small>
                  <h3 className="fw-bold text-light mb-0 mt-1">{stats?.totalWorkers ?? 0}</h3>
                  <small className="text-info">Privacy Shield Protected</small>
                </div>
                <span className="fs-1">👷</span>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div
              className="card border-0 rounded-4 p-3 h-100"
              style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted fw-bold">REGISTERED EMPLOYERS</small>
                  <h3 className="fw-bold text-light mb-0 mt-1">{stats?.totalEmployers ?? 0}</h3>
                  <small className="text-success">Verified Issuers</small>
                </div>
                <span className="fs-1">🏢</span>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div
              className="card border-0 rounded-4 p-3 h-100"
              style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted fw-bold">EMPLOYMENT CONTRACTS</small>
                  <h3 className="fw-bold text-light mb-0 mt-1">{stats?.totalEmployments ?? 0}</h3>
                  <small className="text-warning">
                    {stats?.activeEmployments ?? 0} Active / {stats?.completedEmployments ?? 0} Finalized
                  </small>
                </div>
                <span className="fs-1">📝</span>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div
              className="card border-0 rounded-4 p-3 h-100"
              style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted fw-bold">ON-CHAIN CERTIFICATES</small>
                  <h3 className="fw-bold text-success mb-0 mt-1">
                    {stats?.verifiedCertificates ?? 0} / {stats?.totalCertificates ?? 0}
                  </h3>
                  <small className="text-info">{stats?.verificationRate ?? 0}% Anchored on Ledger</small>
                </div>
                <span className="fs-1">📜</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* NAVIGATION TABS */}
        {/* ================================= */}
        <div className="d-flex gap-2 border-bottom border-secondary border-opacity-25 mb-4">
          <button
            className={`btn pb-3 px-4 rounded-0 fw-semibold ${
              activeTab === "issuers"
                ? "text-primary border-bottom border-primary border-3"
                : "text-muted"
            }`}
            onClick={() => setActiveTab("issuers")}
            style={{ background: "transparent" }}
          >
            🏛️ Issuer Authorization & Governance ({issuers.length})
          </button>
          <button
            className={`btn pb-3 px-4 rounded-0 fw-semibold ${
              activeTab === "ledger"
                ? "text-primary border-bottom border-primary border-3"
                : "text-muted"
            }`}
            onClick={() => setActiveTab("ledger")}
            style={{ background: "transparent" }}
          >
            ⛓️ Decentralized Blockchain Ledger ({certificates.length})
          </button>
        </div>

        {/* ================================= */}
        {/* TAB 1: ISSUER GOVERNANCE */}
        {/* ================================= */}
        {activeTab === "issuers" && (
          <div>
            {/* Direct Wallet Authorize Box */}
            <div
              className="card border-0 rounded-4 p-4 mb-4"
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h5 className="fw-bold text-light mb-1">
                ✍️ Authorize Arbitrary Employer Wallet on Smart Contract
              </h5>
              <p className="text-muted small mb-3">
                Grant permission to any Ethereum wallet address to mint and register work certificates on-chain.
              </p>
              <form onSubmit={handleAuthorizeManualWallet}>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-muted">
                    0x
                  </span>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary font-monospace"
                    placeholder="Enter Ethereum Wallet Address (0x...)"
                    value={manualWallet}
                    onChange={(e) => setManualWallet(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary fw-semibold px-4"
                    disabled={authorizingWallet}
                  >
                    {authorizingWallet ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Authorizing On-Chain...
                      </>
                    ) : (
                      "Authorize as Issuer ✓"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Issuers Table */}
            <div
              className="card border-0 rounded-4 p-4"
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h5 className="fw-bold text-light mb-3">Registered Employers & Issuer Status</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary text-uppercase small text-dark">
                    <tr>
                      <th>Employer Name</th>
                      <th>Email / Contact</th>
                      <th>Wallet Address</th>
                      <th>Smart Contract Status</th>
                      <th>Issued Certs</th>
                      <th className="text-end">Governance Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No employers registered in the platform yet.
                        </td>
                      </tr>
                    ) : (
                      issuers.map((emp) => (
                        <tr key={emp._id}>
                          <td className="fw-bold text-light">{emp.employerName}</td>
                          <td className="small text-muted">
                            <div>{emp.email}</div>
                            <div>{emp.phone}</div>
                          </td>
                          <td className="font-monospace small">
                            {emp.walletAddress ? (
                              <span
                                style={{ cursor: "pointer", color: "#38bdf8" }}
                                onClick={() => copyToClipboard(emp.walletAddress, "Wallet Address")}
                                title="Click to copy"
                              >
                                {emp.walletAddress.slice(0, 10)}...{emp.walletAddress.slice(-6)} 📋
                              </span>
                            ) : (
                              <span className="text-muted fst-italic">No Wallet Linked</span>
                            )}
                          </td>
                          <td>
                            {emp.isAuthorizedOnChain ? (
                              <span className="badge bg-success px-3 py-2">
                                ✓ Authorized Issuer
                              </span>
                            ) : emp.walletAddress ? (
                              <span className="badge bg-warning text-dark px-3 py-2">
                                ⏳ Not Authorized
                              </span>
                            ) : (
                              <span className="badge bg-secondary px-3 py-2">
                                ○ Unlinked Wallet
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="fw-bold text-info">
                              {emp.verifiedCertificates} / {emp.totalCertificates}
                            </span>
                          </td>
                          <td className="text-end">
                            {emp.walletAddress ? (
                              emp.isAuthorizedOnChain ? (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleRevokeIssuer(emp)}
                                  disabled={processingIssuerId === emp._id}
                                >
                                  {processingIssuerId === emp._id ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    "Revoke Permissions"
                                  )}
                                </button>
                              ) : (
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => handleAuthorizeIssuer(emp)}
                                  disabled={processingIssuerId === emp._id}
                                >
                                  {processingIssuerId === emp._id ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    "Authorize on Chain ✓"
                                  )}
                                </button>
                              )
                            ) : (
                              <small className="text-muted">Awaiting Employer Wallet</small>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================= */}
        {/* TAB 2: BLOCKCHAIN AUDIT LEDGER */}
        {/* ================================= */}
        {activeTab === "ledger" && (
          <div
            className="card border-0 rounded-4 p-4"
            style={{
              background: "rgba(30, 41, 59, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold text-light mb-1">
                  Decentralized Work Credential Audit Ledger
                </h5>
                <p className="text-muted small mb-0">
                  Real-time blockchain transactions, cryptographic digests, and on-chain verification states.
                </p>
              </div>
              <span className="badge bg-info text-dark px-3 py-2">
                Total Minted: {certificates.length}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead className="table-secondary text-uppercase small text-dark">
                  <tr>
                    <th>Certificate ID</th>
                    <th>Worker</th>
                    <th>Employer</th>
                    <th>Job Role</th>
                    <th>SHA-256 Digest</th>
                    <th>Blockchain Status</th>
                    <th className="text-end">Verification & Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No certificates recorded yet.
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert) => (
                      <tr key={cert._id}>
                        <td className="font-monospace fw-bold text-primary">
                          {cert.certificateId}
                        </td>
                        <td className="fw-semibold text-light">{cert.workerName}</td>
                        <td className="text-slate-300">{cert.employerName}</td>
                        <td>{cert.jobRole}</td>
                        <td className="font-monospace small">
                          {cert.blockchainHash ? (
                            <span
                              style={{ cursor: "pointer", color: "#38bdf8" }}
                              onClick={() => copyToClipboard(cert.blockchainHash, "SHA-256 Digest")}
                              title="Click to copy"
                            >
                              {cert.blockchainHash.slice(0, 10)}...{cert.blockchainHash.slice(-6)} 📋
                            </span>
                          ) : (
                            <span className="text-muted">Pending</span>
                          )}
                        </td>
                        <td>
                          {cert.verificationStatus === "Verified" ? (
                            <span className="badge bg-success px-2 py-1">
                              ✓ 100% On-Chain Match
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark px-2 py-1">
                              ⏳ Pending Confirmation
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-info"
                              onClick={() => handleInspectCertificate(cert.certificateId)}
                              title="Query smart contract directly"
                            >
                              🔍 Inspect
                            </button>
                            <a
                              href={`http://localhost:5000/api/certificates/download-pdf/${encodeURIComponent(
                                cert.certificateId
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-success"
                              title="Download official PDF credential"
                            >
                              📥 PDF
                            </a>
                            <Link
                              to={`/verify-certificate?id=${encodeURIComponent(cert.certificateId)}`}
                              target="_blank"
                              className="btn btn-outline-primary"
                              title="Open public verification page"
                            >
                              🔗 Portal
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================= */}
        {/* INSPECT BLOCKCHAIN MODAL */}
        {/* ================================= */}
        {inspectModalOpen && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(5px)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div
                className="modal-content border-0 rounded-4 text-light"
                style={{
                  background: "#0f172a",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                }}
              >
                <div className="modal-header border-secondary border-opacity-25">
                  <h5 className="modal-title fw-bold text-info">
                    🔍 On-Chain Smart Contract Audit Inspector
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setInspectModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {inspectLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-info" role="status"></div>
                      <p className="mt-2 text-muted">Reading raw storage from smart contract...</p>
                    </div>
                  ) : inspectionData ? (
                    <div>
                      {/* Status banner */}
                      <div
                        className={`p-3 rounded-3 mb-3 d-flex align-items-center gap-3 ${
                          inspectionData.hashMatches && inspectionData.registeredOnChain
                            ? "bg-success bg-opacity-25 border border-success text-success"
                            : "bg-warning bg-opacity-25 border border-warning text-warning"
                        }`}
                      >
                        <span className="fs-3">
                          {inspectionData.hashMatches && inspectionData.registeredOnChain ? "✓" : "⏳"}
                        </span>
                        <div>
                          <h6 className="fw-bold mb-0">
                            {inspectionData.hashMatches && inspectionData.registeredOnChain
                              ? "100% Cryptographic Match On Smart Contract Storage"
                              : "Smart Contract Record Pending or Desynchronized"}
                          </h6>
                          <small>
                            Certificate ID: {inspectionData.databaseRecord?.certificateId}
                          </small>
                        </div>
                      </div>

                      {/* Raw Comparison Grid */}
                      <div className="row g-3 font-monospace small">
                        <div className="col-md-6">
                          <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 h-100">
                            <span className="text-warning fw-bold d-block mb-2">
                              📋 MONGODB DATABASE RECORD
                            </span>
                            <div className="mb-1">
                              <strong>Worker:</strong> {inspectionData.databaseRecord?.workerName}
                            </div>
                            <div className="mb-1">
                              <strong>Employer:</strong> {inspectionData.databaseRecord?.employerName}
                            </div>
                            <div className="mb-1">
                              <strong>Job Role:</strong> {inspectionData.databaseRecord?.jobRole}
                            </div>
                            <div className="mb-1 text-truncate">
                              <strong>SHA-256:</strong> {inspectionData.databaseRecord?.blockchainHash}
                            </div>
                            <div className="mb-1">
                              <strong>Status:</strong> {inspectionData.databaseRecord?.verificationStatus}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 h-100">
                            <span className="text-info fw-bold d-block mb-2">
                              ⛓️ ON-CHAIN STORAGE (SMART CONTRACT)
                            </span>
                            <div className="mb-1">
                              <strong>Exists On-Chain:</strong>{" "}
                              {inspectionData.registeredOnChain ? "true (exists = true)" : "false"}
                            </div>
                            <div className="mb-1 text-truncate">
                              <strong>Registered By:</strong>{" "}
                              {inspectionData.onChainRecord?.registeredBy || "N/A"}
                            </div>
                            <div className="mb-1">
                              <strong>Block Time:</strong>{" "}
                              {inspectionData.onChainRecord?.registeredAt
                                ? new Date(inspectionData.onChainRecord.registeredAt * 1000).toLocaleString()
                                : "N/A"}
                            </div>
                            <div className="mb-1 text-truncate">
                              <strong>On-Chain Hash:</strong>{" "}
                              {inspectionData.onChainRecord?.certificateHash || "N/A"}
                            </div>
                            <div className="mb-1">
                              <strong>Hash Match:</strong>{" "}
                              <span className={inspectionData.hashMatches ? "text-success fw-bold" : "text-danger"}>
                                {inspectionData.hashMatches ? "100% MATCH ✓" : "MISMATCH ✕"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted">No inspection data available.</div>
                  )}
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setInspectModalOpen(false)}
                  >
                    Close Inspector
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
