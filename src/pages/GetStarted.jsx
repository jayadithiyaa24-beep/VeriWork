import { Link } from "react-router-dom";
import {
  FaUserCheck,
  FaBuilding,
  FaArrowRight,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";

function GetStarted() {
  return (
    <div className="vw-get-started-page">
      <style>{`
        /* ========================================
           PAGE
        ======================================== */

        .vw-get-started-page {
          min-height: calc(100vh - 86px);
          padding: 70px 0 95px;
          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(212, 163, 89, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 20%,
              rgba(63, 85, 71, 0.08),
              transparent 28%
            ),
            var(--color-bg, #EFECE6);
          color: var(--color-text, #2B2625);
        }

        .vw-get-started-shell {
          max-width: 1160px;
          margin: 0 auto;
        }

        /* ========================================
           HEADER
        ======================================== */

        .vw-get-started-header {
          max-width: 720px;
          margin: 0 auto 58px;
          text-align: center;
        }

        .vw-get-started-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(43, 38, 37, 0.08);
          box-shadow: 0 8px 22px rgba(43, 38, 37, 0.05);
          color: var(--color-forest, #3F5547) !important;
          font-size: 0.70rem;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .vw-get-started-eyebrow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-ochre, #D4A359);
          box-shadow: 0 0 0 4px rgba(212, 163, 89, 0.13);
        }

        .vw-get-started-title {
          margin: 22px 0 0;
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(3rem, 5vw, 4.8rem);
          line-height: 0.98;
          letter-spacing: -0.045em;
          color: var(--color-text, #2B2625) !important;
        }

        .vw-get-started-title span {
          color: var(--color-forest, #3F5547) !important;
        }

        .vw-get-started-description {
          max-width: 650px;
          margin: 22px auto 0;
          color: var(--color-text-muted, #756F68) !important;
          font-size: 0.98rem;
          line-height: 1.75;
        }

        /* ========================================
           CARDS
        ======================================== */

        .vw-account-card {
          position: relative;
          height: 100%;
          overflow: hidden;
          padding: 42px 40px 38px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.76);
          border: 1px solid rgba(43, 38, 37, 0.08);
          box-shadow:
            0 22px 55px rgba(43, 38, 37, 0.08),
            0 3px 12px rgba(43, 38, 37, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .vw-account-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 34px;
          right: 34px;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: var(--color-forest, #3F5547);
        }

        .vw-account-card-employer::before {
          background: var(--color-ochre, #D4A359);
        }

        .vw-account-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 30px 70px rgba(43, 38, 37, 0.12),
            0 5px 18px rgba(43, 38, 37, 0.04);
          border-color: rgba(63, 85, 71, 0.14);
        }

        /* ========================================
           ICONS
        ======================================== */

        .vw-account-icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border-radius: 21px;
          background: #E4ECE5;
          color: var(--color-forest, #3F5547);
          box-shadow:
            inset 0 0 0 1px rgba(63, 85, 71, 0.05),
            0 8px 20px rgba(63, 85, 71, 0.07);
        }

        .vw-account-icon-employer {
          background: #F8EDDB;
          color: var(--color-ochre, #C88D38);
          box-shadow:
            inset 0 0 0 1px rgba(212, 163, 89, 0.08),
            0 8px 20px rgba(212, 163, 89, 0.08);
        }

        .vw-account-icon svg {
          transition: transform 0.25s ease;
        }

        .vw-account-card:hover .vw-account-icon svg {
          transform: scale(1.08);
        }

        /* ========================================
           CARD CONTENT
        ======================================== */

        .vw-account-title {
          margin: 0;
          color: var(--color-text, #2B2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 2rem;
          line-height: 1.05;
          letter-spacing: -0.025em;
        }

        .vw-account-badge {
          display: inline-flex;
          align-items: center;
          margin-top: 14px;
          padding: 7px 12px;
          border-radius: 999px;
          background: #E7EEE8;
          color: var(--color-forest, #3F5547) !important;
          font-size: 0.64rem;
          font-weight: 850;
          letter-spacing: 0.10em;
        }

        .vw-account-badge-employer {
          background: #F7EBD8;
          color: #986829 !important;
        }

        .vw-account-description {
          min-height: 92px;
          max-width: 430px;
          margin: 20px 0 0;
          color: var(--color-text-muted, #756F68) !important;
          font-size: 0.84rem;
          line-height: 1.75;
        }

        /* ========================================
           BENEFITS
        ======================================== */

        .vw-account-benefits {
          width: 100%;
          margin-top: 22px;
          padding: 16px 18px;
          border-top: 1px solid rgba(43, 38, 37, 0.07);
          border-bottom: 1px solid rgba(43, 38, 37, 0.07);
          text-align: left;
        }

        .vw-account-benefit {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 7px 0;
          color: var(--color-text, #2B2625) !important;
          font-size: 0.72rem;
          font-weight: 650;
        }

        .vw-account-benefit-icon {
          width: 19px;
          height: 19px;
          flex: 0 0 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #E4ECE5;
          color: var(--color-forest, #3F5547);
        }

        .vw-account-benefit-icon-employer {
          background: #F8EDDB;
          color: var(--color-ochre, #C88D38);
        }

        /* ========================================
           BUTTONS
        ======================================== */

        .vw-account-actions {
          width: 100%;
          margin-top: 28px;
        }

        .vw-account-primary {
          width: 100%;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 15px;
          text-decoration: none;
          background: var(--color-forest, #3F5547);
          color: #FFFFFF !important;
          font-size: 0.80rem;
          font-weight: 800;
          box-shadow: 0 12px 25px rgba(63, 85, 71, 0.17);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .vw-account-primary span {
          color: #FFFFFF !important;
        }

        .vw-account-primary svg {
          color: #FFFFFF !important;
        }

        .vw-account-primary:hover {
          transform: translateY(-2px);
          background: #34483B;
          color: #FFFFFF !important;
          box-shadow: 0 16px 30px rgba(63, 85, 71, 0.23);
        }

        .vw-account-primary-employer {
          background: var(--color-ochre, #D4A359);
          box-shadow: 0 12px 25px rgba(212, 163, 89, 0.20);
        }

        .vw-account-primary-employer:hover {
          background: #C28D3E;
          box-shadow: 0 16px 30px rgba(212, 163, 89, 0.25);
        }

        .vw-account-arrow {
          width: 27px;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.17);
        }

        .vw-account-secondary {
          width: 100%;
          min-height: 45px;
          margin-top: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.56);
          border: 1px solid rgba(43, 38, 37, 0.10);
          color: var(--color-text, #2B2625) !important;
          font-size: 0.74rem;
          font-weight: 750;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .vw-account-secondary:hover {
          transform: translateY(-1px);
          background: #FFFFFF;
          border-color: rgba(43, 38, 37, 0.16);
          color: var(--color-forest, #3F5547) !important;
        }

        /* ========================================
           TRUST STRIP
        ======================================== */

        .vw-get-started-trust {
          max-width: 720px;
          margin: 45px auto 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #756F68 !important;
          font-size: 0.70rem;
          text-align: center;
        }

        .vw-get-started-trust svg {
          color: var(--color-forest, #3F5547) !important;
          flex: 0 0 auto;
        }

        /* ========================================
           RESPONSIVE
        ======================================== */

        @media (max-width: 991px) {
          .vw-get-started-page {
            padding-top: 55px;
          }

          .vw-get-started-header {
            margin-bottom: 42px;
          }

          .vw-account-description {
            min-height: auto;
          }
        }

        @media (max-width: 767px) {
          .vw-get-started-page {
            min-height: 100vh;
            padding: 42px 0 70px;
          }

          .vw-get-started-header {
            margin-bottom: 32px;
          }

          .vw-get-started-title {
            font-size: 3rem;
          }

          .vw-get-started-description {
            font-size: 0.90rem;
          }

          .vw-account-card {
            padding: 34px 24px 30px;
            border-radius: 24px;
          }

          .vw-account-title {
            font-size: 1.8rem;
          }

          .vw-get-started-trust {
            padding: 0 20px;
            line-height: 1.6;
          }
        }

        @media (max-width: 430px) {
          .vw-get-started-title {
            font-size: 2.55rem;
          }

          .vw-account-card {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>

      <div className="container">
        <div className="vw-get-started-shell">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="vw-get-started-header">

            <div className="vw-get-started-eyebrow">
              <span className="vw-get-started-eyebrow-dot"></span>
              <span>ONBOARDING GATEWAY</span>
            </div>

            <h1 className="vw-get-started-title">
              Welcome to{" "}
              <span>VeriWork.</span>
            </h1>

            <p className="vw-get-started-description">
              Select your account type to access India’s trusted work
              credential and verification protocol.
            </p>

          </div>

          {/* =========================================
              ACCOUNT CARDS
          ========================================= */}

          <div className="row justify-content-center g-4">

            {/* =====================================
                WORKER
            ===================================== */}

            <div className="col-lg-6">

              <div className="vw-account-card">

                <div className="vw-account-icon">
                  <FaUserCheck size={29} />
                </div>

                <h2 className="vw-account-title">
                  Domestic Worker
                </h2>

                <span className="vw-account-badge">
                  PASSPORT HOLDER
                </span>

                <p className="vw-account-description">
                  Build your verifiable work identity, carry proof of past
                  domestic employment, download official PDF certificates
                  with scannable QR, and earn verified ratings.
                </p>

                <div className="vw-account-benefits">

                  <div className="vw-account-benefit">
                    <span className="vw-account-benefit-icon">
                      <FaCheck size={9} />
                    </span>
                    Verifiable digital work identity
                  </div>

                  <div className="vw-account-benefit">
                    <span className="vw-account-benefit-icon">
                      <FaCheck size={9} />
                    </span>
                    Employment history and certificates
                  </div>

                  <div className="vw-account-benefit">
                    <span className="vw-account-benefit-icon">
                      <FaCheck size={9} />
                    </span>
                    Trusted ratings and reviews
                  </div>

                </div>

                <div className="vw-account-actions">

                  <Link
                    to="/register-worker"
                    className="vw-account-primary"
                  >
                    <span>Register as Worker</span>

                    <span className="vw-account-arrow">
                      <FaArrowRight size={11} />
                    </span>
                  </Link>

                  <Link
                    to="/login"
                    className="vw-account-secondary"
                  >
                    Worker Login
                  </Link>

                </div>

              </div>

            </div>

            {/* =====================================
                EMPLOYER
            ===================================== */}

            <div className="col-lg-6">

              <div className="vw-account-card vw-account-card-employer">

                <div className="vw-account-icon vw-account-icon-employer">
                  <FaBuilding size={28} />
                </div>

                <h2 className="vw-account-title">
                  Employer / Household
                </h2>

                <span className="vw-account-badge vw-account-badge-employer">
                  CREDENTIAL ISSUER
                </span>

                <p className="vw-account-description">
                  Establish verified domestic employment terms, record
                  monthly wages, issue on-chain work certificates on
                  Ethereum EVM, and submit mutual evaluations.
                </p>

                <div className="vw-account-benefits">

                  <div className="vw-account-benefit">
                    <span className="vw-account-benefit-icon vw-account-benefit-icon-employer">
                      <FaCheck size={9} />
                    </span>
                    Verified employment agreements
                  </div>

                  <div className="vw-account-benefit">
                    <span className="vw-account-benefit-icon vw-account-benefit-icon-employer">
                      <FaCheck size={9} />
                    </span>
                    Wage and work records
                  </div>

                  <div className="vw-account-benefit">
                    <span className="vw-account-benefit-icon vw-account-benefit-icon-employer">
                      <FaCheck size={9} />
                    </span>
                    On-chain certificates and evaluations
                  </div>

                </div>

                <div className="vw-account-actions">

                  <Link
                    to="/register-employer"
                    className="vw-account-primary vw-account-primary-employer"
                  >
                    <span>Register as Employer</span>

                    <span className="vw-account-arrow">
                      <FaArrowRight size={11} />
                    </span>
                  </Link>

                  <Link
                    to="/employer-login"
                    className="vw-account-secondary"
                  >
                    Employer Login
                  </Link>

                </div>

              </div>

            </div>

          </div>

          {/* =========================================
              TRUST MESSAGE
          ========================================= */}

          <div className="vw-get-started-trust">

            <FaShieldAlt size={12} />

            <span>
              Your identity and employment records are protected through
              VeriWork's secure verification system.
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}

export default GetStarted;