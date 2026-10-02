function RatingReviewsSection({
  title = "⭐ Ratings & Reviews",
  subtitle = "Feedback received from completed employment records",
  averageRating = 0,
  totalRatings = 0,
  ratings = [],
  loading = false,
}) {
  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="text-warning fs-5">
        {"★".repeat(fullStars)}
        {hasHalfStar ? "★" : ""}
        <span className="text-muted" style={{ opacity: 0.35 }}>
          {"★".repeat(emptyStars)}
        </span>
      </span>
    );
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <h3 className="fw-bold mb-1">{title}</h3>
            <p className="text-muted mb-0">{subtitle}</p>
          </div>
          <span className="badge bg-warning text-dark px-3 py-2 fs-6 rounded-pill fw-bold">
            ⭐ {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} / 5.0
          </span>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-muted mt-2">Loading ratings & reviews...</p>
          </div>
        ) : (
          <>
            {/* Summary Banner */}
            <div
              className="p-4 rounded-3 mb-4"
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                border: "1px solid #fcd34d",
              }}
            >
              <div className="row align-items-center">
                <div className="col-md-4 text-center border-end-md pb-3 pb-md-0">
                  <div className="display-4 fw-bold text-dark mb-0">
                    {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
                  </div>
                  <div className="my-1">{renderStars(averageRating)}</div>
                  <div className="text-muted small fw-semibold">
                    Based on {totalRatings} review{totalRatings !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="col-md-8 ps-md-4">
                  <h5 className="fw-bold text-dark mb-1">
                    Reputation & Trust Score
                  </h5>
                  <p className="small text-muted mb-0">
                    Ratings on VeriWork are tied directly to verified, completed
                    employment records and are protected against duplicate or
                    unauthorized submissions.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {ratings.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-3">
                <div style={{ fontSize: "2.5rem" }}>💬</div>
                <h6 className="fw-bold mt-2 mb-1">No Reviews Yet</h6>
                <p className="text-muted small mb-0">
                  Once employments are completed and reviewed, feedback will be
                  showcased here.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {ratings.map((rev) => (
                  <div className="col-md-6" key={rev._id}>
                    <div className="card h-100 border shadow-none bg-light p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="fw-bold text-dark">
                            {rev.reviewerName ||
                              (rev.reviewerRole === "employer"
                                ? "Employer"
                                : "Worker")}
                          </div>
                          <span className="badge bg-secondary text-uppercase" style={{ fontSize: "0.7rem" }}>
                            {rev.reviewerRole}
                          </span>
                        </div>
                        <div className="text-end">
                          <div>{renderStars(rev.rating)}</div>
                          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </small>
                        </div>
                      </div>

                      {rev.comment ? (
                        <p className="mb-0 text-secondary fst-italic small mt-2">
                          "{rev.comment}"
                        </p>
                      ) : (
                        <p className="mb-0 text-muted fst-italic small mt-2">
                          No written feedback provided.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RatingReviewsSection;
