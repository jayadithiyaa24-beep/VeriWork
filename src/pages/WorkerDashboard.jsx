import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaBriefcase,
  FaWallet,
  FaShieldAlt,
  FaCertificate,
  FaStar,
  FaBuilding,
  FaCalendarAlt,
  FaRupeeSign,
  FaLink,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaSignOutAlt,
  FaDownload,
  FaExternalLinkAlt,
  FaTimes,
  FaEthereum,
} from "react-icons/fa";

import { getWorkerProfile } from "../services/authService";
import { getWorkerEmployments } from "../services/employmentService";

import {
  getWorkerCertificates,
} from "../services/certificateService";

import { connectWorkerWallet } from "../services/workerService";
import storage from "../utils/storage";

import WorkCertificate from "../components/WorkCertificate";

import {
  getUserRatings,
  getMyRatingForEmployment,
} from "../services/ratingService";

import RatingModal from "../components/RatingModal";
import RatingReviewsSection from "../components/RatingReviewsSection";


function WorkerDashboard() {
  const navigate = useNavigate();

  // =================================
  // STATE
  // =================================

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

  // Web3 Wallet
  const [workerWallet, setWorkerWallet] = useState(
    sessionStorage.getItem("workerWallet") || ""
  );

  const [connectingWallet, setConnectingWallet] =
    useState(false);

  // Ratings
  const [ratedEmployments, setRatedEmployments] =
    useState({});

  const [showRatingModal, setShowRatingModal] =
    useState(false);

  const [selectedEmploymentForRating, setSelectedEmploymentForRating] =
    useState(null);

  // Worker's received ratings
  const [workerRatings, setWorkerRatings] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratings: [],
  });

  const [loadingRatings, setLoadingRatings] =
    useState(true);


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

          sessionStorage.setItem(
            "workerWallet",
            response.worker.walletAddress
          );
        }

        sessionStorage.setItem(
          "worker",
          JSON.stringify(response.worker)
        );

      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          await storage.clearWorkerSession();

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
  // CHECK RATED EMPLOYMENTS
  // =================================

  const checkRatedEmployments = async (list) => {
    const completedList = (list || []).filter(
      (e) => e.status === "Completed"
    );

    const ratedMap = {};

    await Promise.all(
      completedList.map(async (emp) => {
        try {
          const res = await getMyRatingForEmployment(emp._id);

          if (res.rating) {
            ratedMap[emp._id] = res.rating;
          }
        } catch (err) {
          // Ignore rating lookup errors
        }
      })
    );

    setRatedEmployments((prev) => ({
      ...prev,
      ...ratedMap,
    }));
  };


  // =================================
  // LOAD EMPLOYMENT HISTORY
  // =================================

  useEffect(() => {
    const loadEmployments = async () => {
      try {
        const response = await getWorkerEmployments();

        setEmployments(response.employments);

        checkRatedEmployments(response.employments);

      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          await storage.clearWorkerSession();

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
  // LOAD WORKER RATINGS
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
        console.error(
          "Error loading worker ratings:",
          error
        );

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
  // LOAD CERTIFICATES
  // =================================

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response = await getWorkerCertificates();

        setCertificates(response.certificates);

      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          await storage.clearWorkerSession();

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

  const handleLogout = async () => {
    await storage.clearWorkerSession();
    setWorkerWallet("");
    toast.success("Logged out successfully");
    navigate("/login");
  };


  // =================================
  // METAMASK
  // =================================

  const connectWorkerMetaMask = async () => {
    if (!window.ethereum) {
      toast.error(
        "MetaMask is not installed. Please install MetaMask first."
      );

      return;
    }

    setConnectingWallet(true);

    try {
      const accounts =
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

      if (!accounts || accounts.length === 0) {
        toast.error("No MetaMask account found.");
        return;
      }

      const account = accounts[0];

      setWorkerWallet(account);

      sessionStorage.setItem(
        "workerWallet",
        account
      );

      try {
        await connectWorkerWallet(account);
      } catch (saveErr) {
        console.warn(
          "Could not save wallet in backend:",
          saveErr
        );
      }

      toast.success(
        "MetaMask wallet connected successfully! 🦊"
      );

    } catch (err) {
      console.error(
        "Worker MetaMask Error:",
        err
      );

      if (err.code === 4001) {
        toast.error(
          "MetaMask connection request was rejected."
        );
      } else {
        toast.error(
          err.message ||
          "Failed to connect MetaMask."
        );
      }

    } finally {
      setConnectingWallet(false);
    }
  };


  const disconnectWorkerWallet = () => {
    setWorkerWallet("");

    sessionStorage.removeItem(
      "workerWallet"
    );

    localStorage.removeItem(
      "workerWallet"
    );

    toast.info("Wallet disconnected.");
  };


  const shortenAddress = (addr) => {
    if (!addr) return "";

    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };


  // =================================
  // METAMASK ACCOUNT LISTENER
  // =================================

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        setWorkerWallet("");

        sessionStorage.removeItem(
          "workerWallet"
        );

        localStorage.removeItem(
          "workerWallet"
        );
      } else {
        const account = accounts[0];

        setWorkerWallet(account);

        sessionStorage.setItem(
          "workerWallet",
          account
        );

        connectWorkerWallet(account).catch(
          console.warn
        );
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


  // =================================
  // CERTIFICATE
  // =================================

  const handleViewCertificate = (
    certificate
  ) => {
    setSelectedCertificate(certificate);

    setTimeout(() => {
      document
        .getElementById(
          "professional-certificate"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };


  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
  };


  // =================================
  // LOADING
  // =================================

  if (loading) {
    return (
      <>
        <div className="vw-dashboard-loading">
          <div className="vw-loading-card">
            <div className="vw-loading-logo">
              VW
            </div>

            <div className="spinner-border vw-spinner" />

            <h5>
              Loading your workspace
            </h5>

            <p>
              Preparing your verified work identity...
            </p>
          </div>
        </div>

        <DashboardStyles />
      </>
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


  const activeEmployments =
    employments.filter(
      (item) => item.status === "Active"
    ).length;

  const completedEmployments =
    employments.filter(
      (item) => item.status === "Completed"
    ).length;


  return (
    <div className="vw-worker-dashboard">

      <div className="container">

        {/* ================================= */}
        {/* DASHBOARD HEADER */}
        {/* ================================= */}

        <header className="vw-dashboard-header">

          <div>
            <span className="vw-dashboard-eyebrow">
              WORKER PORTAL
            </span>

            <h1>
              Your work identity,
              <br />
              <em>all in one place.</em>
            </h1>

            <p>
              Manage your verified employment,
              certificates and professional reputation.
            </p>
          </div>

          <button
            className="vw-dashboard-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </header>


        {/* ================================= */}
        {/* WELCOME HERO */}
        {/* ================================= */}

        <section className="vw-dashboard-hero">

          <div className="vw-dashboard-hero-content">

            <div className="vw-dashboard-badge">
              <FaCheckCircle />
              <span>
                VERIFIED WORKER IDENTITY
              </span>
            </div>

            <h2>
              Welcome, {worker.fullName}
            </h2>

            <p>
              Your decentralized work identity is active
              and your professional records are securely
              connected to VeriWork.
            </p>

            <div className="vw-chain-status">
              <FaEthereum />
              <span>
                EVM CHAIN ID 31337
              </span>
              <i />
              <span>Identity Active</span>
            </div>

          </div>

          <div className="vw-hero-decoration">
            <div className="vw-hero-ring">
              <FaShieldAlt />
            </div>
          </div>

        </section>


        {/* ================================= */}
        {/* QUICK STATS */}
        {/* ================================= */}

        <section className="vw-dashboard-stats">

          <DashboardStat
            icon={<FaBriefcase />}
            value={employments.length}
            label="Employment Records"
          />

          <DashboardStat
            icon={<FaCheckCircle />}
            value={activeEmployments}
            label="Active Employment"
            accent="green"
          />

          <DashboardStat
            icon={<FaCertificate />}
            value={certificates.length}
            label="Work Certificates"
            accent="ochre"
          />

          <DashboardStat
            icon={<FaStar />}
            value={
              workerRatings.totalRatings > 0
                ? Number(
                  workerRatings.averageRating
                ).toFixed(1)
                : "—"
            }
            label="Average Rating"
            accent="gold"
          />

        </section>


        {/* ================================= */}
        {/* PROFILE */}
        {/* ================================= */}

        <section className="vw-section-card">

          <SectionHeading
            eyebrow="IDENTITY"
            title="My Profile"
            description="Your verified personal and professional information."
            icon={<FaUser />}
          />

          <div className="vw-profile-grid">

            <ProfileItem
              icon={<FaUser />}
              label="Full Name"
              value={worker.fullName}
            />

            <ProfileItem
              icon={<FaEnvelope />}
              label="Email"
              value={worker.email}
            />

            <ProfileItem
              icon={<FaPhone />}
              label="Phone Number"
              value={worker.phone}
            />

            <ProfileItem
              icon={<FaIdCard />}
              label="Aadhaar Number"
              value={maskedAadhaar}
              secure
            />

            <ProfileItem
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={worker.address}
              wide
            />

            <ProfileItem
              icon={<FaBriefcase />}
              label="Skills"
              value={worker.skills}
            />

            <ProfileItem
              icon={<FaBriefcase />}
              label="Experience"
              value={`${worker.experience} years`}
            />

            <div className="vw-profile-item vw-profile-wallet">

              <div className="vw-profile-item-icon">
                <FaWallet />
              </div>

              <div>
                <span>Wallet Address</span>

                <strong>
                  {worker.walletAddress
                    ? shortenAddress(
                      worker.walletAddress
                    )
                    : "Not connected"}
                </strong>
              </div>

              {worker.walletAddress && (
                <FaCheckCircle className="vw-wallet-check" />
              )}

            </div>

          </div>

        </section>


        {/* ================================= */}
        {/* EMPLOYMENT HISTORY */}
        {/* ================================= */}

        <section className="vw-section-card">

          <SectionHeading
            eyebrow="WORK HISTORY"
            title="Employment History"
            description="Your verified employment records."
            icon={<FaBriefcase />}
            count={`${employments.length} ${employments.length === 1
                ? "Record"
                : "Records"
              }`}
          />

          {loadingEmployment ? (

            <DashboardLoading
              text="Loading employment history..."
            />

          ) : employments.length === 0 ? (

            <EmptyState
              icon={<FaBriefcase />}
              title="No Employment Records"
              description="Your employment history will appear here once an employer registers your employment."
            />

          ) : (

            <div className="vw-employment-grid">

              {employments.map(
                (employment) => (

                  <EmploymentCard
                    key={employment._id}
                    employment={employment}
                    rated={
                      ratedEmployments[
                      employment._id
                      ]
                    }
                    onRate={() =>
                      handleOpenRatingModal(
                        employment
                      )
                    }
                  />

                )
              )}

            </div>

          )}

        </section>


        {/* ================================= */}
        {/* CERTIFICATES */}
        {/* ================================= */}

        <section
          id="work-certificates"
          className="vw-section-card"
        >

          <SectionHeading
            eyebrow="VERIFIED CREDENTIALS"
            title="My Work Certificates"
            description="Official work certificates issued through VeriWork."
            icon={<FaCertificate />}
            count={`${certificates.length} ${certificates.length === 1
                ? "Certificate"
                : "Certificates"
              }`}
          />

          {loadingCertificates ? (

            <DashboardLoading
              text="Loading certificates..."
            />

          ) : certificates.length === 0 ? (

            <EmptyState
              icon={<FaCertificate />}
              title="No Work Certificates"
              description="Certificates issued by your employers will appear here."
            />

          ) : (

            <div className="vw-certificate-grid">

              {certificates.map(
                (certificate) => (

                  <CertificateCard
                    key={certificate._id}
                    certificate={certificate}
                    onView={() =>
                      handleViewCertificate(
                        certificate
                      )
                    }
                  />

                )
              )}

            </div>

          )}

        </section>


        {/* ================================= */}
        {/* PROFESSIONAL CERTIFICATE */}
        {/* ================================= */}

        {selectedCertificate && (

          <section
            id="professional-certificate"
            className="vw-section-card vw-professional-certificate"
          >

            <div className="vw-certificate-header">

              <div>
                <span className="vw-dashboard-eyebrow">
                  DOCUMENT VIEWER
                </span>

                <h2>
                  Professional Certificate
                </h2>

                <p>
                  Official VeriWork work certificate
                </p>
              </div>

              <button
                className="vw-close-button"
                onClick={
                  handleCloseCertificate
                }
              >
                <FaTimes />
                Close
              </button>

            </div>

            <WorkCertificate
              certificate={
                selectedCertificate
              }
              onClose={
                handleCloseCertificate
              }
            />

          </section>

        )}


        {/* ================================= */}
        {/* SERVICES */}
        {/* ================================= */}

        <section className="vw-services-section">

          <SectionHeading
            eyebrow="VERIWORK TOOLS"
            title="Your Services"
            description="Access the tools that help you build and protect your professional identity."
            icon={<FaShieldAlt />}
          />

          <div className="vw-services-grid">

            {/* Certificate */}
            <div className="vw-service-card">

              <div className="vw-service-icon green">
                <FaCertificate />
              </div>

              <h3>
                Work Certificate
              </h3>

              <p>
                View and download your verified
                employment certificates.
              </p>

              <button
                className="vw-service-button green"
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
                <FaArrowRight />
              </button>

            </div>


            {/* Blockchain */}
            <div className="vw-service-card">

              <div className="vw-service-icon ochre">
                <FaLink />
              </div>

              <h3>
                Blockchain Verification
              </h3>

              <p>
                Independently verify your authentic
                work credentials on the decentralized
                public ledger.
              </p>

              {certificates.length > 0 ? (

                <a
                  href={`/verify-certificate?id=${encodeURIComponent(
                    certificates[0].certificateId
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vw-service-button ochre"
                >
                  Verify on Blockchain
                  <FaExternalLinkAlt />
                </a>

              ) : (

                <button
                  className="vw-service-button ochre"
                  onClick={() =>
                    navigate(
                      "/verify-certificate"
                    )
                  }
                >
                  Open Verification Portal
                  <FaArrowRight />
                </button>

              )}

            </div>


            {/* Wallet */}
            <div className="vw-service-card">

              <div className="vw-service-icon wallet">
                <FaWallet />
              </div>

              <h3>
                Web3 Wallet
              </h3>

              <p>
                Connect your MetaMask wallet for
                digital identity and portable credentials.
              </p>

              {!workerWallet ? (

                <button
                  className="vw-service-button wallet"
                  onClick={
                    connectWorkerMetaMask
                  }
                  disabled={connectingWallet}
                >
                  {connectingWallet ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      🦊 Connect MetaMask
                      <FaArrowRight />
                    </>
                  )}
                </button>

              ) : (

                <div className="vw-connected-wallet">

                  <div className="vw-wallet-connected-row">

                    <span>
                      <FaCheckCircle />
                      Connected
                    </span>

                    <code>
                      {shortenAddress(
                        workerWallet
                      )}
                    </code>

                  </div>

                  <button
                    className="vw-disconnect-button"
                    onClick={
                      disconnectWorkerWallet
                    }
                  >
                    Disconnect Wallet
                  </button>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* ================================= */}
        {/* REPUTATION */}
        {/* ================================= */}

        <section className="vw-reputation-wrapper">

          <RatingReviewsSection
            title="⭐ Worker Reputation & Reviews"
            subtitle="Feedback and ratings received from employers who have hired you"
            averageRating={
              workerRatings.averageRating
            }
            totalRatings={
              workerRatings.totalRatings
            }
            ratings={
              workerRatings.ratings
            }
            loading={loadingRatings}
          />

        </section>


        {/* ================================= */}
        {/* RATING MODAL */}
        {/* ================================= */}

        <RatingModal
          show={showRatingModal}
          onClose={() =>
            setShowRatingModal(false)
          }
          employment={
            selectedEmploymentForRating
          }
          targetName={
            selectedEmploymentForRating
              ?.employerId?.employerName ||
            "Employer"
          }
          targetRole="Employer"
          onRatingSubmitted={
            handleRatingSubmitted
          }
        />

      </div>

      <DashboardStyles />

    </div>
  );
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function DashboardStat({
  icon,
  value,
  label,
  accent = "",
}) {
  return (
    <div
      className={`vw-dashboard-stat ${accent}`}
    >
      <div className="vw-stat-icon">
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}


function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
  count,
}) {
  return (
    <div className="vw-section-heading">

      <div className="vw-section-heading-main">

        <div className="vw-section-heading-icon">
          {icon}
        </div>

        <div>
          <span className="vw-dashboard-eyebrow">
            {eyebrow}
          </span>

          <h2>{title}</h2>

          <p>{description}</p>
        </div>

      </div>

      {count && (
        <span className="vw-section-count">
          {count}
        </span>
      )}

    </div>
  );
}


function ProfileItem({
  icon,
  label,
  value,
  wide = false,
  secure = false,
}) {
  return (
    <div
      className={`vw-profile-item ${wide ? "wide" : ""
        }`}
    >

      <div className="vw-profile-item-icon">
        {icon}
      </div>

      <div>
        <span>
          {label}
          {secure && (
            <FaShieldAlt className="ms-2 vw-secure-icon" />
          )}
        </span>

        <strong>
          {value || "Not available"}
        </strong>
      </div>

    </div>
  );
}


function EmploymentCard({
  employment,
  rated,
  onRate,
}) {
  const isVerified =
    employment.verificationStatus ===
    "Verified";

  const isActive =
    employment.status === "Active";

  return (
    <article className="vw-employment-card">

      <div className="vw-employment-top">

        <div className="vw-employment-role">
          <span>
            JOB ROLE
          </span>

          <h3>
            {employment.jobRole}
          </h3>
        </div>

        <div className="vw-employment-statuses">

          <span
            className={
              isActive
                ? "vw-status active"
                : "vw-status completed"
            }
          >
            {employment.status}
          </span>

          <span
            className={
              isVerified
                ? "vw-status verified"
                : "vw-status pending"
            }
          >
            {employment.verificationStatus}
          </span>

        </div>

      </div>


      <div className="vw-employment-details">

        <div>
          <span>
            <FaBuilding />
            Employer
          </span>

          <strong>
            {employment.employerId
              ?.employerName ||
              "Unknown Employer"}
          </strong>
        </div>

        <div>
          <span>
            <FaEnvelope />
            Employer Email
          </span>

          <strong>
            {employment.employerId
              ?.email ||
              "Not available"}
          </strong>
        </div>

        <div>
          <span>
            <FaRupeeSign />
            Salary
          </span>

          <strong>
            ₹{employment.salary}
          </strong>
        </div>

        <div>
          <span>
            <FaCalendarAlt />
            Start Date
          </span>

          <strong>
            {new Date(
              employment.startDate
            ).toLocaleDateString()}
          </strong>
        </div>

        <div>
          <span>
            <FaCalendarAlt />
            End Date
          </span>

          <strong>
            {employment.endDate
              ? new Date(
                employment.endDate
              ).toLocaleDateString()
              : "Currently employed"}
          </strong>
        </div>

      </div>


      <div className="vw-blockchain-strip">

        <FaLink />

        <span>
          Blockchain Verification
        </span>

        <strong>
          {isVerified
            ? "Verified"
            : "Pending"}
        </strong>

      </div>


      {employment.status ===
        "Completed" && (

          <div className="vw-rating-area">

            {rated ? (

              <div className="vw-rated-employer">
                <FaStar />
                Rated Employer
                <strong>
                  {rated.rating}/5
                </strong>
              </div>

            ) : (

              <button
                className="vw-rate-button"
                onClick={onRate}
              >
                <FaStar />
                Rate Employer
              </button>

            )}

          </div>

        )}

    </article>
  );
}


function CertificateCard({
  certificate,
  onView,
}) {
  const isVerified =
    certificate.verificationStatus ===
    "Verified";

  return (
    <article className="vw-certificate-card">

      <div className="vw-certificate-card-top">

        <div className="vw-certificate-icon">
          <FaCertificate />
        </div>

        <span
          className={
            isVerified
              ? "vw-certificate-status verified"
              : "vw-certificate-status pending"
          }
        >
          {isVerified && (
            <FaCheckCircle />
          )}

          {certificate.verificationStatus}
        </span>

      </div>


      <div className="vw-certificate-content">

        <span className="vw-certificate-label">
          CERTIFICATE ID
        </span>

        <h3>
          {certificate.certificateId}
        </h3>


        <div className="vw-certificate-info">

          <div>
            <FaBuilding />
            <span>
              Employer
            </span>
            <strong>
              {certificate.employerId
                ?.employerName ||
                certificate.employerName ||
                "Unknown Employer"}
            </strong>
          </div>

          <div>
            <FaBriefcase />
            <span>
              Job Role
            </span>
            <strong>
              {certificate.jobRole}
            </strong>
          </div>

          <div>
            <FaRupeeSign />
            <span>
              Salary
            </span>
            <strong>
              ₹{certificate.salary}
            </strong>
          </div>

          <div>
            <FaCalendarAlt />
            <span>
              Start Date
            </span>
            <strong>
              {new Date(
                certificate.startDate
              ).toLocaleDateString()}
            </strong>
          </div>

          <div>
            <FaCalendarAlt />
            <span>
              End Date
            </span>
            <strong>
              {certificate.endDate
                ? new Date(
                  certificate.endDate
                ).toLocaleDateString()
                : "Currently employed"}
            </strong>
          </div>

        </div>


        <div className="vw-certificate-meta">

          <span>
            Issued:{" "}
            {new Date(
              certificate.issuedAt
            ).toLocaleDateString()}
          </span>

          <span>
            <FaLink />

            {certificate.blockchainTransactionHash
              ? "Blockchain Verified"
              : "Not yet registered on blockchain"}
          </span>

        </div>

      </div>


      <div className="vw-certificate-actions">

        <button
          className="vw-certificate-primary"
          onClick={onView}
        >
          <FaCertificate />
          View & Download PDF Certificate
        </button>

        <a
          href={`/verify-certificate?id=${encodeURIComponent(
            certificate.certificateId
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="vw-certificate-secondary"
        >
          <FaShieldAlt />
          Public Blockchain Verification
          <FaExternalLinkAlt />
        </a>

      </div>

    </article>
  );
}


function DashboardLoading({
  text,
}) {
  return (
    <div className="vw-dashboard-empty">

      <div className="spinner-border vw-spinner" />

      <p>{text}</p>

    </div>
  );
}


function EmptyState({
  icon,
  title,
  description,
}) {
  return (
    <div className="vw-dashboard-empty">

      <div className="vw-empty-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   DASHBOARD STYLES
========================================================= */

function DashboardStyles() {
  return (
    <style>{`

      /* =============================================
         PAGE
      ============================================= */

      .vw-worker-dashboard {
        min-height: 100vh;
        padding: 48px 0 80px;
        background:
          radial-gradient(
            circle at 90% 5%,
            rgba(122, 139, 123, 0.09),
            transparent 28%
          ),
          radial-gradient(
            circle at 5% 30%,
            rgba(212, 163, 89, 0.07),
            transparent 25%
          ),
          var(--color-bg, #EFECE6);
        color: var(--color-text, #2B2625);
      }


      .vw-worker-dashboard .container {
        max-width: 1180px;
      }


      /* =============================================
         HEADER
      ============================================= */

      .vw-dashboard-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 34px;
      }


      .vw-dashboard-eyebrow {
        display: block;
        margin-bottom: 8px;
        color: var(--color-forest, #4A6750);
        font-size: 0.69rem;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }


      .vw-dashboard-header h1 {
        margin: 0;
        color: var(--color-text, #2B2625);
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: clamp(2.3rem, 5vw, 4rem);
        font-weight: 500;
        line-height: 0.98;
        letter-spacing: -0.045em;
      }


      .vw-dashboard-header h1 em {
        color: var(--color-forest, #4A6750);
        font-style: italic;
      }


      .vw-dashboard-header p {
        max-width: 560px;
        margin: 16px 0 0;
        color: var(--color-text-muted, #756F69);
        font-size: 0.98rem;
        line-height: 1.7;
      }


      .vw-dashboard-logout {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        min-height: 44px;
        padding: 0 18px;
        border: 1px solid rgba(43, 38, 37, 0.12);
        border-radius: 999px;
        background: rgba(255,255,255,0.55);
        color: #6F4944 !important;
        font-weight: 700;
        transition: all 0.2s ease;
      }


      .vw-dashboard-logout svg {
        color: #6F4944 !important;
      }


      .vw-dashboard-logout:hover {
        background: #fff;
        border-color: rgba(111,73,68,0.25);
        transform: translateY(-1px);
      }


      /* =============================================
         HERO
      ============================================= */

      .vw-dashboard-hero {
        position: relative;
        min-height: 270px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        margin-bottom: 22px;
        padding: 42px 48px;
        border-radius: 30px;
        background:
          linear-gradient(
            135deg,
            #253B2A 0%,
            #39543F 100%
          );
        box-shadow:
          0 22px 55px rgba(45, 64, 48, 0.16);
      }


      .vw-dashboard-hero::before {
        content: "";
        position: absolute;
        width: 420px;
        height: 420px;
        right: -170px;
        top: -210px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 50%;
      }


      .vw-dashboard-hero::after {
        content: "";
        position: absolute;
        width: 290px;
        height: 290px;
        right: -70px;
        bottom: -190px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 50%;
      }


      .vw-dashboard-hero-content {
        position: relative;
        z-index: 2;
        max-width: 720px;
      }


      .vw-dashboard-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 17px;
        padding: 7px 12px;
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 999px;
        background: rgba(255,255,255,0.1);
        color: #FFFFFF !important;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.1em;
      }


      .vw-dashboard-badge svg {
        color: #D4A359 !important;
      }


      .vw-dashboard-hero h2 {
        margin: 0;
        color: #FFFFFF !important;
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: clamp(2rem, 4vw, 3.2rem);
        font-weight: 500;
        letter-spacing: -0.035em;
      }


      .vw-dashboard-hero p {
        max-width: 690px;
        margin: 12px 0 22px;
        color: rgba(255,255,255,0.82) !important;
        font-size: 0.96rem;
        line-height: 1.7;
      }


      .vw-chain-status {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 9px;
        color: rgba(255,255,255,0.78) !important;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.05em;
      }


      .vw-chain-status svg {
        color: #D4A359 !important;
      }


      .vw-chain-status i {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #92B89A;
      }


      .vw-hero-decoration {
        position: relative;
        z-index: 1;
        padding-right: 35px;
      }


      .vw-hero-ring {
        width: 150px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255,255,255,0.16);
        border-radius: 50%;
        background: rgba(255,255,255,0.035);
      }


      .vw-hero-ring::before {
        content: "";
        position: absolute;
        width: 105px;
        height: 105px;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 50%;
      }


      .vw-hero-ring svg {
        position: relative;
        z-index: 2;
        color: #D4A359 !important;
        font-size: 38px;
      }


      /* =============================================
         STATS
      ============================================= */

      .vw-dashboard-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
        margin-bottom: 30px;
        overflow: hidden;
        border: 1px solid rgba(43,38,37,0.08);
        border-radius: 22px;
        background: rgba(255,255,255,0.48);
      }


      .vw-dashboard-stat {
        display: flex;
        align-items: center;
        gap: 15px;
        min-height: 105px;
        padding: 20px 23px;
        border-right: 1px solid rgba(43,38,37,0.07);
      }


      .vw-dashboard-stat:last-child {
        border-right: 0;
      }


      .vw-stat-icon {
        width: 43px;
        height: 43px;
        flex: 0 0 43px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        background: rgba(74,103,80,0.1);
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-dashboard-stat.ochre .vw-stat-icon,
      .vw-dashboard-stat.gold .vw-stat-icon {
        background: rgba(212,163,89,0.14);
        color: #A97832 !important;
      }


      .vw-dashboard-stat strong {
        display: block;
        color: var(--color-text, #2B2625) !important;
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.7rem;
        line-height: 1;
      }


      .vw-dashboard-stat span {
        display: block;
        margin-top: 5px;
        color: var(--color-text-muted, #756F69) !important;
        font-size: 0.7rem;
        font-weight: 700;
        line-height: 1.3;
      }


      /* =============================================
         SECTION CARD
      ============================================= */

      .vw-section-card {
        margin-bottom: 28px;
        padding: 30px;
        border: 1px solid rgba(43,38,37,0.07);
        border-radius: 26px;
        background: rgba(255,255,255,0.58);
        box-shadow:
          0 12px 38px rgba(43,38,37,0.045);
      }


      .vw-section-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 26px;
      }


      .vw-section-heading-main {
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }


      .vw-section-heading-icon {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
        border-radius: 14px;
        background: rgba(74,103,80,0.1);
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-section-heading h2 {
        margin: 0;
        color: var(--color-text, #2B2625);
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.85rem;
        font-weight: 600;
        letter-spacing: -0.025em;
      }


      .vw-section-heading p {
        margin: 6px 0 0;
        color: var(--color-text-muted, #756F69) !important;
        font-size: 0.86rem;
      }


      .vw-section-count {
        flex-shrink: 0;
        padding: 8px 13px;
        border-radius: 999px;
        background: rgba(74,103,80,0.09);
        color: var(--color-forest, #4A6750) !important;
        font-size: 0.7rem;
        font-weight: 800;
      }


      /* =============================================
         PROFILE
      ============================================= */

      .vw-profile-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }


      .vw-profile-item {
        display: flex;
        align-items: center;
        gap: 14px;
        min-height: 78px;
        padding: 15px 17px;
        border: 1px solid rgba(43,38,37,0.06);
        border-radius: 16px;
        background: rgba(239,236,230,0.55);
      }


      .vw-profile-item.wide {
        grid-column: span 2;
      }


      .vw-profile-item-icon {
        width: 37px;
        height: 37px;
        flex: 0 0 37px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        background: #FFFFFF;
        color: var(--color-forest, #4A6750) !important;
        box-shadow: 0 3px 12px rgba(43,38,37,0.05);
      }


      .vw-profile-item span {
        display: block;
        color: var(--color-text-muted, #756F69) !important;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }


      .vw-profile-item strong {
        display: block;
        margin-top: 4px;
        color: var(--color-text, #2B2625) !important;
        font-size: 0.9rem;
        font-weight: 700;
        word-break: break-word;
      }


      .vw-profile-wallet {
        position: relative;
      }


      .vw-wallet-check {
        margin-left: auto;
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-secure-icon {
        color: var(--color-forest, #4A6750) !important;
        font-size: 0.62rem;
      }


      /* =============================================
         EMPLOYMENT
      ============================================= */

      .vw-employment-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 17px;
      }


      .vw-employment-card {
        padding: 22px;
        border: 1px solid rgba(43,38,37,0.075);
        border-radius: 19px;
        background: #F9F7F2;
        transition:
          transform 0.22s ease,
          box-shadow 0.22s ease;
      }


      .vw-employment-card:hover {
        transform: translateY(-3px);
        box-shadow:
          0 14px 32px rgba(43,38,37,0.08);
      }


      .vw-employment-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(43,38,37,0.07);
      }


      .vw-employment-role span {
        color: #817A73 !important;
        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.13em;
      }


      .vw-employment-role h3 {
        margin: 4px 0 0;
        color: var(--color-text, #2B2625);
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.35rem;
        font-weight: 600;
      }


      .vw-employment-statuses {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 5px;
      }


      .vw-status {
        display: inline-flex;
        align-items: center;
        padding: 5px 8px;
        border-radius: 999px;
        font-size: 0.62rem;
        font-weight: 800;
      }


      .vw-status.active,
      .vw-status.verified {
        background: rgba(74,103,80,0.11);
        color: #3F6248 !important;
      }


      .vw-status.completed {
        background: rgba(43,38,37,0.07);
        color: #625C57 !important;
      }


      .vw-status.pending {
        background: rgba(212,163,89,0.16);
        color: #946A2E !important;
      }


      .vw-employment-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 17px 14px;
        padding: 19px 0;
      }


      .vw-employment-details span {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
        color: #817A73 !important;
        font-size: 0.65rem;
        font-weight: 700;
      }


      .vw-employment-details span svg {
        color: var(--color-forest, #4A6750) !important;
        font-size: 0.63rem;
      }


      .vw-employment-details strong {
        display: block;
        color: var(--color-text, #2B2625) !important;
        font-size: 0.78rem;
        word-break: break-word;
      }


      .vw-blockchain-strip {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 9px 11px;
        border-radius: 10px;
        background: rgba(74,103,80,0.055);
        color: #706A64 !important;
        font-size: 0.67rem;
      }


      .vw-blockchain-strip svg {
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-blockchain-strip strong {
        margin-left: auto;
        color: #45634B !important;
      }


      .vw-rating-area {
        margin-top: 13px;
        padding-top: 13px;
        border-top: 1px solid rgba(43,38,37,0.06);
      }


      .vw-rate-button,
      .vw-rated-employer {
        width: 100%;
        min-height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        border-radius: 10px;
        font-size: 0.72rem;
        font-weight: 800;
      }


      .vw-rate-button {
        border: 1px solid rgba(212,163,89,0.35);
        background: rgba(212,163,89,0.12);
        color: #906629 !important;
      }


      .vw-rate-button svg {
        color: #A97832 !important;
      }


      .vw-rated-employer {
        background: rgba(212,163,89,0.12);
        color: #8E672D !important;
      }


      .vw-rated-employer svg {
        color: #C08A36 !important;
      }


      /* =============================================
         CERTIFICATES
      ============================================= */

      .vw-certificate-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 17px;
      }


      .vw-certificate-card {
        overflow: hidden;
        border: 1px solid rgba(43,38,37,0.075);
        border-radius: 20px;
        background: #F9F7F2;
      }


      .vw-certificate-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 17px 20px;
        border-bottom: 1px solid rgba(43,38,37,0.07);
        background:
          linear-gradient(
            90deg,
            rgba(74,103,80,0.07),
            transparent
          );
      }


      .vw-certificate-icon {
        width: 39px;
        height: 39px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        background: rgba(74,103,80,0.1);
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-certificate-status {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 9px;
        border-radius: 999px;
        font-size: 0.62rem;
        font-weight: 800;
      }


      .vw-certificate-status.verified {
        background: rgba(74,103,80,0.11);
        color: #41644A !important;
      }


      .vw-certificate-status.pending {
        background: rgba(212,163,89,0.15);
        color: #956A2D !important;
      }


      .vw-certificate-content {
        padding: 20px;
      }


      .vw-certificate-label {
        color: #817A73 !important;
        font-size: 0.6rem;
        font-weight: 800;
        letter-spacing: 0.12em;
      }


      .vw-certificate-content h3 {
        margin: 5px 0 19px;
        color: var(--color-text, #2B2625);
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.1rem;
        word-break: break-word;
      }


      .vw-certificate-info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
      }


      .vw-certificate-info div {
        min-width: 0;
      }


      .vw-certificate-info svg {
        margin-right: 5px;
        color: var(--color-forest, #4A6750) !important;
        font-size: 0.62rem;
      }


      .vw-certificate-info span {
        color: #817A73 !important;
        font-size: 0.61rem;
        font-weight: 700;
      }


      .vw-certificate-info strong {
        display: block;
        margin-top: 3px;
        color: var(--color-text, #2B2625) !important;
        font-size: 0.73rem;
        word-break: break-word;
      }


      .vw-certificate-meta {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 18px;
        padding-top: 13px;
        border-top: 1px solid rgba(43,38,37,0.07);
        color: #817A73 !important;
        font-size: 0.62rem;
      }


      .vw-certificate-meta span {
        color: #817A73 !important;
      }


      .vw-certificate-meta svg {
        margin-right: 5px;
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-certificate-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 20px 20px;
      }


      .vw-certificate-primary,
      .vw-certificate-secondary {
        min-height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: 11px;
        font-size: 0.71rem;
        font-weight: 800;
        text-decoration: none;
        transition: all 0.2s ease;
      }


      .vw-certificate-primary {
        border: 0;
        background: var(--color-forest, #4A6750);
        color: #FFFFFF !important;
      }


      .vw-certificate-primary svg {
        color: #FFFFFF !important;
      }


      .vw-certificate-primary:hover {
        background: #39553F;
        color: #FFFFFF !important;
        transform: translateY(-1px);
      }


      .vw-certificate-secondary {
        border: 1px solid rgba(74,103,80,0.2);
        background: rgba(74,103,80,0.04);
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-certificate-secondary svg {
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-certificate-secondary:hover {
        background: rgba(74,103,80,0.09);
        color: var(--color-forest, #4A6750) !important;
      }


      /* =============================================
         PROFESSIONAL CERTIFICATE
      ============================================= */

      .vw-professional-certificate {
        scroll-margin-top: 30px;
      }


      .vw-certificate-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 22px;
      }


      .vw-certificate-header h2 {
        margin: 0;
        color: var(--color-text, #2B2625);
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.9rem;
      }


      .vw-certificate-header p {
        margin: 5px 0 0;
        color: var(--color-text-muted, #756F69) !important;
        font-size: 0.84rem;
      }


      .vw-close-button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 9px 14px;
        border: 1px solid rgba(43,38,37,0.1);
        border-radius: 999px;
        background: transparent;
        color: #6F6963 !important;
        font-size: 0.72rem;
        font-weight: 700;
      }


      .vw-close-button svg {
        color: #6F6963 !important;
      }


      /* =============================================
         SERVICES
      ============================================= */

      .vw-services-section {
        margin: 46px 0;
      }


      .vw-services-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 17px;
      }


      .vw-service-card {
        display: flex;
        flex-direction: column;
        min-height: 285px;
        padding: 24px;
        border: 1px solid rgba(43,38,37,0.07);
        border-radius: 21px;
        background: rgba(255,255,255,0.6);
        box-shadow:
          0 10px 30px rgba(43,38,37,0.035);
      }


      .vw-service-icon {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 19px;
        border-radius: 13px;
      }


      .vw-service-icon.green {
        background: rgba(74,103,80,0.1);
        color: var(--color-forest, #4A6750) !important;
      }


      .vw-service-icon.ochre {
        background: rgba(212,163,89,0.13);
        color: #A97832 !important;
      }


      .vw-service-icon.wallet {
        background: rgba(89,76,61,0.1);
        color: #6F5A45 !important;
      }


      .vw-service-card h3 {
        margin: 0 0 9px;
        color: var(--color-text, #2B2625);
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.28rem;
      }


      .vw-service-card p {
        margin: 0 0 22px;
        color: var(--color-text-muted, #756F69) !important;
        font-size: 0.8rem;
        line-height: 1.7;
      }


      .vw-service-button {
        width: 100%;
        min-height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: auto;
        border-radius: 11px;
        font-size: 0.71rem;
        font-weight: 800;
        text-decoration: none;
        transition: all 0.2s ease;
      }


      .vw-service-button.green {
        border: 0;
        background: var(--color-forest, #4A6750);
        color: #FFFFFF !important;
      }


      .vw-service-button.green svg {
        color: #FFFFFF !important;
      }


      .vw-service-button.ochre {
        border: 1px solid rgba(169,120,50,0.25);
        background: rgba(212,163,89,0.12);
        color: #91672B !important;
      }


      .vw-service-button.ochre svg {
        color: #91672B !important;
      }


      .vw-service-button.wallet {
        border: 0;
        background: #6F5A45;
        color: #FFFFFF !important;
      }


      .vw-service-button.wallet svg {
        color: #FFFFFF !important;
      }


      .vw-service-button:hover {
        transform: translateY(-1px);
      }


      .vw-connected-wallet {
        margin-top: auto;
      }


      .vw-wallet-connected-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        min-height: 42px;
        margin-bottom: 8px;
        padding: 9px 11px;
        border-radius: 10px;
        background: rgba(74,103,80,0.07);
      }


      .vw-wallet-connected-row span {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #41644A !important;
        font-size: 0.67rem;
        font-weight: 800;
      }


      .vw-wallet-connected-row span svg {
        color: #41644A !important;
      }


      .vw-wallet-connected-row code {
        color: #716B65 !important;
        font-size: 0.65rem;
      }


      .vw-disconnect-button {
        width: 100%;
        min-height: 36px;
        border: 1px solid rgba(43,38,37,0.1);
        border-radius: 9px;
        background: transparent;
        color: #6F6963 !important;
        font-size: 0.68rem;
        font-weight: 700;
      }


      /* =============================================
         REPUTATION
      ============================================= */

      .vw-reputation-wrapper {
        margin-top: 15px;
      }


      /* =============================================
         EMPTY / LOADING
      ============================================= */

      .vw-dashboard-empty {
        min-height: 210px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 35px;
      }


      .vw-dashboard-empty p {
        margin: 12px 0 0;
        color: var(--color-text-muted, #756F69) !important;
        font-size: 0.8rem;
      }


      .vw-dashboard-empty h3 {
        margin: 13px 0 0;
        color: var(--color-text, #2B2625);
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.25rem;
      }


      .vw-empty-icon {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 18px;
        background: rgba(74,103,80,0.08);
        color: var(--color-forest, #4A6750) !important;
        font-size: 22px;
      }


      .vw-spinner {
        width: 28px;
        height: 28px;
        color: var(--color-forest, #4A6750) !important;
        border-width: 3px;
      }


      /* =============================================
         LOADING PAGE
      ============================================= */

      .vw-dashboard-loading {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;
        background: var(--color-bg, #EFECE6);
      }


      .vw-loading-card {
        width: min(420px, 100%);
        padding: 45px 30px;
        border: 1px solid rgba(43,38,37,0.07);
        border-radius: 26px;
        background: rgba(255,255,255,0.65);
        text-align: center;
        box-shadow: 0 20px 55px rgba(43,38,37,0.07);
      }


      .vw-loading-logo {
        width: 55px;
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        border-radius: 17px;
        background: var(--color-forest, #4A6750);
        color: #FFFFFF !important;
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.1rem;
        font-weight: 700;
      }


      .vw-loading-card h5 {
        margin: 20px 0 0;
        color: var(--color-text, #2B2625);
        font-family: var(
          --font-serif,
          Georgia,
          serif
        );
        font-size: 1.25rem;
      }


      .vw-loading-card p {
        margin: 7px 0 0;
        color: var(--color-text-muted, #756F69) !important;
        font-size: 0.78rem;
      }


      /* =============================================
         TABLET
      ============================================= */

      @media (max-width: 991px) {

        .vw-worker-dashboard {
          padding-top: 35px;
        }


        .vw-dashboard-hero {
          padding: 35px;
        }


        .vw-hero-decoration {
          padding-right: 0;
        }


        .vw-dashboard-stats {
          grid-template-columns: repeat(2, 1fr);
        }


        .vw-dashboard-stat:nth-child(2) {
          border-right: 0;
        }


        .vw-dashboard-stat:nth-child(-n+2) {
          border-bottom: 1px solid rgba(43,38,37,0.07);
        }


        .vw-services-grid {
          grid-template-columns: 1fr;
        }


        .vw-service-card {
          min-height: 245px;
        }

      }


      /* =============================================
         MOBILE
      ============================================= */

      @media (max-width: 767px) {

        .vw-worker-dashboard {
          padding: 25px 0 55px;
        }


        .vw-dashboard-header {
          align-items: flex-start;
          flex-direction: column;
          margin-bottom: 25px;
        }


        .vw-dashboard-header h1 {
          font-size: 2.55rem;
        }


        .vw-dashboard-logout {
          width: 100%;
        }


        .vw-dashboard-hero {
          min-height: 0;
          padding: 29px 24px;
          border-radius: 23px;
        }


        .vw-dashboard-hero h2 {
          font-size: 2rem;
        }


        .vw-dashboard-hero p {
          font-size: 0.85rem;
        }


        .vw-hero-decoration {
          display: none;
        }


        .vw-dashboard-stats {
          grid-template-columns: 1fr 1fr;
          border-radius: 18px;
        }


        .vw-dashboard-stat {
          min-height: 92px;
          padding: 15px;
        }


        .vw-dashboard-stat strong {
          font-size: 1.45rem;
        }


        .vw-stat-icon {
          width: 36px;
          height: 36px;
          flex-basis: 36px;
        }


        .vw-section-card {
          padding: 20px;
          border-radius: 20px;
        }


        .vw-section-heading {
          flex-direction: column;
          margin-bottom: 20px;
        }


        .vw-section-heading h2 {
          font-size: 1.55rem;
        }


        .vw-section-count {
          align-self: flex-start;
        }


        .vw-profile-grid {
          grid-template-columns: 1fr;
        }


        .vw-profile-item.wide {
          grid-column: span 1;
        }


        .vw-employment-grid,
        .vw-certificate-grid {
          grid-template-columns: 1fr;
        }


        .vw-employment-top {
          flex-direction: column;
        }


        .vw-employment-statuses {
          justify-content: flex-start;
        }


        .vw-employment-details {
          grid-template-columns: 1fr;
        }


        .vw-certificate-info {
          grid-template-columns: 1fr;
        }


        .vw-certificate-header {
          flex-direction: column;
        }


        .vw-close-button {
          align-self: flex-start;
        }

      }


      @media (max-width: 480px) {

        .vw-worker-dashboard .container {
          padding-left: 14px;
          padding-right: 14px;
        }


        .vw-dashboard-header h1 {
          font-size: 2.25rem;
        }


        .vw-dashboard-stats {
          grid-template-columns: 1fr;
        }


        .vw-dashboard-stat {
          border-right: 0;
          border-bottom: 1px solid rgba(43,38,37,0.07);
        }


        .vw-dashboard-stat:last-child {
          border-bottom: 0;
        }


        .vw-dashboard-stat:nth-child(2) {
          border-bottom: 1px solid rgba(43,38,37,0.07);
        }


        .vw-dashboard-badge {
          font-size: 0.59rem;
        }


        .vw-dashboard-hero h2 {
          font-size: 1.75rem;
        }


        .vw-profile-item {
          padding: 13px;
        }


        .vw-service-card {
          padding: 20px;
        }

      }

    `}</style>
  );
}


export default WorkerDashboard;