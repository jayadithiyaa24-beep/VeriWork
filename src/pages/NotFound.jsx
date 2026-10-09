import { Link } from "react-router-dom";
import { FaHome, FaShieldAlt, FaArrowRight } from "react-icons/fa";

function NotFound() {
  return (
    <div className="vw-404-page">

      <style>{`

        /* =========================================
           PAGE
        ========================================= */

        .vw-404-page {
          min-height: calc(100vh - 86px);

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 70px 20px 90px;

          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(212, 163, 89, 0.11),
              transparent 25%
            ),
            radial-gradient(
              circle at 85% 75%,
              rgba(63, 85, 71, 0.10),
              transparent 28%
            ),
            var(--color-bg, #EFECE6);

          color: var(--color-text, #2B2625);

          position: relative;
          overflow: hidden;
        }


        /* =========================================
           DECORATIVE CIRCLES
        ========================================= */

        .vw-404-page::before {
          content: "";

          position: absolute;

          width: 320px;
          height: 320px;

          top: -150px;
          right: -100px;

          border:
            1px solid rgba(63, 85, 71, 0.10);

          border-radius: 50%;
        }


        .vw-404-page::after {
          content: "";

          position: absolute;

          width: 220px;
          height: 220px;

          bottom: -110px;
          left: -70px;

          border:
            1px solid rgba(212, 163, 89, 0.16);

          border-radius: 50%;
        }


        /* =========================================
           CARD
        ========================================= */

        .vw-404-card {
          position: relative;

          z-index: 2;

          width: 100%;
          max-width: 650px;

          padding: 60px 55px;

          text-align: center;

          background:
            rgba(255, 255, 255, 0.78);

          border:
            1px solid rgba(43, 38, 37, 0.08);

          border-radius: 30px;

          box-shadow:
            0 28px 70px rgba(43, 38, 37, 0.10),
            0 5px 18px rgba(43, 38, 37, 0.04);

          backdrop-filter: blur(12px);

          overflow: hidden;
        }


        .vw-404-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 4px;

          background:
            linear-gradient(
              90deg,
              var(--color-forest, #3F5547),
              var(--color-ochre, #D4A359)
            );
        }


        /* =========================================
           ICON
        ========================================= */

        .vw-404-icon {
          width: 68px;
          height: 68px;

          margin: 0 auto 24px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 20px;

          background: #E4ECE5;

          color:
            var(--color-forest, #3F5547);

          box-shadow:
            0 12px 25px rgba(63, 85, 71, 0.10);
        }


        /* =========================================
           404 NUMBER
        ========================================= */

        .vw-404-number {
          margin: 0;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size:
            clamp(5rem, 11vw, 8rem);

          line-height: 0.85;

          letter-spacing: -0.065em;

          color:
            var(--color-text, #2B2625) !important;
        }


        .vw-404-number span {
          color:
            var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           HEADING
        ========================================= */

        .vw-404-heading {
          margin: 24px 0 0;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size: clamp(1.7rem, 3vw, 2.25rem);

          line-height: 1.1;

          letter-spacing: -0.025em;

          color:
            var(--color-text, #2B2625) !important;
        }


        /* =========================================
           DESCRIPTION
        ========================================= */

        .vw-404-description {
          max-width: 500px;

          margin: 14px auto 0;

          color:
            var(--color-text-muted, #756F68) !important;

          font-size: 0.92rem;

          line-height: 1.75;
        }


        /* =========================================
           BUTTON
        ========================================= */

        .vw-404-home-button {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 9px;

          margin-top: 30px;

          min-height: 52px;

          padding: 0 23px;

          border: 0;

          border-radius: 14px;

          background:
            var(--color-forest, #3F5547);

          color: #FFFFFF !important;

          text-decoration: none;

          font-size: 0.82rem;

          font-weight: 800;

          box-shadow:
            0 12px 25px rgba(63, 85, 71, 0.18);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .vw-404-home-button span,
        .vw-404-home-button svg {
          color: #FFFFFF !important;
        }


        .vw-404-home-button:hover {
          transform: translateY(-2px);

          background: #34483B;

          color: #FFFFFF !important;

          box-shadow:
            0 16px 30px rgba(63, 85, 71, 0.24);
        }


        .vw-404-arrow {
          width: 27px;
          height: 27px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.16);
        }


        /* =========================================
           SMALL BRAND MESSAGE
        ========================================= */

        .vw-404-footer {
          margin-top: 28px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 7px;

          color: #948D84 !important;

          font-size: 0.66rem;

          letter-spacing: 0.04em;
        }


        .vw-404-footer svg {
          color:
            var(--color-ochre, #D4A359) !important;
        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 767px) {

          .vw-404-page {
            min-height: 100vh;

            padding: 45px 16px 65px;
          }

          .vw-404-card {
            padding: 45px 25px;

            border-radius: 24px;
          }

          .vw-404-number {
            font-size: 5.5rem;
          }

          .vw-404-heading {
            font-size: 1.65rem;
          }

          .vw-404-description {
            font-size: 0.84rem;
          }

        }


        @media (max-width: 430px) {

          .vw-404-card {
            padding-left: 20px;
            padding-right: 20px;
          }

          .vw-404-number {
            font-size: 5rem;
          }

        }

      `}</style>


      <div className="container">

        <div className="vw-404-card">

          {/* ICON */}

          <div className="vw-404-icon">

            <FaShieldAlt size={29} />

          </div>


          {/* NUMBER */}

          <h1 className="vw-404-number">

            4<span>0</span>4

          </h1>


          {/* HEADING */}

          <h2 className="vw-404-heading">

            This page couldn't be found.

          </h2>


          {/* DESCRIPTION */}

          <p className="vw-404-description">

            Let's get you back to VeriWork. The address you entered
            might be broken or the page has been moved.

          </p>


          {/* HOME BUTTON */}

          <Link
            to="/"
            className="vw-404-home-button"
          >

            <FaHome size={13} />

            <span>
              Back Home
            </span>

            <span className="vw-404-arrow">

              <FaArrowRight size={10} />

            </span>

          </Link>


          {/* FOOTER */}

          <div className="vw-404-footer">

            <FaShieldAlt size={9} />

            <span>
              Trusted Work. Brighter Futures.
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default NotFound;