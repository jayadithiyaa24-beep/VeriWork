import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import storage from "./utils/storage";

import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";

import Login from "./pages/Login";
import EmployerLogin from "./pages/EmployerLogin";

import RegisterWorker from "./pages/RegisterWorker";
import RegisterEmployer from "./pages/RegisterEmployer";

import WorkerDashboard from "./pages/WorkerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

import GetStarted from "./pages/GetStarted";
import VerifyCertificate from "./pages/VerifyCertificate";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  useEffect(() => {
    // Purge any residual tokens stored in localStorage
    // to enforce tab-scoped privacy.
    storage.purgeLegacyPersistentStorage();
  }, []);

  return (
    <BrowserRouter>
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
                WORKER AUTHENTICATION
            ================================================= */}

            <Route
              path="/login"
              element={<Login />}
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
              path="/verify/:certificateId"
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