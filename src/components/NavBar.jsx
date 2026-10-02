import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt, FaSearch } from "react-icons/fa";
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
    <nav className="vw-mockup-navbar sticky-top">
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* Logo on Left: 🌾 VeriWork */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2C14 2 13 8 7 10C13 12 14 18 14 18C14 18 15 12 21 10C15 8 14 2 14 2Z" fill="#354A36" />
              <path d="M7 16C7 16 10 18 10 22C10 22 14 19 14 19" stroke="#C98A41" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 16C21 16 18 18 18 22C18 22 14 19 14 19" stroke="#C98A41" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 18V26" stroke="#354A36" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="vw-mockup-logo-text">VeriWork</span>
          </Link>

          {/* Desktop Center Navigation Links */}
          <div className="d-none d-md-flex align-items-center gap-4 vw-mockup-nav-links">
            <Link className={`vw-mockup-link ${isHomeActive ? "active" : ""}`} to="/">
              Home
            </Link>
            <Link className={`vw-mockup-link ${isHowItWorksActive ? "active" : ""}`} to="/#how-it-works">
              How It Works
            </Link>
            <Link className={`vw-mockup-link ${isFeaturesActive ? "active" : ""}`} to="/#features">
              Features
            </Link>
            <Link className={`vw-mockup-link ${isAboutActive ? "active" : ""}`} to="/about">
              About
            </Link>
          </div>

          {/* Right Action CTAs */}
          <div className="d-none d-md-flex align-items-center gap-3">
            {!userType && (
              <>
                <Link to="/login" className="btn-mockup-outline py-2 px-4">
                  Login
                </Link>
                <Link to="/get-started" className="btn-mockup-ochre py-2 px-4">
                  Get Started
                </Link>
              </>
            )}

            {userType === "worker" && (
              <>
                <Link to="/worker-dashboard" className="btn-mockup-forest py-2 px-3 text-sm">
                  👷 Worker Dashboard
                </Link>
                <button className="btn-mockup-outline py-2 px-3 text-danger text-sm" onClick={handleLogout} title="Logout">
                  <FaSignOutAlt />
                </button>
              </>
            )}

            {userType === "employer" && (
              <>
                <Link to="/employer-dashboard" className="btn-mockup-forest py-2 px-3 text-sm">
                  🏢 Employer Dashboard
                </Link>
                <button className="btn-mockup-outline py-2 px-3 text-danger text-sm" onClick={handleLogout} title="Logout">
                  <FaSignOutAlt />
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="d-md-none">
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
          <div className="d-md-none mt-3 pt-3 border-top border-secondary border-opacity-10">
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

              <div className="d-flex flex-column gap-2 pt-3 mt-2 border-top border-secondary border-opacity-10">
                {!userType ? (
                  <>
                    <Link to="/login" className="btn-mockup-outline w-100 py-2 text-center" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/get-started" className="btn-mockup-ochre w-100 py-2 text-center" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={userType === "worker" ? "/worker-dashboard" : "/employer-dashboard"}
                      className="btn-mockup-forest w-100 py-2 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button className="btn-mockup-outline w-100 py-2 text-danger" onClick={handleLogout}>
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
        .vw-mockup-navbar {
          background-color: var(--color-bg);
          border-bottom: 1px solid var(--color-border);
          z-index: 1030;
          transition: all 0.25s ease;
        }

        .vw-mockup-logo-text {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.45rem;
          color: var(--color-text);
          letter-spacing: -0.02em;
        }

        .vw-mockup-link {
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: color 0.2s ease;
          padding: 4px 0;
        }

        .vw-mockup-link:hover, .vw-mockup-link.active {
          color: var(--color-text);
          border-bottom: 2px solid var(--color-forest);
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
          font-size: 0.88rem;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;