import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBuilding,
  FaLock,
  FaEnvelope,
  FaShieldAlt,
  FaArrowRight,
  FaCheck,
  FaFileContract,
} from "react-icons/fa";
import storage from "../utils/storage";
import { loginEmployer } from "../services/employerAuthService";

function EmployerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storage.getEmployerToken()) {
      navigate("/employer-dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginEmployer(formData);

      // Save employer session via storage abstraction
      await storage.saveEmployerSession({
        token: response.token,
        employer: response.employer,
      });

      toast.success("Employer Authentication Successful!");

      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 600);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Employer login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vw-employer-login-page">
      <style>{`
        /* ========================================
           PAGE
        ======================================== */

        .vw-employer-login-page {
          min-height: calc(100vh - 86px);
          padding: 70px 0 90px;
          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(212, 163, 89, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 20%,
              rgba(63, 85, 71, 0.09),
              transparent 28%
            ),
            var(--color-bg, #EFECE6);
          color: var(--color-text, #2B2625);
        }

        .vw-employer-login-shell {
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ========================================
           LEFT INTRO
        ======================================== */

        .vw-employer-intro {
          padding: 15px 25px 15px 0;
        }

        .vw-employer-eyebrow {
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

        .vw-employer-eyebrow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-ochre, #D4A359);
          box-shadow: 0 0 0 4px rgba(212, 163, 89, 0.13);
        }

        .vw-employer-heading {
          max-width: 560px;
          margin: 24px 0 0;
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(3rem, 5vw, 5rem);
          line-height: 0.98;
          letter-spacing: -0.045em;
          color: var(--color-text, #2B2625) !important;
        }

        .vw-employer-heading span {
          color: var(--color-forest, #3F5547) !important;
        }

        .vw-employer-description {
          max-width: 520px;
          margin: 23px 0 0;
          color: var(--color-text-muted, #756F68) !important;
          font-size: 1rem;
          line-height: 1.75;
        }

        /* ========================================
           TRUST POINTS
        ======================================== */

        .vw-employer-trust-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 28px;
          max-width: 390px;
        }

        .vw-employer-trust-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 13px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.58);
          border: 1px solid rgba(43, 38, 37, 0.07);
          color: var(--color-text, #2B2625) !important;
          font-size: 0.74rem;
          font-weight: 700;
        }

        .vw-employer-trust-icon {
          width: 25px;
          height: 25px;
          flex: 0 0 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #F8EDDB;
          color: var(--color-ochre, #D4A359) !important;
        }

        /* ========================================
           LOGIN CARD
        ======================================== */

        .vw-employer-login-card {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(43, 38, 37, 0.08);
          box-shadow:
            0 25px 70px rgba(43, 38, 37, 0.11),
            0 4px 15px rgba(43, 38, 37, 0.04);
          backdrop-filter: blur(12px);
        }

        .vw-employer-login-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            var(--color-ochre, #D4A359),
            var(--color-forest, #3F5547)
          );
          z-index: 3;
        }

        /* ========================================
           FORM PANEL
        ======================================== */

        .vw-employer-form-panel {
          padding: 44px 42px 38px;
        }

        .vw-employer-form-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border-radius: 999px;
          background: #F7EBD8;
          color: #986829 !important;
          font-size: 0.63rem;
          font-weight: 850;
          letter-spacing: 0.10em;
        }

        .vw-employer-form-title {
          margin: 20px 0 0;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 2.35rem;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: var(--color-text, #2B2625) !important;
        }

        .vw-employer-form-subtitle {
          margin: 9px 0 0;
          color: var(--color-text-muted, #756F68) !important;
          font-size: 0.83rem;
          line-height: 1.65;
        }

        /* ========================================
           FORM FIELDS
        ======================================== */

        .vw-employer-field {
          margin-top: 24px;
        }

        .vw-employer-label {
          display: block;
          margin-bottom: 8px;
          color: var(--color-text, #2B2625) !important;
          font-size: 0.73rem;
          font-weight: 800;
        }

        .vw-employer-input-wrap {
          position: relative;
        }

        .vw-employer-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-forest, #3F5547) !important;
          z-index: 2;
          font-size: 0.80rem;
        }

        .vw-employer-input {
          width: 100%;
          height: 55px;
          padding: 0 16px 0 44px;
          border: 1px solid rgba(43, 38, 37, 0.11);
          border-radius: 14px;
          outline: none;
          background: #F8F6F1;
          color: var(--color-text, #2B2625) !important;
          font-size: 0.84rem;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .vw-employer-input::placeholder {
          color: #9A948C !important;
        }

        .vw-employer-input:focus {
          background: #FFFFFF;
          border-color: rgba(63, 85, 71, 0.45);
          box-shadow: 0 0 0 4px rgba(63, 85, 71, 0.08);
        }

        /* Browser autofill */

        .vw-employer-input:-webkit-autofill,
        .vw-employer-input:-webkit-autofill:hover,
        .vw-employer-input:-webkit-autofill:focus,
        .vw-employer-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #F8F6F1 inset !important;
          -webkit-text-fill-color: #2B2625 !important;
          caret-color: #2B2625 !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        /* ========================================
           LOGIN BUTTON
        ======================================== */

        .vw-employer-submit {
          width: 100%;
          min-height: 55px;
          margin-top: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 15px;
          background: var(--color-ochre, #D4A359);
          color: #FFFFFF !important;
          font-size: 0.86rem;
          font-weight: 800;
          box-shadow: 0 12px 25px rgba(212, 163, 89, 0.20);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .vw-employer-submit span {
          color: #FFFFFF !important;
        }

        .vw-employer-submit svg {
          color: #FFFFFF !important;
        }

        .vw-employer-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #C28D3E;
          box-shadow: 0 16px 30px rgba(212, 163, 89, 0.27);
        }

        .vw-employer-submit:disabled {
          opacity: 0.72;
          cursor: wait;
        }

        .vw-employer-submit-arrow {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
        }

        /* ========================================
           SWITCH LINKS
        ======================================== */

        .vw-employer-switch {
          margin-top: 25px;
          padding-top: 21px;
          border-top: 1px solid rgba(43, 38, 37, 0.08);
          color: #756F68 !important;
          font-size: 0.72rem;
          line-height: 1.8;
        }

        .vw-employer-switch span {
          color: inherit !important;
        }

        .vw-employer-switch a {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 4px 6px;
          color: var(--color-forest, #3F5547) !important;
          font-weight: 800;
          text-decoration: none;
        }

        .vw-employer-switch a:hover {
          text-decoration: underline;
        }

        /* ========================================
           VISUAL PANEL
        ======================================== */

        .vw-employer-visual {
          position: relative;
          min-height: 590px;
          overflow: hidden;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            radial-gradient(
              circle at 78% 18%,
              rgba(212, 163, 89, 0.22),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #E8E3D8 0%,
              #F2EEE5 52%,
              #E3E9E1 100%
            );
        }

        .vw-employer-visual::before {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          top: -90px;
          right: -70px;
          border: 1px solid rgba(63, 85, 71, 0.12);
          border-radius: 50%;
        }

        .vw-employer-visual::after {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          bottom: -80px;
          left: -70px;
          border: 1px solid rgba(212, 163, 89, 0.22);
          border-radius: 50%;
        }

        .vw-employer-visual-content {
          position: relative;
          z-index: 2;
        }

        .vw-employer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vw-employer-brand-mark {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.70);
          border: 1px solid rgba(43, 38, 37, 0.08);
          color: var(--color-forest, #3F5547);
        }

        .vw-employer-brand-name {
          color: var(--color-text, #2B2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.35rem;
          font-weight: 800;
        }

        .vw-employer-brand-tagline {
          margin-top: 4px;
          color: #756F68 !important;
          font-size: 0.68rem;
        }

        .vw-employer-visual-heading {
          max-width: 390px;
          margin-top: 35px;
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(2.15rem, 3vw, 3.1rem);
          line-height: 1.04;
          letter-spacing: -0.035em;
          color: var(--color-text, #2B2625) !important;
        }

        .vw-employer-visual-heading span {
          color: var(--color-forest, #3F5547) !important;
        }

        /* ========================================
           CERTIFICATE MOCKUP
        ======================================== */

        .vw-certificate-wrap {
          position: relative;
          z-index: 2;
          margin: 25px 0;
          display: flex;
          justify-content: center;
        }

        .vw-certificate-card {
          width: min(100%, 350px);
          padding: 24px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(43, 38, 37, 0.09);
          box-shadow: 0 22px 45px rgba(43, 38, 37, 0.12);
          transform: rotate(-2deg);
        }

        .vw-certificate-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(43, 38, 37, 0.09);
        }

        .vw-certificate-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #E4ECE5;
          color: var(--color-forest, #3F5547);
        }

        .vw-certificate-label {
          color: #918A82 !important;
          font-size: 0.60rem;
          font-weight: 800;
          letter-spacing: 0.10em;
          text-transform: uppercase;
        }

        .vw-certificate-title {
          margin-top: 15px;
          color: var(--color-text, #2B2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.45rem;
          font-weight: 800;
        }

        .vw-certificate-row {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 12px;
          color: #756F68 !important;
          font-size: 0.68rem;
        }

        .vw-certificate-check {
          width: 19px;
          height: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #E4ECE5;
          color: var(--color-forest, #3F5547);
        }

        .vw-certificate-status {
          margin-top: 18px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          background: #F7EBD8;
          color: #986829 !important;
          font-size: 0.65rem;
          font-weight: 800;
        }

        /* ========================================
           FOOTER MESSAGE
        ======================================== */

        .vw-employer-visual-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #756F68 !important;
          font-size: 0.67rem;
        }

        .vw-employer-visual-footer svg {
          color: var(--color-forest, #3F5547) !important;
        }

        /* ========================================
           RESPONSIVE
        ======================================== */

        @media (max-width: 991px) {
          .vw-employer-intro {
            padding-right: 0;
            margin-bottom: 35px;
            text-align: center;
          }

          .vw-employer-description {
            margin-left: auto;
            margin-right: auto;
          }

          .vw-employer-trust-list {
            margin-left: auto;
            margin-right: auto;
          }

          .vw-employer-heading {
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 767px) {
          .vw-employer-login-page {
            min-height: 100vh;
            padding: 42px 0 65px;
          }

          .vw-employer-heading {
            font-size: 3rem;
          }

          .vw-employer-login-card {
            border-radius: 24px;
          }

          .vw-employer-form-panel {
            padding: 34px 22px 30px;
          }

          .vw-employer-form-title {
            font-size: 2rem;
          }

          .vw-employer-visual {
            display: none;
          }
        }

        @media (max-width: 430px) {
          .vw-employer-heading {
            font-size: 2.55rem;
          }

          .vw-employer-form-panel {
            padding-left: 18px;
            padding-right: 18px;
          }
        }
      `}</style>

      <div className="container">
        <div className="vw-employer-login-shell">

          <div className="row align-items-center g-5">

            {/* =========================================
                INTRO
            ========================================= */}

            <div className="col-lg-5">
              <div className="vw-employer-intro">

                <div className="vw-employer-eyebrow">
                  <span className="vw-employer-eyebrow-dot"></span>
                  <span>EMPLOYER PORTAL</span>
                </div>

                <h1 className="vw-employer-heading">
                  Hire with <span>trust.</span>
                  <br />
                  Build reliability.
                </h1>

                <p className="vw-employer-description">
                  Manage your domestic workforce, maintain verified
                  employment records, and create trusted work credentials
                  through VeriWork.
                </p>

                <div className="vw-employer-trust-list">

                  <div className="vw-employer-trust-item">
                    <span className="vw-employer-trust-icon">
                      <FaShieldAlt size={11} />
                    </span>
                    Secure employer identity
                  </div>

                  <div className="vw-employer-trust-item">
                    <span className="vw-employer-trust-icon">
                      <FaFileContract size={11} />
                    </span>
                    Verified employment records
                  </div>

                  <div className="vw-employer-trust-item">
                    <span className="vw-employer-trust-icon">
                      <FaCheck size={11} />
                    </span>
                    On-chain work certificates
                  </div>

                </div>

              </div>
            </div>

            {/* =========================================
                LOGIN CARD
            ========================================= */}

            <div className="col-lg-7">

              <div className="vw-employer-login-card">

                <div className="row g-0">

                  {/* =====================================
                      FORM
                  ===================================== */}

                  <div className="col-md-6">

                    <div className="vw-employer-form-panel">

                      <div className="vw-employer-form-eyebrow">
                        <FaBuilding size={10} />
                        EMPLOYER & ISSUER
                      </div>

                      <h2 className="vw-employer-form-title">
                        Welcome Back
                      </h2>

                      <p className="vw-employer-form-subtitle">
                        Sign in to manage your household and workforce
                        credentials.
                      </p>

                      <form onSubmit={handleSubmit}>

                        {/* EMAIL */}

                        <div className="vw-employer-field">

                          <label className="vw-employer-label">
                            Business / Household Email
                          </label>

                          <div className="vw-employer-input-wrap">

                            <FaEnvelope className="vw-employer-input-icon" />

                            <input
                              type="email"
                              name="email"
                              className="vw-employer-input"
                              placeholder="employer@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />

                          </div>

                        </div>

                        {/* PASSWORD */}

                        <div className="vw-employer-field">

                          <label className="vw-employer-label">
                            Password
                          </label>

                          <div className="vw-employer-input-wrap">

                            <FaLock className="vw-employer-input-icon" />

                            <input
                              type="password"
                              name="password"
                              className="vw-employer-input"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />

                          </div>

                        </div>

                        {/* SUBMIT */}

                        <button
                          type="submit"
                          className="vw-employer-submit"
                          disabled={loading}
                        >

                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              ></span>

                              <span>Logging In...</span>
                            </>
                          ) : (
                            <>
                              <span>Login as Employer</span>

                              <span className="vw-employer-submit-arrow">
                                <FaArrowRight size={11} />
                              </span>
                            </>
                          )}

                        </button>

                      </form>

                      {/* SWITCH LINKS */}

                      <div className="vw-employer-switch">

                        <div>
                          <span>
                            New employer or household?{" "}
                          </span>

                          <Link to="/register-employer">
                            Create employer account
                          </Link>
                        </div>

                        <div style={{ marginTop: "5px" }}>
                          <span>
                            Are you a domestic worker?{" "}
                          </span>

                          <Link to="/login">
                            Worker Login →
                          </Link>
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* =====================================
                      VISUAL PANEL
                  ===================================== */}

                  <div className="col-md-6">

                    <div className="vw-employer-visual">

                      <div className="vw-employer-visual-content">

                        <div className="vw-employer-brand">

                          <div className="vw-employer-brand-mark">
                            <FaBuilding size={17} />
                          </div>

                          <div>
                            <div className="vw-employer-brand-name">
                              VeriWork
                            </div>

                            <div className="vw-employer-brand-tagline">
                              Trusted Work. Brighter Futures.
                            </div>
                          </div>

                        </div>

                        <h2 className="vw-employer-visual-heading">
                          Create a workforce built on{" "}
                          <span>trust.</span>
                        </h2>

                      </div>

                      {/* Certificate Mockup */}

                      <div className="vw-certificate-wrap">

                        <div className="vw-certificate-card">

                          <div className="vw-certificate-top">

                            <div className="vw-certificate-icon">
                              <FaFileContract size={17} />
                            </div>

                            <span className="vw-certificate-label">
                              VERIFIED CREDENTIAL
                            </span>

                          </div>

                          <div className="vw-certificate-title">
                            Work Certificate
                          </div>

                          <div className="vw-certificate-row">
                            <span className="vw-certificate-check">
                              <FaCheck size={8} />
                            </span>
                            Employment verified
                          </div>

                          <div className="vw-certificate-row">
                            <span className="vw-certificate-check">
                              <FaCheck size={8} />
                            </span>
                            Work history recorded
                          </div>

                          <div className="vw-certificate-row">
                            <span className="vw-certificate-check">
                              <FaCheck size={8} />
                            </span>
                            Employer authenticated
                          </div>

                          <div className="vw-certificate-status">
                            <FaShieldAlt size={10} />
                            Secured on Ethereum EVM
                          </div>

                        </div>

                      </div>

                      <div className="vw-employer-visual-footer">

                        <FaShieldAlt size={11} />

                        <span>
                          Authorized issuer network · Secure verification
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default EmployerLogin;