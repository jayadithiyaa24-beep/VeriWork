import { FaIdCard, FaShieldAlt, FaRupeeSign, FaStar } from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaIdCard size={22} />,
      iconClass: "icon-box-sage",
      title: "Digital Identity",
      description: "Create a verifiable worker profile with skills, experience, and privacy-shielded credentials.",
    },
    {
      icon: <FaShieldAlt size={22} />,
      iconClass: "icon-box-gold",
      title: "Secure Verification",
      description: "Employer verification and trusted records secured through immutable blockchain technology.",
    },
    {
      icon: <FaRupeeSign size={22} />,
      iconClass: "icon-box-sage",
      title: "Payment Tracking",
      description: "UPI payments and verified monthly salary history recorded transparently for financial inclusion.",
    },
    {
      icon: <FaStar size={22} />,
      iconClass: "icon-box-gold",
      title: "Ratings & Reviews",
      description: "Build lasting credibility through genuine, anti-tamper employer evaluations and merit scores.",
    },
  ];

  return (
    <section id="features" className="container py-5 my-3">
      
      {/* Section Header */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="veriwork-pill-sage mb-3">
          WHY VERIWORK?
        </span>
        <h2 className="display-6 fw-bold mb-2">
          Simple solutions for real problems.
        </h2>
        <p className="text-muted lead" style={{ fontSize: "1.05rem" }}>
          Informal workers face lack of identity and portable proof. VeriWork solves this with verifiable records.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="row g-4">
        {features.map((feature, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className="veriwork-card veriwork-card-interactive p-4 h-100 d-flex flex-column text-start">
              
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