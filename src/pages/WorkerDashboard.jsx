import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getWorkerProfile } from "../services/authService";
import { getWorkerEmployments } from "../services/employmentService";
import {
  getWorkerCertificates,
} from "../services/certificateService";
import { connectWorkerWallet } from "../services/workerService";

import WorkCertificate from "../components/WorkCertificate";

import {
  getUserRatings,
  getMyRatingForEmployment,
} from "../services/ratingService";

import RatingModal from "../components/RatingModal";
import RatingReviewsSection from "../components/RatingReviewsSection";

function WorkerDashboard() {
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [employments, setEmployments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingEmployment, setLoadingEmployment] =
    useState(true);
  const [loadingCertificates, setLoadingCertificates] =
    useState(true);

  // Web3 Wallet state
  const [workerWallet, setWorkerWallet] = useState(
    sessionStorage.getItem("workerWallet") || ""
  );
  const [connectingWallet, setConnectingWallet] = useState(false);

  // Rating states
  const [ratedEmployments, setRatedEmployments] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedEmploymentForRating, setSelectedEmploymentForRating] = useState(null);

  // Worker's received ratings
  const [workerRatings, setWorkerRatings] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratings: [],
  });
  const [loadingRatings, setLoadingRatings] = useState(true);


  // =================================
  // LOAD WORKER PROFILE
  // =================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getWorkerProfile();

        setWorker(response.worker);

        if (response.worker?.walletAddress) {
          setWorkerWallet(response.worker.walletAddress);
          sessionStorage.setItem("workerWallet", response.worker.walletAddress);
        }

        sessionStorage.setItem(
          "worker",
          JSON.stringify(response.worker)
        );
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("worker");
          localStorage.removeItem("token");
          localStorage.removeItem("worker");

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/login");
        } else {
          toast.error(
            error.response?.data?.message ||
            "Unable to load worker profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);


  // =================================
  // LOAD EMPLOYMENT HISTORY & CHECK RATINGS
  // =================================

  const checkRatedEmployments = async (list) => {
    const completedList = (list || []).filter((e) => e.status === "Completed");
    const ratedMap = {};
    await Promise.all(
      completedList.map(async (emp) => {
        try {
          const res = await getMyRatingForEmployment(emp._id);
          if (res.rating) {
            ratedMap[emp._id] = res.rating;
          }
        } catch (err) {
          // ignore
        }
      })
    );
    setRatedEmployments((prev) => ({ ...prev, ...ratedMap }));
  };

  useEffect(() => {
    const loadEmployments = async () => {
      try {
        const response = await getWorkerEmployments();

        setEmployments(response.employments);
        checkRatedEmployments(response.employments);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("worker");
          localStorage.removeItem("token");
          localStorage.removeItem("worker");

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/login");
        } else {
          toast.error(
            error.response?.data?.message ||
            "Unable to load employment history"
          );
        }
      } finally {
        setLoadingEmployment(false);
      }
    };

    loadEmployments();
  }, [navigate]);

  // =================================
  // LOAD WORKER RECEIVED RATINGS
  // =================================

  useEffect(() => {
    const loadRatings = async () => {
      if (!worker?._id) return;
      try {
        const data = await getUserRatings(worker._id);
        setWorkerRatings({
          averageRating: data.averageRating || 0,
          totalRatings: data.totalRatings || 0,
          ratings: data.ratings || [],
        });
      } catch (error) {
        console.error("Error loading worker ratings:", error);
      } finally {
        setLoadingRatings(false);
      }
    };

    loadRatings();
  }, [worker?._id]);

  // =================================
  // HANDLE RATE EMPLOYER
  // =================================

  const handleOpenRatingModal = (employment) => {
    setSelectedEmploymentForRating(employment);
    setShowRatingModal(true);
  };

  const handleRatingSubmitted = (newRating) => {
    if (selectedEmploymentForRating) {
      setRatedEmployments((prev) => ({
        ...prev,
        [selectedEmploymentForRating._id]: newRating,
      }));
    }
  };


  // =================================
  // LOAD WORK CERTIFICATES
  // =================================

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response =
          await getWorkerCertificates();

        setCertificates(response.certificates);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("worker");
          localStorage.removeItem("token");
          localStorage.removeItem("worker");

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/login");
        } else {
          toast.error(
            error.response?.data?.message ||
            "Unable to load work certificates"
          );
        }
      } finally {
        setLoadingCertificates(false);
      }
    };

    loadCertificates();
  }, [navigate]);


  // =================================
  // LOGOUT
  // =================================

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("worker");
    sessionStorage.removeItem("workerWallet");
    localStorage.removeItem("token");
    localStorage.removeItem("worker");
    localStorage.removeItem("workerWallet");
    setWorkerWallet("");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // =================================
  // METAMASK WALLET INTEGRATION
  // =================================

  const connectWorkerMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed. Please install MetaMask first.");
      return;
    }

    setConnectingWallet(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        toast.error("No MetaMask account found.");
        return;
      }

      const account = accounts[0];
      setWorkerWallet(account);
      sessionStorage.setItem("workerWallet", account);

      try {
        await connectWorkerWallet(account);
      } catch (saveErr) {
        console.warn("Could not save wallet in backend:", saveErr);
      }

      toast.success("MetaMask wallet connected successfully! 🦊");
    } catch (err) {
      console.error("Worker MetaMask Error:", err);
      if (err.code === 4001) {
        toast.error("MetaMask connection request was rejected.");
      } else {
        toast.error(err.message || "Failed to connect MetaMask.");
      }
    } finally {
      setConnectingWallet(false);
    }
  };

  const disconnectWorkerWallet = () => {
    setWorkerWallet("");
    sessionStorage.removeItem("workerWallet");
    localStorage.removeItem("workerWallet");
    toast.info("Wallet disconnected.");
  };

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        setWorkerWallet("");
        sessionStorage.removeItem("workerWallet");
        localStorage.removeItem("workerWallet");
      } else {
        const account = accounts[0];
        setWorkerWallet(account);
        sessionStorage.setItem("workerWallet", account);
        connectWorkerWallet(account).catch(console.warn);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);


  // =================================
  // VIEW PROFESSIONAL CERTIFICATE
  // =================================

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);

    setTimeout(() => {
      document
        .getElementById("professional-certificate")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };


  // =================================
  // CLOSE PROFESSIONAL CERTIFICATE
  // =================================

  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
  };


  // =================================
  // LOADING
  // =================================

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


  // =================================
  // MASK AADHAAR
  // =================================

  const maskedAadhaar = worker.aadhaar
    ? `XXXX XXXX ${worker.aadhaar.slice(-4)}`
    : "Not available";


  return (
    <div
      className="container-fluid py-5 vw-dashboard-view"
      style={{
        minHeight: "100vh",
      }}
    >

      <div className="container">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

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


        {/* ================================= */}
        {/* WELCOME */}
        {/* ================================= */}

        <div
          className="veriwork-card-dark p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            borderRadius: "24px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="veriwork-pill-badge mb-2 bg-white text-dark border-0">
                DOMESTIC WORKER PASSPORT
              </span>
              <h2 className="fw-bold text-white mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                Welcome, {worker.fullName} 👋
              </h2>
              <p className="text-white-50 mb-0">
                Your decentralized work identity is active and cryptographically anchored.
              </p>
            </div>
            <div className="d-none d-md-block text-end">
              <span className="veriwork-pill-white">
                ● EVM CHAIN ID 31337
              </span>
            </div>
          </div>
        </div>


        {/* ================================= */}
        {/* PROFILE */}
        {/* ================================= */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <h3 className="fw-bold mb-4">
              👤 My Profile
            </h3>

            <div className="row">


              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  👤 Full Name
                </label>

                <div className="form-control bg-light">
                  {worker.fullName}
                </div>

              </div>


              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  📧 Email
                </label>

                <div className="form-control bg-light">
                  {worker.email}
                </div>

              </div>


              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  📱 Phone Number
                </label>

                <div className="form-control bg-light">
                  {worker.phone}
                </div>

              </div>


              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  🪪 Aadhaar Number
                </label>

                <div className="form-control bg-light">
                  {maskedAadhaar}
                </div>

              </div>


              <div className="col-md-12 mb-4">

                <label className="fw-bold">
                  📍 Address
                </label>

                <div className="form-control bg-light">
                  {worker.address}
                </div>

              </div>


              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  🛠 Skills
                </label>

                <div className="form-control bg-light">
                  {worker.skills}
                </div>

              </div>


              <div className="col-md-6 mb-4">

                <label className="fw-bold">
                  💼 Experience
                </label>

                <div className="form-control bg-light">
                  {worker.experience} years
                </div>

              </div>


              <div className="col-md-12">

                <label className="fw-bold">
                  🦊 Wallet Address
                </label>

                <div className="form-control bg-light">
                  {worker.walletAddress ||
                    "Not connected"}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* EMPLOYMENT HISTORY */}
        {/* ================================= */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h3 className="fw-bold mb-1">
                  💼 Employment History
                </h3>

                <p className="text-muted mb-0">
                  Your verified employment records
                </p>

              </div>

              <span className="badge bg-primary fs-6">
                {employments.length} Record
                {employments.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>


            {loadingEmployment ? (

              <div className="text-center py-4">

                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>

                <p className="text-muted mt-2">
                  Loading employment history...
                </p>

              </div>

            ) : employments.length === 0 ? (

              <div className="text-center py-5">

                <div style={{ fontSize: "50px" }}>
                  💼
                </div>

                <h5 className="mt-3">
                  No Employment Records
                </h5>

                <p className="text-muted">
                  Your employment history will appear
                  here once an employer registers your
                  employment.
                </p>

              </div>

            ) : (

              <div className="row g-4">

                {employments.map(
                  (employment) => (

                    <div
                      className="col-md-6"
                      key={employment._id}
                    >

                      <div className="card border shadow-sm h-100">

                        <div className="card-body">


                          {/* Job */}

                          <h4 className="fw-bold text-primary">
                            {employment.jobRole}
                          </h4>


                          {/* Employer */}

                          <p className="mb-2">

                            <strong>
                              🏢 Employer:
                            </strong>{" "}

                            {employment.employerId
                              ?.employerName ||
                              "Unknown Employer"}

                          </p>


                          {/* Email */}

                          <p className="mb-2">

                            <strong>
                              📧 Employer Email:
                            </strong>{" "}

                            {employment.employerId
                              ?.email ||
                              "Not available"}

                          </p>


                          {/* Salary */}

                          <p className="mb-2">

                            <strong>
                              💰 Salary:
                            </strong>{" "}

                            ₹{employment.salary}

                          </p>


                          {/* Start Date */}

                          <p className="mb-2">

                            <strong>
                              📅 Start Date:
                            </strong>{" "}

                            {new Date(
                              employment.startDate
                            ).toLocaleDateString()}

                          </p>


                          {/* End Date */}

                          <p className="mb-3">

                            <strong>
                              📅 End Date:
                            </strong>{" "}

                            {employment.endDate
                              ? new Date(
                                  employment.endDate
                                ).toLocaleDateString()
                              : "Currently employed"}

                          </p>


                          {/* Status */}

                          <div className="d-flex gap-2 flex-wrap">

                            <span
                              className={
                                employment.status ===
                                "Active"
                                  ? "badge bg-success"
                                  : "badge bg-secondary"
                              }
                            >
                              {employment.status}
                            </span>


                            <span
                              className={
                                employment.verificationStatus ===
                                "Verified"
                                  ? "badge bg-success"
                                  : "badge bg-warning text-dark"
                              }
                            >
                              {
                                employment.verificationStatus
                              }
                            </span>

                          </div>


                          {/* Blockchain */}

                          <div className="mt-3 p-2 bg-light rounded">

                            <small className="text-muted">

                              🔗 Blockchain Verification:{" "}

                              {employment.verificationStatus ===
                              "Verified"
                                ? "Verified"
                                : "Pending"}

                            </small>

                          </div>

                          {/* Rate Employer Button */}
                          {employment.status === "Completed" && (
                            <div className="mt-3 pt-2 border-top">
                              {ratedEmployments[employment._id] ? (
                                <span className="badge bg-warning text-dark px-3 py-2 w-100 text-center">
                                  ⭐ Rated Employer ({ratedEmployments[employment._id].rating}/5)
                                </span>
                              ) : (
                                <button
                                  className="btn btn-sm btn-warning text-dark fw-bold w-100"
                                  onClick={() => handleOpenRatingModal(employment)}
                                >
                                  ⭐ Rate Employer
                                </button>
                              )}
                            </div>
                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>


        {/* ================================= */}
        {/* WORK CERTIFICATES */}
        {/* ================================= */}

        <div
          id="work-certificates"
          className="card border-0 shadow-sm mb-4"
        >

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h3 className="fw-bold mb-1">
                  📜 My Work Certificates
                </h3>

                <p className="text-muted mb-0">
                  Your certificates issued through VeriWork
                </p>

              </div>

              <span className="badge bg-primary fs-6">
                {certificates.length} Certificate
                {certificates.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>


            {loadingCertificates ? (

              <div className="text-center py-4">

                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>

                <p className="text-muted mt-2">
                  Loading certificates...
                </p>

              </div>

            ) : certificates.length === 0 ? (

              <div className="text-center py-5">

                <div style={{ fontSize: "50px" }}>
                  📜
                </div>

                <h5 className="mt-3">
                  No Work Certificates
                </h5>

                <p className="text-muted">
                  Certificates issued by your employers
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="row g-4">

                {certificates.map(
                  (certificate) => (

                    <div
                      className="col-md-6"
                      key={certificate._id}
                    >

                      <div className="card border shadow-sm h-100">

                        <div className="card-body">

                          <div className="d-flex justify-content-between align-items-start mb-3">

                            <h4 className="fw-bold text-primary mb-0">
                              📜 Work Certificate
                            </h4>

                            <span
                              className={
                                certificate.verificationStatus ===
                                "Verified"
                                  ? "badge bg-success"
                                  : "badge bg-warning text-dark"
                              }
                            >
                              {
                                certificate.verificationStatus
                              }
                            </span>

                          </div>


                          <p className="mb-2">

                            <strong>
                              Certificate ID:
                            </strong>{" "}

                            {certificate.certificateId}

                          </p>


                          <p className="mb-2">

                            <strong>
                              🏢 Employer:
                            </strong>{" "}

                            {certificate.employerId
                              ?.employerName ||
                              certificate.employerName ||
                              "Unknown Employer"}

                          </p>


                          <p className="mb-2">

                            <strong>
                              💼 Job Role:
                            </strong>{" "}

                            {certificate.jobRole}

                          </p>


                          <p className="mb-2">

                            <strong>
                              💰 Salary:
                            </strong>{" "}

                            ₹{certificate.salary}

                          </p>


                          <p className="mb-2">

                            <strong>
                              📅 Start Date:
                            </strong>{" "}

                            {new Date(
                              certificate.startDate
                            ).toLocaleDateString()}

                          </p>


                          <p className="mb-3">

                            <strong>
                              📅 End Date:
                            </strong>{" "}

                            {certificate.endDate
                              ? new Date(
                                  certificate.endDate
                                ).toLocaleDateString()
                              : "Currently employed"}

                          </p>


                          <div className="border-top pt-3">

                            <small className="text-muted">

                              📅 Issued:{" "}

                              {new Date(
                                certificate.issuedAt
                              ).toLocaleDateString()}

                            </small>

                          </div>


                          <div className="mt-3 p-2 bg-light rounded">

                            <small className="text-muted">

                              🔗 Blockchain Status:{" "}

                              {certificate.blockchainTransactionHash
                                ? "Blockchain Verified"
                                : "Not yet registered on blockchain"}

                            </small>

                          </div>


                          {/* VIEW CERTIFICATE */}

                          <div className="mt-3 d-flex flex-column gap-2">

                            <button
                              className="btn btn-primary w-100 fw-semibold"
                              onClick={() =>
                                handleViewCertificate(
                                  certificate
                                )
                              }
                            >
                              📜 View & Download PDF Certificate
                            </button>

                            <a
                              href={`/verify-certificate?id=${encodeURIComponent(
                                certificate.certificateId
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm w-100"
                            >
                              🔍 Public Blockchain Verification
                            </a>

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>


        {/* ================================= */}
        {/* PROFESSIONAL CERTIFICATE */}
        {/* ================================= */}

        {selectedCertificate && (

          <div
            id="professional-certificate"
            className="mb-5"
          >

            <div className="d-flex justify-content-between align-items-center mb-3">

              <div>

                <h3 className="fw-bold mb-1">
                  📜 Professional Certificate
                </h3>

                <p className="text-muted mb-0">
                  Official VeriWork work certificate
                </p>

              </div>

              <button
                className="btn btn-outline-secondary"
                onClick={handleCloseCertificate}
              >
                ✕ Close
              </button>

            </div>


            <WorkCertificate
              certificate={selectedCertificate}
              onClose={handleCloseCertificate}
            />

          </div>

        )}


        {/* ================================= */}
        {/* SERVICES */}
        {/* ================================= */}

        <h3 className="fw-bold mb-3">
          VeriWork Services
        </h3>


        <div className="row g-4">


          <div className="col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body">

                <h4>🪪 Work Certificate</h4>

                <p className="text-muted">
                  Your issued work certificates are
                  displayed above.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    document
                      .getElementById(
                        "work-certificates"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  View Certificates
                </button>

              </div>

            </div>

          </div>


          <div className="col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body d-flex flex-column justify-content-between">

                <div>
                  <h4>🔗 Blockchain Verification</h4>

                  <p className="text-muted">
                    Independently verify your authentic work credentials on the decentralized public ledger.
                  </p>
                </div>

                {certificates.length > 0 ? (
                  <a
                    href={`/verify-certificate?id=${encodeURIComponent(
                      certificates[0].certificateId
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary w-100"
                  >
                    🔍 Verify on Blockchain
                  </a>
                ) : (
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate("/verify-certificate")}
                  >
                    🔍 Open Verification Portal
                  </button>
                )}

              </div>

            </div>

          </div>


          <div className="col-md-6 col-lg-4">

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body d-flex flex-column justify-content-between">

                <div>
                  <h4>🦊 Web3 Wallet</h4>

                  <p className="text-muted">
                    Connect your MetaMask wallet for digital identity & portable credentials.
                  </p>
                </div>

                {!workerWallet ? (
                  <button
                    className="btn btn-warning text-dark fw-bold w-100"
                    onClick={connectWorkerMetaMask}
                    disabled={connectingWallet}
                  >
                    {connectingWallet ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Connecting...
                      </>
                    ) : (
                      "🦊 Connect MetaMask"
                    )}
                  </button>
                ) : (
                  <div>
                    <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                      <span className="badge bg-success p-2">🟢 Connected</span>
                      <span className="font-monospace text-muted small">
                        {shortenAddress(workerWallet)}
                      </span>
                    </div>
                    <button
                      className="btn btn-outline-secondary btn-sm w-100"
                      onClick={disconnectWorkerWallet}
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* WORKER REPUTATION & REVIEWS */}
        {/* ================================= */}

        <div className="mt-4">
          <RatingReviewsSection
            title="⭐ Worker Reputation & Reviews"
            subtitle="Feedback and ratings received from employers who have hired you"
            averageRating={workerRatings.averageRating}
            totalRatings={workerRatings.totalRatings}
            ratings={workerRatings.ratings}
            loading={loadingRatings}
          />
        </div>

        {/* ================================= */}
        {/* RATING MODAL */}
        {/* ================================= */}

        <RatingModal
          show={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          employment={selectedEmploymentForRating}
          targetName={
            selectedEmploymentForRating?.employerId?.employerName || "Employer"
          }
          targetRole="Employer"
          onRatingSubmitted={handleRatingSubmitted}
        />

      </div>

    </div>
  );
}

export default WorkerDashboard;