import { Link } from "react-router-dom";
import { FaShieldAlt, FaIdCard, FaRupeeSign, FaUsers, FaLock, FaCheckCircle, FaAward, FaArrowRight } from "react-icons/fa";

function About() {
  return (
    <div className="vw-about-page py-5">
      <div className="container py-3">

        {/* Hero Section */}
        <div className="text-center max-w-800 mx-auto mb-5 pb-3">
          <span className="veriwork-pill-sage mb-3">
            ABOUT VERIWORK
          </span>
          <h1 className="display-4 fw-bold text-dark mb-3">
            Building a safer, more transparent work environment for informal workers.
          </h1>
          <p className="lead text-muted" style={{ fontSize: "1.15rem" }}>
            VeriWork bridges the gap between millions of informal domestic professionals and institutional trust through privacy-preserving digital identity and cryptographic proof.
          </p>
        </div>

        {/* The Problem Section */}
        <div className="row g-4 align-items-center mb-5 pb-4">
          <div className="col-lg-6">
            <span className="veriwork-pill-badge mb-2">
              THE PROBLEM
            </span>
            <h2 className="display-6 fw-bold text-dark mb-3">
              Millions of domestic workers lack recognized proof of experience.
            </h2>
            <p className="text-muted" style={{ lineHeight: "1.8" }}>
              In India, over 50 million domestic workers (cooks, housekeepers, drivers, and caregivers) operate without written contracts, standardized credentials, or verifiable salary history.
            </p>
            <div className="d-flex flex-column gap-3 mt-4">
              <div className="d-flex align-items-start gap-3">
                <div className="icon-box-gold flex-shrink-0" style={{ width: "36px", height: "36px" }}>
                  <FaIdCard size={16} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Lack of Portable Identity</h6>
                  <p className="small text-muted mb-0">Experience is lost when moving to new households or cities without written references.</p>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="icon-box-gold flex-shrink-0" style={{ width: "36px", height: "36px" }}>
                  <FaRupeeSign size={16} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Financial Exclusion</h6>
                  <p className="small text-muted mb-0">Banks and insurers cannot verify irregular cash payments, blocking access to micro-credit.</p>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="icon-box-gold flex-shrink-0" style={{ width: "36px", height: "36px" }}>
                  <FaLock size={16} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Privacy Vulnerabilities</h6>
                  <p className="small text-muted mb-0">Workers frequently hand over unmasked photocopies of Aadhaar cards with no data protection.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="veriwork-card-tint p-4 p-md-5">
              <div className="row g-3">
                <div className="col-6">
                  <div className="veriwork-card p-4 text-center h-100">
                    <div className="display-5 fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>50M+</div>
                    <div className="small text-muted">Informal Domestic Workers</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="veriwork-card p-4 text-center h-100">
                    <div className="display-5 fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>&lt;5%</div>
                    <div className="small text-muted">Have Written Contracts</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="veriwork-card p-4 text-center h-100">
                    <div className="display-5 fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>0</div>
                    <div className="small text-muted">Standard Portability Today</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="veriwork-card p-4 text-center h-100">
                    <div className="display-5 fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>100%</div>
                    <div className="small text-muted">Need for Verified Trust</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Solution Section */}
        <div className="veriwork-card p-4 p-md-5 mb-5">
          <div className="text-center max-w-700 mx-auto mb-4">
            <span className="veriwork-pill-sage mb-2">
              OUR SOLUTION
            </span>
            <h2 className="display-6 fw-bold text-dark mb-2">
              Verifiable work records owned by the worker.
            </h2>
            <p className="text-muted">
              VeriWork provides a decentralized work identity where every employment contract, wage entry, and mutual rating is permanently verifiable.
            </p>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="veriwork-card-tint p-4 h-100 text-start">
                <div className="icon-box-sage mb-3">
                  <FaIdCard size={20} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Self-Sovereign Profile</h5>
                <p className="small text-muted mb-0">
                  Workers carry their complete employment history on their phone via verifiable digital credentials and downloadable vector PDFs.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="veriwork-card-tint p-4 h-100 text-start">
                <div className="icon-box-sage mb-3">
                  <FaShieldAlt size={20} />
                </div>
                <h5 className="fw-bold text-dark mb-2">On-Chain Consensus</h5>
                <p className="small text-muted mb-0">
                  Certificates are SHA-256 hashed and anchored to the Ethereum EVM smart contract, ensuring no past work record can be deleted or forged.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="veriwork-card-tint p-4 h-100 text-start">
                <div className="icon-box-sage mb-3">
                  <FaAward size={20} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Merit-Based Ratings</h5>
                <p className="small text-muted mb-0">
                  Employers and workers submit mutual evaluations with duplicate locks, building a permanent reputation score.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How Technology Helps */}
        <div className="row g-4 align-items-center mb-5 pb-4">
          <div className="col-lg-6">
            <span className="veriwork-pill-badge mb-2">
              HOW TECHNOLOGY HELPS
            </span>
            <h2 className="display-6 fw-bold text-dark mb-3">
              Cryptographic integrity without compromising personal privacy.
            </h2>
            <p className="text-muted" style={{ lineHeight: "1.8" }}>
              VeriWork uses a dual-layer architecture: off-chain database storage for operational responsiveness, paired with on-chain Ethereum EVM smart contracts for cryptographic anchoring.
            </p>
            <ul className="list-unstyled d-flex flex-column gap-2 mt-3">
              <li className="d-flex align-items-center gap-2 text-dark small fw-semibold">
                <FaCheckCircle className="text-success" />
                <span>Zero-Knowledge PII Shield: Aadhaar is salted and hashed via SHA-256</span>
              </li>
              <li className="d-flex align-items-center gap-2 text-dark small fw-semibold">
                <FaCheckCircle className="text-success" />
                <span>EVM Smart Contract: VeriWorkCertificate.sol permanently stores hashes</span>
              </li>
              <li className="d-flex align-items-center gap-2 text-dark small fw-semibold">
                <FaCheckCircle className="text-success" />
                <span>Instant Tamper Detection: Compares database state against on-chain block hash</span>
              </li>
              <li className="d-flex align-items-center gap-2 text-dark small fw-semibold">
                <FaCheckCircle className="text-success" />
                <span>QR Verification Portal: Anyone can verify certificate validity in seconds</span>
              </li>
            </ul>
          </div>

          <div className="col-lg-6">
            <div className="veriwork-card-dark p-4 p-md-5 text-start">
              <h4 className="fw-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                Our Vision
              </h4>
              <p className="text-white-50" style={{ lineHeight: "1.8" }}>
                We envision an informal labor market where domestic workers have the same dignity, credential portability, and financial access as corporate employees.
              </p>
              <p className="text-white-50 mb-4" style={{ lineHeight: "1.8" }}>
                By establishing decentralized proof of work experience, we transform domestic work from unrecorded, invisible labor into documented, respected careers.
              </p>
              <Link to="/get-started" className="btn-veriwork-accent py-2 px-4 text-sm">
                <span>Join the Movement</span>
                <FaArrowRight size={11} className="ms-2" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .max-w-700 { max-width: 650px; }
        .max-w-800 { max-width: 800px; }
      `}</style>
    </div>
  );
}

export default About;