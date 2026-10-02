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
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vw-register-split-wrapper py-5">
      <div className="container py-3">
        <div className="row g-0 justify-content-center">
          
          <div className="col-lg-11 col-xl-10">
            <div className="veriwork-card overflow-hidden shadow-lg border-0">
              <div className="row g-0">
                
                {/* Left Side: Branded Story Panel */}
                <div className="col-lg-4 d-none d-lg-flex flex-column justify-content-between p-4 p-xl-5 vw-register-sidebar">
                  <div>
                    <span className="veriwork-pill-badge mb-3 bg-white text-dark border-0">
                      DIGITAL WORK IDENTITY
                    </span>
                    <h2 className="display-6 fw-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                      Create Your Worker Profile
                    </h2>
                    <p className="text-white-50 small mb-0" style={{ lineHeight: "1.7" }}>
                      Take ownership of your domestic work experience. Your employment history, wages, and ratings are cryptographically anchored.
                    </p>
                  </div>

                  <div className="p-3 rounded-3 bg-black bg-opacity-20 text-white-50 small border border-white border-opacity-10 mt-4">
                    <div className="d-flex align-items-center gap-2 mb-1 text-white fw-semibold">
                      <FaShieldAlt className="text-warning" size={13} />
                      <span>Zero-Knowledge Aadhaar Protection</span>
                    </div>
                    <span>Your 12-digit UIDAI number is immediately salted & hashed with SHA-256 before storage.</span>
                  </div>
                </div>

                {/* Right Side: Registration Form */}
                <div className="col-lg-8 p-4 p-md-5 bg-white text-start">
                  
                  <div className="mb-4">
                    <span className="veriwork-pill-sage mb-2">
                      DOMESTIC WORKFORCE ONBOARDING
                    </span>
                    <h3 className="fw-bold text-dark mb-1">
                      Register as a Verified Worker
                    </h3>
                    <p className="text-muted small">
                      Please fill out your details accurately to generate your digital identity.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      
                      {/* Full Name */}
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
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
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="10-digit Mobile Number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
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

                      {/* Aadhaar */}
                      <div className="col-md-6">
                        <label className="form-label">Aadhaar Number (12 Digits)</label>
                        <input
                          type="text"
                          name="aadhaar"
                          className="form-control"
                          placeholder="12-digit UIDAI Number"
                          maxLength={12}
                          value={formData.aadhaar}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Skills */}
                      <div className="col-md-6">
                        <label className="form-label">Primary Skills</label>
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
                        <label className="form-label">Experience (Years)</label>
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

                      {/* Location / Address */}
                      <div className="col-12">
                        <label className="form-label">Location / Residential Area</label>
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
                        <label className="form-label">Password</label>
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
                      className="btn-veriwork-primary w-100 py-3 mt-4 fw-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Registering Profile...
                        </>
                      ) : (
                        <>
                          <span>Create Worker Profile</span>
                          <FaArrowRight size={12} className="ms-2" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch Links */}
                  <div className="text-center pt-4 mt-3 border-top border-slate-200 small">
                    <span className="text-muted">Already have a worker profile? </span>
                    <Link to="/login" className="text-dark fw-bold">
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

        .vw-register-sidebar {
          background-color: var(--color-primary-dark);
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default RegisterWorker;