import { FaUserPlus, FaFileSignature, FaStarHalfAlt, FaCube } from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <FaUserPlus />,
      title: "Identity Ingestion",
      desc: "Worker registers with privacy-preserving Aadhaar SHA-256 hash. Zero raw PII is stored.",
      badge: "DID Creation",
    },
    {
      step: "02",
      icon: <FaFileSignature />,
      title: "Employment Term",
      desc: "Employer registers contract with monthly wage, work category, and verified duration.",
      badge: "State Tracking",
    },
    {
      step: "03",
      icon: <FaStarHalfAlt />,
      title: "Mutual Reputation",
      desc: "Upon completion, both parties rate each other with anti-tamper duplicate review prevention.",
      badge: "Consensus",
    },
    {
      step: "04",
      icon: <FaCube />,
      title: "Blockchain Anchor",
      desc: "Certificate SHA-256 hash is permanently mined onto Ethereum EVM with QR code verification.",
      badge: "EVM Ledger",
    },
  ];

  return (
    <section id="how-it-works" className="container py-5 my-4">
      
      {/* Section Header */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="badge-web3 mb-3">
          DECENTRALIZED WORKFLOW
        </span>
        <h2 className="display-6 fw-bold text-white">
          How VeriWork <span className="text-gradient-cyan">Operates</span>
        </h2>
        <p className="text-muted mt-2">
          From initial onboarding to cryptographic on-chain minting in 4 verifiable steps.
        </p>
      </div>

      {/* Step Cards */}
      <div className="row g-4 position-relative">
        {steps.map((item, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className="glass-card p-4 h-100 position-relative text-start d-flex flex-column">
              
              {/* Step Number Backdrop */}
              <div className="vw-step-number-watermark">
                {item.step}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
                <div className="vw-step-icon">
                  {item.icon}
                </div>
                <span className="badge-web3-cyan py-1 px-2" style={{ fontSize: "0.68rem" }}>
                  {item.badge}
                </span>
              </div>

              <h5 className="fw-bold text-white mb-2 position-relative">
                {item.title}
              </h5>

              <p className="text-muted small mb-0 flex-grow-1 position-relative" style={{ lineHeight: "1.6" }}>
                {item.desc}
              </p>

            </div>
          </div>
        ))}
      </div>

      <style>{`
        .vw-step-number-watermark {
          position: absolute;
          top: 10px;
          right: 15px;
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.04);
          user-select: none;
          pointer-events: none;
          line-height: 1;
        }

        .vw-step-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2));
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #67e8f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .max-w-700 {
          max-width: 700px;
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;