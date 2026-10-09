import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaLock,
  FaGoogle,
  FaArrowRight,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";
import storage from "../utils/storage";
import { loginWorker } from "../services/authService";
import workerIllustration from "../assets/worker_illustration.jpg";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storage.getWorkerToken()) {
      navigate("/worker-dashboard", { replace: true });
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
      const response = await loginWorker(formData);

      // Save worker session via storage abstraction
      await storage.saveWorkerSession({
        token: response.token,
        worker: response.worker,
      });

      toast.success("Worker Authentication Successful!");

      setTimeout(() => {
        navigate("/worker-dashboard");
      }, 600);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vw-worker-login-page">

      <style>{`

        /* =========================================
           PAGE
        ========================================= */

        .vw-worker-login-page {
          min-height: calc(100vh - 86px);
          padding: 70px 0 90px;

          background:
            radial-gradient(
              circle at 8% 12%,
              rgba(212, 163, 89, 0.10),
              transparent 24%
            ),
            radial-gradient(
              circle at 90% 18%,
              rgba(63, 85, 71, 0.09),
              transparent 28%
            ),
            var(--color-bg, #EFECE6);

          color: var(--color-text, #2B2625);
        }

        .vw-worker-login-shell {
          max-width: 1180px;
          margin: 0 auto;
        }


        /* =========================================
           LEFT INTRO
        ========================================= */

        .vw-worker-login-intro {
          padding: 15px 25px 15px 0;
        }

        .vw-worker-login-eyebrow {
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

        .vw-worker-login-eyebrow-dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: var(--color-ochre, #D4A359);

          box-shadow:
            0 0 0 4px rgba(212, 163, 89, 0.13);
        }


        .vw-worker-login-heading {
          max-width: 570px;

          margin: 24px 0 0;

          font-family: var(--font-serif, Georgia, serif);

          font-size: clamp(3rem, 5vw, 5rem);

          line-height: 0.98;

          letter-spacing: -0.045em;

          color: var(--color-text, #2B2625) !important;
        }

        .vw-worker-login-heading span {
          color: var(--color-forest, #3F5547) !important;
        }


        .vw-worker-login-description {
          max-width: 520px;

          margin: 23px 0 0;

          color: var(--color-text-muted, #756F68) !important;

          font-size: 1rem;

          line-height: 1.75;
        }


        /* =========================================
           TRUST BADGES
        ========================================= */

        .vw-worker-login-trust-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          margin-top: 28px;
        }

        .vw-worker-login-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 9px 12px;

          border-radius: 999px;

          background: rgba(255, 255, 255, 0.60);

          border: 1px solid rgba(43, 38, 37, 0.07);

          color: var(--color-text, #2B2625) !important;

          font-size: 0.72rem;

          font-weight: 750;
        }

        .vw-worker-login-trust-item svg {
          color: var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           LOGIN CARD
        ========================================= */

        .vw-worker-login-card {
          position: relative;

          overflow: hidden;

          border-radius: 30px;

          background: rgba(255, 255, 255, 0.80);

          border: 1px solid rgba(43, 38, 37, 0.08);

          box-shadow:
            0 25px 70px rgba(43, 38, 37, 0.11),
            0 4px 15px rgba(43, 38, 37, 0.04);

          backdrop-filter: blur(12px);
        }

        .vw-worker-login-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 4px;

          background: linear-gradient(
            90deg,
            var(--color-forest, #3F5547),
            var(--color-ochre, #D4A359)
          );

          z-index: 5;
        }


        /* =========================================
           FORM PANEL
        ========================================= */

        .vw-worker-login-form {
          padding: 42px 42px 38px;
        }


        .vw-worker-login-form-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          padding: 7px 11px;

          border-radius: 999px;

          background: #E4ECE5;

          color: var(--color-forest, #3F5547) !important;

          font-size: 0.63rem;

          font-weight: 850;

          letter-spacing: 0.10em;
        }


        .vw-worker-login-form-title {
          margin: 20px 0 0;

          font-family: var(--font-serif, Georgia, serif);

          font-size: 2.35rem;

          line-height: 1.05;

          letter-spacing: -0.025em;

          color: var(--color-text, #2B2625) !important;
        }


        .vw-worker-login-form-subtitle {
          margin: 9px 0 0;

          color: var(--color-text-muted, #756F68) !important;

          font-size: 0.83rem;

          line-height: 1.65;
        }


        /* =========================================
           FORM FIELDS
        ========================================= */

        .vw-worker-login-field {
          margin-top: 24px;
        }

        .vw-worker-login-label {
          display: block;

          margin-bottom: 8px;

          color: var(--color-text, #2B2625) !important;

          font-size: 0.73rem;

          font-weight: 800;

          letter-spacing: 0.02em;
        }


        .vw-worker-login-input-wrap {
          position: relative;
        }

        .vw-worker-login-input-icon {
          position: absolute;

          left: 16px;
          top: 50%;

          transform: translateY(-50%);

          color: var(--color-forest, #3F5547) !important;

          z-index: 2;

          font-size: 0.82rem;
        }


        .vw-worker-login-input {
          width: 100%;

          height: 54px;

          padding: 0 16px 0 44px;

          border: 1px solid rgba(43, 38, 37, 0.11);

          border-radius: 14px;

          outline: none;

          background: #F8F6F1;

          color: var(--color-text, #2B2625) !important;

          font-size: 0.85rem;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .vw-worker-login-input::placeholder {
          color: #9A948C !important;
        }


        .vw-worker-login-input:focus {
          background: #FFFFFF;

          border-color: rgba(63, 85, 71, 0.45);

          box-shadow:
            0 0 0 4px rgba(63, 85, 71, 0.08);
        }


        /* Autofill */

        .vw-worker-login-input:-webkit-autofill,
        .vw-worker-login-input:-webkit-autofill:hover,
        .vw-worker-login-input:-webkit-autofill:focus,
        .vw-worker-login-input:-webkit-autofill:active {
          -webkit-box-shadow:
            0 0 0 1000px #F8F6F1 inset !important;

          -webkit-text-fill-color:
            #2B2625 !important;

          caret-color:
            #2B2625 !important;

          transition:
            background-color 9999s ease-in-out 0s;
        }


        /* =========================================
           OPTIONS
        ========================================= */

        .vw-worker-login-options {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          margin-top: 15px;
        }


        .vw-worker-login-remember {
          display: flex;

          align-items: center;

          gap: 8px;
        }


        .vw-worker-login-checkbox {
          width: 16px;
          height: 16px;

          accent-color:
            var(--color-forest, #3F5547);
        }


        .vw-worker-login-remember label,
        .vw-worker-login-forgot {
          color: #756F68 !important;

          font-size: 0.72rem;
        }


        .vw-worker-login-forgot {
          border: 0;

          padding: 0;

          background: transparent;

          text-decoration: none;
        }


        .vw-worker-login-forgot:hover {
          color: var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           LOGIN BUTTON
        ========================================= */

        .vw-worker-login-submit {
          width: 100%;

          min-height: 55px;

          margin-top: 24px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          border: 0;

          border-radius: 15px;

          background: var(--color-forest, #3F5547);

          color: #FFFFFF !important;

          font-size: 0.87rem;

          font-weight: 800;

          box-shadow:
            0 12px 25px rgba(63, 85, 71, 0.18);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .vw-worker-login-submit span {
          color: #FFFFFF !important;
        }

        .vw-worker-login-submit svg {
          color: #FFFFFF !important;
        }


        .vw-worker-login-submit:hover:not(:disabled) {
          transform: translateY(-2px);

          background: #34483B;

          box-shadow:
            0 16px 30px rgba(63, 85, 71, 0.24);
        }


        .vw-worker-login-submit:disabled {
          opacity: 0.72;

          cursor: wait;
        }


        .vw-worker-login-submit-arrow {
          width: 28px;
          height: 28px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.16);
        }


        /* =========================================
           DIVIDER
        ========================================= */

        .vw-worker-login-divider {
          display: flex;

          align-items: center;

          gap: 12px;

          margin: 25px 0 17px;
        }

        .vw-worker-login-divider::before,
        .vw-worker-login-divider::after {
          content: "";

          flex: 1;

          height: 1px;

          background:
            rgba(43, 38, 37, 0.10);
        }

        .vw-worker-login-divider span {
          color: #948D84 !important;

          font-size: 0.68rem;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.10em;
        }


        /* =========================================
           GOOGLE BUTTON
        ========================================= */

        .vw-worker-google {
          width: 100%;

          min-height: 48px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          border: 1px solid rgba(43, 38, 37, 0.11);

          border-radius: 14px;

          background: rgba(255, 255, 255, 0.72);

          color: var(--color-text, #2B2625) !important;

          font-size: 0.78rem;

          font-weight: 750;

          transition: 0.2s ease;
        }

        .vw-worker-google:hover {
          transform: translateY(-1px);

          background: #FFFFFF;

          border-color:
            rgba(43, 38, 37, 0.17);
        }

        .vw-worker-google span {
          color: var(--color-text, #2B2625) !important;
        }

        .vw-worker-google svg {
          color: #DB4437 !important;
        }


        /* =========================================
           SWITCH LINKS
        ========================================= */

        .vw-worker-login-switch {
          margin-top: 24px;

          padding-top: 21px;

          border-top:
            1px solid rgba(43, 38, 37, 0.08);

          text-align: center;

          color: #756F68 !important;

          font-size: 0.72rem;

          line-height: 1.8;
        }

        .vw-worker-login-switch span {
          color: inherit !important;
        }

        .vw-worker-login-switch a {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 4px 6px;
          color:
            var(--color-forest, #3F5547) !important;

          font-weight: 800;

          text-decoration: none;
        }

        .vw-worker-login-switch a:hover {
          text-decoration: underline;
        }

        .vw-worker-login-employer {
          margin-top: 4px;
        }


        /* =========================================
           VISUAL PANEL
        ========================================= */

        .vw-worker-login-visual {
          position: relative;

          min-height: 620px;

          overflow: hidden;

          padding: 38px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          background:
            radial-gradient(
              circle at 78% 18%,
              rgba(212, 163, 89, 0.20),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #E7E5DD 0%,
              #F2F0EA 52%,
              #E2E8E0 100%
            );
        }


        .vw-worker-login-visual::before {
          content: "";

          position: absolute;

          width: 230px;
          height: 230px;

          top: -80px;
          right: -60px;

          border:
            1px solid rgba(63, 85, 71, 0.12);

          border-radius: 50%;
        }


        .vw-worker-login-visual::after {
          content: "";

          position: absolute;

          width: 150px;
          height: 150px;

          bottom: -65px;
          left: -50px;

          border:
            1px solid rgba(212, 163, 89, 0.22);

          border-radius: 50%;
        }


        .vw-worker-login-visual-content {
          position: relative;

          z-index: 2;
        }


        /* =========================================
           BRAND
        ========================================= */

        .vw-worker-login-brand {
          display: flex;

          align-items: center;

          gap: 10px;
        }


        .vw-worker-login-brand-mark {
          width: 38px;
          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.68);

          border:
            1px solid rgba(43, 38, 37, 0.08);

          color:
            var(--color-forest, #3F5547);

          font-size: 1.2rem;

          font-weight: 800;
        }


        .vw-worker-login-brand-name {
          color:
            var(--color-text, #2B2625) !important;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size: 1.35rem;

          font-weight: 800;
        }


        .vw-worker-login-brand-tagline {
          margin-top: 5px;

          color: #756F68 !important;

          font-size: 0.70rem;
        }


        /* =========================================
           ART HEADING
        ========================================= */

        .vw-worker-login-art-heading {
          max-width: 420px;

          margin-top: 35px;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size:
            clamp(2rem, 3vw, 3rem);

          line-height: 1.05;

          letter-spacing: -0.035em;

          color:
            var(--color-text, #2B2625) !important;
        }


        .vw-worker-login-art-heading span {
          color:
            var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           IMAGE
        ========================================= */

        .vw-worker-login-image-wrap {
          position: relative;

          z-index: 2;

          margin: 26px 0;

          display: flex;

          justify-content: center;
        }


        .vw-worker-login-image-frame {
          position: relative;

          width: min(100%, 360px);

          padding: 8px;

          border-radius:
            120px 120px 24px 24px;

          background:
            rgba(255, 255, 255, 0.65);

          box-shadow:
            0 20px 45px rgba(43, 38, 37, 0.13);
        }


        .vw-worker-login-img {
          width: 100%;

          height: 330px;

          display: block;

          object-fit: cover;

          object-position: center;

          border-radius:
            112px 112px 17px 17px;
        }


        /* =========================================
           VERIFIED WORKER
        ========================================= */

        .vw-worker-login-verified {
          position: absolute;

          right: -16px;

          bottom: 25px;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 10px 14px;

          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.93);

          border:
            1px solid rgba(43, 38, 37, 0.07);

          box-shadow:
            0 10px 28px rgba(43, 38, 37, 0.12);

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.70rem;

          font-weight: 800;
        }


        .vw-worker-login-verified-icon {
          width: 23px;
          height: 23px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background:
            var(--color-forest, #3F5547);

          color: #FFFFFF !important;

          font-size: 0.68rem;
        }


        /* =========================================
           VISUAL FOOTER
        ========================================= */

        .vw-worker-login-art-footer {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;

          gap: 8px;

          color: #756F68 !important;

          font-size: 0.68rem;
        }

        .vw-worker-login-art-footer svg {
          color:
            var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 991px) {

          .vw-worker-login-intro {
            padding-right: 0;

            margin-bottom: 35px;

            text-align: center;
          }

          .vw-worker-login-description {
            margin-left: auto;
            margin-right: auto;
          }

          .vw-worker-login-trust-list {
            justify-content: center;
          }

          .vw-worker-login-heading {
            margin-left: auto;
            margin-right: auto;
          }

        }


        @media (max-width: 767px) {

          .vw-worker-login-page {
            min-height: 100vh;

            padding: 42px 0 65px;
          }

          .vw-worker-login-heading {
            font-size: 3rem;
          }

          .vw-worker-login-card {
            border-radius: 23px;
          }

          .vw-worker-login-form {
            padding: 32px 22px 28px;
          }

          .vw-worker-login-form-title {
            font-size: 2rem;
          }

          .vw-worker-login-options {
            align-items: flex-start;
          }

          .vw-worker-login-visual {
            display: none;
          }

        }


        @media (max-width: 430px) {

          .vw-worker-login-heading {
            font-size: 2.55rem;
          }

          .vw-worker-login-trust-item {
            width: 100%;

            justify-content: center;
          }

          .vw-worker-login-options {
            flex-direction: column;

            gap: 8px;
          }

          .vw-worker-login-form {
            padding-left: 18px;
            padding-right: 18px;
          }

        }

      `}</style>


      <div className="container">

        <div className="vw-worker-login-shell">

          <div className="row align-items-center g-5">


            {/* =========================================
                INTRODUCTION
            ========================================= */}

            <div className="col-lg-5">

              <div className="vw-worker-login-intro">

                <div className="vw-worker-login-eyebrow">

                  <span className="vw-worker-login-eyebrow-dot"></span>

                  <span>
                    WORKER PORTAL
                  </span>

                </div>


                <h1 className="vw-worker-login-heading">

                  Welcome back to{" "}

                  <span>
                    trusted work.
                  </span>

                </h1>


                <p className="vw-worker-login-description">

                  Sign in to manage your verified work identity,
                  employment history, certificates, and trusted
                  professional profile.

                </p>


                <div className="vw-worker-login-trust-list">

                  <div className="vw-worker-login-trust-item">

                    <FaShieldAlt size={12} />

                    Secure Identity

                  </div>


                  <div className="vw-worker-login-trust-item">

                    <FaLock size={11} />

                    Protected Records

                  </div>


                  <div className="vw-worker-login-trust-item">

                    <FaUser size={11} />

                    Worker Dashboard

                  </div>

                </div>

              </div>

            </div>


            {/* =========================================
                LOGIN CARD
            ========================================= */}

            <div className="col-lg-7">

              <div className="vw-worker-login-card">

                <div className="row g-0">


                  {/* =====================================
                      FORM
                  ===================================== */}

                  <div className="col-md-6">

                    <div className="vw-worker-login-form">


                      <div className="vw-worker-login-form-eyebrow">

                        <FaUser size={10} />

                        WORKER PORTAL

                      </div>


                      <h2 className="vw-worker-login-form-title">

                        Welcome Back

                      </h2>


                      <p className="vw-worker-login-form-subtitle">

                        Sign in to your VeriWork account

                      </p>


                      <form onSubmit={handleSubmit}>


                        {/* EMAIL / PHONE */}

                        <div className="vw-worker-login-field">

                          <label className="vw-worker-login-label">

                            Email or Phone Number

                          </label>


                          <div className="vw-worker-login-input-wrap">

                            <FaUser className="vw-worker-login-input-icon" />

                            <input
                              type="text"
                              name="email"
                              className="vw-worker-login-input"
                              placeholder="Enter your email or phone"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />

                          </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="vw-worker-login-field">

                          <label className="vw-worker-login-label">

                            Password

                          </label>


                          <div className="vw-worker-login-input-wrap">

                            <FaLock className="vw-worker-login-input-icon" />

                            <input
                              type="password"
                              name="password"
                              className="vw-worker-login-input"
                              placeholder="Enter your password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />

                          </div>

                        </div>


                        {/* OPTIONS */}

                        <div className="vw-worker-login-options">

                          <div className="vw-worker-login-remember">

                            <input
                              type="checkbox"
                              className="vw-worker-login-checkbox"
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={(e) =>
                                setRememberMe(e.target.checked)
                              }
                            />

                            <label htmlFor="rememberMe">
                              Remember me
                            </label>

                          </div>


                          <button
                            type="button"
                            className="vw-worker-login-forgot"
                            onClick={() =>
                              toast.info(
                                "Password reset link will be sent to your verified email/phone."
                              )
                            }
                          >
                            Forgot password?
                          </button>

                        </div>


                        {/* LOGIN */}

                        <button
                          type="submit"
                          className="vw-worker-login-submit"
                          disabled={loading}
                        >

                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              ></span>

                              <span>
                                Signing In...
                              </span>
                            </>
                          ) : (
                            <>
                              <span>
                                Login
                              </span>

                              <span className="vw-worker-login-submit-arrow">

                                <FaArrowRight size={11} />

                              </span>
                            </>
                          )}

                        </button>


                        {/* DIVIDER */}

                        <div className="vw-worker-login-divider">

                          <span>
                            or
                          </span>

                        </div>


                        {/* GOOGLE */}

                        <button
                          type="button"
                          className="vw-worker-google"
                          onClick={() =>
                            toast.info(
                              "Google OAuth is available on enterprise deployment."
                            )
                          }
                        >

                          <FaGoogle size={14} />

                          <span>
                            Continue with Google
                          </span>

                        </button>

                      </form>


                      {/* SWITCH LINKS */}

                      <div className="vw-worker-login-switch">

                        <div>

                          <span>
                            Don't have an account?{" "}
                          </span>

                          <Link to="/register-worker">
                            Create one
                          </Link>

                        </div>


                        <div className="vw-worker-login-employer">

                          <span>
                            Are you an employer?{" "}
                          </span>

                          <Link to="/employer-login">
                            Employer Login →
                          </Link>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* =====================================
                      IMAGE / BRAND PANEL
                  ===================================== */}

                  <div className="col-md-6">

                    <div className="vw-worker-login-visual">


                      <div className="vw-worker-login-visual-content">


                        <div className="vw-worker-login-brand">

                          <div className="vw-worker-login-brand-mark">
                            ✦
                          </div>

                          <div>

                            <div className="vw-worker-login-brand-name">
                              VeriWork
                            </div>

                            <div className="vw-worker-login-brand-tagline">
                              Trusted Work. Brighter Futures.
                            </div>

                          </div>

                        </div>


                        <h2 className="vw-worker-login-art-heading">

                          Your work deserves to be{" "}

                          <span>
                            seen and trusted.
                          </span>

                        </h2>

                      </div>


                      {/* WORKER IMAGE */}

                      <div className="vw-worker-login-image-wrap">

                        <div className="vw-worker-login-image-frame">

                          <img
                            src={workerIllustration}
                            alt="VeriWork Worker"
                            className="vw-worker-login-img"
                          />


                          <div className="vw-worker-login-verified">

                            <span className="vw-worker-login-verified-icon">

                              <FaCheck size={10} />

                            </span>

                            Verified Worker

                          </div>

                        </div>

                      </div>


                      {/* FOOTER */}

                      <div className="vw-worker-login-art-footer">

                        <FaShieldAlt size={12} />

                        <span>
                          Zero-Knowledge Aadhaar SHA-256 Protected
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

export default Login;