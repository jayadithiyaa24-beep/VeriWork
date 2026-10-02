import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  // =================================
  // HANDLE INPUT CHANGE
  // =================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =================================
  // HANDLE REGISTRATION
  // =================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await registerEmployer(formData);

      toast.success(
        response.message || "Employer Registered Successfully!"
      );

      // Go to employer login after successful registration
      setTimeout(() => {
        navigate("/employer-login");
      }, 1000);
    } catch (error) {
      console.error("Employer Registration Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Employer Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-5">

        <h2 className="text-success mb-4">
  Employer Registration
</h2>

        <form onSubmit={handleSubmit}>

          {/* Employer Name */}

          <div className="mb-3">
            <label className="form-label">
              Employer Name
            </label>

            <input
              type="text"
              name="employerName"
              className="form-control"
              placeholder="Enter Employer Name"
              value={formData.employerName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile Number */}

          <div className="mb-3">
            <label className="form-label">
              Mobile Number
            </label>

            <input
              type="tel"
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

          {/* Password */}

          <div className="mb-4">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Register Button */}

          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>

                Registering...
              </>
            ) : (
              "Register Employer"
            )}
          </button>

        </form>

      </div>
    </div>
  );
}

export default RegisterEmployer;