import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerEmployer } from "../services/employerService";
import { toast } from "react-toastify";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
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
    <div className="vw-register-page-wrapper py-5">
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            
            <div className="mockup-card overflow-hidden shadow-lg border-0">
              <div className="row g-0 align-items-stretch">
                
                {/* Left Side: Illustration & Checklist */}
                <div className="col-md-5 d-none d-md-flex flex-column justify-content-between p-4 p-lg-5 vw-register-art-panel text-start">
                  
                  {/* Employer Illustration */}
                  <div className="text-center mb-4">
                    <img
                      src={employerIllustration}
                      alt="Employer"
                      className="img-fluid rounded-4 shadow-sm"
                      style={{ maxHeight: "240px", objectFit: "cover" }}
                    />
                  </div>

                  <div>
                    <h4 className="fw-bold text-dark mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                      Hire with Trust
                    </h4>

                    <div className="d-flex flex-column gap-2 small">
                      <div className="d-flex align-items-center gap-2">
                        <div className="vw-check-circle-sm">
                          <FaCheck size={8} />
                        </div>
                        <span className="fw-semibold text-dark">Access verified profiles</span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <div className="vw-check-circle-sm">
                          <FaCheck size={8} />
                        </div>
                        <span className="fw-semibold text-dark">Secure and transparent</span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <div className="vw-check-circle-sm">
                          <FaCheck size={8} />
                        </div>
                        <span className="fw-semibold text-dark">Build long-term relationships</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 text-muted small">
                    Authorized Smart Contract Issuer Network
                  </div>

                </div>

                {/* Right Side: Form Panel */}
                <div className="col-md-7 p-4 p-lg-5 bg-white text-start">
                  
                  <div className="mb-4">
                    <h2 className="fw-bold text-dark mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                      Create Employer Account
                    </h2>
                    <p className="text-muted small">
                      Find and hire verified domestic workers
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    
                    {/* Full Name / Company Name */}
                    <div className="mb-3">
                      <label className="form-label">Full Name / Company Name</label>
                      <input
                        type="text"
                        name="employerName"
                        className="form-control"
                        placeholder="Enter your name or company name"
                        value={formData.employerName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Email Address */}
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
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control pe-5"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y text-muted border-0 me-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn-mockup-ochre w-100 py-3 fw-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Profile...
                        </>
                      ) : (
                        "Create Employer Profile"
                      )}
                    </button>

                  </form>

                  <div className="text-center pt-3 small text-muted">
                    Already registered?{" "}
                    <Link to="/employer-login" className="text-dark fw-bold text-decoration-underline">
                      Login here
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .vw-register-page-wrapper {
          min-height: 85vh;
          display: flex;
          align-items: center;
        }

        .vw-register-art-panel {
          background-color: var(--color-surface-cream, #F8F6F2);
          border-right: 1px solid var(--color-border);
        }

        .vw-check-circle-sm {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #2E7D32;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export default RegisterEmployer;