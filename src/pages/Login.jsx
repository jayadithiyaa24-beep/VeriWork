import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCheck, FaLock, FaEnvelope, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { loginWorker } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    <div className="vw-auth-split-wrapper py-5">
      <div className="container py-3">
        <div className="row g-0 justify-content-center">
          
          <div className="col-lg-10 col-xl-9">
            <div className="veriwork-card overflow-hidden shadow-lg border-0">
              <div className="row g-0">
                
                {/* Left Side: Earthy Branded Visual Panel */}
                <div className="col-md-5 d-none d-md-flex flex-column justify-content-between p-4 p-lg-5 vw-auth-sidebar">
                  <div>
                    <span className="veriwork-pill-badge mb-3 bg-white text-dark border-0">
                      WORKER IDENTITY
                    </span>
                    <h2 className="display-6 fw-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                      Trusted Work.<br />Verified Identity.
                    </h2>
                    <p className="text-white-50 small mb-0" style={{ lineHeight: "1.7" }}>
                      Access your portable digital work passport, view completed jobs, and manage your blockchain employment credentials.
                    </p>
                  </div>

                  <div className="p-3 rounded-3 bg-black bg-opacity-20 text-white-50 small border border-white border-opacity-10 mt-4">
                    <div className="d-flex align-items-center gap-2 mb-1 text-white fw-semibold">
                      <FaShieldAlt className="text-warning" size={13} />
                      <span>Zero-Knowledge Privacy</span>
                    </div>
                    <span>Your Aadhaar number is hashed via SHA-256 and never shared raw.</span>
                  </div>
                </div>

                {/* Right Side: Clean Login Form */}
                <div className="col-md-7 p-4 p-lg-5 bg-white text-start">
                  
                  <div className="mb-4">
                    <span className="veriwork-pill-sage mb-2">
                      DOMESTIC WORKER
                    </span>
                    <h3 className="fw-bold text-dark mb-1">
                      Welcome Back
                    </h3>
                    <p className="text-muted small">
                      Please enter your account details to access your dashboard.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    
                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="worker@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn-veriwork-primary w-100 py-3 mb-3 fw-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Logging In...
                        </>
                      ) : (
                        <>
                          <span>Login</span>
                          <FaArrowRight size={12} className="ms-2" />
                        </>
                      )}
                    </button>

                  </form>

                  {/* Switch Links */}
                  <div className="pt-3 border-top border-slate-200 small text-center text-md-start">
                    <span className="text-muted">Don't have an account? </span>
                    <Link to="/register-worker" className="text-dark fw-bold">
                      Create worker profile
                    </Link>
                    <div className="mt-2">
                      <span className="text-muted">Are you an employer? </span>
                      <Link to="/employer-login" className="text-primary-dark fw-bold">
                        Employer Login →
                      </Link>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .vw-auth-split-wrapper {
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .vw-auth-sidebar {
          background-color: var(--color-primary-dark);
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default Login;