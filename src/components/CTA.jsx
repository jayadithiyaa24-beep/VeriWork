import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function CTA() {
  return (
    <section className="container py-5 my-3">
      <div className="veriwork-card-dark p-4 p-md-5 text-center text-md-start position-relative overflow-hidden">
        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          
          <div className="col-md-8">
            <span className="veriwork-pill-badge mb-3 bg-white text-dark border-0">
              SOCIAL IMPACT & TRUST
            </span>
            <h2 className="display-6 fw-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              Empowering Domestic Workers <br />Through Trust and Technology
            </h2>
            <p className="lead mb-0 text-white-50" style={{ fontSize: "1.1rem" }}>
              Build a verified identity. Create trusted work relationships.
            </p>
          </div>

          <div className="col-md-4 mt-4 mt-md-0 text-md-end">
            <Link to="/get-started" className="btn-veriwork-accent py-3 px-4">
              <span>Get Started</span>
              <FaArrowRight size={13} className="ms-2" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CTA;