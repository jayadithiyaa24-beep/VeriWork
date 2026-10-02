import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

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
        // Tab-scoped token check (sessionStorage)
        const token = sessionStorage.getItem("token");

        // No worker token in this tab -> redirect to login
        if (!token) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        try {
          // Verify worker JWT through backend
          const response = await getWorkerProfile();

          if (response.worker) {
            sessionStorage.setItem(
              "worker",
              JSON.stringify(response.worker)
            );
          }

          setAuthenticated(true);
        } catch (error) {
          console.error(
            "Worker session verification failed:",
            error
          );

          // Remove invalid worker session
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("worker");
          localStorage.removeItem("token");
          localStorage.removeItem("worker");

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
        // Tab-scoped employer token check (sessionStorage)
        const employerToken =
          sessionStorage.getItem("employerToken");

        // No employer token in this tab -> redirect to employer-login
        if (!employerToken) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        try {
          // Verify employer JWT through backend
          const response = await getEmployerProfile();

          if (response.employer) {
            sessionStorage.setItem(
              "employer",
              JSON.stringify(response.employer)
            );
          }

          setAuthenticated(true);
        } catch (error) {
          console.error(
            "Employer session verification failed:",
            error
          );

          // Remove invalid employer session
          sessionStorage.removeItem("employerToken");
          sessionStorage.removeItem("employer");
          localStorage.removeItem("employerToken");
          localStorage.removeItem("employer");

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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "70vh",
        }}
      >
        <div className="text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3">
            Verifying your session...
          </p>

        </div>
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