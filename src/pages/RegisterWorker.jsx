import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWorker } from "../services/workerService";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaBriefcase,
  FaMapMarkerAlt,
  FaLock,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import workerIllustration from "../assets/worker_illustration.jpg";

function RegisterWorker() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    aadhaar: "",
    address: "",
    skills: "",
    experience: "",
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
      const response = await registerWorker(formData);

      toast.success(
        response.message || "Worker registered successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Worker Registration Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vw-worker-register-page">

      <style>{`

        /* =========================================
           PAGE
        ========================================= */

        .vw-worker-register-page {
          min-height: calc(100vh - 86px);

          padding: 60px 0 85px;

          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(212, 163, 89, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 20%,
              rgba(63, 85, 71, 0.10),
              transparent 28%
            ),
            var(--color-bg, #EFECE6);

          color: var(--color-text, #2B2625);
        }


        .vw-worker-register-shell {
          max-width: 1200px;
          margin: 0 auto;
        }


        /* =========================================
           MAIN CARD
        ========================================= */

        .vw-worker-register-card {
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


        .vw-worker-register-card::before {
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

          z-index: 5;
        }


        /* =========================================
           LEFT VISUAL PANEL
        ========================================= */

        .vw-worker-register-visual {
          position: relative;

          min-height: 760px;

          overflow: hidden;

          padding: 42px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(63, 85, 71, 0.14),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #E3E9E1 0%,
              #F0EEE7 52%,
              #E7E2D8 100%
            );
        }


        .vw-worker-register-visual::before {
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


        .vw-worker-register-visual::after {
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


        .vw-worker-register-visual-content {
          position: relative;

          z-index: 2;
        }


        /* =========================================
           BRAND
        ========================================= */

        .vw-worker-register-brand {
          display: flex;

          align-items: center;

          gap: 10px;
        }


        .vw-worker-register-brand-icon {
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


        .vw-worker-register-brand-name {
          color:
            var(--color-text, #2B2625) !important;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size: 1.35rem;

          font-weight: 800;
        }


        .vw-worker-register-brand-tagline {
          margin-top: 3px;

          color: #756F68 !important;

          font-size: 0.68rem;
        }


        /* =========================================
           HEADING
        ========================================= */

        .vw-worker-register-heading {
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


        .vw-worker-register-heading span {
          color:
            var(--color-forest, #3F5547) !important;
        }


        .vw-worker-register-description {
          max-width: 430px;

          margin-top: 18px;

          color:
            #756F68 !important;

          font-size: 0.86rem;

          line-height: 1.75;
        }


        /* =========================================
           IMAGE
        ========================================= */

        .vw-worker-register-image-wrap {
          position: relative;

          z-index: 2;

          margin: 20px 0;

          display: flex;

          justify-content: center;
        }


        .vw-worker-register-image-frame {
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


        .vw-worker-register-image {
          width: 100%;

          height: 280px;

          display: block;

          object-fit: cover;

          border-radius:
            112px 112px 17px 17px;
        }


        /* =========================================
           VERIFIED BADGE
        ========================================= */

        .vw-worker-register-verified {
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


        .vw-worker-register-verified-icon {
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

        .vw-worker-register-benefits {
          position: relative;

          z-index: 2;

          display: flex;

          flex-direction: column;

          gap: 9px;
        }


        .vw-worker-register-benefit {
          display: flex;

          align-items: center;

          gap: 10px;

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.70rem;

          font-weight: 750;
        }


        .vw-worker-register-benefit-icon {
          width: 24px;
          height: 24px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex: 0 0 24px;

          border-radius: 50%;

          background:
            #E4ECE5;

          color:
            var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           FORM PANEL
        ========================================= */

        .vw-worker-register-form-panel {
          padding: 44px 43px 38px;

          background:
            rgba(255, 255, 255, 0.82);
        }


        /* =========================================
           FORM HEADER
        ========================================= */

        .vw-worker-register-eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding: 7px 11px;

          border-radius: 999px;

          background:
            #E4ECE5;

          color:
            var(--color-forest, #3F5547) !important;

          font-size: 0.63rem;

          font-weight: 850;

          letter-spacing: 0.10em;
        }


        .vw-worker-register-title {
          margin: 19px 0 0;

          font-family:
            var(--font-serif, Georgia, serif);

          font-size:
            clamp(2rem, 3vw, 2.65rem);

          line-height: 1.04;

          letter-spacing: -0.03em;

          color:
            var(--color-text, #2B2625) !important;
        }


        .vw-worker-register-subtitle {
          margin: 9px 0 0;

          color:
            var(--color-text-muted, #756F68) !important;

          font-size: 0.82rem;

          line-height: 1.65;
        }


        /* =========================================
           FORM FIELDS
        ========================================= */

        .vw-worker-register-field {
          margin-top: 17px;
        }


        .vw-worker-register-label {
          display: block;

          margin-bottom: 7px;

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.71rem;

          font-weight: 800;
        }


        .vw-worker-register-input-wrap {
          position: relative;
        }


        .vw-worker-register-input-icon {
          position: absolute;

          left: 15px;
          top: 50%;

          transform: translateY(-50%);

          color:
            var(--color-forest, #3F5547) !important;

          z-index: 2;

          font-size: 0.75rem;
        }


        .vw-worker-register-input {
          width: 100%;

          height: 48px;

          padding:
            0 15px 0 41px;

          border:
            1px solid rgba(43, 38, 37, 0.11);

          border-radius: 13px;

          outline: none;

          background:
            #F8F6F1;

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.78rem;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .vw-worker-register-input::placeholder {
          color:
            #9A948C !important;
        }


        .vw-worker-register-input:focus {
          background: #FFFFFF;

          border-color:
            rgba(63, 85, 71, 0.45);

          box-shadow:
            0 0 0 4px rgba(63, 85, 71, 0.08);
        }


        /* Autofill */

        .vw-worker-register-input:-webkit-autofill,
        .vw-worker-register-input:-webkit-autofill:hover,
        .vw-worker-register-input:-webkit-autofill:focus,
        .vw-worker-register-input:-webkit-autofill:active {
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

        .vw-worker-register-password-button {
          position: absolute;

          top: 50%;
          right: 10px;

          transform: translateY(-50%);

          width: 30px;
          height: 30px;

          display: flex;

          align-items: center;
          justify-content: center;

          border: 0;

          border-radius: 8px;

          background: transparent;

          color:
            #8A837B !important;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }


        .vw-worker-register-password-button:hover {
          background:
            rgba(63, 85, 71, 0.08);

          color:
            var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           SUBMIT BUTTON
        ========================================= */

        .vw-worker-register-submit {
          width: 100%;

          min-height: 53px;

          margin-top: 24px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          border: 0;

          border-radius: 14px;

          background:
            var(--color-forest, #3F5547);

          color: #FFFFFF !important;

          font-size: 0.83rem;

          font-weight: 800;

          box-shadow:
            0 12px 25px rgba(63, 85, 71, 0.18);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .vw-worker-register-submit span,
        .vw-worker-register-submit svg {
          color: #FFFFFF !important;
        }


        .vw-worker-register-submit:hover:not(:disabled) {
          transform: translateY(-2px);

          background:
            #34483B;

          box-shadow:
            0 16px 30px rgba(63, 85, 71, 0.24);
        }


        .vw-worker-register-submit:disabled {
          opacity: 0.72;

          cursor: wait;
        }


        .vw-worker-register-submit-arrow {
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
           LOGIN LINK
        ========================================= */

        .vw-worker-register-login {
          margin-top: 21px;

          padding-top: 18px;

          border-top:
            1px solid rgba(43, 38, 37, 0.08);

          text-align: center;

          color:
            #756F68 !important;

          font-size: 0.71rem;
        }


        .vw-worker-register-login span {
          color: inherit !important;
        }


        .vw-worker-register-login a {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 4px 6px;
          color:
            var(--color-forest, #3F5547) !important;

          font-weight: 800;

          text-decoration: none;
        }


        .vw-worker-register-login a:hover {
          text-decoration: underline;
        }


        /* =========================================
           SECURITY
        ========================================= */

        .vw-worker-register-security {
          margin-top: 17px;

          padding: 10px 12px;

          display: flex;

          align-items: center;

          gap: 9px;

          border-radius: 11px;

          background:
            #F4F1EA;

          color:
            #756F68 !important;

          font-size: 0.62rem;

          line-height: 1.5;
        }


        .vw-worker-register-security svg {
          flex: 0 0 auto;

          color:
            var(--color-forest, #3F5547) !important;
        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 991px) {

          .vw-worker-register-form-panel {
            padding: 40px 32px;
          }

        }


        @media (max-width: 767px) {

          .vw-worker-register-page {
            min-height: 100vh;

            padding: 42px 0 65px;
          }


          .vw-worker-register-card {
            border-radius: 24px;
          }


          .vw-worker-register-form-panel {
            padding: 34px 22px 30px;
          }


          .vw-worker-register-title {
            font-size: 2.05rem;
          }


          .vw-worker-register-visual {
            display: none;
          }

        }


        @media (max-width: 575px) {

          .vw-worker-register-form-panel {
            padding-left: 18px;
            padding-right: 18px;
          }


          .vw-worker-register-title {
            font-size: 1.9rem;
          }

        }

      `}</style>


      <div className="container">

        <div className="vw-worker-register-shell">

          <div className="vw-worker-register-card">

            <div className="row g-0 align-items-stretch">


              {/* =========================================
                  LEFT VISUAL PANEL
              ========================================= */}

              <div className="col-md-5">

                <div className="vw-worker-register-visual">


                  <div className="vw-worker-register-visual-content">

                    {/* BRAND */}

                    <div className="vw-worker-register-brand">

                      <div className="vw-worker-register-brand-icon">

                        <FaUser size={17} />

                      </div>

                      <div>

                        <div className="vw-worker-register-brand-name">
                          VeriWork
                        </div>

                        <div className="vw-worker-register-brand-tagline">
                          Trusted Work. Brighter Futures.
                        </div>

                      </div>

                    </div>


                    {/* HEADING */}

                    <h2 className="vw-worker-register-heading">

                      Build your{" "}

                      <span>
                        trusted identity.
                      </span>

                    </h2>


                    <p className="vw-worker-register-description">

                      Create a verified work profile and carry
                      your skills, experience, and employment
                      history with you.

                    </p>

                  </div>


                  {/* WORKER IMAGE */}

                  <div className="vw-worker-register-image-wrap">

                    <div className="vw-worker-register-image-frame">

                      <img
                        src={workerIllustration}
                        alt="VeriWork Domestic Worker"
                        className="vw-worker-register-image"
                      />


                      <div className="vw-worker-register-verified">

                        <span className="vw-worker-register-verified-icon">

                          <FaCheck size={9} />

                        </span>

                        Verified Worker

                      </div>

                    </div>

                  </div>


                  {/* BENEFITS */}

                  <div className="vw-worker-register-benefits">

                    <div className="vw-worker-register-benefit">

                      <span className="vw-worker-register-benefit-icon">

                        <FaCheck size={8} />

                      </span>

                      Get verified

                    </div>


                    <div className="vw-worker-register-benefit">

                      <span className="vw-worker-register-benefit-icon">

                        <FaCheck size={8} />

                      </span>

                      Find better opportunities

                    </div>


                    <div className="vw-worker-register-benefit">

                      <span className="vw-worker-register-benefit-icon">

                        <FaCheck size={8} />

                      </span>

                      Build your reputation

                    </div>


                    <div className="vw-worker-register-benefit">

                      <span className="vw-worker-register-benefit-icon">

                        <FaShieldAlt size={8} />

                      </span>

                      Zero-Knowledge Aadhaar protection

                    </div>

                  </div>

                </div>

              </div>


              {/* =========================================
                  FORM PANEL
              ========================================= */}

              <div className="col-md-7">

                <div className="vw-worker-register-form-panel">


                  {/* HEADER */}

                  <div>

                    <div className="vw-worker-register-eyebrow">

                      <FaUser size={10} />

                      WORKER ONBOARDING

                    </div>


                    <h1 className="vw-worker-register-title">

                      Create Your Worker Profile

                    </h1>


                    <p className="vw-worker-register-subtitle">

                      Tell us about yourself and your skills
                      to create your verified work identity.

                    </p>

                  </div>


                  {/* FORM */}

                  <form onSubmit={handleSubmit}>


                    {/* NAME */}

                    <div className="vw-worker-register-field">

                      <label className="vw-worker-register-label">

                        Full Name

                      </label>


                      <div className="vw-worker-register-input-wrap">

                        <FaUser className="vw-worker-register-input-icon" />

                        <input
                          type="text"
                          name="fullName"
                          className="vw-worker-register-input"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    {/* PHONE */}

                    <div className="vw-worker-register-field">

                      <label className="vw-worker-register-label">

                        Phone Number

                      </label>


                      <div className="vw-worker-register-input-wrap">

                        <FaPhone className="vw-worker-register-input-icon" />

                        <input
                          type="tel"
                          name="phone"
                          className="vw-worker-register-input"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    {/* EMAIL + AADHAAR */}

                    <div className="row g-3">

                      <div className="col-md-6">

                        <div className="vw-worker-register-field">

                          <label className="vw-worker-register-label">

                            Email Address

                          </label>


                          <div className="vw-worker-register-input-wrap">

                            <FaEnvelope className="vw-worker-register-input-icon" />

                            <input
                              type="email"
                              name="email"
                              className="vw-worker-register-input"
                              placeholder="worker@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />

                          </div>

                        </div>

                      </div>


                      <div className="col-md-6">

                        <div className="vw-worker-register-field">

                          <label className="vw-worker-register-label">

                            Aadhaar Number

                          </label>


                          <div className="vw-worker-register-input-wrap">

                            <FaIdCard className="vw-worker-register-input-icon" />

                            <input
                              type="text"
                              name="aadhaar"
                              className="vw-worker-register-input"
                              placeholder="12-digit number"
                              maxLength={12}
                              value={formData.aadhaar}
                              onChange={handleChange}
                              required
                            />

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* SKILLS */}

                    <div className="vw-worker-register-field">

                      <label className="vw-worker-register-label">

                        Skills

                      </label>


                      <div className="vw-worker-register-input-wrap">

                        <FaBriefcase className="vw-worker-register-input-icon" />

                        <input
                          type="text"
                          name="skills"
                          className="vw-worker-register-input"
                          placeholder="e.g. Cooking, Cleaning, Babysitting"
                          value={formData.skills}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    {/* EXPERIENCE */}

                    <div className="vw-worker-register-field">

                      <label className="vw-worker-register-label">

                        Experience

                      </label>


                      <div className="vw-worker-register-input-wrap">

                        <FaBriefcase className="vw-worker-register-input-icon" />

                        <input
                          type="number"
                          name="experience"
                          className="vw-worker-register-input"
                          placeholder="e.g. 2 years"
                          min={0}
                          value={formData.experience}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    {/* LOCATION */}

                    <div className="vw-worker-register-field">

                      <label className="vw-worker-register-label">

                        Location

                      </label>


                      <div className="vw-worker-register-input-wrap">

                        <FaMapMarkerAlt className="vw-worker-register-input-icon" />

                        <input
                          type="text"
                          name="address"
                          className="vw-worker-register-input"
                          placeholder="Enter your location"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="vw-worker-register-field">

                      <label className="vw-worker-register-label">

                        Password

                      </label>


                      <div className="vw-worker-register-input-wrap">

                        <FaLock className="vw-worker-register-input-icon" />

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          name="password"
                          className="vw-worker-register-input"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />


                        <button
                          type="button"
                          className="vw-worker-register-password-button"
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
                            <FaEyeSlash size={12} />
                          ) : (
                            <FaEye size={12} />
                          )}

                        </button>

                      </div>

                    </div>


                    {/* SUBMIT */}

                    <button
                      type="submit"
                      className="vw-worker-register-submit"
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
                            Create Profile
                          </span>

                          <span className="vw-worker-register-submit-arrow">

                            <FaArrowRight size={10} />

                          </span>
                        </>
                      )}

                    </button>

                  </form>


                  {/* LOGIN */}

                  <div className="vw-worker-register-login">

                    <span>
                      Already have a profile?{" "}
                    </span>

                    <Link to="/login">
                      Login here
                    </Link>

                  </div>


                  {/* SECURITY */}

                  <div className="vw-worker-register-security">

                    <FaShieldAlt size={12} />

                    <span>
                      Your identity information is handled through
                      VeriWork's secure verification system.
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

export default RegisterWorker;