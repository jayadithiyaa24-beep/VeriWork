import { FaIdCard, FaShieldAlt, FaMoneyCheckAlt, FaStar } from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaIdCard size={40} className="text-primary mb-3" />,
      title: "Digital Identity",
      description:
        "Every worker receives a secure blockchain-based work identity.",
    },
    {
      icon: <FaShieldAlt size={40} className="text-success mb-3" />,
      title: "Secure Verification",
      description:
        "Employment records are immutable and cannot be altered.",
    },
    {
      icon: <FaMoneyCheckAlt size={40} className="text-warning mb-3" />,
      title: "Salary Tracking",
      description:
        "Monthly salary records are verified and securely stored.",
    },
    {
      icon: <FaStar size={40} className="text-danger mb-3" />,
      title: "Verified Ratings",
      description:
        "Employers provide trusted ratings after employment ends.",
    },
  ];

  return (
    <section id="features" className="container py-5">
      <h2 className="text-center fw-bold mb-5">Key Features</h2>

      <div className="row">
        {features.map((feature, index) => (
          <div className="col-md-6 col-lg-3 mb-4" key={index}>
            <div className="card shadow border-0 h-100 text-center p-4 feature-card">
              {feature.icon}
              <h5>{feature.title}</h5>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;