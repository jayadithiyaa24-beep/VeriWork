import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import storage from "../utils/storage";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userType, setUserType] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =================================
  // CHECK LOGIN SESSION
  // =================================
  useEffect(() => {
    const workerToken = storage.getWorkerToken();
    const employerToken = storage.getEmployerToken();

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
        setTimeout(() => {
          elem.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location]);

  // =================================
  // ACTIVE ROUTE HELPERS
  // =================================
  const isHomeActive =
    location.pathname === "/" &&
    (!location.hash || location.hash === "#");

  const isHowItWorksActive =
    location.pathname === "/" &&
    location.hash === "#how-it-works";

  const isFeaturesActive =
    location.pathname === "/" &&
    location.hash === "#features";

  const isAboutActive = location.pathname === "/about";

  const isVerifyActive =
    location.pathname === "/verify-certificate";

  // =================================
  // LOGOUT
  // =================================
  const handleLogout = async () => {
    if (userType === "worker") {
      await storage.clearWorkerSession();
      setUserType(null);
      toast.success("Worker logged out successfully!");
      navigate("/login");
    }

    if (userType === "employer") {
      await storage.clearEmployerSession();
      setUserType(null);
      toast.success("Employer logged out successfully!");
      navigate("/employer-login");
    }
  };

  // =================================
  // CLOSE MOBILE MENU
  // =================================
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="vw-navbar">

      {/* =================================
          NAVBAR INNER
      ================================== */}
      <div className="vw-navbar-inner container">

        {/* =================================
            LOGO
        ================================== */}
        <Link
          to="/"
          className="vw-brand"
          onClick={closeMobileMenu}
          aria-label="VeriWork Home"
        >
          <span className="vw-brand-icon">
            <img
              src="/logo.svg"
              alt=""
              width="31"
              height="31"
              aria-hidden="true"
            />
          </span>

          <span className="vw-brand-name">
            VeriWork
          </span>
        </Link>


        {/* =================================
            DESKTOP NAVIGATION
        ================================== */}
        <div className="vw-desktop-navigation">

          <Link
            to="/"
            className={`vw-nav-link ${isHomeActive ? "active" : ""
              }`}
          >
            Home
          </Link>

          <Link
            to="/#how-it-works"
            className={`vw-nav-link ${isHowItWorksActive ? "active" : ""
              }`}
          >
            How It Works
          </Link>

          <Link
            to="/#features"
            className={`vw-nav-link ${isFeaturesActive ? "active" : ""
              }`}
          >
            Features
          </Link>

          <Link
            to="/about"
            className={`vw-nav-link ${isAboutActive ? "active" : ""
              }`}
          >
            About
          </Link>

          <Link
            to="/verify-certificate"
            className={`vw-nav-link ${isVerifyActive ? "active" : ""
              }`}
          >
            Verify Certificate
          </Link>

        </div>


        {/* =================================
            DESKTOP ACTIONS
        ================================== */}
        <div className="vw-desktop-actions">

          {!userType && (
            <>
              <Link
                to="/login"
                className="vw-login-button"
              >
                Login
              </Link>

              <Link
                to="/get-started"
                className="vw-get-started-button"
              >
                <span className="vw-get-started-text">
                  Get Started
                </span>

                <span className="vw-button-arrow">
                  →
                </span>
              </Link>
            </>
          )}


          {userType === "worker" && (
            <>
              <Link
                to="/worker-dashboard"
                className="vw-dashboard-button"
              >
                <span>
                  Worker Dashboard
                </span>
              </Link>

              <button
                className="vw-logout-button"
                onClick={handleLogout}
                title="Logout"
              >
                <span>
                  Logout
                </span>

                <FaSignOutAlt size={13} />
              </button>
            </>
          )}


          {userType === "employer" && (
            <>
              <Link
                to="/employer-dashboard"
                className="vw-dashboard-button"
              >
                <span>
                  Employer Dashboard
                </span>
              </Link>

              <button
                className="vw-logout-button"
                onClick={handleLogout}
                title="Logout"
              >
                <span>
                  Logout
                </span>

                <FaSignOutAlt size={13} />
              </button>
            </>
          )}

        </div>


        {/* =================================
            MOBILE MENU BUTTON
        ================================== */}
        <button
          className={`vw-mobile-toggle ${mobileMenuOpen ? "open" : ""
            }`}
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          aria-label="Toggle Navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <FaTimes size={19} />
          ) : (
            <FaBars size={19} />
          )}
        </button>

      </div>


      {/* =================================
          MOBILE NAVIGATION
      ================================== */}
      <div
        className={`vw-mobile-menu ${mobileMenuOpen ? "show" : ""
          }`}
      >

        <div className="vw-mobile-menu-inner">

          <Link
            to="/"
            className={`vw-mobile-link ${isHomeActive ? "active" : ""
              }`}
            onClick={closeMobileMenu}
          >
            <span>
              Home
            </span>
          </Link>


          <Link
            to="/#how-it-works"
            className={`vw-mobile-link ${isHowItWorksActive ? "active" : ""
              }`}
            onClick={closeMobileMenu}
          >
            <span>
              How It Works
            </span>
          </Link>


          <Link
            to="/#features"
            className={`vw-mobile-link ${isFeaturesActive ? "active" : ""
              }`}
            onClick={closeMobileMenu}
          >
            <span>
              Features
            </span>
          </Link>


          <Link
            to="/about"
            className={`vw-mobile-link ${isAboutActive ? "active" : ""
              }`}
            onClick={closeMobileMenu}
          >
            <span>
              About
            </span>
          </Link>


          <Link
            to="/verify-certificate"
            className={`vw-mobile-link ${isVerifyActive ? "active" : ""
              }`}
            onClick={closeMobileMenu}
          >
            <span>
              Verify Certificate
            </span>
          </Link>


          <div className="vw-mobile-divider" />


          {!userType ? (
            <div className="vw-mobile-actions">

              <Link
                to="/login"
                className="vw-mobile-login"
                onClick={closeMobileMenu}
              >
                Login
              </Link>

              <Link
                to="/get-started"
                className="vw-mobile-get-started"
                onClick={closeMobileMenu}
              >
                <span>
                  Get Started
                </span>

                <span>
                  →
                </span>
              </Link>

            </div>
          ) : (
            <div className="vw-mobile-actions">

              <Link
                to={
                  userType === "worker"
                    ? "/worker-dashboard"
                    : "/employer-dashboard"
                }
                className="vw-mobile-dashboard"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>

              <button
                className="vw-mobile-logout"
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
              >
                Logout
              </button>

            </div>
          )}

        </div>
      </div>


      {/* =================================
          NAVBAR STYLES
      ================================== */}
      <style>{`

        /* =====================================================
           MAIN NAVBAR
           SAME VISUAL CANVAS AS HERO
        ===================================================== */

        .vw-navbar {
          position: sticky;
          top: 0;

          width: 100%;

          z-index: 1030;

          padding-top: env(safe-area-inset-top, 0px);

          /*
             IMPORTANT:
             Use the same background as the Hero.
             This removes the white/hero visual break.
          */
          background: var(--color-bg);

          /*
             Extremely subtle separation instead of
             a strong white border.
          */
          border-bottom: 1px solid rgba(43, 38, 37, 0.045);

          /*
             Keep a very subtle blur while scrolling,
             but do NOT create a white glass effect.
          */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);

          transition:
            background-color 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }


        /*
           Make sure the navbar remains warm even
           when the browser applies transparency.
        */
        .vw-navbar::before {
          content: "";

          position: absolute;

          inset: 0;

          z-index: -1;

          background: rgba(239, 236, 230, 0.94);

          pointer-events: none;
        }


        /* =====================================================
           NAVBAR INNER
        ===================================================== */

        .vw-navbar-inner {
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 28px;

          padding-top: 10px;
          padding-bottom: 10px;
        }


        /* =====================================================
           BRAND
        ===================================================== */

        .vw-brand {
          display: inline-flex;
          align-items: center;

          gap: 9px;

          flex-shrink: 0;

          color: var(--color-text) !important;

          text-decoration: none !important;
        }


        .vw-brand-icon {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }


        .vw-brand-name {
          color: var(--color-text) !important;

          font-family: var(--font-serif);

          font-size: 1.5rem;
          font-weight: 700;

          line-height: 1;

          letter-spacing: -0.025em;
        }


        /* =====================================================
           DESKTOP NAVIGATION
        ===================================================== */

        .vw-desktop-navigation {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 27px;

          flex: 1;
        }


        .vw-nav-link {
          position: relative;

          display: inline-flex;
          align-items: center;

          min-height: 38px;

          padding: 5px 1px;

          color: #3C3633 !important;

          font-family: var(--font-sans);

          font-size: 0.83rem;
          font-weight: 600;

          line-height: 1;

          white-space: nowrap;

          text-decoration: none !important;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }


        .vw-nav-link::after {
          content: "";

          position: absolute;

          left: 0;
          right: 0;

          bottom: 1px;

          height: 2px;

          border-radius: 999px;

          background: var(--color-forest);

          transform: scaleX(0);

          transform-origin: center;

          transition:
            transform 0.2s ease;
        }


        .vw-nav-link:hover {
          color: var(--color-forest) !important;
        }


        .vw-nav-link:hover::after,
        .vw-nav-link.active::after {
          transform: scaleX(1);
        }


        .vw-nav-link.active {
          color: var(--color-forest) !important;
        }


        /* =====================================================
           DESKTOP ACTIONS
        ===================================================== */

        .vw-desktop-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 9px;

          flex-shrink: 0;
        }


        .vw-login-button,
        .vw-get-started-button,
        .vw-dashboard-button,
        .vw-logout-button {
          min-height: 42px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          font-family: var(--font-sans);

          font-size: 0.82rem;
          font-weight: 600;

          line-height: 1;

          white-space: nowrap;

          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            background-color 0.22s ease,
            border-color 0.22s ease;
        }


        /* =====================================================
           LOGIN
        ===================================================== */

        .vw-login-button {
          padding: 0 20px;

          color: var(--color-text) !important;

          /*
             Warm surface instead of pure white.
          */
          background: rgba(255, 255, 255, 0.48);

          border: 1px solid rgba(43, 38, 37, 0.12);

          border-radius: var(--radius-pill);

          text-decoration: none !important;
        }


        .vw-login-button:hover {
          color: var(--color-text) !important;

          background: rgba(255, 255, 255, 0.8);

          border-color: rgba(43, 38, 37, 0.2);

          transform: translateY(-1px);

          box-shadow:
            0 5px 15px rgba(43, 38, 37, 0.07);
        }


        /* =====================================================
           GET STARTED
        ===================================================== */

        .vw-get-started-button {
          gap: 7px;

          padding: 0 18px;

          color: #FFFFFF !important;

          background: var(--color-ochre);

          border: 1px solid var(--color-ochre);

          border-radius: var(--radius-pill);

          box-shadow:
            0 4px 14px rgba(201, 138, 65, 0.18);

          text-decoration: none !important;
        }


        .vw-get-started-button:hover {
          color: #FFFFFF !important;

          background: var(--color-ochre-hover);

          border-color: var(--color-ochre-hover);

          transform: translateY(-2px);

          box-shadow:
            0 7px 18px rgba(201, 138, 65, 0.27);
        }


        .vw-get-started-text {
          color: #FFFFFF !important;
        }


        .vw-button-arrow {
          color: #FFFFFF !important;

          font-size: 1rem;

          line-height: 1;

          transition:
            transform 0.2s ease;
        }


        .vw-get-started-button:hover
        .vw-button-arrow {
          transform: translateX(2px);
        }


        /* =====================================================
           DASHBOARD
        ===================================================== */

        .vw-dashboard-button {
          padding: 0 16px;

          color: #FFFFFF !important;

          background: var(--color-forest);

          border: 1px solid var(--color-forest);

          border-radius: var(--radius-pill);

          text-decoration: none !important;

          box-shadow:
            0 4px 12px rgba(53, 74, 54, 0.16);
        }


        .vw-dashboard-button span {
          color: #FFFFFF !important;
        }


        .vw-dashboard-button:hover {
          color: #FFFFFF !important;

          background: var(--color-forest-hover);

          border-color: var(--color-forest-hover);

          transform: translateY(-1px);

          box-shadow:
            0 7px 17px rgba(53, 74, 54, 0.23);
        }


        /* =====================================================
           LOGOUT
        ===================================================== */

        .vw-logout-button {
          gap: 6px;

          padding: 0 14px;

          color: var(--color-text-muted);

          background: rgba(255, 255, 255, 0.4);

          border: 1px solid rgba(43, 38, 37, 0.1);

          border-radius: var(--radius-pill);

          cursor: pointer;
        }


        .vw-logout-button span {
          color: inherit !important;
        }


        .vw-logout-button:hover {
          color: #9B3D34;

          border-color: #D9B7B2;

          background: rgba(255, 249, 248, 0.8);

          transform: translateY(-1px);
        }


        /* =====================================================
           MOBILE TOGGLE
        ===================================================== */

        .vw-mobile-toggle {
          width: 42px;
          height: 42px;

          display: none;

          align-items: center;
          justify-content: center;

          padding: 0;

          color: var(--color-text);

          background: rgba(255, 255, 255, 0.45);

          border: 1px solid rgba(43, 38, 37, 0.12);

          border-radius: 50%;

          cursor: pointer;

          transition:
            background-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }


        .vw-mobile-toggle:hover,
        .vw-mobile-toggle.open {
          color: #FFFFFF;

          background: var(--color-forest);

          border-color: var(--color-forest);
        }


        /* =====================================================
           MOBILE MENU
        ===================================================== */

        .vw-mobile-menu {
          display: none;

          /*
             Same warm background as the Hero.
          */
          background: var(--color-bg);

          border-top:
            1px solid rgba(43, 38, 37, 0.045);

          box-shadow:
            0 12px 30px rgba(43, 38, 37, 0.06);
        }


        .vw-mobile-menu-inner {
          max-width: 100%;

          padding: 16px 20px 22px;
        }


        .vw-mobile-link {
          min-height: 48px;

          display: flex;
          align-items: center;

          padding: 0 14px;

          color: var(--color-text) !important;

          font-family: var(--font-sans);

          font-size: 0.94rem;
          font-weight: 600;

          border-radius: 12px;

          text-decoration: none !important;

          transition:
            background-color 0.2s ease,
            color 0.2s ease;
        }


        .vw-mobile-link span {
          color: inherit !important;
        }


        .vw-mobile-link:hover,
        .vw-mobile-link.active {
          color: var(--color-forest) !important;

          background:
            rgba(214, 225, 215, 0.7);
        }


        .vw-mobile-divider {
          height: 1px;

          margin: 12px 0;

          background:
            rgba(43, 38, 37, 0.08);
        }


        .vw-mobile-actions {
          display: flex;

          flex-direction: column;

          gap: 9px;
        }


        .vw-mobile-login,
        .vw-mobile-get-started,
        .vw-mobile-dashboard,
        .vw-mobile-logout {
          min-height: 46px;

          display: flex;

          align-items: center;
          justify-content: center;

          width: 100%;

          font-family: var(--font-sans);

          font-size: 0.92rem;
          font-weight: 600;

          border-radius: var(--radius-pill);

          text-decoration: none !important;

          transition:
            transform 0.2s ease,
            background-color 0.2s ease;
        }


        .vw-mobile-login {
          color: var(--color-text) !important;

          background:
            rgba(255, 255, 255, 0.5);

          border:
            1px solid rgba(43, 38, 37, 0.12);
        }


        .vw-mobile-login:hover {
          color: var(--color-text) !important;

          background:
            rgba(255, 255, 255, 0.8);

          border-color:
            rgba(43, 38, 37, 0.2);

          transform: translateY(-1px);
        }


        .vw-mobile-get-started {
          gap: 7px;

          color: #FFFFFF !important;

          background: var(--color-ochre);

          border: 1px solid var(--color-ochre);
        }


        .vw-mobile-get-started span {
          color: #FFFFFF !important;
        }


        .vw-mobile-get-started:hover {
          color: #FFFFFF !important;

          background: var(--color-ochre-hover);

          transform: translateY(-1px);
        }


        .vw-mobile-dashboard {
          color: #FFFFFF !important;

          background: var(--color-forest);

          border: 1px solid var(--color-forest);
        }


        .vw-mobile-dashboard:hover {
          color: #FFFFFF !important;

          background: var(--color-forest-hover);

          transform: translateY(-1px);
        }


        .vw-mobile-logout {
          color: var(--color-text-muted);

          background:
            rgba(255, 255, 255, 0.45);

          border:
            1px solid rgba(43, 38, 37, 0.1);

          cursor: pointer;
        }


        .vw-mobile-logout:hover {
          color: #9B3D34;

          border-color: #D9B7B2;

          background: rgba(255, 249, 248, 0.8);

          transform: translateY(-1px);
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 991.98px) {

          .vw-desktop-navigation {
            gap: 18px;
          }


          .vw-nav-link {
            font-size: 0.78rem;
          }


          .vw-navbar-inner {
            gap: 18px;
          }


          .vw-login-button,
          .vw-get-started-button {
            padding-left: 15px;
            padding-right: 15px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767.98px) {

          .vw-navbar-inner {
            min-height: 68px;

            padding-top: 9px;
            padding-bottom: 9px;
          }


          .vw-brand-name {
            font-size: 1.38rem;
          }


          .vw-brand-icon {
            width: 30px;
            height: 30px;
          }


          .vw-desktop-navigation,
          .vw-desktop-actions {
            display: none;
          }


          .vw-mobile-toggle {
            display: inline-flex;
          }


          .vw-mobile-menu {
            display: block;

            max-height: 0;

            overflow: hidden;

            opacity: 0;

            transform: translateY(-6px);

            transition:
              max-height 0.3s ease,
              opacity 0.2s ease,
              transform 0.3s ease;
          }


          .vw-mobile-menu.show {
            max-height: 600px;

            opacity: 1;

            transform: translateY(0);
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 420px) {

          .vw-navbar-inner {
            padding-left: 16px;
            padding-right: 16px;
          }


          .vw-brand-name {
            font-size: 1.3rem;
          }


          .vw-mobile-menu-inner {
            padding-left: 16px;
            padding-right: 16px;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .vw-navbar,
          .vw-nav-link,
          .vw-login-button,
          .vw-get-started-button,
          .vw-dashboard-button,
          .vw-logout-button,
          .vw-mobile-toggle,
          .vw-mobile-menu,
          .vw-mobile-link,
          .vw-mobile-login,
          .vw-mobile-get-started,
          .vw-mobile-dashboard,
          .vw-mobile-logout {
            transition: none !important;
          }

        }

      `}</style>
    </nav >
  );
}

export default Navbar;