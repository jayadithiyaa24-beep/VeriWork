import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getWorkerProfile } from "../services/authService";

function WorkerDashboard() {
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getWorkerProfile();

        setWorker(response.worker);

        // Update localStorage with latest worker data
        localStorage.setItem(
          "worker",
          JSON.stringify(response.worker)
        );

      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("worker");

          toast.error("Session expired. Please login again.");

          navigate("/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
          "Unable to load worker profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("worker");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // Loading
  if (loading) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <p className="mt-3 text-muted">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return null;
  }

  // Hide most of Aadhaar number
  const maskedAadhaar = worker.aadhaar
    ? `XXXX XXXX ${worker.aadhaar.slice(-4)}`
    : "Not available";

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "#f4f8ff",
        minHeight: "100vh",
      }}
    >
      <div className="container">

        {/* ================= HEADER ================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">
              👷 Worker Dashboard
            </h2>

            <p className="text-muted mb-0">
              Manage your VeriWork identity
            </p>
          </div>

          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>


        {/* ================= WELCOME ================= */}

        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            background:
              "linear-gradient(90deg,#2563eb,#4f46e5)",
            color: "white",
          }}
        >
          <div className="card-body p-4">

            <h3>
              Welcome, {worker.fullName} 👋
            </h3>

            <p className="mb-0">
              Your verified work identity is ready.
            </p>

          </div>
        </div>


        {/* ================= PROFILE ================= */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <h3 className="fw-bold mb-4">
              👤 My Profile
            </h3>

            <div className="row">

              {/* Full Name */}

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  👤 Full Name
                </label>

                <div className="form-control bg-light">
                  {worker.fullName}
                </div>

              </div>


              {/* Email */}

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  📧 Email
                </label>

                <div className="form-control bg-light">
                  {worker.email}
                </div>

              </div>


              {/* Phone */}

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  📱 Phone Number
                </label>

                <div className="form-control bg-light">
                  {worker.phone}
                </div>

              </div>


              {/* Aadhaar */}

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  🪪 Aadhaar Number
                </label>

                <div className="form-control bg-light">
                  {maskedAadhaar}
                </div>

              </div>


              {/* Address */}

              <div className="col-md-12 mb-4">

                <label className="fw-bold">
                  📍 Address
                </label>

                <div className="form-control bg-light">
                  {worker.address}
                </div>

              </div>


              {/* Skills */}

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  🛠 Skills
                </label>

                <div className="form-control bg-light">
                  {worker.skills}
                </div>

              </div>


              {/* Experience */}

              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  💼 Experience
                </label>

                <div className="form-control bg-light">
                  {worker.experience} years
                </div>

              </div>


              {/* Wallet */}

              <div className="col-md-12 mb-2">

                <label className="fw-bold">
                  🦊 Wallet Address
                </label>

                <div className="form-control bg-light">
                  {worker.walletAddress || "Not connected"}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= FEATURES ================= */}

        <h3 className="fw-bold mb-3">
          VeriWork Services
        </h3>

        <div className="row g-4">

          {/* Employment */}

          <div className="col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body">

                <h4>💼 Employment History</h4>

                <p className="text-muted">
                  View your employment records and history.
                </p>

                <button
                  className="btn btn-primary"
                  disabled
                >
                  Coming Soon
                </button>

              </div>

            </div>

          </div>


          {/* Salary */}

          <div className="col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body">

                <h4>💰 Salary History</h4>

                <p className="text-muted">
                  View your verified salary records.
                </p>

                <button
                  className="btn btn-primary"
                  disabled
                >
                  Coming Soon
                </button>

              </div>

            </div>

          </div>


          {/* Blockchain */}

          <div className="col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body">

                <h4>🔗 Blockchain Verification</h4>

                <p className="text-muted">
                  Verify your employment records on the blockchain.
                </p>

                <button
                  className="btn btn-primary"
                  disabled
                >
                  Coming Soon
                </button>

              </div>

            </div>

          </div>


          {/* Certificate */}

          <div className="col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body">

                <h4>🪪 Work Certificate</h4>

                <p className="text-muted">
                  Download your verified work certificate.
                </p>

                <button
                  className="btn btn-primary"
                  disabled
                >
                  Coming Soon
                </button>

              </div>

            </div>

          </div>


          {/* Wallet */}

          <div className="col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body">

                <h4>🦊 Wallet</h4>

                <p className="text-muted">
                  Connect your blockchain wallet.
                </p>

                <button
                  className="btn btn-primary"
                  disabled
                >
                  Coming Soon
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default WorkerDashboard;