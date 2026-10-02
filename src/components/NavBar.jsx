import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserTie, FaBuilding, FaSearch } from "react-icons/fa";
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
    } else if (
      location.pathname.startsWith("/employer-dashboard")
    ) {
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
  // ACTIVE ROUTES
  // =================================

  const isHomeActive =
    location.pathname === "/" &&
    (!location.hash || location.hash === "#");

  const isFeaturesActive =
    location.pathname === "/" &&
    location.hash === "#features";

  const isHowItWorksActive =
    location.pathname === "/" &&
    location.hash === "#how-it-works";

  const isAboutActive =
    location.pathname === "/about";

  const isVerifyCertificateActive =
    location.pathname === "/verify-certificate";

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
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">

        {/* Logo */}

        <Link
          className="navbar-brand fw-bold text-primary d-flex align-items-center"
          to="/"
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <FaUserTie className="me-2" />
          VeriWork
        </Link>


        {/* Mobile Toggle */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        {/* Navbar Items */}

        <div
          className="collapse navbar-collapse"
          id="navbar"
        >

          {/* Navigation Links */}

          <ul className="navbar-nav ms-auto align-items-center gap-1">

            <li className="nav-item">

              <Link
                className={`nav-link ${
                  isHomeActive
                    ? "text-primary fw-semibold active"
                    : ""
                }`}
                to="/"
                style={{
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                Home
              </Link>

            </li>


            <li className="nav-item">

              <Link
                className={`nav-link ${
                  isFeaturesActive
                    ? "text-primary fw-semibold active"
                    : ""
                }`}
                to="/#features"
                style={{
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                Features
              </Link>

            </li>


            <li className="nav-item">

              <Link
                className={`nav-link ${
                  isHowItWorksActive
                    ? "text-primary fw-semibold active"
                    : ""
                }`}
                to="/#how-it-works"
                style={{
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                How It Works
              </Link>

            </li>


            <li className="nav-item">

              <Link
                className={`nav-link ${
                  isAboutActive
                    ? "text-primary fw-semibold active"
                    : ""
                }`}
                to="/about"
                style={{
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                About Platform
              </Link>

            </li>


            {/* ================================= */}
            {/* VERIFY CERTIFICATE */}
            {/* ================================= */}

            <li className="nav-item">

              <Link
                className={`nav-link ${
                  isVerifyCertificateActive
                    ? "text-primary fw-semibold active"
                    : ""
                }`}
                to="/verify-certificate"
                style={{
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                <FaSearch className="me-1" />
                Verify Certificate
              </Link>

            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/admin"
                    ? "text-primary fw-semibold active"
                    : ""
                }`}
                to="/admin"
                style={{
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                ⚙️ Admin
              </Link>
            </li>

          </ul>


          {/* Buttons Area */}

          <div className="d-flex ms-lg-3 flex-wrap gap-2 align-items-center">

            {/* ================================= */}
            {/* NOT LOGGED IN */}
            {/* ================================= */}

            {!userType && (
              <>

                {/* Worker Registration */}

                <Link
                  className="btn btn-outline-primary btn-sm rounded-3"
                  to="/register-worker"
                >
                  Register Worker
                </Link>


                {/* Employer Registration */}

                <Link
                  className="btn btn-outline-success btn-sm rounded-3"
                  to="/register-employer"
                >
                  Register Employer
                </Link>


                {/* Worker Login */}

                <Link
                  className="vw-navbar-btn"
                  to="/login"
                >
                  <FaUserTie
                    style={{
                      color: "#0d6efd",
                    }}
                  />

                  <span>
                    Worker Login
                  </span>

                </Link>


                {/* Employer Login */}

                <Link
                  className="vw-navbar-btn"
                  to="/employer-login"
                >
                  <FaBuilding
                    style={{
                      color: "#0d6efd",
                    }}
                  />

                  <span>
                    Employer Login
                  </span>

                </Link>

              </>
            )}


            {/* ================================= */}
            {/* WORKER LOGGED IN */}
            {/* ================================= */}

            {userType === "worker" && (
              <>

                <Link
                  className="btn btn-outline-primary btn-sm rounded-3"
                  to="/worker-dashboard"
                >
                  Worker Dashboard
                </Link>


                <button
                  className="btn btn-danger btn-sm rounded-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>
            )}


            {/* ================================= */}
            {/* EMPLOYER LOGGED IN */}
            {/* ================================= */}

            {userType === "employer" && (
              <>

                <Link
                  className="btn btn-outline-success btn-sm rounded-3"
                  to="/employer-dashboard"
                >
                  Employer Dashboard
                </Link>


                <button
                  className="btn btn-danger btn-sm rounded-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>
            )}

          </div>

        </div>

      </div>


      <style>{`
        .vw-navbar-btn {
          background-color: #ffffff;
          border: 1.5px solid #0d6efd;
          color: #0d6efd;
          text-decoration: none !important;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.375rem 0.85rem;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 1px 2px rgba(13, 110, 253, 0.08);
        }

        .vw-navbar-btn:hover {
          background-color: #e7f1ff;
          border-color: #0a58ca;
          color: #0a58ca;
          box-shadow: 0 3px 8px rgba(13, 110, 253, 0.18);
          text-decoration: none !important;
          transform: translateY(-1px);
        }
      `}</style>

    </nav>
  );
}

export default Navbar;