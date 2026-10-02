import { Link } from "react-router-dom";
import { FaUserCheck, FaBuilding, FaArrowRight, FaShieldAlt } from "react-icons/fa";

function GetStarted() {
  return (
    <div className="vw-get-started-page py-5">
      <div className="container py-4">

        {/* Section Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="veriwork-pill-sage mb-2">
            ONBOARDING GATEWAY
          </span>
          <h1 className="display-5 fw-bold text-dark mb-2">
            Welcome to VeriWork
          </h1>
          <p className="lead text-muted" style={{ fontSize: "1.05rem" }}>
            Select your account type to access India’s trusted work credential and verification protocol.
          </p>
        </div>

        {/* Dual Selection Cards */}
        <div className="row justify-content-center g-4 max-w-900 mx-auto">
          
          {/* Worker Card */}
          <div className="col-md-6">
            <div className="veriwork-card veriwork-card-interactive p-4 p-lg-5 h-100 text-center d-flex flex-column align-items-center">
              
              <div className="icon-box-sage mb-4" style={{ width: "64px", height: "64px" }}>
                <FaUserCheck size={28} />
              </div>

              <h3 className="fw-bold text-dark mb-2">
                Domestic Worker
              </h3>

              <span className="veriwork-pill-badge mb-3">
                PASSPORT HOLDER
              </span>

              <p className="text-muted small flex-grow-1" style={{ lineHeight: "1.7" }}>
                Build your verifiable work identity, carry proof of past domestic employment, download official PDF certificates with scannable QR, and earn verified ratings.
              </p>

              <div className="d-flex flex-column gap-2 w-100 mt-4">
                <Link to="/register-worker" className="btn-veriwork-primary w-100 py-3">
                  <span>Register as Worker</span>
                  <FaArrowRight size={12} className="ms-2" />
                </Link>
                <Link to="/login" className="btn-veriwork-secondary w-100 py-2">
                  Worker Login
                </Link>
              </div>

            </div>
          </div>

          {/* Employer Card */}
          <div className="col-md-6">
            <div className="veriwork-card veriwork-card-interactive p-4 p-lg-5 h-100 text-center d-flex flex-column align-items-center">
              
              <div className="icon-box-gold mb-4" style={{ width: "64px", height: "64px" }}>
                <FaBuilding size={28} />
              </div>

              <h3 className="fw-bold text-dark mb-2">
                Employer / Household
              </h3>

              <span className="veriwork-pill-sage mb-3">
                CREDENTIAL ISSUER
              </span>

              <p className="text-muted small flex-grow-1" style={{ lineHeight: "1.7" }}>
                Establish verified domestic employment terms, record monthly wages, issue on-chain work certificates on Ethereum EVM, and submit mutual evaluations.
              </p>

              <div className="d-flex flex-column gap-2 w-100 mt-4">
                <Link to="/register-employer" className="btn-veriwork-accent w-100 py-3">
                  <span>Register as Employer</span>
                  <FaArrowRight size={12} className="ms-2" />
                </Link>
                <Link to="/employer-login" className="btn-veriwork-secondary w-100 py-2">
                  Employer Login
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>

      <style>{`
        .vw-get-started-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .max-w-700 { max-width: 650px; }
        .max-w-900 { max-width: 900px; }
      `}</style>
    </div>
  );
}

export default GetStarted;