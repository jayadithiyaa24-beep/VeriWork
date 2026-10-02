import { Link } from "react-router-dom";
import { FaUserTie, FaBuilding, FaArrowRight, FaShieldAlt } from "react-icons/fa";

function GetStarted() {
  return (
    <div className="vw-get-started-wrapper py-5">
      <div className="container py-4">

        {/* Section Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge-web3 mb-3">
            ONBOARDING GATEWAY
          </span>
          <h1 className="display-5 fw-bold text-white mb-2">
            Welcome to <span className="text-gradient-primary">VeriWork</span>
          </h1>
          <p className="text-muted lead" style={{ fontSize: "1.05rem" }}>
            Select your account type to access the decentralized work identity protocol.
          </p>
        </div>

        {/* Dual Onboarding Cards */}
        <div className="row justify-content-center g-4 max-w-900 mx-auto">
          
          {/* Worker Card */}
          <div className="col-md-6">
            <div className="glass-card glass-card-interactive p-4 p-lg-5 h-100 text-center d-flex flex-column align-items-center">
              
              <div className="vw-onboard-icon-cyan mb-4">
                <FaUserTie size={32} />
              </div>

              <h3 className="fw-bold text-white mb-2">
                Domestic Worker
              </h3>

              <span className="badge-web3-cyan py-1 px-3 mb-3" style={{ fontSize: "0.72rem" }}>
                DECENTRALIZED PASSPORT HOLDER
              </span>

              <p className="text-muted small flex-grow-1" style={{ lineHeight: "1.7" }}>
                Create your cryptographically verifiable work profile, view your active employment contracts, download your PDF certificate with QR code, and build a lasting reputation.
              </p>

              <div className="d-flex flex-column gap-2 w-100 mt-4">
                <Link to="/register-worker" className="btn-web3-cyan w-100 py-2">
                  <span>Register as Worker</span>
                  <FaArrowRight className="ms-2 small opacity-75" />
                </Link>
                <Link to="/login" className="btn-web3-outline w-100 py-2">
                  Worker Login
                </Link>
              </div>

            </div>
          </div>

          {/* Employer Card */}
          <div className="col-md-6">
            <div className="glass-card glass-card-interactive p-4 p-lg-5 h-100 text-center d-flex flex-column align-items-center">
              
              <div className="vw-onboard-icon-purple mb-4">
                <FaBuilding size={32} />
              </div>

              <h3 className="fw-bold text-white mb-2">
                Employer / Household
              </h3>

              <span className="badge-web3 py-1 px-3 mb-3" style={{ fontSize: "0.72rem" }}>
                VERIFIED CREDENTIAL ISSUER
              </span>

              <p className="text-muted small flex-grow-1" style={{ lineHeight: "1.7" }}>
                Establish verified domestic employment terms, record monthly wages, issue on-chain work certificates on Ethereum EVM, and submit mutual evaluations.
              </p>

              <div className="d-flex flex-column gap-2 w-100 mt-4">
                <Link to="/register-employer" className="btn-web3-primary w-100 py-2">
                  <span>Register as Employer</span>
                  <FaArrowRight className="ms-2 small opacity-75" />
                </Link>
                <Link to="/employer-login" className="btn-web3-outline w-100 py-2">
                  Employer Login
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>

      <style>{`
        .vw-get-started-wrapper {
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .max-w-700 { max-width: 700px; }
        .max-w-900 { max-width: 900px; }

        .vw-onboard-icon-cyan {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: #06b6d4;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.25);
        }

        .vw-onboard-icon-purple {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: #a855f7;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.25);
        }
      `}</style>
    </div>
  );
}

export default GetStarted;