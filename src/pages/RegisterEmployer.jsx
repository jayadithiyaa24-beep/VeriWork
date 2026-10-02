import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBuilding, FaPhone, FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { registerEmployer } from "../services/employerService";

function RegisterEmployer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employerName: "",
    phone: "",
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
      const response = await registerEmployer(formData);
      toast.success(response.message || "Employer Registered Successfully!");

      setTimeout(() => {
        navigate("/employer-login");
      }, 1000);
    } catch (error) {
      console.error("Employer Registration Error:", error);
      toast.error(error.response?.data?.message || "Employer Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vw-register-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            
            <div className="glass-card p-4 p-sm-5 text-start position-relative">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="vw-register-badge-purple mx-auto mb-3">
                  <FaBuilding size={24} />
                </div>
                <h3 className="fw-bold text-white mb-1">
                  Employer <span className="text-gradient-primary">Registration</span>
                </h3>
                <p className="text-muted small">
                  Register as an authorized domestic employer & certificate issuer
                </p>

                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-black bg-opacity-30 border border-purple border-opacity-30 text-purple small mt-2">
                  <FaShieldAlt size={12} />
                  <span style={{ fontSize: "0.75rem" }}>Authorized Smart Contract Issuer Network</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Employer Name */}
                <div className="mb-3">
                  <label className="form-label d-flex align-items-center gap-2">
                    <FaBuilding className="text-purple small" />
                    <span>Employer / Household Name</span>
                  </label>
                  <input
                    type="text"
                    name="employerName"
                    className="form-control"
                    placeholder="e.g. Dr. Rajesh & Meera Verma"
                    value={formData.employerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="mb-3">
                  <label className="form-label d-flex align-items-center gap-2">
                    <FaPhone className="text-purple small" />
                    <span>Contact Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="10-digit Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label d-flex align-items-center gap-2">
                    <FaEnvelope className="text-purple small" />
                    <span>Email Address</span>
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
                    placeholder="Create a secure password"
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
                      Registering Employer Identity...
                    </>
                  ) : (
                    <>
                      <span>Complete Employer Registration</span>
                      <FaArrowRight className="ms-2 small opacity-75" />
                    </>
                  )}
                </button>

              </form>

              {/* Footer Switch */}
              <div className="text-center pt-3 border-top border-white border-opacity-10 small">
                <span className="text-muted">Already registered as an employer? </span>
                <Link to="/employer-login" className="text-purple fw-semibold">
                  Employer Login →
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        .vw-register-container {
          min-height: 85vh;
        }

        .vw-register-badge-purple {
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

        .border-purple { border-color: rgba(168, 85, 247, 0.4) !important; }
        .text-purple { color: #a855f7; }
      `}</style>
    </div>
  );
}

export default RegisterEmployer;