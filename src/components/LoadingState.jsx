import React from "react";

function LoadingState({ message = "Loading details..." }) {
  return (
    <div className="vw-card p-5 text-center my-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "260px" }}>
      <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h6 className="fw-semibold text-dark mb-1">{message}</h6>
      <small className="text-muted">Fetching verified records from VeriWork platform...</small>
    </div>
  );
}

export default LoadingState;
