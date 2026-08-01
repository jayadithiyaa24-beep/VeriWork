import { FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
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

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbar">

          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/#features">
                Features
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/#how-it-works">
                How It Works
              </a>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

          </ul>

          <div className="d-flex ms-lg-3">

            <Link
              className="btn btn-outline-primary me-2"
              to="/register-worker"
            >
              Register Worker
            </Link>

            <Link
              className="btn btn-outline-success me-2"
              to="/register-employer"
            >
              Register Employer
            </Link>

            <Link
              className="btn btn-primary"
              to="/login"
            >
              Login
            </Link>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;