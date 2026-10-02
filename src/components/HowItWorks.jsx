import { FaHome, FaShieldAlt, FaUserTie, FaReceipt, FaStar, FaArrowRight } from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <FaHome size={18} />,
      title: "Worker Registers",
      desc: "Create a digital profile with skills and experience.",
    },
    {
      step: "02",
      icon: <FaShieldAlt size={18} />,
      title: "Identity is Verified",
      desc: "Verification by employers and secure blockchain storage.",
    },
    {
      step: "03",
      icon: <FaUserTie size={18} />,
      title: "Employer Hires",
      desc: "Connect with verified workers.",
    },
    {
      step: "04",
      icon: <FaReceipt size={18} />,
      title: "Payments Recorded",
      desc: "UPI payments automatically update work history.",
    },
    {
      step: "05",
      icon: <FaStar size={18} />,
      title: "Build Reputation",
      desc: "Collect ratings and build a trusted profile.",
    },
  ];

  return (
    <section id="how-it-works" className="container py-5 my-3">
      
      {/* Section Header */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <h2 className="display-6 fw-bold text-dark mb-2" style={{ fontFamily: "var(--font-serif)" }}>
          How It Works
        </h2>
        <p className="text-muted" style={{ fontSize: "1.05rem" }}>
          A simple and transparent process for everyone
        </p>
      </div>

      {/* Horizontal Steps with Connecting Arrows */}
      <div className="d-flex flex-wrap justify-content-center align-items-start gap-2 gap-lg-3 vw-steps-flow">
        {steps.map((item, index) => (
          <div key={index} className="d-flex align-items-center">
            
            {/* Step Card */}
            <div className="text-center vw-step-item">
              <div className="vw-step-icon-circle mx-auto mb-3">
                {item.icon}
              </div>

              <div className="fw-bold text-dark mb-1 small">
                {item.step}
              </div>

              <h6 className="fw-bold text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                {item.title}
              </h6>

              <p className="text-muted small mb-0 vw-step-desc">
                {item.desc}
              </p>
            </div>

            {/* Connecting Arrow between steps (except last) */}
            {index < steps.length - 1 && (
              <div className="d-none d-lg-flex align-items-center px-2 text-muted opacity-50 vw-step-arrow">
                <FaArrowRight size={14} />
              </div>
            )}

          </div>
        ))}
      </div>

      <style>{`
        .vw-step-item {
          width: 195px;
          padding: 10px;
        }

        .vw-step-icon-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background-color: var(--color-forest-light);
          color: var(--color-forest);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .vw-step-item:hover .vw-step-icon-circle {
          transform: scale(1.08);
          background-color: #D3DFD3;
        }

        .vw-step-desc {
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .vw-step-arrow {
          margin-top: -40px;
        }

        .max-w-700 {
          max-width: 650px;
        }

        @media (max-width: 991px) {
          .vw-step-item {
            width: 100%;
            max-width: 280px;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;