import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBars, FaTimes, FaSignOutAlt, FaSearch, FaCogs } from "react-icons/fa";
import { toast } from "react-toastify";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userType, setUserType] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
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
  const isHowItWorksActive = location.pathname === "/" && location.hash === "#how-it-works";
  const isFeaturesActive = location.pathname === "/" && location.hash === "#features";
  const isAboutActive = location.pathname === "/about";
  const isVerifyActive = location.pathname === "/verify-certificate";

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
    <nav className="vw-navbar sticky-top">
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* Logo on Left */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="vw-logo-mark">
              <FaShieldAlt size={16} />
            </div>
            <div className="d-flex flex-column">
              <span className="vw-logo-title">VeriWork</span>
              <span className="vw-logo-tagline d-none d-sm-inline">Trusted Work. Verified Identity.</span>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-1 vw-nav-center">
            <Link className={`vw-nav-link ${isHomeActive ? "active" : ""}`} to="/">
              Home
            </Link>
            <Link className={`vw-nav-link ${isHowItWorksActive ? "active" : ""}`} to="/#how-it-works">
              How It Works
            </Link>
            <Link className={`vw-nav-link ${isFeaturesActive ? "active" : ""}`} to="/#features">
              Features
            </Link>
            <Link className={`vw-nav-link ${isAboutActive ? "active" : ""}`} to="/about">
              About
            </Link>
            <Link className={`vw-nav-link ${isVerifyActive ? "active" : ""}`} to="/verify-certificate">
              Verify ID
            </Link>
          </div>

          {/* Right Action CTAs */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            {!userType && (
              <>
                <Link to="/login" className="btn-veriwork-secondary py-2 px-3 text-sm">
                  Login
                </Link>
                <Link to="/get-started" className="btn-veriwork-primary py-2 px-4 text-sm">
                  Get Started
                </Link>
              </>
            )}

            {userType === "worker" && (
              <>
                <Link to="/worker-dashboard" className="btn-veriwork-primary py-2 px-3 text-sm">
                  👷 Worker Dashboard
                </Link>
                <button className="btn-veriwork-secondary py-2 px-3 text-danger text-sm" onClick={handleLogout} title="Logout">
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </>
            )}

            {userType === "employer" && (
              <>
                <Link to="/employer-dashboard" className="btn-veriwork-primary py-2 px-3 text-sm">
                  🏢 Employer Dashboard
                </Link>
                <button className="btn-veriwork-secondary py-2 px-3 text-danger text-sm" onClick={handleLogout} title="Logout">
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="d-lg-none">
            <button
              className="btn btn-link text-dark p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="d-lg-none mt-3 pt-3 border-top border-secondary border-opacity-10 vw-mobile-menu">
            <div className="d-flex flex-column gap-2">
              <Link className="vw-mobile-link" to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link className="vw-mobile-link" to="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link className="vw-mobile-link" to="/#features" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link className="vw-mobile-link" to="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link className="vw-mobile-link" to="/verify-certificate" onClick={() => setMobileMenuOpen(false)}>
                Verify Certificate
              </Link>
              <Link className="vw-mobile-link" to="/admin" onClick={() => setMobileMenuOpen(false)}>
                Governance
              </Link>

              <div className="d-flex flex-column gap-2 pt-3 mt-2 border-top border-secondary border-opacity-10">
                {!userType ? (
                  <>
                    <Link to="/login" className="btn-veriwork-secondary w-100 py-2 text-center" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/get-started" className="btn-veriwork-primary w-100 py-2 text-center" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={userType === "worker" ? "/worker-dashboard" : "/employer-dashboard"}
                      className="btn-veriwork-primary w-100 py-2 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button className="btn-veriwork-secondary w-100 py-2 text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .vw-navbar {
          background-color: rgba(239, 236, 230, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
          z-index: 1030;
          transition: all 0.25s ease;
        }

        .vw-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background-color: var(--color-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }

        .vw-logo-title {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.35rem;
          color: var(--color-text);
          line-height: 1.1;
        }

        .vw-logo-tagline {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .vw-nav-center {
          background-color: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          padding: 3px 6px;
        }

        .vw-nav-link {
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.92rem;
          padding: 7px 18px;
          border-radius: var(--radius-pill);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .vw-nav-link:hover {
          color: var(--color-text);
          background-color: rgba(255, 255, 255, 0.9);
        }

        .vw-nav-link.active {
          color: #FFFFFF;
          background-color: var(--color-primary-dark);
          box-shadow: 0 2px 8px rgba(55, 71, 56, 0.2);
        }

        .vw-mobile-link {
          color: var(--color-text);
          font-weight: 600;
          font-size: 1rem;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          text-decoration: none;
        }

        .vw-mobile-link:hover {
          background-color: rgba(255, 255, 255, 0.6);
        }

        .text-sm {
          font-size: 0.9rem;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;