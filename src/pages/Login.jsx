import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserTie, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";
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
      }, 800);
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
    <div className="vw-auth-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            
            <div className="glass-card p-4 p-sm-5 text-start position-relative">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="vw-auth-badge mx-auto mb-3">
                  <FaUserTie size={24} />
                </div>
                <h3 className="fw-bold text-white mb-1">
                  Worker <span className="text-gradient-cyan">Login</span>
                </h3>
                <p className="text-muted small">
                  Access your portable digital work passport & ratings
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label d-flex align-items-center gap-2">
                    <FaEnvelope className="text-cyan small" />
                    <span>Email Address</span>
                  </label>
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
                  <label className="form-label d-flex align-items-center gap-2">
                    <FaLock className="text-cyan small" />
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
                  className="btn-web3-cyan w-100 py-3 mb-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Authenticating Identity...
                    </>
                  ) : (
                    <>
                      <span>Enter Worker Portal</span>
                      <FaArrowRight className="ms-2 small opacity-75" />
                    </>
                  )}
                </button>

              </form>

              {/* Footer Switch */}
              <div className="text-center pt-3 border-top border-white border-opacity-10 small">
                <span className="text-muted">New domestic worker? </span>
                <Link to="/register-worker" className="text-cyan fw-semibold">
                  Register Digital ID
                </Link>
                <div className="mt-2">
                  <span className="text-muted">Are you an employer? </span>
                  <Link to="/employer-login" className="text-purple fw-semibold">
                    Employer Login →
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

        .vw-auth-badge {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: #06b6d4;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.25);
        }
      `}</style>
    </div>
  );
}

export default Login;