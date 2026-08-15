import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import RegisterWorker from "./pages/RegisterWorker";
import RegisterEmployer from "./pages/RegisterEmployer";
import WorkerDashboard from "./pages/WorkerDashboard";

function App() {
  return (
    <BrowserRouter>

      {/* Navbar */}
      <Navbar />

      {/* Website Routes */}
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Worker Registration */}
        <Route
          path="/register-worker"
          element={<RegisterWorker />}
        />

        {/* Employer Registration */}
        <Route
          path="/register-employer"
          element={<RegisterEmployer />}
        />

        {/* Protected Worker Dashboard */}
        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div
              className="container d-flex flex-column justify-content-center align-items-center text-center"
              style={{ minHeight: "70vh" }}
            >
              <h1 className="display-1 fw-bold text-primary">
                404
              </h1>

              <h3>Page Not Found</h3>

              <p className="text-muted">
                The page you are looking for does not exist.
              </p>
            </div>
          }
        />

      </Routes>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
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