import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import storage from "./utils/storage";

import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";

import LoginPortal from "./pages/LoginPortal";
import WorkerLogin from "./pages/WorkerLogin";
import EmployerLogin from "./pages/EmployerLogin";

import RegisterWorker from "./pages/RegisterWorker";
import RegisterEmployer from "./pages/RegisterEmployer";

import WorkerDashboard from "./pages/WorkerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

import GetStarted from "./pages/GetStarted";
import VerifyCertificate from "./pages/VerifyCertificate";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import { API_BASE_URL } from "./services/api";

function SessionSecurityManager() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Auto-logout when user navigates to the public Home page ("/")
  useEffect(() => {
    if (location.pathname === "/") {
      const hasWorker = Boolean(storage.getWorkerToken());
      const hasEmployer = Boolean(storage.getEmployerToken());

      if (hasWorker || hasEmployer) {
        storage.clearWorkerSession();
        storage.clearEmployerSession();
      }
    }
  }, [location.pathname]);

  // 2. Auto-logout after 5 minutes of stationary inactivity
  useEffect(() => {
    const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
    let inactivityTimer;

    const handleInactivityLogout = () => {
      const hasWorker = Boolean(storage.getWorkerToken());
      const hasEmployer = Boolean(storage.getEmployerToken());

      if (hasWorker || hasEmployer) {
        storage.clearWorkerSession();
        storage.clearEmployerSession();

        toast.warn(
          "Session expired due to 5 minutes of inactivity. Please log in again.",
          {
            toastId: "inactivity-logout-toast",
          }
        );

        if (hasWorker) {
          navigate("/worker-login");
        } else if (hasEmployer) {
          navigate("/employer-login");
        }
      }
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetTimer, { passive: true });
    });

    // Start initial 5-minute timer
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, resetTimer);
      });
    };
  }, [navigate]);

  return null;
}

function App() {
  useEffect(() => {
    // Purge any residual tokens stored in localStorage
    // to enforce tab-scoped privacy.
    storage.purgeLegacyPersistentStorage();

    // Check if the page was reloaded by the user (F5, browser reload button, etc.)
    const navEntries = performance.getEntriesByType?.("navigation") || [];
    const isReload =
      (navEntries.length > 0 && navEntries[0].type === "reload") ||
      performance?.navigation?.type === 1;

    if (isReload) {
      storage.clearWorkerSession();
      storage.clearEmployerSession();
    }

    // Proactively pre-warm Render backend to eliminate cold-start latency
    try {
      const serverRoot = API_BASE_URL.replace(/\/api\/?$/, "");
      fetch(serverRoot, { method: "GET", mode: "no-cors" }).catch(() => {});
    } catch {
      // Non-blocking pre-warm ping
    }
  }, []);

  return (
    <BrowserRouter>
      <SessionSecurityManager />
      <div className="vw-app">

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <Navbar />


        {/* =====================================================
            MAIN APPLICATION
        ===================================================== */}

        <main className="vw-app-main">

          <Routes>

            {/* =================================================
                PUBLIC PAGES
            ================================================= */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/get-started"
              element={<GetStarted />}
            />


            {/* =================================================
                PORTAL LOGIN SELECTION
            ================================================= */}

            <Route
              path="/login"
              element={<LoginPortal />}
            />


            {/* =================================================
                WORKER AUTHENTICATION
            ================================================= */}

            <Route
              path="/worker-login"
              element={<WorkerLogin />}
            />

            <Route
              path="/register-worker"
              element={<RegisterWorker />}
            />


            {/* =================================================
                EMPLOYER AUTHENTICATION
            ================================================= */}

            <Route
              path="/employer-login"
              element={<EmployerLogin />}
            />

            <Route
              path="/register-employer"
              element={<RegisterEmployer />}
            />


            {/* =================================================
                PUBLIC CERTIFICATE VERIFICATION
            ================================================= */}

            <Route
              path="/verify-certificate"
              element={<VerifyCertificate />}
            />

            <Route
              path="/verify-certificate/:certificateId"
              element={<VerifyCertificate />}
            />

            <Route
              path="/verify"
              element={<VerifyCertificate />}
            />

            <Route
              path="/verify/:certificateId"
              element={<VerifyCertificate />}
            />

            <Route
              path="/verify-blockchain"
              element={<VerifyCertificate />}
            />

            <Route
              path="/blockchain-verification"
              element={<VerifyCertificate />}
            />


            {/* =================================================
                WORKER DASHBOARD
                PROTECTED
            ================================================= */}

            <Route
              path="/worker-dashboard"
              element={
                <ProtectedRoute type="worker">
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />


            {/* =================================================
                EMPLOYER DASHBOARD
                PROTECTED
            ================================================= */}

            <Route
              path="/employer-dashboard"
              element={
                <ProtectedRoute type="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />


            {/* =================================================
                ADMIN
            ================================================= */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />


            {/* =================================================
                404
            ================================================= */}

            <Route
              path="*"
              element={<NotFound />}
            />

          </Routes>

        </main>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Footer />


        {/* =====================================================
            TOAST NOTIFICATIONS
        ===================================================== */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
          theme="colored"
        />

      </div>


      {/* =======================================================
          APP SHELL STYLES
      ======================================================= */}

      <style>{`

        /* =====================================================
           APP ROOT
        ===================================================== */

        .vw-app {
          min-height: 100vh;

          display: flex;
          flex-direction: column;

          background: var(--color-bg, #EFECE6);

          color: var(--color-text, #2B2625);
        }


        /* =====================================================
           MAIN CONTENT
        ===================================================== */

        .vw-app-main {
          flex: 1;

          width: 100%;

          background: var(--color-bg, #EFECE6);
        }


        /* =====================================================
           PREVENT HORIZONTAL OVERFLOW
        ===================================================== */

        .vw-app {
          overflow-x: hidden;
        }


        /* =====================================================
           TOASTIFY
        ===================================================== */

        .Toastify__toast-container--top-right,
        .Toastify__toast-container--top-center,
        .Toastify__toast-container--top-left {
          top: calc(env(safe-area-inset-top, 0px) + 12px) !important;
        }

        .Toastify__toast {
          border-radius: 12px !important;

          font-family:
            var(
              --font-sans,
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif
            ) !important;

          font-size: 0.82rem !important;

          box-shadow:
            0 10px 30px rgba(43, 38, 37, 0.12) !important;
        }


        .Toastify__toast-body {
          font-weight: 500;
        }


        .Toastify__progress-bar {
          opacity: 0.7;
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767.98px) {

          .vw-app-main {
            min-width: 0;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .vw-app *,
          .vw-app *::before,
          .vw-app *::after {
            scroll-behavior: auto !important;

            animation-duration: 0.01ms !important;

            animation-iteration-count: 1 !important;

            transition-duration: 0.01ms !important;
          }

        }

      `}</style>
    </BrowserRouter>
  );
}

export default App;