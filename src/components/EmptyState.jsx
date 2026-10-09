import React from "react";
import { FaInbox, FaArrowRight } from "react-icons/fa";

function EmptyState({
  icon: Icon = FaInbox,
  title,
  description,
  actionText,
  onAction,
}) {
  return (
    <div className="vw-empty-state">
      {/* Decorative background elements */}
      <div className="vw-empty-glow vw-empty-glow-one"></div>
      <div className="vw-empty-glow vw-empty-glow-two"></div>

      <div className="vw-empty-content">
        {/* Icon */}
        <div className="vw-empty-icon">
          <Icon size={25} />
        </div>

        {/* Text */}
        <div className="vw-empty-copy">
          <span className="vw-empty-eyebrow">
            NOTHING HERE YET
          </span>

          <h5>
            {title || "No Records Found"}
          </h5>

          <p>
            {description ||
              "There are no records available at the moment."}
          </p>
        </div>

        {/* Optional Action */}
        {actionText && onAction && (
          <button
            type="button"
            className="vw-empty-action"
            onClick={onAction}
          >
            <span>{actionText}</span>
            <span className="vw-empty-action-arrow">
              <FaArrowRight size={11} />
            </span>
          </button>
        )}
      </div>

      <style>{`
        /* =========================================
           EMPTY STATE
        ========================================== */

        .vw-empty-state {
          position: relative;
          overflow: hidden;
          width: 100%;
          margin: 24px 0;
          padding: 52px 28px;
          text-align: center;
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.88),
              rgba(246, 243, 236, 0.9)
            );
          border: 1px dashed rgba(49, 88, 71, 0.2);
          box-shadow:
            0 10px 30px rgba(43, 38, 37, 0.045),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }

        /* =========================================
           DECORATIVE GLOWS
        ========================================== */

        .vw-empty-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }

        .vw-empty-glow-one {
          width: 180px;
          height: 180px;
          top: -115px;
          left: -75px;
          background: rgba(49, 88, 71, 0.06);
        }

        .vw-empty-glow-two {
          width: 150px;
          height: 150px;
          right: -85px;
          bottom: -100px;
          background: rgba(212, 163, 89, 0.08);
        }

        /* =========================================
           CONTENT
        ========================================== */

        .vw-empty-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* =========================================
           ICON
        ========================================== */

        .vw-empty-icon {
          width: 66px;
          height: 66px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          color: var(--color-forest, #315847);
          background:
            linear-gradient(
              145deg,
              rgba(49, 88, 71, 0.12),
              rgba(49, 88, 71, 0.06)
            );
          border: 1px solid rgba(49, 88, 71, 0.1);
          box-shadow:
            0 8px 20px rgba(49, 88, 71, 0.08);
        }

        /* =========================================
           TEXT
        ========================================== */

        .vw-empty-copy {
          max-width: 480px;
        }

        .vw-empty-eyebrow {
          display: block;
          margin-bottom: 7px;
          color: var(--color-forest, #315847);
          font-size: 0.59rem;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .vw-empty-copy h5 {
          margin: 0 0 9px;
          color: var(--color-text, #2b2625);
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.45rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .vw-empty-copy p {
          margin: 0 auto;
          max-width: 420px;
          color: var(--color-text-muted, #756e67);
          font-size: 0.86rem;
          line-height: 1.65;
        }

        /* =========================================
           ACTION BUTTON
        ========================================== */

        .vw-empty-action {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 25px;
          padding: 11px 13px 11px 17px;
          border: 0;
          border-radius: 999px;
          color: #ffffff !important;
          background: var(--color-forest, #315847);
          box-shadow:
            0 8px 18px rgba(49, 88, 71, 0.18);
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .vw-empty-action span {
          color: #ffffff !important;
        }

        .vw-empty-action:hover {
          color: #ffffff !important;
          background: #264b3c;
          transform: translateY(-2px);
          box-shadow:
            0 12px 24px rgba(49, 88, 71, 0.22);
        }

        .vw-empty-action-arrow {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.16);
        }

        .vw-empty-action-arrow svg {
          color: #ffffff !important;
        }

        /* =========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 576px) {
          .vw-empty-state {
            margin: 18px 0;
            padding: 40px 20px;
            border-radius: 20px;
          }

          .vw-empty-icon {
            width: 58px;
            height: 58px;
            margin-bottom: 17px;
            border-radius: 17px;
          }

          .vw-empty-copy h5 {
            font-size: 1.25rem;
          }

          .vw-empty-copy p {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default EmptyState;