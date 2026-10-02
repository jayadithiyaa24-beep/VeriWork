import { Link } from "react-router-dom";

function CTA() {
  return (
    <section
      className="py-5 text-white text-center"
      style={{
        background: "#0d6efd",
      }}
    >
      <div className="container">

        <h2 className="fw-bold">
          Join India's Digital Workforce Revolution
        </h2>

        <p className="mb-4">
          Build trust. Verify employment. Empower millions.
        </p>

        <Link
          to="/get-started"
          className="btn btn-light px-4 py-2"
        >
          Get Started
        </Link>

      </div>
    </section>
  );
}

export default CTA;