import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBuilding, FaLock, FaEnvelope, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { loginEmployer } from "../services/employerAuthService";

function EmployerLogin() {
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
      const response = await loginEmployer(formData);

      // Store employer JWT in tab-scoped session storage
      sessionStorage.setItem("employerToken", response.token);
      sessionStorage.setItem("employer", JSON.stringify(response.employer));

      // Clear legacy localStorage
      localStorage.removeItem("employerToken");
      localStorage.removeItem("employer");

      toast.success("Employer Authentication Successful!");

      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 600);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Employer login failed. Please check credentials."
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
                <div className="col-md-5 d-none d-md-flex flex-column justify-content-between p-4 p-lg-5 vw-auth-sidebar-employer">
                  <div>
                    <span className="veriwork-pill-badge mb-3 bg-white text-dark border-0">
                      EMPLOYER & ISSUER
                    </span>
                    <h2 className="display-6 fw-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                      Hire with Trust.<br />Build Reliability.
                    </h2>
                    <p className="text-white-50 small mb-0" style={{ lineHeight: "1.7" }}>
                      Manage your domestic workforce contracts, authorize digital wallet credentials, and issue on-chain verified work certificates.
                    </p>
                  </div>

                  <div className="p-3 rounded-3 bg-black bg-opacity-20 text-white-50 small border border-white border-opacity-10 mt-4">
                    <div className="d-flex align-items-center gap-2 mb-1 text-white fw-semibold">
                      <FaShieldAlt className="text-warning" size={13} />
                      <span>Authorized Issuer Network</span>
                    </div>
                    <span>Sign work completion certificates directly to the Ethereum smart contract.</span>
                  </div>
                </div>

                {/* Right Side: Clean Login Form */}
                <div className="col-md-7 p-4 p-lg-5 bg-white text-start">
                  
                  <div className="mb-4">
                    <span className="veriwork-pill-badge mb-2">
                      EMPLOYER PORTAL
                    </span>
                    <h3 className="fw-bold text-dark mb-1">
                      Welcome Back
                    </h3>
                    <p className="text-muted small">
                      Please enter your employer / household credentials.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    
                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">Business / Household Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="employer@example.com"
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
                      className="btn-veriwork-dark w-100 py-3 mb-3 fw-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Logging In...
                        </>
                      ) : (
                        <>
                          <span>Login as Employer</span>
                          <FaArrowRight size={12} className="ms-2" />
                        </>
                      )}
                    </button>

                  </form>

                  {/* Switch Links */}
                  <div className="pt-3 border-top border-slate-200 small text-center text-md-start">
                    <span className="text-muted">New employer or household? </span>
                    <Link to="/register-employer" className="text-dark fw-bold">
                      Create employer account
                    </Link>
                    <div className="mt-2">
                      <span className="text-muted">Are you a domestic worker? </span>
                      <Link to="/login" className="text-primary-dark fw-bold">
                        Worker Login →
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

        .vw-auth-sidebar-employer {
          background-color: var(--color-primary-darker);
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default EmployerLogin;