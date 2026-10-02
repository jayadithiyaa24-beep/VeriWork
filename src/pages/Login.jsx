import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
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

      // Save JWT token in tab-scoped session storage
      sessionStorage.setItem("token", response.token);

      // Save worker information
      sessionStorage.setItem("worker", JSON.stringify(response.worker));

      // Clear legacy localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("worker");

      toast.success("Worker Authentication Successful!");

      setTimeout(() => {
        navigate("/worker-dashboard");
      }, 600);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vw-login-page-wrapper py-5">
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            
            <div className="mockup-card overflow-hidden shadow-lg border-0">
              <div className="row g-0 align-items-stretch">
                
                {/* Left Side: Form Panel */}
                <div className="col-md-6 p-4 p-lg-5 bg-white text-start d-flex flex-column justify-content-center">
                  
                  <div className="mb-4">
                    <h2 className="fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                      Welcome Back
                    </h2>
                    <p className="text-muted small">
                      Sign in to your VeriWork account
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    
                    {/* Email / Phone */}
                    <div className="mb-3">
                      <div className="position-relative">
                        <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                          <FaUser size={14} />
                        </span>
                        <input
                          type="text"
                          name="email"
                          className="form-control ps-5"
                          placeholder="Email or Phone Number"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <div className="position-relative">
                        <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                          <FaLock size={14} />
                        </span>
                        <input
                          type="password"
                          name="password"
                          className="form-control ps-5"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center mb-4 small">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>

                      <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info("Password reset link will be sent to your verified email/phone."); }} className="text-muted text-decoration-none">
                        Forgot password?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn-mockup-forest w-100 py-3 mb-3 fw-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing In...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>

                    {/* Or Divider */}
                    <div className="text-center my-3 position-relative">
                      <hr className="border-secondary border-opacity-25" />
                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted">
                        or
                      </span>
                    </div>

                    {/* Google Button */}
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3 rounded-pill"
                      style={{ borderColor: "var(--color-border)" }}
                      onClick={() => toast.info("Google OAuth is available on enterprise deployment.")}
                    >
                      <FaGoogle className="text-danger" size={14} />
                      <span className="small fw-semibold text-dark">Continue with Google</span>
                    </button>

                  </form>

                  {/* Switch Links */}
                  <div className="text-center pt-2 small text-muted">
                    Don't have an account?{" "}
                    <Link to="/register-worker" className="text-dark fw-bold text-decoration-underline">
                      Create one
                    </Link>
                    <div className="mt-2">
                      Are you an employer?{" "}
                      <Link to="/employer-login" className="text-dark fw-bold">
                        Employer Login →
                      </Link>
                    </div>
                  </div>

                </div>

                {/* Right Side: Cream Illustration Panel */}
                <div className="col-md-6 d-none d-md-flex flex-column justify-content-between p-4 p-lg-5 vw-login-art-panel text-center">
                  
                  {/* Brand Tagline */}
                  <div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2C14 2 13 8 7 10C13 12 14 18 14 18C14 18 15 12 21 10C15 8 14 2 14 2Z" fill="#354A36" />
                        <path d="M7 16C7 16 10 18 10 22C10 22 14 19 14 19" stroke="#C98A41" strokeWidth="2" strokeLinecap="round" />
                        <path d="M21 16C21 16 18 18 18 22C18 22 14 19 14 19" stroke="#C98A41" strokeWidth="2" strokeLinecap="round" />
                        <path d="M14 18V26" stroke="#354A36" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="fw-bold fs-4 text-dark" style={{ fontFamily: "var(--font-serif)" }}>
                        VeriWork
                      </span>
                    </div>
                    <div className="text-muted small">
                      Trusted Work. Brighter Futures.
                    </div>
                  </div>

                  {/* Worker Illustration */}
                  <div className="my-auto py-3">
                    <img
                      src={workerIllustration}
                      alt="VeriWork Worker"
                      className="img-fluid vw-login-img rounded-4 shadow-sm"
                      style={{ maxHeight: "320px", objectFit: "cover" }}
                    />
                  </div>

                  <div className="text-muted small">
                    Zero-Knowledge Aadhaar SHA-256 Protected
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .vw-login-page-wrapper {
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .vw-login-art-panel {
          background-color: var(--color-surface-cream, #F8F6F2);
          border-left: 1px solid var(--color-border);
        }
      `}</style>
    </div>
  );
}

export default Login;