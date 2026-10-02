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
    <div className="vw-register-split-wrapper py-5">
      <div className="container py-3">
        <div className="row g-0 justify-content-center">
          
          <div className="col-lg-10 col-xl-9">
            <div className="veriwork-card overflow-hidden shadow-lg border-0">
              <div className="row g-0">
                
                {/* Left Side: Branded Story Panel */}
                <div className="col-md-5 d-none d-md-flex flex-column justify-content-between p-4 p-lg-5 vw-register-sidebar-employer">
                  <div>
                    <span className="veriwork-pill-badge mb-3 bg-white text-dark border-0">
                      EMPLOYER ONBOARDING
                    </span>
                    <h2 className="display-6 fw-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                      Create Employer Account
                    </h2>
                    <p className="text-white-50 small mb-0" style={{ lineHeight: "1.7" }}>
                      Hire with trust. Build reliable work relationships. Register domestic contracts, track wages, and sign verified work credentials.
                    </p>
                  </div>

                  <div className="p-3 rounded-3 bg-black bg-opacity-20 text-white-50 small border border-white border-opacity-10 mt-4">
                    <div className="d-flex align-items-center gap-2 mb-1 text-white fw-semibold">
                      <FaShieldAlt className="text-warning" size={13} />
                      <span>Authorized Credential Issuer</span>
                    </div>
                    <span>Authorized employers issue tamper-proof work certificates anchored on Ethereum.</span>
                  </div>
                </div>

                {/* Right Side: Registration Form */}
                <div className="col-md-7 p-4 p-lg-5 bg-white text-start">
                  
                  <div className="mb-4">
                    <span className="veriwork-pill-badge mb-2">
                      HOUSEHOLD & BUSINESS
                    </span>
                    <h3 className="fw-bold text-dark mb-1">
                      Register as an Employer
                    </h3>
                    <p className="text-muted small">
                      Please enter your contact details to begin issuing verified contracts.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    
                    {/* Employer Name */}
                    <div className="mb-3">
                      <label className="form-label">Name / Company / Household</label>
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

                    {/* Phone */}
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
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
                      <label className="form-label">Email Address</label>
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
                        placeholder="Create a secure password"
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
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <span>Create Employer Profile</span>
                          <FaArrowRight size={12} className="ms-2" />
                        </>
                      )}
                    </button>

                  </form>

                  {/* Switch Links */}
                  <div className="pt-3 border-top border-slate-200 small text-center text-md-start">
                    <span className="text-muted">Already registered as an employer? </span>
                    <Link to="/employer-login" className="text-dark fw-bold">
                      Login here →
                    </Link>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .vw-register-split-wrapper {
          min-height: 85vh;
        }

        .vw-register-sidebar-employer {
          background-color: var(--color-primary-darker);
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default RegisterEmployer;