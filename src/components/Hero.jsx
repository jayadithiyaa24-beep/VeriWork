import hero from "../assets/hero.png";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      className="py-5"
      style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('/veriwork-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container">
        <div className="row align-items-center">

          {/* Left Side */}
          <div className="col-lg-6">

            <span className="badge bg-primary px-3 py-2 mb-3">
              Blockchain Powered
            </span>

            <h1
              className="fw-bold"
              style={{
                fontSize: "4rem",
                lineHeight: "1.2",
              }}
            >
              Verifiable Work
              <br />
              Identity
            </h1>

            <h2
              className="text-primary fw-semibold"
              style={{
                marginTop: "20px",
              }}
            >
              For Informal Domestic Workers
            </h2>

            <p
              className="lead mt-4"
              style={{
                color: "#555",
                lineHeight: "1.8",
              }}
            >
              Empowering millions of domestic workers with secure
              employment records, salary verification, digital
              identities and blockchain-based trust.
            </p>

            <div className="mt-4">

              <Link
                to="/register-worker"
                className="btn btn-primary btn-lg me-3 px-4"
              >
                Register Worker
              </Link>

              <Link
                to="/register-employer"
                className="btn btn-outline-primary btn-lg px-4"
              >
                Register Employer
              </Link>

            </div>

          </div>

          {/* Right Side */}
          <div className="col-lg-6 text-center">

            <img
              src={hero}
              alt="Blockchain Illustration"
              className="img-fluid"
              style={{
                maxWidth: "90%",
                animation: "float 4s ease-in-out infinite",
              }}
            />

          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>

    </section>
  );
}

export default Hero;