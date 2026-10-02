function Stats() {
  const stats = [
    {
      value: "50M+",
      label: "Domestic Workforce Target",
      subtext: "Informal gig & domestic workers across India",
      gradient: "text-gradient-cyan",
    },
    {
      value: "100%",
      label: "Cryptographic Tamper Proof",
      subtext: "SHA-256 state matching against EVM smart contract",
      gradient: "text-gradient-primary",
    },
    {
      value: "<1 Sec",
      label: "Zero-Knowledge Query",
      subtext: "Instant QR code validation without PII exposure",
      gradient: "text-gradient-gold",
    },
    {
      value: "0.00 Gas",
      label: "Subsidized Public Verifications",
      subtext: "Free, permissionless verification for employers & banks",
      gradient: "text-gradient-cyan",
    },
  ];

  return (
    <section className="container py-4 my-3">
      <div className="glass-panel p-4 p-lg-5">
        <div className="row g-4 text-center">
          {stats.map((stat, index) => (
            <div className="col-6 col-lg-3" key={index}>
              <div className="p-2">
                <div className={`display-5 fw-bold ${stat.gradient} mb-1`} style={{ fontFamily: "var(--font-display)" }}>
                  {stat.value}
                </div>
                <div className="text-white fw-semibold small mb-1">
                  {stat.label}
                </div>
                <div className="text-muted" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                  {stat.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;