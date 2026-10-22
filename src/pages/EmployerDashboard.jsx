import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createEmployment,
  getEmployerEmployments,
  completeEmployment,
  checkWorkerAvailability,
} from "../services/employmentService";

import {
  createCertificate,
  getEmployerCertificates,
  getCertificateHash,
  confirmBlockchainRegistration,
  syncCertificateWithBlockchain,
  registerCertificateDirectOnBlockchain,
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
import storage from "../utils/storage";

function EmployerDashboard() {
  const navigate = useNavigate();

  const employer = storage.getEmployer();

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
    endDate: "",
    startTime: "06:00",
    endTime: "07:00",
  });

  // Helper to format 24h time to 12h AM/PM
  const formatTime12h = (time24) => {
    if (!time24) return "";
    const parts = time24.split(":");
    let h = parseInt(parts[0], 10);
    const m = parts[1] || "00";
    if (isNaN(h)) return time24;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
  };

  // Convert "HH:MM" to minutes for reliable numerical comparison
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(":");
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) || 0;
    if (isNaN(h)) return null;
    return h * 60 + m;
  };

  // Check if daily work start time is invalid (must be strictly less than end time)
  const isInvalidTimeRange = Boolean(
    formData.startTime &&
    formData.endTime &&
    parseTimeToMinutes(formData.startTime) !== null &&
    parseTimeToMinutes(formData.endTime) !== null &&
    parseTimeToMinutes(formData.startTime) >= parseTimeToMinutes(formData.endTime)
  );

  // Rating & Completion states
  const [completingEmployment, setCompletingEmployment] = useState(null);
  const [ratedEmployments, setRatedEmployments] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedEmploymentForRating, setSelectedEmploymentForRating] = useState(null);
  const [registeringBlockchain, setRegisteringBlockchain] = useState(null);

  // Worker availability conflict states
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityConflict, setAvailabilityConflict] = useState(null);
  const [workerAvailabilityStatus, setWorkerAvailabilityStatus] = useState(null);
  const [workerAvailabilityMsg, setWorkerAvailabilityMsg] = useState("");

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

      // Ethereum Sepolia testnet (chain ID 11155111 / 0xaa36a7)
      const sepoliaChainId = "0xaa36a7";

      if (chainId !== sepoliaChainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: sepoliaChainId }],
          });
        } catch (switchError) {
          // Error 4902 means Sepolia is not yet added to MetaMask.
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: sepoliaChainId,
                  chainName: "Ethereum Sepolia",
                  nativeCurrency: {
                    name: "Sepolia Ether",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.sepolia.org"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      // Verify the wallet actually switched before continuing.
      const confirmedChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (confirmedChainId !== sepoliaChainId) {
        throw new Error("Please switch MetaMask to Ethereum Sepolia and try again.");
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
          await storage.clearEmployerSession();

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
          await storage.clearEmployerSession();

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
  // CHECK WORKER AVAILABILITY ON DATE / TIME / EMAIL CHANGE
  // =================================

  useEffect(() => {
    if (!formData.workerEmail || !formData.workerEmail.includes("@")) {
      setAvailabilityConflict(null);
      setWorkerAvailabilityStatus(null);
      setWorkerAvailabilityMsg("");
      return;
    }

    // Daily work start time must be less than daily work end time
    if (isInvalidTimeRange) {
      setAvailabilityConflict(null);
      setWorkerAvailabilityStatus("invalid_time");
      setWorkerAvailabilityMsg(
        `Daily work start time (${formatTime12h(formData.startTime)}) must be less than daily work end time (${formatTime12h(formData.endTime)}).`
      );
      setAvailabilityLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setAvailabilityLoading(true);
      try {
        const res = await checkWorkerAvailability({
          workerEmail: formData.workerEmail,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
        });

        if (!res.available && res.conflict) {
          setAvailabilityConflict(res.conflict);
          setWorkerAvailabilityStatus("conflict");
          setWorkerAvailabilityMsg(
            res.message || "Worker is already hired at this time. Please choose another time slot."
          );
        } else if (res.available) {
          setAvailabilityConflict(null);
          setWorkerAvailabilityStatus("available");
          setWorkerAvailabilityMsg(
            res.message || "✓ Worker is free and available during these requested hours."
          );
        }
      } catch (error) {
        if (error.response?.data?.isInvalidTimeRange) {
          setAvailabilityConflict(null);
          setWorkerAvailabilityStatus("invalid_time");
          setWorkerAvailabilityMsg(error.response.data.message);
        } else if (error.response?.status === 404) {
          setAvailabilityConflict(null);
          setWorkerAvailabilityStatus("not_found");
          setWorkerAvailabilityMsg("No registered worker found with this email");
        } else if (error.response?.data?.conflict) {
          setAvailabilityConflict(error.response.data.conflict);
          setWorkerAvailabilityStatus("conflict");
          setWorkerAvailabilityMsg(error.response.data.message);
        }
      } finally {
        setAvailabilityLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [
    formData.workerEmail,
    formData.startDate,
    formData.endDate,
    formData.startTime,
    formData.endTime,
    isInvalidTimeRange,
  ]);

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

    if (isInvalidTimeRange) {
      toast.error("Daily work start time must be less than daily work end time.");
      return;
    }

    if (availabilityConflict) {
      toast.error(
        `Cannot recruit: Worker is already hired at this time (${availabilityConflict.existingHours || ""}) by ${availabilityConflict.employerName}. Please give some other time.`
      );
      return;
    }

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
        endDate: "",
        startTime: "06:00",
        endTime: "07:00",
      });

      setAvailabilityConflict(null);
      setWorkerAvailabilityStatus(null);
      setWorkerAvailabilityMsg("");
      setShowForm(false);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.conflict) {
        setAvailabilityConflict(error.response.data.conflict);
        setWorkerAvailabilityStatus("conflict");
        setWorkerAvailabilityMsg(error.response.data.message);
      }

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

  const handleLogout = async () => {
    await storage.clearEmployerSession();
    setWalletAddress("");
    toast.success("Logged out successfully");
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
    setRegisteringBlockchain(certificate.certificateId);

    try {
      // 1. If MetaMask is connected, try MetaMask flow first
      if (walletAddress && window.ethereum) {
        toast.info("Preparing certificate hash for blockchain registration...");

        let hashToRegister = certificate.blockchainHash;
        if (!hashToRegister) {
          const hashRes = await getCertificateHash(certificate.certificateId);
          hashToRegister = hashRes.certificateHash;
        }

        // Try authorizing employer wallet as issuer on-chain
        try {
          await authorizeEmployerWallet(walletAddress);
        } catch (authErr) {
          console.warn("Pre-register authorization warning:", authErr);
        }

        try {
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

          setCertificates((prev) =>
            prev.map((c) =>
              c.certificateId === certificate.certificateId
                ? confirmResponse.certificate
                : c
            )
          );

          const targetEmpId =
            certificate.employmentId?._id || certificate.employmentId;
          setEmployments((prev) =>
            prev.map((emp) =>
              emp._id === targetEmpId
                ? { ...emp, verificationStatus: "Verified" }
                : emp
            )
          );
          return;
        } catch (mmErr) {
          console.warn("MetaMask transaction error:", mmErr);

          if (mmErr.code === 4001 || mmErr.message?.includes("rejected")) {
            toast.error("MetaMask transaction was cancelled by user.");
            return;
          }

          const isAlreadyRegistered =
            mmErr.message?.includes("already registered") ||
            mmErr.reason?.includes("already registered") ||
            mmErr.data?.includes("Certificate already registered");

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

          toast.info("MetaMask registration encountered a wallet/network issue. Anchoring directly via smart contract...");
        }
      }

      // 2. Direct blockchain registration via smart contract owner signer
      toast.info("Anchoring certificate to Ethereum blockchain...");
      const directResponse = await registerCertificateDirectOnBlockchain(
        certificate.certificateId
      );

      toast.success(
        directResponse.message || "Certificate registered and verified on blockchain! ✓"
      );

      setCertificates((prev) =>
        prev.map((c) =>
          c.certificateId === certificate.certificateId
            ? directResponse.certificate
            : c
        )
      );

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
        error.response?.data?.message?.includes("already registered");

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

      let errorMsg =
        error.response?.data?.message ||
        error.reason ||
        error.message ||
        "Failed to register certificate on blockchain.";

      if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("0x") ||
          errorMsg.includes("CALL_EXCEPTION") ||
          errorMsg.includes("missing revert data") ||
          errorMsg.includes("execution reverted"))
      ) {
        if (errorMsg.includes("Unauthorized") || errorMsg.includes("only authorized")) {
          errorMsg = "Unauthorized wallet: this wallet is not authorized to register certificates on the deployed Sepolia contract. The contract owner must authorize it first.";
        } else {
          errorMsg = "Blockchain connection error: unable to complete the transaction on Ethereum Sepolia. Check MetaMask's network, wallet balance, and the browser console for details.";
        }
      }

      toast.error(errorMsg);
    } finally {
      setRegisteringBlockchain(null);
    }
  };

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
          className="veriwork-card-dark p-4 p-md-5 mb-4 position-relative overflow-hidden shadow-lg"
          style={{
            borderRadius: "24px",
            background: "linear-gradient(135deg, #1A281D 0%, #293E2B 100%)",
            color: "#FFFFFF",
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <span
                className="mb-2 d-inline-block px-3 py-1 fw-bold rounded-pill text-uppercase"
                style={{
                  backgroundColor: "#C98A41",
                  color: "#FFFFFF",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                }}
              >
                EMPLOYER & ISSUER PORTAL
              </span>
              <h2 className="fw-bold mb-1" style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF", fontSize: "2rem" }}>
                Welcome, {employer?.employerName || "Employer"} 👋
              </h2>
              <p className="mb-0" style={{ color: "rgba(255, 255, 255, 0.88)", fontSize: "1rem" }}>
                Manage domestic workforce contracts, authorize wallet signers, and anchor certificates to Ethereum.
              </p>
            </div>
            <div className="text-end">
              <span
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  fontSize: "0.85rem",
                }}
              >
                ● AUTHORIZED ISSUER
              </span>
            </div>
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
                  ✓ Connected to Ethereum Sepolia testnet
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
                      className={`form-control ${availabilityConflict ? "is-invalid" : ""}`}
                      style={
                        availabilityConflict
                          ? {
                              borderColor: "#DC2626",
                              boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.12)",
                            }
                          : {}
                      }
                      placeholder="Enter registered worker email"
                      value={
                        formData.workerEmail
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                    {availabilityLoading && formData.workerEmail && (
                      <div className="small text-muted mt-1">
                        ⏳ Checking worker availability...
                      </div>
                    )}

                    {!availabilityLoading && workerAvailabilityStatus === "not_found" && (
                      <div className="small text-danger mt-1">
                        ⚠️ No registered worker found with this email
                      </div>
                    )}

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

                  <div className="col-md-4 mb-3">

                    <label className="form-label fw-bold">
                      Salary (Monthly ₹)
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

                  <div className="col-md-4 mb-3">

                    <label className="form-label fw-bold">
                      Start Date
                    </label>

                    <input
                      type="date"
                      name="startDate"
                      className={`form-control ${availabilityConflict ? "is-invalid" : ""}`}
                      style={
                        availabilityConflict
                          ? {
                              borderColor: "#DC2626",
                              background: "#FFFBFB",
                              boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.15)",
                            }
                          : {}
                      }
                      value={
                        formData.startDate
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                  {/* End Date */}

                  <div className="col-md-4 mb-3">

                    <label className="form-label fw-bold">
                      End Date <span className="small text-muted fw-normal">(Optional)</span>
                    </label>

                    <input
                      type="date"
                      name="endDate"
                      className={`form-control ${availabilityConflict ? "is-invalid" : ""}`}
                      style={
                        availabilityConflict
                          ? {
                              borderColor: "#DC2626",
                              background: "#FFFBFB",
                              boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.15)",
                            }
                          : {}
                      }
                      value={
                        formData.endDate
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  {/* Daily Work Start Time */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-bold">
                      Daily Work Start Time
                    </label>

                    <input
                      type="time"
                      name="startTime"
                      className={`form-control ${availabilityConflict || isInvalidTimeRange ? "is-invalid" : ""}`}
                      style={
                        availabilityConflict || isInvalidTimeRange
                          ? {
                              borderColor: "#DC2626",
                              background: "#FFFBFB",
                              boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.15)",
                            }
                          : {}
                      }
                      value={
                        formData.startTime
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                    {formData.startTime && (
                      <div className="small text-muted mt-1">
                        Starts: <strong>{formatTime12h(formData.startTime)}</strong>
                      </div>
                    )}

                  </div>

                  {/* Daily Work End Time */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-bold">
                      Daily Work End Time
                    </label>

                    <input
                      type="time"
                      name="endTime"
                      className={`form-control ${availabilityConflict || isInvalidTimeRange ? "is-invalid" : ""}`}
                      style={
                        availabilityConflict || isInvalidTimeRange
                          ? {
                              borderColor: "#DC2626",
                              background: "#FFFBFB",
                              boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.15)",
                            }
                          : {}
                      }
                      value={
                        formData.endTime
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                    {formData.endTime && (
                      <div className="small text-muted mt-1">
                        Ends: <strong>{formatTime12h(formData.endTime)}</strong>
                      </div>
                    )}

                    {isInvalidTimeRange && (
                      <div className="small text-danger fw-bold mt-1">
                        ⚠️ End time must be later than start time ({formatTime12h(formData.startTime)}).
                      </div>
                    )}

                  </div>

                </div>

                {isInvalidTimeRange ? (
                  <div
                    className="alert alert-danger d-flex align-items-center mb-4 py-2 px-3"
                    style={{
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      background: "#FEF2F2",
                      borderColor: "#FCA5A5",
                      color: "#991B1B",
                    }}
                  >
                    <span className="me-2 fs-5">⚠️</span>
                    <div>
                      <strong>Invalid Work Hours:</strong> Daily work start time (
                      <strong>{formatTime12h(formData.startTime)}</strong>) must be less than daily work end time (
                      <strong>{formatTime12h(formData.endTime)}</strong>). Please select an end time later than start time.
                    </div>
                  </div>
                ) : availabilityConflict ? (
                  <div
                    className="vw-conflict-red-line-banner mb-4"
                    style={{
                      background: "#FEF2F2",
                      borderLeft: "6px solid #DC2626",
                      borderTop: "1px solid #FCA5A5",
                      borderRight: "1px solid #FCA5A5",
                      borderBottom: "1px solid #FCA5A5",
                      borderRadius: "10px",
                      padding: "16px 20px",
                      boxShadow: "0 6px 18px rgba(220, 38, 38, 0.10)",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div
                        style={{
                          background: "#DC2626",
                          color: "#FFFFFF",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontWeight: "800",
                          fontSize: "14px",
                          marginTop: "2px",
                        }}
                      >
                        ✕
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: "#991B1B",
                            fontWeight: "800",
                            fontSize: "0.94rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>WORKER ALREADY HIRED AT THIS TIME</span>
                          <span
                            style={{
                              background: "#FEE2E2",
                              color: "#B91C1C",
                              fontSize: "0.68rem",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              fontWeight: "700",
                              border: "1px solid #F87171",
                            }}
                          >
                            TIME & DATE OVERLAP
                          </span>
                        </div>

                        <p
                          style={{
                            margin: "8px 0 10px",
                            color: "#7F1D1D",
                            fontSize: "0.88rem",
                            lineHeight: "1.5",
                          }}
                        >
                          This domestic worker is already hired at this time (
                          <strong style={{ color: "#B91C1C" }}>
                            {availabilityConflict.existingHours || "this time slot"}
                          </strong>
                          ) by{" "}
                          <strong style={{ color: "#991B1B" }}>
                            {availabilityConflict.employerName}
                          </strong>{" "}
                          as <em>"{availabilityConflict.jobRole}"</em> for the period{" "}
                          <strong>{availabilityConflict.formattedPeriod}</strong>.
                        </p>

                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "#FFFFFF",
                            border: "1px dashed #DC2626",
                            borderRadius: "6px",
                            padding: "7px 14px",
                            fontSize: "0.78rem",
                            color: "#991B1B",
                            fontWeight: "700",
                          }}
                        >
                          <span>⛔ Recruitment Blocked:</span> Worker is already hired at this time. Please give some other time.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : workerAvailabilityStatus === "available" && formData.startDate && !isInvalidTimeRange ? (
                  <div
                    className="alert alert-success d-flex align-items-center mb-4 py-2 px-3"
                    style={{ borderRadius: "8px", fontSize: "0.82rem" }}
                  >
                    <span className="me-2">✓</span>
                    <span>
                      {formData.startTime && formData.endTime
                        ? `Time slot available! Worker is free between ${formatTime12h(formData.startTime)} and ${formatTime12h(formData.endTime)}.`
                        : "Worker is free and available on this date."}
                    </span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className={`btn ${availabilityConflict || isInvalidTimeRange ? "btn-secondary" : "btn-success"}`}
                  disabled={loading || Boolean(availabilityConflict) || isInvalidTimeRange || availabilityLoading}
                  style={
                    availabilityConflict || isInvalidTimeRange
                      ? {
                          cursor: "not-allowed",
                          opacity: 0.65,
                          background: "#6B7280",
                          borderColor: "#6B7280",
                        }
                      : {}
                  }
                >

                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      Creating...
                    </>
                  ) : isInvalidTimeRange ? (
                    "⚠️ Daily Work Start Time Must Be Less Than End Time"
                  ) : availabilityConflict ? (
                    "⛔ Worker Already Hired At This Time — Give Another Time"
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
                      <th>Dates & Hours</th>
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
                              <div>
                                <span className="fw-semibold">
                                  {new Date(
                                    employment.startDate
                                  ).toLocaleDateString()}
                                </span>
                                {employment.endDate ? (
                                  <span className="text-muted small">
                                    {" "}→ {new Date(employment.endDate).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <span className="text-success small ms-1">
                                    (Ongoing)
                                  </span>
                                )}
                              </div>
                              {employment.startTime && employment.endTime ? (
                                <div className="mt-1">
                                  <span
                                    className="badge bg-light text-dark border"
                                    style={{ fontSize: "0.74rem", fontWeight: "600" }}
                                  >
                                    🕒 {formatTime12h(employment.startTime)} – {formatTime12h(employment.endTime)}
                                  </span>
                                </div>
                              ) : null}
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
                                      <Link
                                        to={`/verify-certificate?id=${encodeURIComponent(
                                          certificate.certificateId
                                        )}`}
                                        className="btn btn-sm btn-outline-info mt-1 w-100"
                                        style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                                      >
                                        🔍 View Public Proof
                                      </Link>
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