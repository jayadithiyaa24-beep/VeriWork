import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
      sessionStorage.setItem(
        "employerToken",
        response.token
      );

      sessionStorage.setItem(
        "employer",
        JSON.stringify(response.employer)
      );

      // Clear legacy localStorage
      localStorage.removeItem("employerToken");
      localStorage.removeItem("employer");

      toast.success("Employer Login Successful!");

      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 1000);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Employer Login Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "#f4f8ff",
        minHeight: "80vh",
      }}
    >
      <div className="row justify-content-center">

        <div className="col-md-6 col-lg-5">

          <div className="card shadow-lg border-0 rounded-4">

            <div
              className="text-white text-center py-4 rounded-top"
              style={{
                background:
                  "linear-gradient(90deg,#16a34a,#059669)",
              }}
            >
              <h2>🏢 Employer Login</h2>

              <p className="mb-0">
                Login to your VeriWork account
              </p>
            </div>

            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>

                {/* Email */}

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Button */}

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      Logging in...
                    </>
                  ) : (
                    "Login as Employer"
                  )}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default EmployerLogin;