import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

import storage from "../utils/storage";
import { getWorkerProfile } from "../services/authService";
import { getEmployerProfile } from "../services/employerAuthService";

function ProtectedRoute({ children, type = "worker" }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      // =================================
      // WORKER AUTHENTICATION
      // =================================

      if (type === "worker") {
        const token = storage.getWorkerToken();

        // No worker token
        if (!token) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        try {
          // Verify worker JWT through backend
          const response = await getWorkerProfile();

          if (response.worker) {
            await storage.setWorker(response.worker);
          }

          setAuthenticated(true);
        } catch (error) {
          console.error(
            "Worker session verification failed:",
            error
          );

          // Remove invalid worker session
          await storage.clearWorkerSession();

          setAuthenticated(false);
        } finally {
          setLoading(false);
        }

        return;
      }

      // =================================
      // EMPLOYER AUTHENTICATION
      // =================================

      if (type === "employer") {
        const employerToken = storage.getEmployerToken();

        // No employer token
        if (!employerToken) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        try {
          // Verify employer JWT through backend
          const response = await getEmployerProfile();

          if (response.employer) {
            await storage.setEmployer(response.employer);
          }

          setAuthenticated(true);
        } catch (error) {
          console.error(
            "Employer session verification failed:",
            error
          );

          // Remove invalid employer session
          await storage.clearEmployerSession();

          setAuthenticated(false);
        } finally {
          setLoading(false);
        }

        return;
      }

      // =================================
      // INVALID ROUTE TYPE
      // =================================

      setAuthenticated(false);
      setLoading(false);
    };

    verifySession();
  }, [type]);

  // =================================
  // LOADING
  // =================================

  if (loading) {
    return (
      <div className="vw-protected-loading">
        <div className="vw-protected-loading-card">

          {/* Security Icon */}
          <div className="vw-protected-icon">
            <FaShieldAlt size={23} />
          </div>

          {/* Brand */}
          <div className="vw-protected-brand">
            VeriWork
          </div>

          {/* Loading Indicator */}
          <div className="vw-protected-spinner">
            <span></span>
          </div>

          <h5>
            Verifying your session
          </h5>

          <p>
            Please wait while we securely verify your credentials.
          </p>

          <div className="vw-protected-security">
            <span className="vw-protected-dot"></span>
            Secure verification in progress
          </div>
        </div>

        <style>{`
          /* =========================================
             PROTECTED ROUTE LOADING
          ========================================== */

          .vw-protected-loading {
            min-height: 70vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            position: relative;
            overflow: hidden;
            background:
              radial-gradient(
                circle at 20% 20%,
                rgba(49, 88, 71, 0.055),
                transparent 28%
              ),
              radial-gradient(
                circle at 85% 80%,
                rgba(212, 163, 89, 0.06),
                transparent 25%
              ),
              var(--color-bg, #efece6);
          }

          .vw-protected-loading-card {
            width: 100%;
            max-width: 390px;
            padding: 38px 30px;
            text-align: center;
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(43, 38, 37, 0.07);
            box-shadow:
              0 18px 45px rgba(43, 38, 37, 0.07),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
          }

          .vw-protected-icon {
            width: 58px;
            height: 58px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px;
            color: var(--color-forest, #315847);
            background: rgba(49, 88, 71, 0.1);
            border: 1px solid rgba(49, 88, 71, 0.1);
          }

          .vw-protected-brand {
            margin-bottom: 25px;
            color: var(--color-forest, #315847);
            font-family: var(--font-serif, Georgia, serif);
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: -0.02em;
          }

          .vw-protected-spinner {
            width: 34px;
            height: 34px;
            margin: 0 auto 18px;
            border: 3px solid rgba(49, 88, 71, 0.12);
            border-top-color: var(--color-forest, #315847);
            border-radius: 50%;
            animation: vw-protected-spin 0.85s linear infinite;
          }

          .vw-protected-spinner span {
            display: none;
          }

          @keyframes vw-protected-spin {
            to {
              transform: rotate(360deg);
            }
          }

          .vw-protected-loading-card h5 {
            margin: 0 0 8px;
            color: var(--color-text, #2b2625) !important;
            font-family: var(--font-serif, Georgia, serif);
            font-size: 1.3rem;
            font-weight: 700;
          }

          .vw-protected-loading-card p {
            max-width: 290px;
            margin: 0 auto;
            color: var(--color-text-muted, #756e67) !important;
            font-size: 0.78rem;
            line-height: 1.6;
          }

          .vw-protected-security {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            margin-top: 22px;
            padding: 7px 11px;
            border-radius: 999px;
            color: var(--color-forest, #315847) !important;
            background: rgba(49, 88, 71, 0.065);
            font-size: 0.58rem;
            font-weight: 700;
          }

          .vw-protected-security span {
            color: inherit !important;
          }

          .vw-protected-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #5c8b70;
            box-shadow:
              0 0 0 3px rgba(92, 139, 112, 0.12);
          }

          @media (max-width: 480px) {
            .vw-protected-loading {
              min-height: 65vh;
              padding: 25px 16px;
            }

            .vw-protected-loading-card {
              padding: 32px 22px;
              border-radius: 21px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .vw-protected-spinner {
              animation: none;
            }
          }
        `}</style>
      </div>
    );
  }

  // =================================
  // NOT AUTHENTICATED
  // =================================

  if (!authenticated) {
    if (type === "employer") {
      return (
        <Navigate
          to="/employer-login"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =================================
  // AUTHENTICATED
  // =================================

  return children;
}

export default ProtectedRoute;