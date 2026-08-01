import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

function RegisterWorker() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

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
    console.log(formData);

    try {
      const response = await registerWorker(formData);

      toast.success(response.message);

setTimeout(() => {
  navigate("/login");
}, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "#f4f8ff",
        minHeight: "100vh",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div
              className="text-white text-center py-4"
              style={{
                background:
                  "linear-gradient(90deg,#2563eb,#4f46e5)",
              }}
            >
              <h2>👤 Worker Registration</h2>
              <p>Create your secure work identity</p>
            </div>

            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Full Name */}

                <div className="mb-3">
                  <label className="form-label">
                    <FaUser className="me-2 text-primary" />
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="Enter Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}

                <div className="mb-3">
                  <label className="form-label">
                    <FaPhone className="me-2 text-primary" />
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Enter Mobile Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}

                <div className="mb-3">
                  <label className="form-label">
                    <FaEnvelope className="me-2 text-primary" />
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Aadhaar */}

                <div className="mb-3">
                  <label className="form-label">
                    <FaIdCard className="me-2 text-primary" />
                    Aadhaar Number
                  </label>

                  <input
                    type="text"
                    name="aadhaar"
                    className="form-control"
                    placeholder="Enter Aadhaar Number"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Address */}

                <div className="mb-3">
                  <label className="form-label">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    Address
                  </label>

                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Skills */}

                <div className="mb-3">
                  <label className="form-label">
                    <FaTools className="me-2 text-primary" />
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    className="form-control"
                    placeholder="Cooking, Cleaning, Driving..."
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>

                {/* Experience */}

                <div className="mb-3">
                  <label className="form-label">
                    <FaBriefcase className="me-2 text-primary" />
                    Years of Experience
                  </label>

                  <input
                    type="number"
                    name="experience"
                    className="form-control"
                    placeholder="Experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}

                <div className="mb-4">
                  <label className="form-label">
                    <FaLock className="me-2 text-primary" />
                    Password
                  </label>

                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                >
                  Register Worker
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterWorker;