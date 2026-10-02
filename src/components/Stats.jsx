function Stats() {
  const stats = [
    {
      value: "50M+",
      label: "Domestic Workers",
      description: "Cooks, housekeepers, drivers & caregivers in India",
    },
    {
      value: "100%",
      label: "Tamper-Proof Records",
      description: "Cryptographically secured on Ethereum EVM",
    },
    {
      value: "<1 Sec",
      label: "Instant Verification",
      description: "Zero-Knowledge lookup without raw Aadhaar exposure",
    },
    {
      value: "0.00 Gas",
      label: "Public Verifications",
      description: "Subsidized, permissionless verification for employers",
    },
  ];

  return (
    <section className="container py-4 my-2">
      <div className="veriwork-card-tint p-4 p-lg-5">
        <div className="row g-4 text-center">
          {stats.map((stat, index) => (
            <div className="col-6 col-lg-3" key={index}>
              <div className="p-2 text-start">
                <div className="display-5 fw-bold text-dark mb-1 font-monospace" style={{ fontFamily: "var(--font-serif)" }}>
                  {stat.value}
                </div>
                <div className="fw-bold text-dark small mb-1">
                  {stat.label}
                </div>
                <div className="text-muted" style={{ fontSize: "0.78rem", lineHeight: "1.5" }}>
                  {stat.description}
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