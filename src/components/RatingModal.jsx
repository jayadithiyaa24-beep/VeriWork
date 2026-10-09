import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaStar,
  FaTimes,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import { createRating } from "../services/ratingService";

function RatingModal({
  show,
  onClose,
  employment,
  targetName,
  targetRole,
  onRatingSubmitted,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!show || !employment) return null;

  const ratingDescriptions = {
    1: "1 - Poor",
    2: "2 - Fair",
    3: "3 - Good",
    4: "4 - Very Good",
    5: "5 - Excellent",
  };

  const currentDisplayScore = hoverRating || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await createRating({
        employmentId: employment._id,
        rating: Number(rating),
        comment: comment.trim(),
      });

      toast.success(
        response.message || "Rating submitted successfully!"
      );

      if (onRatingSubmitted) {
        onRatingSubmitted(response.rating);
      }

      onClose();
    } catch (error) {
      console.error("Submit Rating Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to submit rating. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vw-rating-overlay">
      <div
        className="vw-rating-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vw-rating-title"
      >
        {/* =========================================
            DECORATIVE ELEMENTS
        ========================================== */}

        <div className="vw-rating-glow vw-rating-glow-one"></div>
        <div className="vw-rating-glow vw-rating-glow-two"></div>

        {/* =========================================
            HEADER
        ========================================== */}

        <div className="vw-rating-header">
          <div className="vw-rating-header-content">

            <div className="vw-rating-icon">
              <FaStar size={18} />
            </div>

            <div>
              <span className="vw-rating-eyebrow">
                BUILD TRUST
              </span>

              <h5 id="vw-rating-title">
                Rate {targetRole}
              </h5>

              <p>
                Share your experience with{" "}
                <strong>
                  {targetName || targetRole}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="vw-rating-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            <FaTimes size={13} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* =========================================
              BODY
          ========================================== */}

          <div className="vw-rating-body">

            {/* Employment summary */}
            <div className="vw-rating-employment">
              <div>
                <span>EMPLOYMENT ROLE</span>
                <strong>
                  {employment.jobRole}
                </strong>
              </div>

              <div className="vw-rating-employment-badge">
                <FaShieldAlt size={11} />
                <span>VERIFIED</span>
              </div>
            </div>

            {/* =====================================
                STAR SELECTOR
            ====================================== */}

            <div className="vw-rating-selector">

              <span className="vw-rating-label">
                How was your experience?
              </span>

              <div
                className="vw-rating-stars"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled =
                    (hoverRating || rating) >= star;

                  return (
                    <button
                      type="button"
                      key={star}
                      className={`vw-rating-star ${isFilled
                          ? "vw-rating-star-active"
                          : ""
                        }`}
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onClick={() =>
                        setRating(star)
                      }
                      disabled={submitting}
                      aria-label={`${star} star${star > 1 ? "s" : ""
                        }`}
                    >
                      <FaStar size={25} />
                    </button>
                  );
                })}
              </div>

              <div className="vw-rating-score">
                <span>
                  {ratingDescriptions[currentDisplayScore]}
                </span>
              </div>
            </div>

            {/* =====================================
                COMMENT
            ====================================== */}

            <div className="vw-rating-comment">

              <div className="vw-rating-comment-heading">
                <label htmlFor="ratingComment">
                  Review / Comments
                  <span>OPTIONAL</span>
                </label>

                <small>
                  {comment.length} / 500
                </small>
              </div>

              <textarea
                id="ratingComment"
                rows="4"
                maxLength={500}
                placeholder={`Write your genuine experience with ${targetName || targetRole
                  }...`}
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                disabled={submitting}
              />
            </div>

            {/* Trust message */}
            <div className="vw-rating-trust">
              <div className="vw-rating-trust-icon">
                <FaShieldAlt size={12} />
              </div>

              <p>
                Your feedback helps build a more trusted
                professional community on VeriWork.
              </p>
            </div>
          </div>

          {/* =========================================
              FOOTER
          ========================================== */}

          <div className="vw-rating-footer">

            <button
              type="button"
              className="vw-rating-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="vw-rating-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="vw-rating-spinner"></span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Rating</span>
                  <span className="vw-rating-submit-arrow">
                    <FaArrowRight size={10} />
                  </span>
                </>
              )}
            </button>

          </div>
        </form>
      </div>

      <style>{`
        /* =========================================
           OVERLAY
        ========================================== */

        .vw-rating-overlay {
          position: fixed;
          inset: 0;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(29, 35, 31, 0.58);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: vw-rating-fade 0.2s ease-out;
        }

        @keyframes vw-rating-fade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        /* =========================================
           MODAL
        ========================================== */

        .vw-rating-modal {
          position: relative;
          width: 100%;
          max-width: 520px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          border-radius: 27px;
          background: #ffffff;
          border: 1px solid rgba(43, 38, 37, 0.08);
          box-shadow:
            0 30px 80px rgba(20, 27, 23, 0.25),
            0 8px 25px rgba(20, 27, 23, 0.1);
          animation: vw-rating-slide 0.25s ease-out;
        }

        @keyframes vw-rating-slide {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .vw-rating-modal::-webkit-scrollbar {
          width: 5px;
        }

        .vw-rating-modal::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(49, 88, 71, 0.2);
        }

        /* =========================================
           GLOWS
        ========================================== */

        .vw-rating-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .vw-rating-glow-one {
          width: 180px;
          height: 180px;
          top: -110px;
          right: -70px;
          background: rgba(212, 163, 89, 0.08);
        }

        .vw-rating-glow-two {
          width: 130px;
          height: 130px;
          left: -75px;
          bottom: 80px;
          background: rgba(49, 88, 71, 0.045);
        }

        /* =========================================
           HEADER
        ========================================== */

        .vw-rating-header {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding: 25px 26px 22px;
          background:
            linear-gradient(
              135deg,
              #f3f5f0 0%,
              #f8f5ee 100%
            );
          border-bottom: 1px solid rgba(43, 38, 37, 0.06);
        }

        .vw-rating-header-content {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .vw-rating-icon {
          width: 43px;
          height: 43px;
          flex: 0 0 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: var(--color-ochre, #d4a359);
          background: rgba(212, 163, 89, 0.14);
          border: 1px solid rgba(212, 163, 89, 0.12);
        }

        .vw-rating-eyebrow {
          display: block;
          margin-bottom: 3px;
          color: var(--color-forest, #315847) !important;
          font-size: 0.56rem;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .vw-rating-header h5 {
          margin: 0 0 3px;
          color: var(--color-text, #2b2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.3rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .vw-rating-header p {
          margin: 0;
          color: var(--color-text-muted, #756e67) !important;
          font-size: 0.72rem;
          line-height: 1.4;
        }

        .vw-rating-header p strong {
          color: var(--color-text, #2b2625) !important;
        }

        .vw-rating-close {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 1px solid rgba(43, 38, 37, 0.08);
          border-radius: 10px;
          color: #817a73 !important;
          background: rgba(255, 255, 255, 0.72);
          cursor: pointer;
          transition:
            color 0.2s ease,
            background 0.2s ease;
        }

        .vw-rating-close svg {
          color: inherit !important;
        }

        .vw-rating-close:hover:not(:disabled) {
          color: #ffffff !important;
          background: var(--color-forest, #315847);
        }

        /* =========================================
           BODY
        ========================================== */

        .vw-rating-body {
          position: relative;
          z-index: 2;
          padding: 23px 26px 18px;
        }

        /* =========================================
           EMPLOYMENT
        ========================================== */

        .vw-rating-employment {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 13px 15px;
          border-radius: 14px;
          background: #f7f5ef;
          border: 1px solid rgba(43, 38, 37, 0.065);
        }

        .vw-rating-employment span {
          display: block;
          margin-bottom: 4px;
          color: #918980 !important;
          font-size: 0.53rem;
          font-weight: 800;
          letter-spacing: 0.11em;
        }

        .vw-rating-employment strong {
          color: var(--color-text, #2b2625) !important;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .vw-rating-employment-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 999px;
          color: var(--color-forest, #315847) !important;
          background: rgba(49, 88, 71, 0.08);
          font-size: 0.52rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          white-space: nowrap;
        }

        .vw-rating-employment-badge svg {
          color: inherit !important;
        }

        /* =========================================
           STAR SELECTOR
        ========================================== */

        .vw-rating-selector {
          padding: 25px 10px 20px;
          text-align: center;
        }

        .vw-rating-label {
          display: block;
          margin-bottom: 14px;
          color: #6e6861 !important;
          font-size: 0.63rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .vw-rating-stars {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .vw-rating-star {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          border-radius: 12px;
          color: #d6d1ca !important;
          background: transparent;
          cursor: pointer;
          transition:
            transform 0.15s ease,
            color 0.15s ease,
            background 0.15s ease;
        }

        .vw-rating-star svg {
          color: inherit !important;
          transition: transform 0.15s ease;
        }

        .vw-rating-star:hover:not(:disabled) {
          background: rgba(212, 163, 89, 0.08);
          transform: translateY(-2px);
        }

        .vw-rating-star-active {
          color: var(--color-ochre, #d4a359) !important;
        }

        .vw-rating-star-active svg {
          filter: drop-shadow(
            0 3px 5px rgba(212, 163, 89, 0.18)
          );
        }

        .vw-rating-score {
          min-height: 29px;
          margin-top: 10px;
        }

        .vw-rating-score span {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          color: #80622d !important;
          background: rgba(212, 163, 89, 0.12);
          font-size: 0.63rem;
          font-weight: 700;
        }

        /* =========================================
           COMMENT
        ========================================== */

        .vw-rating-comment {
          margin-top: 3px;
        }

        .vw-rating-comment-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }

        .vw-rating-comment-heading label {
          margin: 0;
          color: #504a45 !important;
          font-size: 0.69rem;
          font-weight: 800;
        }

        .vw-rating-comment-heading label span {
          margin-left: 7px;
          color: #9b938b !important;
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .vw-rating-comment-heading small {
          color: #9b938b !important;
          font-size: 0.6rem;
        }

        .vw-rating-comment textarea {
          width: 100%;
          min-height: 105px;
          resize: vertical;
          padding: 12px 14px;
          border: 1px solid rgba(43, 38, 37, 0.1);
          border-radius: 13px;
          outline: none;
          color: var(--color-text, #2b2625) !important;
          background: #fbfaf7;
          font-family: var(--font-sans);
          font-size: 0.76rem;
          line-height: 1.6;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .vw-rating-comment textarea::placeholder {
          color: #aaa39b !important;
        }

        .vw-rating-comment textarea:focus {
          background: #ffffff;
          border-color: rgba(49, 88, 71, 0.35);
          box-shadow:
            0 0 0 3px rgba(49, 88, 71, 0.07);
        }

        .vw-rating-comment textarea:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* =========================================
           TRUST MESSAGE
        ========================================== */

        .vw-rating-trust {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 14px;
          padding: 10px 11px;
          border-radius: 11px;
          background: rgba(49, 88, 71, 0.045);
          border: 1px solid rgba(49, 88, 71, 0.07);
        }

        .vw-rating-trust-icon {
          width: 26px;
          height: 26px;
          flex: 0 0 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: var(--color-forest, #315847);
          background: rgba(49, 88, 71, 0.09);
        }

        .vw-rating-trust p {
          margin: 0;
          color: #777068 !important;
          font-size: 0.6rem;
          line-height: 1.45;
        }

        /* =========================================
           FOOTER
        ========================================== */

        .vw-rating-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 9px;
          padding: 15px 26px 22px;
        }

        .vw-rating-cancel,
        .vw-rating-submit {
          min-height: 40px;
          border-radius: 11px;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .vw-rating-cancel {
          padding: 0 16px;
          color: #6f6962 !important;
          background: #f4f2ed;
          border: 1px solid rgba(43, 38, 37, 0.08);
        }

        .vw-rating-cancel:hover:not(:disabled) {
          color: #3e3935 !important;
          background: #ece9e2;
        }

        .vw-rating-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 9px 0 16px;
          border: 0;
          color: #ffffff !important;
          background: var(--color-forest, #315847);
          box-shadow:
            0 7px 16px rgba(49, 88, 71, 0.18);
        }

        .vw-rating-submit > span {
          color: #ffffff !important;
        }

        .vw-rating-submit:hover:not(:disabled) {
          color: #ffffff !important;
          background: #274b3d;
          transform: translateY(-1px);
          box-shadow:
            0 10px 21px rgba(49, 88, 71, 0.22);
        }

        .vw-rating-submit-arrow {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.14);
        }

        .vw-rating-submit-arrow svg {
          color: #ffffff !important;
        }

        .vw-rating-spinner {
          width: 13px;
          height: 13px;
          display: inline-block;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: vw-rating-spin 0.7s linear infinite;
        }

        @keyframes vw-rating-spin {
          to {
            transform: rotate(360deg);
          }
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        /* =========================================
           MOBILE
        ========================================== */

        @media (max-width: 576px) {
          .vw-rating-overlay {
            padding: 12px;
          }

          .vw-rating-modal {
            max-height: calc(100vh - 24px);
            border-radius: 22px;
          }

          .vw-rating-header {
            padding: 20px 19px 18px;
          }

          .vw-rating-body {
            padding: 19px 19px 14px;
          }

          .vw-rating-footer {
            padding: 12px 19px 18px;
          }

          .vw-rating-header h5 {
            font-size: 1.15rem;
          }

          .vw-rating-star {
            width: 38px;
            height: 38px;
          }

          .vw-rating-star svg {
            width: 22px;
            height: 22px;
          }

          .vw-rating-stars {
            gap: 4px;
          }

          .vw-rating-employment {
            padding: 11px 12px;
          }
        }

        @media (max-width: 380px) {
          .vw-rating-icon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }

          .vw-rating-header-content {
            gap: 9px;
          }

          .vw-rating-star {
            width: 34px;
            height: 34px;
          }

          .vw-rating-star svg {
            width: 19px;
            height: 19px;
          }

          .vw-rating-footer {
            flex-direction: column-reverse;
            align-items: stretch;
          }

          .vw-rating-cancel,
          .vw-rating-submit {
            width: 100%;
            justify-content: center;
          }
        }

        /* =========================================
           REDUCED MOTION
        ========================================== */

        @media (prefers-reduced-motion: reduce) {
          .vw-rating-overlay,
          .vw-rating-modal,
          .vw-rating-star,
          .vw-rating-close,
          .vw-rating-submit,
          .vw-rating-cancel {
            animation: none !important;
            transition: none !important;
          }

          .vw-rating-spinner {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default RatingModal;