import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";

function Home() {
  return (
    <>
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

      {/* Login Section */}
      <section
        className="py-5"
        style={{
          background: "#f4f8ff",
        }}
      >
        <div className="container text-center">

          <h2 className="fw-bold mb-3">
            Already have an account?
          </h2>

          <p className="text-muted mb-4">
            Login to manage your VeriWork identity and employment records.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">

            {/* Worker Login */}
            <Link
              to="/login"
              className="btn btn-primary px-4 py-2"
            >
              👷 Worker Login
            </Link>

            {/* Employer Login */}
            <Link
              to="/employer-login"
              className="btn btn-success px-4 py-2"
            >
              🏢 Employer Login
            </Link>

          </div>

        </div>
      </section>
    </>
  );
}

export default Home;