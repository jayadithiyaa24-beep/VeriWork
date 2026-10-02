import { FaIdCard, FaShieldAlt, FaRupeeSign, FaStar } from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaIdCard size={22} />,
      iconClass: "mockup-icon-circle-sage",
      title: "Digital Identity",
      description: "Create a verifiable work profile with skills and experience.",
    },
    {
      icon: <FaShieldAlt size={22} />,
      iconClass: "mockup-icon-circle-sage",
      title: "Secure Verification",
      description: "Employer verification and trusted records on blockchain.",
    },
    {
      icon: <FaRupeeSign size={22} />,
      iconClass: "mockup-icon-circle-sage",
      title: "Payment Tracking",
      description: "UPI payments recorded securely with full transparency.",
    },
    {
      icon: <FaStar size={22} />,
      iconClass: "mockup-icon-circle-ochre",
      title: "Ratings & Reviews",
      description: "Build trust through genuine employer ratings.",
    },
  ];

  return (
    <section id="features" className="container py-5 my-3">
      
      {/* Section Header */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <h2 className="display-6 fw-bold text-dark mb-2" style={{ fontFamily: "var(--font-serif)" }}>
          Why VeriWork?
        </h2>
        <p className="text-muted" style={{ fontSize: "1.05rem" }}>
          Simple solutions for real problems
        </p>
      </div>

      {/* 4 Mockup Cards */}
      <div className="row g-4">
        {features.map((feature, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className="mockup-card mockup-card-interactive p-4 h-100 d-flex flex-column text-start">
              
              <div className="mb-4">
                <div className={feature.iconClass}>
                  {feature.icon}
                </div>
              </div>

              <h4 className="fw-bold text-dark mb-2 fs-5">
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
        .max-w-700 {
          max-width: 650px;
        }
      `}</style>
    </section>
  );
}

export default Features;