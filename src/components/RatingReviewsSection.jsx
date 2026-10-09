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
      <span className="vw-reviews-stars">
        {"★".repeat(fullStars)}

        {hasHalfStar ? "★" : ""}

        <span className="vw-reviews-stars-empty">
          {"★".repeat(emptyStars)}
        </span>
      </span>
    );
  };

  return (
    <section className="vw-reviews-section">
      <div className="vw-reviews-card">

        {/* =========================================
            HEADER
        ========================================== */}

        <div className="vw-reviews-header">
          <div>
            <div className="vw-reviews-eyebrow">
              <span></span>
              REPUTATION
            </div>

            <h3>{title}</h3>

            <p>{subtitle}</p>
          </div>

          <div className="vw-reviews-header-rating">
            <span className="vw-reviews-header-star">★</span>

            <div>
              <strong>
                {averageRating > 0
                  ? averageRating.toFixed(1)
                  : "0.0"}
              </strong>

              <small>/ 5.0</small>
            </div>
          </div>
        </div>

        {loading ? (
          /* =========================================
             LOADING
          ========================================== */

          <div className="vw-reviews-loading">
            <div className="vw-reviews-spinner"></div>

            <h5>Loading ratings & reviews</h5>

            <p>
              Gathering verified feedback from employment records...
            </p>
          </div>
        ) : (
          <>
            {/* =====================================
                SUMMARY
            ====================================== */}

            <div className="vw-reviews-summary">

              <div className="vw-reviews-summary-score">
                <span className="vw-reviews-summary-label">
                  OVERALL RATING
                </span>

                <div className="vw-reviews-score-number">
                  {averageRating > 0
                    ? averageRating.toFixed(1)
                    : "0.0"}
                </div>

                <div className="vw-reviews-summary-stars">
                  {renderStars(averageRating)}
                </div>

                <p>
                  Based on{" "}
                  <strong>
                    {totalRatings}
                  </strong>{" "}
                  review
                  {totalRatings !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="vw-reviews-summary-divider"></div>

              <div className="vw-reviews-trust">

                <div className="vw-reviews-trust-icon">
                  ✓
                </div>

                <div>
                  <span className="vw-reviews-trust-label">
                    VERIFIED REPUTATION
                  </span>

                  <h5>
                    Reputation & Trust Score
                  </h5>

                  <p>
                    Ratings on VeriWork are tied directly to
                    verified, completed employment records and
                    are protected against duplicate or
                    unauthorized submissions.
                  </p>
                </div>

              </div>
            </div>

            {/* =====================================
                REVIEWS
            ====================================== */}

            {ratings.length === 0 ? (
              <div className="vw-reviews-empty">

                <div className="vw-reviews-empty-icon">
                  💬
                </div>

                <div>
                  <h6>No Reviews Yet</h6>

                  <p>
                    Once employments are completed and
                    reviewed, feedback will be showcased here.
                  </p>
                </div>

              </div>
            ) : (
              <div className="vw-reviews-list">

                {ratings.map((rev) => (
                  <article
                    className="vw-review-item"
                    key={rev._id}
                  >

                    {/* Review header */}
                    <div className="vw-review-top">

                      <div className="vw-reviewer">

                        <div className="vw-reviewer-avatar">
                          {(
                            rev.reviewerName ||
                            (rev.reviewerRole === "employer"
                              ? "Employer"
                              : "Worker")
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {rev.reviewerName ||
                              (rev.reviewerRole === "employer"
                                ? "Employer"
                                : "Worker")}
                          </strong>

                          <span>
                            {rev.reviewerRole}
                          </span>
                        </div>

                      </div>

                      <div className="vw-review-rating">

                        <div>
                          {renderStars(rev.rating)}
                        </div>

                        <small>
                          {new Date(
                            rev.createdAt
                          ).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </small>

                      </div>

                    </div>

                    {/* Comment */}
                    <div className="vw-review-comment">
                      {rev.comment ? (
                        <>
                          <span className="vw-review-quote">
                            “
                          </span>

                          <p>{rev.comment}</p>
                        </>
                      ) : (
                        <p className="vw-review-no-comment">
                          No written feedback provided.
                        </p>
                      )}
                    </div>

                    {/* Verified footer */}
                    <div className="vw-review-footer">
                      <span className="vw-review-verified-dot">
                        ✓
                      </span>

                      <span>
                        Verified employment feedback
                      </span>
                    </div>

                  </article>
                ))}

              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        /* =========================================
           REVIEWS SECTION
        ========================================== */

        .vw-reviews-section {
          width: 100%;
          margin-bottom: 28px;
        }

        .vw-reviews-card {
          position: relative;
          overflow: hidden;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(43, 38, 37, 0.075);
          box-shadow:
            0 12px 34px rgba(43, 38, 37, 0.055);
        }

        /* =========================================
           HEADER
        ========================================== */

        .vw-reviews-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 27px 28px 23px;
          border-bottom: 1px solid rgba(43, 38, 37, 0.06);
          background:
            linear-gradient(
              135deg,
              rgba(247, 248, 243, 0.85),
              rgba(250, 247, 240, 0.8)
            );
        }

        .vw-reviews-eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 7px;
          color: var(--color-forest, #315847) !important;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .vw-reviews-eyebrow span {
          width: 19px;
          height: 2px;
          border-radius: 999px;
          background: var(--color-ochre, #d4a359);
        }

        .vw-reviews-header h3 {
          margin: 0 0 5px;
          color: var(--color-text, #2b2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.45rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .vw-reviews-header p {
          margin: 0;
          color: var(--color-text-muted, #756e67) !important;
          font-size: 0.73rem;
          line-height: 1.5;
        }

        /* =========================================
           HEADER RATING
        ========================================== */

        .vw-reviews-header-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 14px;
          color: #755b29;
          background: rgba(212, 163, 89, 0.12);
          border: 1px solid rgba(212, 163, 89, 0.14);
          white-space: nowrap;
        }

        .vw-reviews-header-star {
          color: var(--color-ochre, #d4a359) !important;
          font-size: 1.15rem;
        }

        .vw-reviews-header-rating strong {
          color: #514431 !important;
          font-size: 0.95rem;
          font-weight: 800;
        }

        .vw-reviews-header-rating small {
          color: #8b806c !important;
          font-size: 0.58rem;
        }

        /* =========================================
           SUMMARY
        ========================================== */

        .vw-reviews-summary {
          display: grid;
          grid-template-columns: 190px 1px minmax(0, 1fr);
          align-items: center;
          gap: 27px;
          margin: 22px 24px;
          padding: 22px;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              rgba(245, 242, 231, 0.95),
              rgba(239, 244, 238, 0.9)
            );
          border: 1px solid rgba(43, 38, 37, 0.06);
        }

        .vw-reviews-summary-score {
          text-align: center;
        }

        .vw-reviews-summary-label {
          display: block;
          margin-bottom: 5px;
          color: #898178 !important;
          font-size: 0.54rem;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .vw-reviews-score-number {
          color: var(--color-text, #2b2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 2.55rem;
          font-weight: 700;
          line-height: 1;
        }

        .vw-reviews-summary-stars {
          margin-top: 6px;
        }

        .vw-reviews-summary-score p {
          margin: 5px 0 0;
          color: #888078 !important;
          font-size: 0.58rem;
        }

        .vw-reviews-summary-score p strong {
          color: #5e5852 !important;
        }

        .vw-reviews-summary-divider {
          width: 1px;
          height: 70px;
          background: rgba(43, 38, 37, 0.1);
        }

        /* =========================================
           STARS
        ========================================== */

        .vw-reviews-stars {
          color: var(--color-ochre, #d4a359) !important;
          font-size: 0.92rem;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .vw-reviews-stars-empty {
          color: #c8c2ba !important;
          opacity: 0.45;
        }

        /* =========================================
           TRUST
        ========================================== */

        .vw-reviews-trust {
          display: flex;
          align-items: flex-start;
          gap: 13px;
        }

        .vw-reviews-trust-icon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          color: #ffffff !important;
          background: var(--color-forest, #315847);
          font-size: 0.7rem;
          font-weight: 800;
        }

        .vw-reviews-trust-icon {
          color: #ffffff !important;
        }

        .vw-reviews-trust-label {
          display: block;
          margin-bottom: 3px;
          color: var(--color-forest, #315847) !important;
          font-size: 0.53rem;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .vw-reviews-trust h5 {
          margin: 0 0 5px;
          color: var(--color-text, #2b2625) !important;
          font-size: 0.88rem;
          font-weight: 750;
        }

        .vw-reviews-trust p {
          max-width: 540px;
          margin: 0;
          color: var(--color-text-muted, #756e67) !important;
          font-size: 0.68rem;
          line-height: 1.6;
        }

        /* =========================================
           REVIEW LIST
        ========================================== */

        .vw-reviews-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
          padding: 0 24px 24px;
        }

        .vw-review-item {
          position: relative;
          min-width: 0;
          padding: 17px;
          border-radius: 17px;
          background: rgba(250, 249, 246, 0.9);
          border: 1px solid rgba(43, 38, 37, 0.065);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .vw-review-item:hover {
          transform: translateY(-2px);
          background: #ffffff;
          box-shadow:
            0 9px 24px rgba(43, 38, 37, 0.06);
        }

        /* =========================================
           REVIEWER
        ========================================== */

        .vw-review-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .vw-reviewer {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .vw-reviewer-avatar {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          color: var(--color-forest, #315847);
          background: #e8eee8;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 0.82rem;
          font-weight: 700;
        }

        .vw-reviewer strong {
          display: block;
          overflow: hidden;
          color: var(--color-text, #2b2625) !important;
          font-size: 0.73rem;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vw-reviewer span {
          display: inline-block;
          margin-top: 3px;
          color: var(--color-forest, #315847) !important;
          font-size: 0.5rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* =========================================
           REVIEW RATING
        ========================================== */

        .vw-review-rating {
          flex: 0 0 auto;
          text-align: right;
        }

        .vw-review-rating .vw-reviews-stars {
          font-size: 0.7rem;
          letter-spacing: 0;
        }

        .vw-review-rating small {
          display: block;
          margin-top: 3px;
          color: #9a9289 !important;
          font-size: 0.53rem;
        }

        /* =========================================
           COMMENT
        ========================================== */

        .vw-review-comment {
          position: relative;
          min-height: 47px;
          margin-top: 15px;
          padding-left: 17px;
        }

        .vw-review-comment p {
          margin: 0;
          color: #68615a !important;
          font-size: 0.7rem;
          font-style: italic;
          line-height: 1.65;
        }

        .vw-review-quote {
          position: absolute;
          top: -4px;
          left: 0;
          color: var(--color-ochre, #d4a359) !important;
          font-family: Georgia, serif;
          font-size: 1.55rem;
          line-height: 1;
        }

        .vw-review-no-comment {
          color: #a19a92 !important;
        }

        /* =========================================
           REVIEW FOOTER
        ========================================== */

        .vw-review-footer {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 13px;
          padding-top: 10px;
          border-top: 1px solid rgba(43, 38, 37, 0.055);
          color: #8d958e !important;
          font-size: 0.51rem;
          font-weight: 700;
        }

        .vw-review-verified-dot {
          width: 15px;
          height: 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff !important;
          background: #5c8b70;
          font-size: 0.48rem;
          font-weight: 800;
        }

        /* =========================================
           EMPTY STATE
        ========================================== */

        .vw-reviews-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          margin: 0 24px 24px;
          padding: 27px 20px;
          text-align: left;
          border-radius: 17px;
          background: #f8f6f1;
          border: 1px dashed rgba(49, 88, 71, 0.16);
        }

        .vw-reviews-empty-icon {
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(49, 88, 71, 0.08);
          font-size: 1.25rem;
        }

        .vw-reviews-empty h6 {
          margin: 0 0 4px;
          color: var(--color-text, #2b2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 0.95rem;
          font-weight: 700;
        }

        .vw-reviews-empty p {
          margin: 0;
          color: var(--color-text-muted, #756e67) !important;
          font-size: 0.66rem;
          line-height: 1.5;
        }

        /* =========================================
           LOADING
        ========================================== */

        .vw-reviews-loading {
          padding: 55px 20px;
          text-align: center;
        }

        .vw-reviews-spinner {
          width: 32px;
          height: 32px;
          margin: 0 auto 14px;
          border: 3px solid rgba(49, 88, 71, 0.12);
          border-top-color: var(--color-forest, #315847);
          border-radius: 50%;
          animation: vw-reviews-spin 0.75s linear infinite;
        }

        @keyframes vw-reviews-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .vw-reviews-loading h5 {
          margin: 0 0 5px;
          color: var(--color-text, #2b2625) !important;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1rem;
        }

        .vw-reviews-loading p {
          margin: 0;
          color: var(--color-text-muted, #756e67) !important;
          font-size: 0.68rem;
        }

        /* =========================================
           TABLET
        ========================================== */

        @media (max-width: 767.98px) {
          .vw-reviews-summary {
            grid-template-columns: 150px 1px minmax(0, 1fr);
            gap: 18px;
            margin: 19px;
            padding: 18px;
          }

          .vw-reviews-list {
            grid-template-columns: 1fr;
            padding: 0 19px 19px;
          }

          .vw-reviews-empty {
            margin: 0 19px 19px;
          }
        }

        /* =========================================
           MOBILE
        ========================================== */

        @media (max-width: 576px) {
          .vw-reviews-card {
            border-radius: 21px;
          }

          .vw-reviews-header {
            align-items: flex-start;
            padding: 21px 18px;
          }

          .vw-reviews-header h3 {
            font-size: 1.2rem;
          }

          .vw-reviews-header p {
            font-size: 0.65rem;
          }

          .vw-reviews-header-rating {
            padding: 7px 9px;
          }

          .vw-reviews-header-star {
            font-size: 0.95rem;
          }

          .vw-reviews-summary {
            grid-template-columns: 1fr;
            gap: 16px;
            margin: 17px;
            padding: 20px;
          }

          .vw-reviews-summary-divider {
            width: 100%;
            height: 1px;
          }

          .vw-reviews-trust {
            align-items: flex-start;
          }

          .vw-reviews-list {
            padding: 0 17px 17px;
          }

          .vw-review-item {
            padding: 15px;
          }

          .vw-review-top {
            gap: 8px;
          }
        }

        /* =========================================
           SMALL MOBILE
        ========================================== */

        @media (max-width: 400px) {
          .vw-reviews-header {
            flex-direction: column;
          }

          .vw-reviews-header-rating {
            align-self: flex-start;
          }

          .vw-review-rating .vw-reviews-stars {
            font-size: 0.62rem;
          }

          .vw-review-rating small {
            font-size: 0.48rem;
          }
        }

        /* =========================================
           REDUCED MOTION
        ========================================== */

        @media (prefers-reduced-motion: reduce) {
          .vw-review-item,
          .vw-reviews-spinner {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default RatingReviewsSection;