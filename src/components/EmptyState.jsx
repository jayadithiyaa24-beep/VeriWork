import React from "react";
import { FaInbox } from "react-icons/fa";

function EmptyState({ icon: Icon = FaInbox, title, description, actionText, onAction }) {
  return (
    <div className="vw-card p-5 text-center my-4" style={{ background: "#fafafc", borderStyle: "dashed" }}>
      <div 
        className="mx-auto mb-3 text-primary d-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: "72px",
          height: "72px",
          background: "var(--primary-light)",
          fontSize: "32px"
        }}
      >
        <Icon />
      </div>
      <h5 className="fw-bold mb-2 text-dark">{title || "No Records Found"}</h5>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: "420px" }}>
        {description || "There are no records available at the moment."}
      </p>
      {actionText && onAction && (
        <button className="vw-btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
