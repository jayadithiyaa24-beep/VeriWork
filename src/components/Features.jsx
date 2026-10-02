import { FaIdCard, FaShieldAlt, FaMoneyCheckAlt, FaStar } from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaIdCard size={28} />,
      iconClass: "vw-feat-icon-cyan",
      badge: "DECENTRALIZED DID",
      title: "Self-Sovereign Identity",
      description:
        "Every domestic worker receives a cryptographically signed digital work passport, fully owned and controlled by them.",
    },
    {
      icon: <FaShieldAlt size={28} />,
      iconClass: "vw-feat-icon-indigo",
      badge: "EVM SMART CONTRACT",
      title: "Tamper-Proof Verification",
      description:
        "Employment contracts and certificates are SHA-256 hashed and anchored on-chain, rendering unauthorized modification mathematically impossible.",
    },
    {
      icon: <FaMoneyCheckAlt size={28} />,
      iconClass: "vw-feat-icon-emerald",
      badge: "FINANCIAL INCLUSION",
      title: "Verifiable Salary Ledger",
      description:
        "Transparent, verified income records empower workers to qualify for micro-loans, insurance, banking, and housing without physical paperwork.",
    },
    {
      icon: <FaStar size={28} />,
      iconClass: "vw-feat-icon-amber",
      badge: "REPUTATION PROTOCOL",
      title: "Bidirectional Ratings",
      description:
        "Mutual 1-to-5 star evaluations with duplicate-submission guards build an unalterable meritocratic reputation score for both workers and employers.",
    },
  ];

  return (
    <section id="features" className="container py-5 my-4">
      {/* Section Header */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="badge-web3 mb-3">
          ARCHITECTURE HIGHLIGHTS
        </span>
        <h2 className="display-6 fw-bold text-white">
          Engineered for <span className="text-gradient-primary">Unconditional Trust</span>
        </h2>
        <p className="text-muted mt-2">
          Bridging the gap between the informal gig economy and institutional trust through dual-layer off-chain storage and on-chain consensus.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="row g-4">
        {features.map((feature, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className="glass-card glass-card-interactive p-4 h-100 d-flex flex-column text-start">
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className={`vw-feat-icon-wrapper ${feature.iconClass}`}>
                  {feature.icon}
                </div>
                <span className="badge-web3 py-1 px-2" style={{ fontSize: "0.68rem" }}>
                  {feature.badge}
                </span>
              </div>

              <h4 className="fw-bold text-white mb-2 fs-5">
                {feature.title}
              </h4>

              <p className="text-muted small flex-grow-1 mb-0" style={{ lineHeight: "1.7" }}>
                {feature.description}
              </p>

            </div>
          </div>
        ))}
      </div>

      <style>{`
        .vw-feat-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .glass-card-interactive:hover .vw-feat-icon-wrapper {
          transform: scale(1.1);
        }

        .vw-feat-icon-cyan {
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #06b6d4;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
        }

        .vw-feat-icon-indigo {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.35);
          color: #818cf8;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
        }

        .vw-feat-icon-emerald {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #10b981;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
        }

        .vw-feat-icon-amber {
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fbbf24;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
        }

        .max-w-700 {
          max-width: 700px;
        }
      `}</style>
    </section>
  );
}

export default Features;