import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWorker } from "../services/workerService";
import { toast } from "react-toastify";

import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaTools,
  FaBriefcase,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

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
      toast.success(response.message || "Worker registered successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vw-register-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            <div className="glass-card p-4 p-sm-5 text-start position-relative">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="vw-register-badge mx-auto mb-3">
                  <FaUser size={24} />
                </div>
                <h3 className="fw-bold text-white mb-1">
                  Worker <span className="text-gradient-cyan">Registration</span>
                </h3>
                <p className="text-muted small">
                  Create your portable decentralized work passport
                </p>

                {/* Privacy Badge */}
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-black bg-opacity-30 border border-info border-opacity-30 text-cyan small mt-2">
                  <FaShieldAlt size={12} />
                  <span style={{ fontSize: "0.75rem" }}>Zero-Knowledge Privacy: Aadhaar is salted & hashed via SHA-256</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FaUser className="text-cyan small" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FaPhone className="text-cyan small" />
                      <span>Mobile Number</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="10-digit Mobile"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
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

                  {/* Aadhaar */}
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FaIdCard className="text-cyan small" />
                      <span>Aadhaar Number (12 Digits)</span>
                    </label>
                    <input
                      type="text"
                      name="aadhaar"
                      className="form-control"
                      placeholder="12-digit UIDAI number"
                      maxLength={12}
                      value={formData.aadhaar}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Skills / Occupation */}
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FaTools className="text-cyan small" />
                      <span>Primary Skills / Role</span>
                    </label>
                    <input
                      type="text"
                      name="skills"
                      className="form-control"
                      placeholder="e.g. Cooking, Housekeeping, Driving"
                      value={formData.skills}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Experience */}
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FaBriefcase className="text-cyan small" />
                      <span>Experience (Years)</span>
                    </label>
                    <input
                      type="number"
                      name="experience"
                      className="form-control"
                      placeholder="e.g. 5"
                      min={0}
                      value={formData.experience}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Residential Address */}
                  <div className="col-12">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FaMapMarkerAlt className="text-cyan small" />
                      <span>Current Residential Area / Address</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="City, State, Locality"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <label className="form-label d-flex align-items-center gap-2">
                      <FaLock className="text-cyan small" />
                      <span>Account Password</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control pe-5"
                        placeholder="Create a strong password"
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

                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-web3-cyan w-100 py-3 mt-4 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Registering Digital Identity...
                    </>
                  ) : (
                    <>
                      <span>Complete Worker Registration</span>
                      <FaArrowRight className="ms-2 small opacity-75" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switch */}
              <div className="text-center pt-4 mt-3 border-top border-white border-opacity-10 small">
                <span className="text-muted">Already registered? </span>
                <Link to="/login" className="text-cyan fw-semibold">
                  Worker Login →
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

        .vw-register-badge {
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

export default RegisterWorker;