import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createEmployment,
  getEmployerEmployments,
  completeEmployment,
} from "../services/employmentService";

import {
  createCertificate,
  getEmployerCertificates,
  getCertificateHash,
  confirmBlockchainRegistration,
  syncCertificateWithBlockchain,
} from "../services/certificateService";

import {
  registerCertificateWithMetaMask,
} from "../services/blockchainService";

import {
  getUserRatings,
  getMyRatingForEmployment,
} from "../services/ratingService";

import {
  authorizeEmployerWallet,
} from "../services/employerService";

import RatingModal from "../components/RatingModal";
import RatingReviewsSection from "../components/RatingReviewsSection";
import WorkCertificate from "../components/WorkCertificate";

function EmployerDashboard() {
  const navigate = useNavigate();

  const employer = JSON.parse(
    sessionStorage.getItem("employer")
  );

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [loadingCertificates, setLoadingCertificates] =
    useState(true);

  const [generatingCertificate, setGeneratingCertificate] =
    useState(null);

  const [employments, setEmployments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [walletAddress, setWalletAddress] = useState(
    sessionStorage.getItem("employerWallet") || ""
  );

  const [connectingWallet, setConnectingWallet] =
    useState(false);

  const [formData, setFormData] = useState({
    workerEmail: "",
    jobRole: "",
    salary: "",
    startDate: "",
  });

  // Rating & Completion states
  const [completingEmployment, setCompletingEmployment] = useState(null);
  const [ratedEmployments, setRatedEmployments] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedEmploymentForRating, setSelectedEmploymentForRating] = useState(null);
  const [registeringBlockchain, setRegisteringBlockchain] = useState(null);

  // Ratings received for this employer
  const [employerRatings, setEmployerRatings] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratings: [],
  });
  const [loadingRatings, setLoadingRatings] = useState(true);

  // =================================
  // CONNECT METAMASK
  // =================================

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast.error(
        "MetaMask is not installed. Please install MetaMask first."
      );

      return;
    }

    setConnectingWallet(true);

    try {
      // Request wallet connection
      const accounts =
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

      if (!accounts || accounts.length === 0) {
        toast.error("No MetaMask account found.");
        return;
      }

      const account = accounts[0];

      // =================================
      // CHECK NETWORK
      // =================================

      const chainId =
        await window.ethereum.request({
          method: "eth_chainId",
        });

      // Hardhat local network = 31337
      const hardhatChainId = "0x7a69";

      if (chainId !== hardhatChainId) {
        try {
          // Try switching to Hardhat network
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: hardhatChainId,
              },
            ],
          });
        } catch (switchError) {
          // Error 4902 = network does not exist
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: hardhatChainId,
                  chainName: "VeriWork Local",
                  nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "http://127.0.0.1:8545",
                  ],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      // Save connected wallet
      setWalletAddress(account);

      sessionStorage.setItem(
        "employerWallet",
        account
      );

      try {
        const authRes = await authorizeEmployerWallet(account);
        if (authRes.isIssuer) {
          toast.success(
            "MetaMask connected & verified as an authorized certificate issuer! ✓"
          );
        } else {
          toast.success(
            "MetaMask connected successfully!"
          );
        }
      } catch (authErr) {
        toast.success(
          "MetaMask connected successfully!"
        );
      }
    } catch (error) {
      console.error(
        "MetaMask Connection Error:",
        error
      );

      if (error.code === 4001) {
        toast.error(
          "MetaMask connection request was rejected."
        );
      } else {
        toast.error(
          error.message ||
            "Failed to connect MetaMask."
        );
      }
    } finally {
      setConnectingWallet(false);
    }
  };

  // =================================
  // DISCONNECT WALLET
  // =================================

  const disconnectMetaMask = () => {
    setWalletAddress("");

    sessionStorage.removeItem("employerWallet");
    localStorage.removeItem("employerWallet");

    toast.success(
      "Wallet disconnected."
    );
  };

  // =================================
  // HANDLE ACCOUNT CHANGE & AUTO-AUTHORIZE
  // =================================

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const handleAccountsChanged = async (accounts) => {
      if (!accounts || accounts.length === 0) {
        setWalletAddress("");
        sessionStorage.removeItem("employerWallet");
        localStorage.removeItem("employerWallet");
        return;
      }

      const account = accounts[0];
      setWalletAddress(account);
      sessionStorage.setItem("employerWallet", account);

      try {
        await authorizeEmployerWallet(account);
      } catch (err) {
        console.warn("Wallet authorization error on account change:", err);
      }
    };

    window.ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

  // Sync authorization whenever walletAddress is set or restored
  useEffect(() => {
    if (walletAddress) {
      authorizeEmployerWallet(walletAddress)
        .then(() => {
          console.log("Wallet authorization confirmed for:", walletAddress);
        })
        .catch((err) => {
          console.warn("Wallet authorization error on load:", err);
        });
    }
  }, [walletAddress]);

  // =================================
  // LOAD EMPLOYMENT RECORDS & RATINGS
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
          // ignore error
        }
      })
    );
    setRatedEmployments((prev) => ({ ...prev, ...ratedMap }));
  };

  useEffect(() => {
    const loadEmployments = async () => {
      try {
        const response =
          await getEmployerEmployments();

        setEmployments(
          response.employments
        );

        checkRatedEmployments(response.employments);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          sessionStorage.removeItem("employerToken");
          sessionStorage.removeItem("employer");
          localStorage.removeItem("employerToken");
          localStorage.removeItem("employer");

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/employer-login");

          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Unable to load employment records"
        );
      } finally {
        setLoadingRecords(false);
      }
    };

    loadEmployments();
  }, [navigate]);

  // =================================
  // LOAD EMPLOYER RECEIVED RATINGS
  // =================================

  useEffect(() => {
    const loadRatings = async () => {
      if (!employer?._id) return;
      try {
        const data = await getUserRatings(employer._id);
        setEmployerRatings({
          averageRating: data.averageRating || 0,
          totalRatings: data.totalRatings || 0,
          ratings: data.ratings || [],
        });
      } catch (error) {
        console.error("Error loading employer ratings:", error);
      } finally {
        setLoadingRatings(false);
      }
    };

    loadRatings();
  }, [employer?._id]);

  // =================================
  // LOAD CERTIFICATES
  // =================================

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response =
          await getEmployerCertificates();

        setCertificates(
          response.certificates
        );
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          sessionStorage.removeItem("employerToken");
          sessionStorage.removeItem("employer");
          localStorage.removeItem("employerToken");
          localStorage.removeItem("employer");

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/employer-login");

          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Unable to load certificates"
        );
      } finally {
        setLoadingCertificates(false);
      }
    };

    loadCertificates();
  }, [navigate]);

  // =================================
  // HANDLE FORM CHANGE
  // =================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =================================
  // CREATE EMPLOYMENT
  // =================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response =
        await createEmployment(
          formData
        );

      toast.success(
        response.message
      );

      setEmployments([
        response.employment,
        ...employments,
      ]);

      setFormData({
        workerEmail: "",
        jobRole: "",
        salary: "",
        startDate: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create employment record"
      );
    } finally {
      setLoading(false);
    }
  };

  // =================================
  // GENERATE CERTIFICATE
  // =================================

  const handleGenerateCertificate = async (
    employmentId
  ) => {
    setGeneratingCertificate(
      employmentId
    );

    try {
      const response =
        await createCertificate(
          employmentId
        );

      toast.success(
        response.message ||
          "Work Certificate Created Successfully"
      );

      setCertificates([
        response.certificate,
        ...certificates,
      ]);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to generate work certificate"
      );
    } finally {
      setGeneratingCertificate(null);
    }
  };

  // =================================
  // CHECK CERTIFICATE
  // =================================

  const getCertificateForEmployment = (
    employmentId
  ) => {
    return certificates.find(
      (certificate) =>
        certificate.employmentId?._id ===
          employmentId ||
        certificate.employmentId ===
          employmentId
    );
  };

  // =================================
  // LOGOUT
  // =================================

  const handleLogout = () => {
    sessionStorage.removeItem("employerToken");
    sessionStorage.removeItem("employer");
    sessionStorage.removeItem("employerWallet");
    localStorage.removeItem("employerToken");
    localStorage.removeItem("employer");
    localStorage.removeItem("employerWallet");

    setWalletAddress("");

    toast.success(
      "Logged out successfully"
    );

    navigate("/employer-login");
  };

  // =================================
  // FORMAT WALLET ADDRESS
  // =================================

  const shortenAddress = (address) => {
    if (!address) {
      return "";
    }

    return `${address.slice(
      0,
      6
    )}...${address.slice(-4)}`;
  };

  // =================================
  // HANDLE COMPLETE EMPLOYMENT
  // =================================

  const handleCompleteEmployment = async (employmentId) => {
    if (!window.confirm("Mark this employment record as completed? This will finalize the contract and allow rating the worker.")) {
      return;
    }

    setCompletingEmployment(employmentId);
    try {
      const response = await completeEmployment(employmentId);
      toast.success(response.message || "Employment marked as completed!");

      setEmployments((prev) =>
        prev.map((emp) =>
          emp._id === employmentId ? response.employment : emp
        )
      );
    } catch (error) {
      console.error("Complete Employment Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete employment record"
      );
    } finally {
      setCompletingEmployment(null);
    }
  };

  // =================================
  // HANDLE RATE WORKER
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
  // REGISTER CERTIFICATE ON BLOCKCHAIN (METAMASK)
  // =================================

  const handleRegisterOnBlockchain = async (certificate) => {
    if (!walletAddress) {
      toast.warn("Please connect your MetaMask wallet first.");
      return;
    }

    setRegisteringBlockchain(certificate.certificateId);

    try {
      toast.info("Retrieving certificate cryptographic hash...");

      let hashToRegister = certificate.blockchainHash;
      if (!hashToRegister) {
        const hashRes = await getCertificateHash(certificate.certificateId);
        hashToRegister = hashRes.certificateHash;
      }

      // Ensure connected wallet is registered as authorized issuer on the smart contract
      try {
        await authorizeEmployerWallet(walletAddress);
      } catch (authErr) {
        console.warn("Pre-register authorization warning:", authErr);
      }

      toast.info("Opening MetaMask... Please approve the transaction.");

      const txResult = await registerCertificateWithMetaMask({
        certificateId: certificate.certificateId,
        certificateHash: hashToRegister,
      });

      toast.info("Transaction confirmed on blockchain. Syncing with VeriWork...");

      const confirmResponse = await confirmBlockchainRegistration(
        certificate.certificateId,
        txResult.transactionHash
      );

      toast.success(
        confirmResponse.message || "Certificate registered and verified on blockchain!"
      );

      // Update certificate in state
      setCertificates((prev) =>
        prev.map((c) =>
          c.certificateId === certificate.certificateId
            ? confirmResponse.certificate
            : c
        )
      );

      // Also update verification status in employment list
      const targetEmpId =
        certificate.employmentId?._id || certificate.employmentId;
      setEmployments((prev) =>
        prev.map((emp) =>
          emp._id === targetEmpId
            ? { ...emp, verificationStatus: "Verified" }
            : emp
        )
      );
    } catch (error) {
      console.error("Blockchain Registration Error:", error);

      const isAlreadyRegistered =
        error.message?.includes("already registered") ||
        error.reason?.includes("already registered") ||
        error.data?.includes("Certificate already registered");

      if (isAlreadyRegistered) {
        toast.info("Certificate is already registered on blockchain! Synchronizing state...");
        try {
          const syncRes = await syncCertificateWithBlockchain(certificate.certificateId);
          toast.success("Certificate synchronized and verified successfully! ✓");

          setCertificates((prev) =>
            prev.map((c) =>
              c.certificateId === certificate.certificateId ? syncRes.certificate : c
            )
          );

          const targetEmpId = certificate.employmentId?._id || certificate.employmentId;
          setEmployments((prev) =>
            prev.map((emp) =>
              emp._id === targetEmpId ? { ...emp, verificationStatus: "Verified" } : emp
            )
          );
          return;
        } catch (syncErr) {
          console.error("Auto-sync error:", syncErr);
        }
      }

      if (error.code === 4001 || error.message?.includes("rejected")) {
        toast.error("MetaMask transaction was cancelled by user.");
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to register certificate on blockchain."
        );
      }
    } finally {
      setRegisteringBlockchain(null);
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
      <div className="container">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">
              🏢 Employer Dashboard
            </h2>

            <p className="text-muted mb-0">
              Manage your employment records
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
          className="card border-0 shadow-sm mb-4"
          style={{
            background:
              "linear-gradient(90deg,#16a34a,#059669)",
            color: "white",
          }}
        >
          <div className="card-body p-4">

            <h3>
              Welcome,{" "}
              {employer?.employerName ||
                "Employer"} 👋
            </h3>

            <p className="mb-0">
              Manage your employees and employment
              records.
            </p>

          </div>
        </div>

        {/* ================================= */}
        {/* METAMASK WALLET */}
        {/* ================================= */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div>

                <h3 className="fw-bold mb-1">
                  🦊 Blockchain Wallet
                </h3>

                <p className="text-muted mb-0">
                  Connect your MetaMask wallet
                  to the blockchain.
                </p>

              </div>

              {!walletAddress ? (

                <button
                  className="btn btn-warning"
                  onClick={
                    connectMetaMask
                  }
                  disabled={
                    connectingWallet
                  }
                >

                  {connectingWallet ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      Connecting...
                    </>
                  ) : (
                    "🦊 Connect MetaMask"
                  )}

                </button>

              ) : (

                <div className="d-flex align-items-center gap-2">

                  <span className="badge bg-success p-2">
                    🟢 Connected
                  </span>

                  <span className="text-muted">
                    {shortenAddress(
                      walletAddress
                    )}
                  </span>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={
                      disconnectMetaMask
                    }
                  >
                    Disconnect
                  </button>

                </div>

              )}

            </div>

            {walletAddress && (

              <div className="mt-3 p-3 bg-light rounded">

                <strong>
                  Wallet Address
                </strong>

                <div className="small text-muted mt-1">
                  {walletAddress}
                </div>

                <div className="small text-success mt-2">
                  ✓ Connected to local blockchain
                </div>

              </div>

            )}

          </div>

        </div>

        {/* ================================= */}
        {/* EMPLOYER PROFILE */}
        {/* ================================= */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <h3 className="fw-bold mb-4">
              🏢 Employer Profile
            </h3>

            <div className="row">

              <div className="col-md-4 mb-3">

                <strong>
                  Employer Name
                </strong>

                <div className="form-control bg-light mt-2">
                  {employer?.employerName ||
                    "Not available"}
                </div>

              </div>

              <div className="col-md-4 mb-3">

                <strong>
                  Email
                </strong>

                <div className="form-control bg-light mt-2">
                  {employer?.email ||
                    "Not available"}
                </div>

              </div>

              <div className="col-md-4 mb-3">

                <strong>
                  Phone
                </strong>

                <div className="form-control bg-light mt-2">
                  {employer?.phone ||
                    "Not available"}
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* REGISTER EMPLOYMENT */}
        {/* ================================= */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h3 className="fw-bold mb-1">
                  ➕ Register Employment
                </h3>

                <p className="text-muted mb-0">
                  Create a verified employment record
                  for a worker.
                </p>

              </div>

              <button
                className="btn btn-success"
                onClick={() =>
                  setShowForm(!showForm)
                }
              >
                {showForm
                  ? "Close Form"
                  : "Register Employment"}
              </button>

            </div>

            {/* FORM */}

            {showForm && (

              <form
                onSubmit={handleSubmit}
                className="mt-4"
              >

                <div className="row">

                  {/* Worker Email */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-bold">
                      Worker Email
                    </label>

                    <input
                      type="email"
                      name="workerEmail"
                      className="form-control"
                      placeholder="Enter registered worker email"
                      value={
                        formData.workerEmail
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                  {/* Job Role */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-bold">
                      Job Role
                    </label>

                    <input
                      type="text"
                      name="jobRole"
                      className="form-control"
                      placeholder="Example: Software Developer"
                      value={
                        formData.jobRole
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                  {/* Salary */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-bold">
                      Salary
                    </label>

                    <input
                      type="number"
                      name="salary"
                      className="form-control"
                      placeholder="Enter monthly salary"
                      value={
                        formData.salary
                      }
                      onChange={
                        handleChange
                      }
                      min="0"
                      required
                    />

                  </div>

                  {/* Start Date */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-bold">
                      Start Date
                    </label>

                    <input
                      type="date"
                      name="startDate"
                      className="form-control"
                      value={
                        formData.startDate
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>

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

                      Creating...
                    </>
                  ) : (
                    "Create Employment Record"
                  )}

                </button>

              </form>

            )}

          </div>

        </div>

        {/* ================================= */}
        {/* EMPLOYMENT HISTORY */}
        {/* ================================= */}

        <div className="card border-0 shadow-sm">

          <div className="card-body p-4">

            <h3 className="fw-bold mb-4">
              👥 Employment Records
            </h3>

            {loadingRecords ? (

              <div className="text-center py-4">

                <div
                  className="spinner-border text-success"
                  role="status"
                ></div>

                <p className="text-muted mt-2">
                  Loading employment records...
                </p>

              </div>

            ) : employments.length ===
              0 ? (

              <div className="text-center py-4">

                <h5>
                  No employment records yet.
                </h5>

                <p className="text-muted">
                  Register your first employee above.
                </p>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                  <thead className="table-success">

                    <tr>
                      <th>Worker</th>
                      <th>Email</th>
                      <th>Job Role</th>
                      <th>Salary</th>
                      <th>Start Date</th>
                      <th>Status</th>
                      <th>Verification</th>
                      <th>Certificate</th>
                      <th>Action / Rating</th>
                    </tr>

                  </thead>

                  <tbody>

                    {employments.map(
                      (employment) => {

                        const certificate =
                          getCertificateForEmployment(
                            employment._id
                          );

                        return (
                          <tr
                            key={
                              employment._id
                            }
                          >

                            <td>
                              {
                                employment
                                  .workerId
                                  ?.fullName
                              }
                            </td>

                            <td>
                              {
                                employment
                                  .workerId
                                  ?.email
                              }
                            </td>

                            <td>
                              {
                                employment.jobRole
                              }
                            </td>

                            <td>
                              ₹
                              {
                                employment.salary
                              }
                            </td>

                            <td>
                              {new Date(
                                employment.startDate
                              ).toLocaleDateString()}
                            </td>

                            <td>

                              <span className={employment.status === "Completed" ? "badge bg-secondary" : "badge bg-success"}>
                                {
                                  employment.status
                                }
                              </span>

                            </td>

                            <td>

                              <span className="badge bg-warning text-dark">
                                {
                                  employment.verificationStatus
                                }
                              </span>

                            </td>

                            <td>

                              {loadingCertificates ? (

                                <span className="text-muted">
                                  Loading...
                                </span>

                              ) : certificate ? (

                                <div>

                                  <div className="d-flex align-items-center gap-1">
                                    <span
                                      className={
                                        certificate.verificationStatus ===
                                        "Verified"
                                          ? "badge bg-success"
                                          : "badge bg-warning text-dark"
                                      }
                                    >
                                      {certificate.verificationStatus === "Verified"
                                        ? "📜 Verified"
                                        : "⏳ Pending Registration"}
                                    </span>
                                  </div>

                                  <div className="small text-muted font-monospace mt-1">
                                    {
                                      certificate.certificateId
                                    }
                                  </div>

                                  {certificate.verificationStatus === "Verified" ? (
                                    <div>
                                      <div className="small text-success mt-1 fw-bold">
                                        ✓ On Blockchain
                                      </div>
                                      <a
                                        href={`/verify-certificate?id=${encodeURIComponent(
                                          certificate.certificateId
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-info mt-1 w-100"
                                        style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                                      >
                                        🔍 View Public Proof
                                      </a>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-success mt-1 w-100 fw-semibold"
                                        style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                                        onClick={() => {
                                          setSelectedCertificate(certificate);
                                          setTimeout(() => {
                                            document
                                              .getElementById("employer-certificate-viewer")
                                              ?.scrollIntoView({ behavior: "smooth" });
                                          }, 100);
                                        }}
                                      >
                                        📥 Download PDF & QR
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-outline-primary mt-2"
                                      onClick={() =>
                                        handleRegisterOnBlockchain(
                                          certificate
                                        )
                                      }
                                      disabled={
                                        registeringBlockchain ===
                                        certificate.certificateId
                                      }
                                    >
                                      {registeringBlockchain ===
                                      certificate.certificateId ? (
                                        <>
                                          <span
                                            className="spinner-border spinner-border-sm me-1"
                                            role="status"
                                          ></span>
                                          Registering...
                                        </>
                                      ) : (
                                        "🔗 Register Blockchain"
                                      )}
                                    </button>
                                  )}

                                </div>

                              ) : (

                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() =>
                                    handleGenerateCertificate(
                                      employment._id
                                    )
                                  }
                                  disabled={
                                    generatingCertificate ===
                                    employment._id
                                  }
                                >

                                  {generatingCertificate ===
                                  employment._id ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                      ></span>

                                      Generating...
                                    </>
                                  ) : (
                                    "📜 Generate"
                                  )}

                                </button>

                              )}

                            </td>

                            <td>

                              {employment.status === "Active" ? (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleCompleteEmployment(employment._id)}
                                  disabled={completingEmployment === employment._id}
                                >
                                  {completingEmployment === employment._id ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                      ></span>
                                      Completing...
                                    </>
                                  ) : (
                                    "✓ Complete Job"
                                  )}
                                </button>
                              ) : ratedEmployments[employment._id] ? (
                                <span className="badge bg-warning text-dark px-2 py-1">
                                  ⭐ Rated ({ratedEmployments[employment._id].rating}/5)
                                </span>
                              ) : (
                                <button
                                  className="btn btn-sm btn-warning text-dark fw-bold"
                                  onClick={() => handleOpenRatingModal(employment)}
                                >
                                  ⭐ Rate Worker
                                </button>
                              )}

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

        {/* ================================= */}
        {/* CERTIFICATE PREVIEW & PDF DOWNLOAD */}
        {/* ================================= */}
        {selectedCertificate && (
          <div id="employer-certificate-viewer" className="mt-4">
            <WorkCertificate
              certificate={selectedCertificate}
              onClose={() => setSelectedCertificate(null)}
            />
          </div>
        )}
        {/* EMPLOYER REPUTATION & REVIEWS */}
        {/* ================================= */}

        <div className="mt-4">
          <RatingReviewsSection
            title="⭐ Employer Reputation & Reviews"
            subtitle="Feedback and ratings received from workers you've employed"
            averageRating={employerRatings.averageRating}
            totalRatings={employerRatings.totalRatings}
            ratings={employerRatings.ratings}
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
          targetName={selectedEmploymentForRating?.workerId?.fullName || "Worker"}
          targetRole="Worker"
          onRatingSubmitted={handleRatingSubmitted}
        />

      </div>
    </div>
  );
}

export default EmployerDashboard;