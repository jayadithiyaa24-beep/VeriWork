import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerEmployer } from "../services/employerService";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import employerIllustration from "../assets/employer_illustration.jpg";

function RegisterEmployer() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employerName: "",
    phone: "",
    email: "",
    password: "",
  });

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
      const response = await registerEmployer(formData);

      toast.success(
        response.message || "Employer Registered Successfully!"
      );

      setTimeout(() => {
        navigate("/employer-login");
      }, 1000);
    } catch (error) {
      console.error("Employer Registration Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Employer Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vw-employer-register-page">

      <style>{`

        /* =========================================
           PAGE
        ========================================= */

        .vw-employer-register-page {
          min-height: calc(100vh - 86px);

          padding: 65px 0 85px;

          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(212, 163, 89, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 18%,
              rgba(63, 85, 71, 0.09),
              transparent 28%
            ),
            var(--color-bg, #EFECE6);

          color: var(--color-text, #2B2625);
        }


        .vw-employer-register-shell {
          max-width: 1180px;
          margin: 0 auto;
        }


        /* =========================================
           MAIN CARD
        ========================================= */

        .vw-employer-register-card {
          position: relative;

          overflow: hidden;

          border-radius: 30px;

          background:
            rgba(255, 255, 255, 0.80);

          border:
            1px solid rgba(43, 38, 37, 0.08);

          box-shadow:
            0 28px 75px rgba(43, 38, 37, 0.11),
            0 5px 18px rgba(43, 38, 37, 0.04);

          backdrop-filter: blur(12px);
        }


        .vw-employer-register-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 4px;

          background:
            linear-gradient(
              90deg,
              var(--color-ochre, #D4A359),
              var(--color-forest, #3F5547)
            );

          z-index: 5;
        }


        /* =========================================
           LEFT VISUAL PANEL
        ========================================= */

        .vw-employer-register-visual {
          position: relative;

          min-height: 690px;

          overflow: hidden;

          padding: 42px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(212, 163, 89, 0.22),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #E8E3D8 0%,
              #F2EEE5 52%,
              #E2E9E2 100%
            );
        }


        .vw-employer-register-visual::before {
          content: "";

          position: absolute;

          width: 270px;
          height: 270px;

          top: -100px;
          right: -75px;

          border:
            1px solid rgba(63, 85, 71, 0.12);

          border-radius: 50%;
        }


        .vw-employer-register-visual::after {
          content: "";

          position: absolute;

          width: 190px;
          height: 190px;

          bottom: -90px;
          left: -75px;

          border:
            1px solid rgba(212, 163, 89, 0.20);

          border-radius: 50%;
        }


        .vw-employer-register-visual-content {
          position: relative;

          z-index: 2;
        }


        /* =========================================
           BRAND
        ========================================= */

        .vw-employer-register-brand {
          display: flex;

          align-items: center;

          gap: 10px;
        }


        .vw-employer-register-brand-icon {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.72);

          border:
            1px solid rgba(43, 38, 37, 0.08);

          color:
            var(--color-forest, #3F5547);
        }


        .vw-employer-register-brand-name {
          color:
            var(--color-text, #2B2625) !important;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size: 1.35rem;

          font-weight: 800;
        }


        .vw-employer-register-brand-tagline {
          margin-top: 3px;

          color: #756F68 !important;

          font-size: 0.68rem;
        }


        /* =========================================
           VISUAL HEADING
        ========================================= */

        .vw-employer-register-heading {
          max-width: 430px;

          margin-top: 38px;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size:
            clamp(2.4rem, 4vw, 4rem);

          line-height: 0.99;

          letter-spacing: -0.045em;

          color:
            var(--color-text, #2B2625) !important;
        }


        .vw-employer-register-heading span {
          color:
            var(--color-forest, #3F5547) !important;
        }


        .vw-employer-register-description {
          max-width: 430px;

          margin-top: 18px;

          color:
            #756F68 !important;

          font-size: 0.86rem;

          line-height: 1.75;
        }


        /* =========================================
           ILLUSTRATION
        ========================================= */

        .vw-employer-register-image-wrap {
          position: relative;

          z-index: 2;

          margin: 25px 0;

          display: flex;

          justify-content: center;
        }


        .vw-employer-register-image-frame {
          position: relative;

          width: min(100%, 365px);

          padding: 8px;

          border-radius:
            120px 120px 24px 24px;

          background:
            rgba(255, 255, 255, 0.68);

          box-shadow:
            0 22px 48px rgba(43, 38, 37, 0.13);
        }


        .vw-employer-register-image {
          width: 100%;

          height: 290px;

          display: block;

          object-fit: cover;

          border-radius:
            112px 112px 17px 17px;
        }


        /* =========================================
           VERIFIED BADGE
        ========================================= */

        .vw-employer-register-verified {
          position: absolute;

          right: -15px;

          bottom: 20px;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 10px 14px;

          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.94);

          border:
            1px solid rgba(43, 38, 37, 0.07);

          box-shadow:
            0 10px 28px rgba(43, 38, 37, 0.12);

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.68rem;

          font-weight: 800;
        }


        .vw-employer-register-verified-icon {
          width: 23px;
          height: 23px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            var(--color-forest, #3F5547);

          color: #FFFFFF !important;
        }


        /* =========================================
           BENEFITS
        ========================================= */

        .vw-employer-register-benefits {
          position: relative;

          z-index: 2;

          display: flex;

          flex-direction: column;

          gap: 9px;
        }


        .vw-employer-register-benefit {
          display: flex;

          align-items: center;

          gap: 10px;

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.70rem;

          font-weight: 750;
        }


        .vw-employer-register-benefit-icon {
          width: 24px;
          height: 24px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex: 0 0 24px;

          border-radius: 50%;

          background:
            #F7EBD8;

          color:
            var(--color-ochre, #D4A359) !important;
        }


        /* =========================================
           FORM PANEL
        ========================================= */

        .vw-employer-register-form-panel {
          padding: 46px 45px 40px;

          background:
            rgba(255, 255, 255, 0.82);
        }


        .vw-employer-register-eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding: 7px 11px;

          border-radius: 999px;

          background:
            #F7EBD8;

          color:
            #986829 !important;

          font-size: 0.63rem;

          font-weight: 850;

          letter-spacing: 0.10em;
        }


        .vw-employer-register-title {
          margin: 20px 0 0;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size:
            clamp(2rem, 3vw, 2.7rem);

          line-height: 1.04;

          letter-spacing: -0.03em;

          color:
            var(--color-text, #2B2625) !important;
        }


        .vw-employer-register-subtitle {
          margin: 9px 0 0;

          color:
            var(--color-text-muted, #756F68) !important;

          font-size: 0.83rem;

          line-height: 1.65;
        }


        /* =========================================
           FORM
        ========================================= */

        .vw-employer-register-field {
          margin-top: 20px;
        }


        .vw-employer-register-label {
          display: block;

          margin-bottom: 8px;

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.73rem;

          font-weight: 800;
        }


        .vw-employer-register-input-wrap {
          position: relative;
        }


        .vw-employer-register-input-icon {
          position: absolute;

          left: 16px;
          top: 50%;

          transform: translateY(-50%);

          color:
            var(--color-forest, #3F5547) !important;

          z-index: 2;

          font-size: 0.78rem;
        }


        .vw-employer-register-input {
          width: 100%;

          height: 53px;

          padding:
            0 45px 0 43px;

          border:
            1px solid rgba(43, 38, 37, 0.11);

          border-radius: 14px;

          outline: none;

          background:
            #F8F6F1;

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.82rem;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .vw-employer-register-input::placeholder {
          color:
            #9A948C !important;
        }


        .vw-employer-register-input:focus {
          background: #FFFFFF;

          border-color:
            rgba(63, 85, 71, 0.45);

          box-shadow:
            0 0 0 4px rgba(63, 85, 71, 0.08);
        }


        /* Autofill */

        .vw-employer-register-input:-webkit-autofill,
        .vw-employer-register-input:-webkit-autofill:hover,
        .vw-employer-register-input:-webkit-autofill:focus,
        .vw-employer-register-input:-webkit-autofill:active {
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
           PASSWORD BUTTON
        ========================================= */

        .vw-employer-register-password-button {
          position: absolute;

          top: 50%;
          right: 12px;

          transform: translateY(-50%);

          width: 32px;
          height: 32px;

          display: flex;

          align-items: center;
          justify-content: center;

          border: 0;

          border-radius: 9px;

          background: transparent;

          color:
            #8A837B !important;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }


        .vw-employer-register-password-button:hover {
          background:
            rgba(63, 85, 71, 0.08);

          color:
            var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           SUBMIT
        ========================================= */

        .vw-employer-register-submit {
          width: 100%;

          min-height: 55px;

          margin-top: 27px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 9px;

          border: 0;

          border-radius: 15px;

          background:
            var(--color-ochre, #D4A359);

          color: #FFFFFF !important;

          font-size: 0.84rem;

          font-weight: 800;

          box-shadow:
            0 12px 25px rgba(212, 163, 89, 0.20);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .vw-employer-register-submit span,
        .vw-employer-register-submit svg {
          color: #FFFFFF !important;
        }


        .vw-employer-register-submit:hover:not(:disabled) {
          transform: translateY(-2px);

          background:
            #C28D3E;

          box-shadow:
            0 16px 30px rgba(212, 163, 89, 0.27);
        }


        .vw-employer-register-submit:disabled {
          opacity: 0.72;

          cursor: wait;
        }


        .vw-employer-register-submit-arrow {
          width: 28px;
          height: 28px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.18);
        }


        /* =========================================
           LOGIN LINK
        ========================================= */

        .vw-employer-register-login {
          margin-top: 23px;

          padding-top: 20px;

          border-top:
            1px solid rgba(43, 38, 37, 0.08);

          text-align: center;

          color:
            #756F68 !important;

          font-size: 0.72rem;
        }


        .vw-employer-register-login span {
          color: inherit !important;
        }


        .vw-employer-register-login a {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 4px 6px;
          color:
            var(--color-forest, #3F5547) !important;

          font-weight: 800;

          text-decoration: none;
        }


        .vw-employer-register-login a:hover {
          text-decoration: underline;
        }


        /* =========================================
           SECURITY MESSAGE
        ========================================= */

        .vw-employer-register-security {
          margin-top: 20px;

          padding: 11px 13px;

          display: flex;

          align-items: center;

          gap: 9px;

          border-radius: 12px;

          background:
            #F4F1EA;

          color:
            #756F68 !important;

          font-size: 0.64rem;

          line-height: 1.5;
        }


        .vw-employer-register-security svg {
          flex: 0 0 auto;

          color:
            var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 991px) {

          .vw-employer-register-form-panel {
            padding: 40px 35px;
          }

        }


        @media (max-width: 767px) {

          .vw-employer-register-page {
            min-height: 100vh;

            padding: 42px 0 65px;
          }


          .vw-employer-register-card {
            border-radius: 24px;
          }


          .vw-employer-register-form-panel {
            padding: 35px 22px 30px;
          }


          .vw-employer-register-title {
            font-size: 2.15rem;
          }


          .vw-employer-register-visual {
            display: none;
          }

        }


        @media (max-width: 430px) {

          .vw-employer-register-form-panel {
            padding-left: 18px;
            padding-right: 18px;
          }


          .vw-employer-register-title {
            font-size: 1.95rem;
          }

        }

      `}</style>


      <div className="container">

        <div className="vw-employer-register-shell">

          <div className="vw-employer-register-card">

            <div className="row g-0 align-items-stretch">


              {/* =========================================
                  LEFT VISUAL
              ========================================= */}

              <div className="col-md-5">

                <div className="vw-employer-register-visual">


                  <div className="vw-employer-register-visual-content">

                    {/* BRAND */}

                    <div className="vw-employer-register-brand">

                      <div className="vw-employer-register-brand-icon">

                        <FaBuilding size={17} />

                      </div>

                      <div>

                        <div className="vw-employer-register-brand-name">
                          VeriWork
                        </div>

                        <div className="vw-employer-register-brand-tagline">
                          Trusted Work. Brighter Futures.
                        </div>

                      </div>

                    </div>


                    {/* HEADING */}

                    <h2 className="vw-employer-register-heading">

                      Hire with{" "}

                      <span>
                        trust.
                      </span>

                      <br />

                      Build lasting
                      relationships.

                    </h2>


                    <p className="vw-employer-register-description">

                      Create your employer identity and connect
                      with verified domestic workers through a
                      secure and transparent work platform.

                    </p>

                  </div>


                  {/* ILLUSTRATION */}

                  <div className="vw-employer-register-image-wrap">

                    <div className="vw-employer-register-image-frame">

                      <img
                        src={employerIllustration}
                        alt="VeriWork Employer"
                        className="vw-employer-register-image"
                      />


                      <div className="vw-employer-register-verified">

                        <span className="vw-employer-register-verified-icon">

                          <FaCheck size={9} />

                        </span>

                        Verified Employer

                      </div>

                    </div>

                  </div>


                  {/* BENEFITS */}

                  <div className="vw-employer-register-benefits">

                    <div className="vw-employer-register-benefit">

                      <span className="vw-employer-register-benefit-icon">

                        <FaCheck size={8} />

                      </span>

                      Access verified worker profiles

                    </div>


                    <div className="vw-employer-register-benefit">

                      <span className="vw-employer-register-benefit-icon">

                        <FaCheck size={8} />

                      </span>

                      Secure employment records

                    </div>


                    <div className="vw-employer-register-benefit">

                      <span className="vw-employer-register-benefit-icon">

                        <FaCheck size={8} />

                      </span>

                      Build trusted work relationships

                    </div>

                  </div>

                </div>

              </div>


              {/* =========================================
                  FORM
              ========================================= */}

              <div className="col-md-7">

                <div className="vw-employer-register-form-panel">


                  {/* HEADER */}

                  <div>

                    <div className="vw-employer-register-eyebrow">

                      <FaBuilding size={10} />

                      EMPLOYER ONBOARDING

                    </div>


                    <h1 className="vw-employer-register-title">

                      Create Employer Account

                    </h1>


                    <p className="vw-employer-register-subtitle">

                      Find and hire verified domestic workers
                      through VeriWork.

                    </p>

                  </div>


                  {/* FORM */}

                  <form onSubmit={handleSubmit}>


                    {/* NAME */}

                    <div className="vw-employer-register-field">

                      <label className="vw-employer-register-label">

                        Full Name / Company Name

                      </label>


                      <div className="vw-employer-register-input-wrap">

                        <FaUser className="vw-employer-register-input-icon" />

                        <input
                          type="text"
                          name="employerName"
                          className="vw-employer-register-input"
                          placeholder="Enter your name or company name"
                          value={formData.employerName}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    {/* PHONE */}

                    <div className="vw-employer-register-field">

                      <label className="vw-employer-register-label">

                        Phone Number

                      </label>


                      <div className="vw-employer-register-input-wrap">

                        <FaPhone className="vw-employer-register-input-icon" />

                        <input
                          type="tel"
                          name="phone"
                          className="vw-employer-register-input"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    {/* EMAIL */}

                    <div className="vw-employer-register-field">

                      <label className="vw-employer-register-label">

                        Email Address

                      </label>


                      <div className="vw-employer-register-input-wrap">

                        <FaEnvelope className="vw-employer-register-input-icon" />

                        <input
                          type="email"
                          name="email"
                          className="vw-employer-register-input"
                          placeholder="employer@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="vw-employer-register-field">

                      <label className="vw-employer-register-label">

                        Password

                      </label>


                      <div className="vw-employer-register-input-wrap">

                        <FaLock className="vw-employer-register-input-icon" />

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          name="password"
                          className="vw-employer-register-input"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />


                        <button
                          type="button"
                          className="vw-employer-register-password-button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >

                          {showPassword ? (
                            <FaEyeSlash size={13} />
                          ) : (
                            <FaEye size={13} />
                          )}

                        </button>

                      </div>

                    </div>


                    {/* SUBMIT */}

                    <button
                      type="submit"
                      className="vw-employer-register-submit"
                      disabled={loading}
                    >

                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          ></span>

                          <span>
                            Creating Profile...
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            Create Employer Profile
                          </span>

                          <span className="vw-employer-register-submit-arrow">

                            <FaArrowRight size={10} />

                          </span>
                        </>
                      )}

                    </button>

                  </form>


                  {/* LOGIN */}

                  <div className="vw-employer-register-login">

                    <span>
                      Already registered?{" "}
                    </span>

                    <Link to="/employer-login">
                      Login here
                    </Link>

                  </div>


                  {/* SECURITY */}

                  <div className="vw-employer-register-security">

                    <FaShieldAlt size={12} />

                    <span>
                      Your employer information is securely
                      handled by the VeriWork authentication
                      system.
                    </span>

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

export default RegisterEmployer;