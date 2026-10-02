import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import storage from "./utils/storage";

import Navbar from "./components/Navbar";
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

function App() {
  useEffect(() => {
    // Purge any residual tokens stored in localStorage to enforce tab-scoped privacy
    storage.purgeLegacyPersistentStorage();
  }, []);

  return (
    <BrowserRouter>

      {/* =============================== */}
      {/* NAVBAR */}
      {/* =============================== */}

      <Navbar />

      {/* =============================== */}
      {/* ROUTES */}
      {/* =============================== */}

      <Routes>

        {/* =============================== */}
        {/* HOME */}
        {/* =============================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =============================== */}
        {/* ABOUT */}
        {/* =============================== */}

        <Route
          path="/about"
          element={<About />}
        />

        {/* =============================== */}
        {/* GET STARTED */}
        {/* =============================== */}

        <Route
          path="/get-started"
          element={<GetStarted />}
        />

        {/* =============================== */}
        {/* WORKER LOGIN */}
        {/* =============================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =============================== */}
        {/* EMPLOYER LOGIN */}
        {/* =============================== */}

        <Route
          path="/employer-login"
          element={<EmployerLogin />}
        />

        {/* =============================== */}
        {/* WORKER REGISTRATION */}
        {/* =============================== */}

        <Route
          path="/register-worker"
          element={<RegisterWorker />}
        />

        {/* =============================== */}
        {/* EMPLOYER REGISTRATION */}
        {/* =============================== */}

        <Route
          path="/register-employer"
          element={<RegisterEmployer />}
        />

        {/* =============================== */}
        {/* PUBLIC CERTIFICATE VERIFICATION */}
        {/* =============================== */}

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

        {/* =============================== */}
        {/* WORKER DASHBOARD */}
        {/* PROTECTED */}
        {/* =============================== */}

        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute type="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        {/* =============================== */}
        {/* EMPLOYER DASHBOARD */}
        {/* PROTECTED */}
        {/* =============================== */}

        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute type="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        {/* =============================== */}
        {/* ADMIN DASHBOARD & GOVERNANCE */}
        {/* =============================== */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* =============================== */}
        {/* 404 PAGE */}
        {/* =============================== */}

        <Route
          path="*"
          element={
            <div
              className="container d-flex flex-column justify-content-center align-items-center text-center"
              style={{
                minHeight: "70vh",
              }}
            >

              <h1 className="display-1 fw-bold text-primary">
                404
              </h1>

              <h3>
                Page Not Found
              </h3>

              <p className="text-muted">
                The page you are looking for does not exist.
              </p>

            </div>
          }
        />

      </Routes>

      {/* =============================== */}
      {/* FOOTER */}
      {/* =============================== */}

      <Footer />

      {/* =============================== */}
      {/* TOAST NOTIFICATIONS */}
      {/* =============================== */}

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

    </BrowserRouter>
  );
}

export default App;