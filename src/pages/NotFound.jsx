import { Link } from "react-router-dom";
import { FaHome, FaShieldAlt } from "react-icons/fa";

function NotFound() {
  return (
    <div className="vw-404-wrapper py-5 text-center d-flex align-items-center justify-content-center">
      <div className="container py-4">
        <div className="veriwork-card p-5 max-w-600 mx-auto shadow-md">
          
          <div className="vw-404-icon mx-auto mb-3">
            <FaShieldAlt size={28} />
          </div>

          <h1 className="display-1 fw-bold text-dark mb-2" style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary-dark)" }}>
            404
          </h1>

          <h3 className="fw-bold text-dark mb-2">
            This page couldn't be found.
          </h3>

          <p className="text-muted mb-4">
            Let's get you back to VeriWork. The address you entered might be broken or the page has been moved.
          </p>

          <Link to="/" className="btn-veriwork-primary py-3 px-4">
            <FaHome className="me-2" />
            <span>Back Home</span>
          </Link>

        </div>
      </div>

      <style>{`
        .vw-404-wrapper {
          min-height: 75vh;
        }

        .max-w-600 {
          max-width: 540px;
        }

        .vw-404-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          background-color: var(--color-primary-light);
          color: var(--color-primary-dark);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default NotFound;
