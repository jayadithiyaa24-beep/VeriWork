import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught render error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            textAlign: "center",
            background: "var(--color-bg, #EFECE6)",
            color: "var(--color-text, #2B2625)",
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
          }}
        >
          <div
            style={{
              maxWidth: "520px",
              padding: "40px 32px",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(43, 38, 37, 0.08)",
              boxShadow: "0 18px 45px rgba(43, 38, 37, 0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 18px",
                borderRadius: "50%",
                background: "rgba(186, 75, 59, 0.12)",
                color: "#ba4b3b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              !
            </div>
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "1.4rem",
                fontWeight: 700,
              }}
            >
              Something went wrong
            </h3>
            <p
              style={{
                color: "#756E67",
                fontSize: "0.88rem",
                lineHeight: 1.6,
                margin: "0 0 24px",
              }}
            >
              An unexpected error occurred while rendering this page. You can try
              refreshing or returning to the home page.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={this.handleReload}
                style={{
                  padding: "10px 22px",
                  borderRadius: "999px",
                  background: "#4A6750",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: "10px 22px",
                  borderRadius: "999px",
                  background: "transparent",
                  color: "#2B2625",
                  border: "1px solid rgba(43, 38, 37, 0.2)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

