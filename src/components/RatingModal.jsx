import { useState } from "react";
import { toast } from "react-toastify";
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

      toast.success(response.message || "Rating submitted successfully!");
      if (onRatingSubmitted) {
        onRatingSubmitted(response.rating);
      }
      onClose();
    } catch (error) {
      console.error("Submit Rating Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit rating. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header bg-light border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold">
                ⭐ Rate {targetRole}
              </h5>
              <p className="text-muted small mb-0">
                Provide feedback for <strong>{targetName || targetRole}</strong>
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body pt-3 pb-2">
              {/* Job summary badge */}
              <div className="p-2 mb-3 bg-light rounded text-center small text-muted">
                Role: <strong>{employment.jobRole}</strong>
              </div>

              {/* Star selector */}
              <div className="text-center my-3">
                <label className="form-label fw-bold d-block text-secondary small text-uppercase">
                  Select Rating
                </label>
                <div
                  className="d-inline-flex gap-2 justify-content-center py-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        className="btn btn-link p-0 text-decoration-none border-0"
                        style={{
                          fontSize: "2.4rem",
                          lineHeight: "1",
                          color: isFilled ? "#f59e0b" : "#d1d5db",
                          cursor: "pointer",
                          transition: "transform 0.15s ease, color 0.15s ease",
                          transform:
                            (hoverRating || rating) >= star
                              ? "scale(1.15)"
                              : "scale(1)",
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2">
                  <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-semibold">
                    {ratingDescriptions[currentDisplayScore]}
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div className="mb-3 mt-4 text-start">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label htmlFor="ratingComment" className="form-label fw-bold small text-secondary mb-0">
                    Review / Comments (Optional)
                  </label>
                  <small className="text-muted">
                    {comment.length} / 500
                  </small>
                </div>
                <textarea
                  id="ratingComment"
                  className="form-control"
                  rows="3"
                  maxLength={500}
                  placeholder={`Write your genuine experience with ${targetName || targetRole}...`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={submitting}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-warning text-dark fw-bold px-4"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Rating"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;
