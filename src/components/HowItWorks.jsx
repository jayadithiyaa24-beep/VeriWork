import { FaUserPlus, FaUserCheck, FaHandshake, FaRupeeSign, FaAward } from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <FaUserPlus size={18} />,
      title: "Worker Registers",
      desc: "Create a digital profile with skills, experience, and privacy-shielded ID.",
    },
    {
      step: "02",
      icon: <FaUserCheck size={18} />,
      title: "Identity is Verified",
      desc: "Verification is performed by employers and securely recorded on blockchain.",
    },
    {
      step: "03",
      icon: <FaHandshake size={18} />,
      title: "Employer Hires",
      desc: "Employers connect with verified workers and create formal employment terms.",
    },
    {
      step: "04",
      icon: <FaRupeeSign size={18} />,
      title: "Payments Recorded",
      desc: "UPI and monthly wage activity updates verified employment history.",
    },
    {
      step: "05",
      icon: <FaAward size={18} />,
      title: "Build Reputation",
      desc: "Ratings and reviews help establish an unalterable, trusted work credential.",
    },
  ];

  return (
    <section id="how-it-works" className="container py-5 my-3">
      
      {/* Section Header */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="veriwork-pill-badge mb-3">
          STEP-BY-STEP PROCESS
        </span>
        <h2 className="display-6 fw-bold mb-2">
          How It Works
        </h2>
        <p className="text-muted lead" style={{ fontSize: "1.05rem" }}>
          A simple and transparent process for everyone.
        </p>
      </div>

      {/* 5-Step Horizontal Flow on Desktop, Vertical on Mobile */}
      <div className="row g-3 justify-content-center">
        {steps.map((item, index) => (
          <div className="col-lg col-md-6 col-12" key={index} style={{ minWidth: "200px" }}>
            <div className="veriwork-card p-4 h-100 text-start d-flex flex-column position-relative">
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="vw-step-number">
                  {item.step}
                </div>
                <div className="vw-step-icon text-muted">
                  {item.icon}
                </div>
              </div>

              <h5 className="fw-bold text-dark mb-2 fs-6">
                {item.title}
              </h5>

              <p className="text-muted small mb-0 flex-grow-1" style={{ lineHeight: "1.6", fontSize: "0.83rem" }}>
                {item.desc}
              </p>

            </div>
          </div>
        ))}
      </div>

      <style>{`
        .vw-step-number {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--color-primary-dark);
          background-color: var(--color-primary-light);
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vw-step-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background-color: var(--color-surface-tint);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .max-w-700 {
          max-width: 650px;
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;