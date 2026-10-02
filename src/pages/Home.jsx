import { Link } from "react-router-dom";
import { FaUserTie, FaBuilding, FaArrowRight, FaLock } from "react-icons/fa";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";

function Home() {
  return (
    <div className="vw-home-wrapper">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <div id="features">
        <Features />
      </div>

      {/* Statistics */}
      <Stats />

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Call To Action */}
      <CTA />

      {/* Account Access Portals */}
      <section className="container py-5 my-3">
        <div className="text-center max-w-700 mx-auto mb-4">
          <span className="badge-web3 mb-2">
            INSTANT ACCOUNT ACCESS
          </span>
          <h3 className="fw-bold text-white fs-2">
            Already Have an Account?
          </h3>
          <p className="text-muted small">
            Access your encrypted domestic workforce passport or employer management portal.
          </p>
        </div>

        <div className="row g-4 justify-content-center max-w-900 mx-auto">
          
          {/* Worker Login Portal Card */}
          <div className="col-md-6">
            <div className="glass-card glass-card-interactive p-4 h-100 text-start d-flex flex-column">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="vw-portal-icon-cyan">
                  <FaUserTie size={24} />
                </div>
                <div>
                  <h4 className="fw-bold text-white mb-0 fs-5">Domestic Worker Portal</h4>
                  <small className="text-cyan font-monospace">Identity & Credential Holder</small>
                </div>
              </div>

              <p className="text-muted small flex-grow-1" style={{ lineHeight: "1.6" }}>
                View your decentralized work ID, check your verified employment contracts, download your PDF certificate with scannable QR, and view your reputation score.
              </p>

              <Link to="/login" className="btn-web3-cyan w-100 py-2 mt-3">
                <span>Worker Login</span>
                <FaArrowRight className="ms-2 small opacity-75" />
              </Link>
            </div>
          </div>

          {/* Employer Login Portal Card */}
          <div className="col-md-6">
            <div className="glass-card glass-card-interactive p-4 h-100 text-start d-flex flex-column">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="vw-portal-icon-purple">
                  <FaBuilding size={24} />
                </div>
                <div>
                  <h4 className="fw-bold text-white mb-0 fs-5">Employer & Issuer Portal</h4>
                  <small className="text-purple font-monospace">Authorized Contract Issuer</small>
                </div>
              </div>

              <p className="text-muted small flex-grow-1" style={{ lineHeight: "1.6" }}>
                Register domestic employment terms, record monthly wages, finalize work certificates, submit mutual evaluations, and anchor proof to the Ethereum EVM.
              </p>

              <Link to="/employer-login" className="btn-web3-primary w-100 py-2 mt-3">
                <span>Employer Login</span>
                <FaArrowRight className="ms-2 small opacity-75" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        .max-w-700 { max-width: 700px; }
        .max-w-900 { max-width: 900px; }

        .vw-portal-icon-cyan {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #06b6d4;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vw-portal-icon-purple {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.35);
          color: #a855f7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default Home;