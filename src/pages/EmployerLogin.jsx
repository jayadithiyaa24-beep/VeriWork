import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBuilding, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";
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
      }, 800);
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
    <div className="vw-auth-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            
            <div className="glass-card p-4 p-sm-5 text-start position-relative">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="vw-auth-badge-purple mx-auto mb-3">
                  <FaBuilding size={24} />
                </div>
                <h3 className="fw-bold text-white mb-1">
                  Employer <span className="text-gradient-primary">Portal</span>
                </h3>
                <p className="text-muted small">
                  Issue on-chain contracts & manage domestic work staff
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label d-flex align-items-center gap-2">
                    <FaEnvelope className="text-purple small" />
                    <span>Business / Household Email</span>
                  </label>
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
                  <label className="form-label d-flex align-items-center gap-2">
                    <FaLock className="text-purple small" />
                    <span>Password</span>
                  </label>
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
                  className="btn-web3-primary w-100 py-3 mb-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Authenticating Employer...
                    </>
                  ) : (
                    <>
                      <span>Enter Employer Portal</span>
                      <FaArrowRight className="ms-2 small opacity-75" />
                    </>
                  )}
                </button>

              </form>

              {/* Footer Switch */}
              <div className="text-center pt-3 border-top border-white border-opacity-10 small">
                <span className="text-muted">New employer or household? </span>
                <Link to="/register-employer" className="text-purple fw-semibold">
                  Register as Employer
                </Link>
                <div className="mt-2">
                  <span className="text-muted">Are you a domestic worker? </span>
                  <Link to="/login" className="text-cyan fw-semibold">
                    Worker Login →
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        .vw-auth-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .vw-auth-badge-purple {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: #a855f7;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.25);
        }

        .text-purple { color: #a855f7; }
      `}</style>
    </div>
  );
}

export default EmployerLogin;