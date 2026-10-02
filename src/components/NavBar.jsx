import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserTie, FaBuilding, FaSearch, FaShieldAlt, FaCogs, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userType, setUserType] = useState(null);

  // =================================
  // CHECK LOGIN SESSION
  // =================================
  useEffect(() => {
    const workerToken = sessionStorage.getItem("token");
    const employerToken = sessionStorage.getItem("employerToken");

    if (location.pathname.startsWith("/worker-dashboard")) {
      setUserType(workerToken ? "worker" : null);
    } else if (location.pathname.startsWith("/employer-dashboard")) {
      setUserType(employerToken ? "employer" : null);
    } else {
      setUserType(null);
    }
  }, [location.pathname]);

  // =================================
  // SCROLL TO HASH ELEMENT
  // =================================
  useEffect(() => {
    if (location.hash) {
      const elem = document.querySelector(location.hash);
      if (elem) {
        elem.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [location]);

  // =================================
  // ACTIVE ROUTE HELPERS
  // =================================
  const isHomeActive = location.pathname === "/" && (!location.hash || location.hash === "#");
  const isFeaturesActive = location.pathname === "/" && location.hash === "#features";
  const isHowItWorksActive = location.pathname === "/" && location.hash === "#how-it-works";
  const isAboutActive = location.pathname === "/about";
  const isVerifyCertificateActive = location.pathname === "/verify-certificate";
  const isAdminActive = location.pathname === "/admin";

  // =================================
  // LOGOUT
  // =================================
  const handleLogout = () => {
    if (userType === "worker") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("worker");
      sessionStorage.removeItem("workerWallet");
      localStorage.removeItem("token");
      localStorage.removeItem("worker");
      localStorage.removeItem("workerWallet");
      setUserType(null);
      toast.success("Worker logged out successfully!");
      navigate("/login");
    }

    if (userType === "employer") {
      sessionStorage.removeItem("employerToken");
      sessionStorage.removeItem("employer");
      sessionStorage.removeItem("employerWallet");
      localStorage.removeItem("employerToken");
      localStorage.removeItem("employer");
      localStorage.removeItem("employerWallet");
      setUserType(null);
      toast.success("Employer logged out successfully!");
      navigate("/employer-login");
    }
  };

  return (
    <nav className="vw-web3-navbar sticky-top">
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* Logo Brand */}
          <Link className="vw-brand d-flex align-items-center gap-2" to="/">
            <div className="vw-brand-icon">
              <FaShieldAlt />
            </div>
            <div>
              <span className="vw-brand-name">VeriWork</span>
              <span className="vw-brand-badge">WEB3</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-1 vw-nav-links">
            <Link className={`vw-nav-item ${isHomeActive ? "active" : ""}`} to="/">
              Home
            </Link>
            <Link className={`vw-nav-item ${isFeaturesActive ? "active" : ""}`} to="/#features">
              Features
            </Link>
            <Link className={`vw-nav-item ${isHowItWorksActive ? "active" : ""}`} to="/#how-it-works">
              How It Works
            </Link>
            <Link className={`vw-nav-item ${isAboutActive ? "active" : ""}`} to="/about">
              About
            </Link>
            <Link className={`vw-nav-item ${isVerifyCertificateActive ? "active" : ""}`} to="/verify-certificate">
              <FaSearch className="me-1 opacity-75" />
              Verify Certificate
            </Link>
            <Link className={`vw-nav-item ${isAdminActive ? "active" : ""}`} to="/admin">
              <FaCogs className="me-1 opacity-75" />
              Governance
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-2">
            {!userType && (
              <>
                <Link to="/login" className="vw-btn-glass d-none d-sm-inline-flex">
                  <FaUserTie className="text-cyan" />
                  <span>Worker</span>
                </Link>

                <Link to="/employer-login" className="vw-btn-glass d-none d-sm-inline-flex">
                  <FaBuilding className="text-purple" />
                  <span>Employer</span>
                </Link>

                <Link to="/register-worker" className="vw-btn-gradient">
                  <span>Get Started</span>
                </Link>
              </>
            )}

            {userType === "worker" && (
              <>
                <Link to="/worker-dashboard" className="vw-btn-dashboard-worker">
                  👷 Worker Dashboard
                </Link>
                <button className="vw-btn-logout" onClick={handleLogout} title="Logout">
                  <FaSignOutAlt />
                </button>
              </>
            )}

            {userType === "employer" && (
              <>
                <Link to="/employer-dashboard" className="vw-btn-dashboard-employer">
                  🏢 Employer Dashboard
                </Link>
                <button className="vw-btn-logout" onClick={handleLogout} title="Logout">
                  <FaSignOutAlt />
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      <style>{`
        .vw-web3-navbar {
          background: rgba(8, 11, 25, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          z-index: 1030;
          transition: all 0.3s ease;
        }

        .vw-brand {
          text-decoration: none;
          user-select: none;
        }

        .vw-brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 1.1rem;
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.5);
        }

        .vw-brand-name {
          font-family: var(--font-display, 'Outfit', sans-serif);
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .vw-brand-badge {
          margin-left: 6px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 9999px;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #67e8f9;
        }

        .vw-nav-links {
          background: rgba(18, 24, 46, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 9999px;
          padding: 4px 6px;
        }

        .vw-nav-item {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 9999px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }

        .vw-nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .vw-nav-item.active {
          color: #ffffff;
          background: rgba(99, 102, 241, 0.25);
          border: 1px solid rgba(99, 102, 241, 0.4);
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.25);
        }

        .vw-btn-glass {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          padding: 7px 15px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.2s ease;
        }

        .vw-btn-glass:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .vw-btn-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
          border: none;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: var(--font-display, 'Outfit', sans-serif);
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
        }

        .vw-btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(99, 102, 241, 0.55);
          filter: brightness(1.1);
          color: #ffffff;
        }

        .vw-btn-dashboard-worker {
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: #67e8f9;
          padding: 7px 16px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .vw-btn-dashboard-worker:hover {
          background: rgba(6, 182, 212, 0.25);
          color: #ffffff;
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.3);
        }

        .vw-btn-dashboard-employer {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #a5b4fc;
          padding: 7px 16px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .vw-btn-dashboard-employer:hover {
          background: rgba(99, 102, 241, 0.25);
          color: #ffffff;
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.3);
        }

        .vw-btn-logout {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }

        .vw-btn-logout:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.35);
        }

        .text-cyan { color: #06b6d4; }
        .text-purple { color: #a855f7; }
      `}</style>
    </nav>
  );
}

export default Navbar;