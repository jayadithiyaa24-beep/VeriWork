import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function CTA() {
  return (
    <section className="container py-5 my-2">
      <div className="vw-mockup-cta p-4 p-md-5 text-center text-md-start position-relative overflow-hidden">
        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          
          <div className="col-md-8">
            <h2 className="display-6 fw-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              Empowering Domestic Workers<br />Through Trust and Technology
            </h2>
          </div>

          <div className="col-md-4 mt-4 mt-md-0 text-md-end">
            <Link to="/get-started" className="btn-mockup-ochre py-3 px-4">
              <span>Get Started Today</span>
              <FaArrowRight size={13} className="ms-2" />
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        .vw-mockup-cta {
          background: linear-gradient(135deg, #4A3A2C 0%, #2F241C 100%);
          border-radius: var(--radius-xl, 32px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </section>
  );
}

export default CTA;