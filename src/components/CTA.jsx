import { Link } from "react-router-dom";
import { FaUserPlus, FaBuilding, FaArrowRight } from "react-icons/fa";

function CTA() {
  return (
    <section className="container py-5 my-4">
      <div className="vw-cta-card p-4 p-lg-5 text-center text-lg-start position-relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="vw-cta-glow"></div>

        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          
          <div className="col-lg-8">
            <span className="badge-web3 mb-3">
              TRANSFORM THE INFORMAL ECONOMY
            </span>
            <h2 className="display-6 fw-bold text-white mb-2">
              Ready to Join India’s <span className="text-gradient-primary">Digital Workforce</span> Revolution?
            </h2>
            <p className="text-muted lead mb-0" style={{ fontSize: "1.05rem", maxWidth: "600px" }}>
              Issue tamper-proof certificates, verify domestic employment histories, and build a lasting reputation on Ethereum.
            </p>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0 text-lg-end">
            <div className="d-flex flex-column flex-sm-row flex-lg-column gap-2 justify-content-center justify-content-lg-end">
              <Link to="/register-worker" className="btn-web3-primary py-3 px-4">
                <FaUserPlus className="me-2" />
                Register as Worker
                <FaArrowRight className="ms-2 small opacity-75" />
              </Link>
              <Link to="/register-employer" className="btn-web3-outline py-3 px-4">
                <FaBuilding className="me-2" />
                Register as Employer
              </Link>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .vw-cta-card {
          background: linear-gradient(135deg, rgba(17, 24, 48, 0.9), rgba(10, 14, 30, 0.95));
          border: 1px solid rgba(99, 102, 241, 0.35);
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15);
        }

        .vw-cta-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
          top: -100px;
          right: -50px;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}

export default CTA;