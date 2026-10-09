import { useEffect, useRef, useState } from "react";

function Stats() {
  const stats = [
    {
      value: "50M+",
      label: "Domestic Workers",
      description:
        "Cooks, housekeepers, drivers & caregivers in India",
    },
    {
      value: "100%",
      label: "Tamper-Proof Records",
      description:
        "Cryptographically secured on Ethereum EVM",
    },
    {
      value: "<1 Sec",
      label: "Instant Verification",
      description:
        "Zero-Knowledge lookup without raw Aadhaar exposure",
    },
    {
      value: "0.00 Gas",
      label: "Public Verifications",
      description:
        "Subsidized, permissionless verification for employers",
    },
  ];

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`vw-stats-section ${isVisible ? "vw-stats-visible" : ""
        }`}
    >
      {/* =====================================================
          TOP TRANSITION
      ===================================================== */}

      <div className="vw-stats-top-transition">
        <div className="vw-stats-transition-glow" />

        <div className="vw-stats-transition-pulse" />
      </div>

      <div className="container">
        <div className="vw-stats-card">

          {/* Subtle light sweep */}
          <div className="vw-stats-card-shine" />

          {/* Ambient glow */}
          <div className="vw-stats-card-glow" />

          <div className="vw-stats-grid">

            {stats.map((stat, index) => (
              <div
                className={`vw-stat-item ${index !== stats.length - 1
                    ? "vw-stat-with-divider"
                    : ""
                  }`}
                key={index}
                style={{
                  "--stat-delay": `${index * 110}ms`,
                }}
              >
                <div className="vw-stat-value">
                  {stat.value}
                </div>

                <div className="vw-stat-label">
                  {stat.label}
                </div>

                <div className="vw-stat-description">
                  {stat.description}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      <style>{`

        /* =====================================================
           STATS SECTION
        ===================================================== */

        .vw-stats-section {
          position: relative;

          width: 100%;

          padding: 0 0 42px;

          background: var(--color-bg);

          /*
            Small overlap keeps the Hero and Stats visually
            connected without hiding the transition signal.
          */
          margin-top: -8px;

          z-index: 3;
        }


        /* =====================================================
           TOP TRANSITION
        ===================================================== */

        .vw-stats-top-transition {
          position: absolute;

          left: 0;
          right: 0;

          top: -100px;

          height: 120px;

          pointer-events: none;

          overflow: hidden;

          z-index: -1;
        }


        .vw-stats-transition-glow {
          position: absolute;

          left: 50%;
          top: 45px;

          width: 580px;
          height: 130px;

          transform: translateX(-50%);

          border-radius: 50%;

          background:
            radial-gradient(
              ellipse,
              rgba(53, 74, 54, 0.10) 0%,
              rgba(53, 74, 54, 0.04) 38%,
              transparent 72%
            );

          filter: blur(12px);

          opacity: 0;

          transition:
            opacity 1.2s ease,
            transform 1.2s cubic-bezier(.22, 1, .36, 1);
        }


        .vw-stats-visible .vw-stats-transition-glow {
          opacity: 1;

          transform:
            translateX(-50%)
            scale(1.05);
        }


        .vw-stats-transition-pulse {
          position: absolute;

          left: 50%;
          top: 68px;

          width: 6px;
          height: 6px;

          transform:
            translate(-50%, -50%)
            scale(.4);

          border-radius: 50%;

          background: var(--color-forest);

          box-shadow:
            0 0 0 7px rgba(53, 74, 54, .07),
            0 0 18px rgba(53, 74, 54, .2);

          opacity: 0;

          transition:
            opacity .5s ease .25s,
            transform .8s cubic-bezier(.22, 1, .36, 1) .25s;
        }


        .vw-stats-visible .vw-stats-transition-pulse {
          opacity: .8;

          transform:
            translate(-50%, -50%)
            scale(1);
        }


        /* =====================================================
           MAIN CARD
        ===================================================== */

        .vw-stats-card {
          position: relative;

          width: 100%;

          padding: 30px 34px;

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, .76),
              rgba(255, 255, 255, .48)
            );

          border:
            1px solid rgba(43, 38, 37, .075);

          border-radius: 24px;

          box-shadow:
            0 10px 32px rgba(43, 38, 37, .045);

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);

          overflow: hidden;

          opacity: 0;

          transform:
            translateY(52px)
            scale(.965);

          filter: blur(5px);

          transition:
            opacity .9s cubic-bezier(.22, 1, .36, 1),
            transform 1s cubic-bezier(.22, 1, .36, 1),
            filter .9s ease,
            box-shadow 1s ease;
        }


        .vw-stats-visible .vw-stats-card {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);

          filter: blur(0);

          box-shadow:
            0 18px 42px rgba(43, 38, 37, .065);
        }


        /* =====================================================
           CARD SHINE
        ===================================================== */

        .vw-stats-card-shine {
          position: absolute;

          top: -20%;
          left: -35%;

          width: 35%;
          height: 150%;

          transform: rotate(18deg);

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, .4),
              transparent
            );

          opacity: 0;

          pointer-events: none;
        }


        .vw-stats-visible .vw-stats-card-shine {
          animation:
            vwStatsShine 1.5s ease .45s forwards;
        }


        /* =====================================================
           CARD AMBIENT GLOW
        ===================================================== */

        .vw-stats-card-glow {
          position: absolute;

          width: 180px;
          height: 180px;

          top: -120px;
          right: 12%;

          background:
            radial-gradient(
              circle,
              rgba(122, 139, 123, .12),
              transparent 70%
            );

          border-radius: 50%;

          filter: blur(4px);

          pointer-events: none;

          opacity: 0;

          transition:
            opacity 1.2s ease .35s;
        }


        .vw-stats-visible .vw-stats-card-glow {
          opacity: 1;
        }


        /* =====================================================
           GRID
        ===================================================== */

        .vw-stats-grid {
          position: relative;

          z-index: 1;

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          align-items: stretch;
        }


        /* =====================================================
           STAT ITEM
        ===================================================== */

        .vw-stat-item {
          position: relative;

          min-width: 0;

          padding: 6px 28px;

          text-align: left;

          opacity: 0;

          transform:
            translateY(25px);

          transition:
            opacity .7s cubic-bezier(.22, 1, .36, 1)
              var(--stat-delay),
            transform .75s cubic-bezier(.22, 1, .36, 1)
              var(--stat-delay);
        }


        .vw-stats-visible .vw-stat-item {
          opacity: 1;

          transform:
            translateY(0);
        }


        /* =====================================================
           DIVIDER
        ===================================================== */

        .vw-stat-with-divider::after {
          content: "";

          position: absolute;

          top: 6px;
          right: 0;

          width: 1px;

          height: calc(100% - 12px);

          background:
            rgba(43, 38, 37, .095);

          transform:
            scaleY(.3);

          transform-origin: center;

          opacity: 0;

          transition:
            transform .7s ease
              calc(var(--stat-delay) + 180ms),
            opacity .5s ease
              calc(var(--stat-delay) + 180ms);
        }


        .vw-stats-visible .vw-stat-with-divider::after {
          transform: scaleY(1);

          opacity: 1;
        }


        /* =====================================================
           VALUE
        ===================================================== */

        .vw-stat-value {
          margin-bottom: 8px;

          color: var(--color-text) !important;

          font-family: var(--font-serif);

          font-size:
            clamp(2rem, 2.55vw, 2.65rem);

          font-weight: 700;

          line-height: .98;

          letter-spacing: -.04em;

          transition:
            transform .35s ease;
        }


        .vw-stat-item:hover .vw-stat-value {
          transform:
            translateY(-2px);
        }


        /* =====================================================
           LABEL
        ===================================================== */

        .vw-stat-label {
          margin-bottom: 7px;

          color: var(--color-forest) !important;

          font-family: var(--font-sans);

          font-size: .76rem;

          font-weight: 750;

          line-height: 1.3;

          letter-spacing: .015em;
        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .vw-stat-description {
          max-width: 215px;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: .69rem;

          font-weight: 400;

          line-height: 1.55;
        }


        /* =====================================================
           SHINE
        ===================================================== */

        @keyframes vwStatsShine {

          0% {
            left: -35%;
            opacity: 0;
          }

          20% {
            opacity: .7;
          }

          100% {
            left: 125%;
            opacity: 0;
          }

        }


        /* =====================================================
           LARGE TABLET
        ===================================================== */

        @media (max-width: 1199px) {

          .vw-stats-card {
            padding: 28px 20px;
          }


          .vw-stat-item {
            padding-left: 20px;
            padding-right: 20px;
          }


          .vw-stat-value {
            font-size: 2.25rem;
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 991.98px) {

          .vw-stats-section {
            margin-top: -6px;

            padding-bottom: 34px;
          }


          .vw-stats-card {
            padding: 22px 18px;

            border-radius: 22px;
          }


          .vw-stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }


          .vw-stat-item {
            padding: 17px 20px;
          }


          .vw-stat-with-divider::after {
            display: none;
          }


          /*
            Vertical divider.
          */

          .vw-stat-item:nth-child(odd)::after {
            content: "";

            display: block;

            position: absolute;

            top: 17px;
            right: 0;

            width: 1px;

            height: calc(100% - 34px);

            background:
              rgba(43, 38, 37, .09);

            transform:
              scaleY(.3);
          }


          .vw-stats-visible
          .vw-stat-item:nth-child(odd)::after {
            transform:
              scaleY(1);
          }


          /*
            Horizontal divider.
          */

          .vw-stat-item:nth-child(-n + 2)::before {
            content: "";

            position: absolute;

            left: 20px;
            right: 20px;

            bottom: 0;

            height: 1px;

            background:
              rgba(43, 38, 37, .09);

            transform:
              scaleX(.3);

            transform-origin: left;

            opacity: 0;

            transition:
              transform .7s ease
                calc(var(--stat-delay) + 180ms),
              opacity .5s ease
                calc(var(--stat-delay) + 180ms);
          }


          .vw-stats-visible
          .vw-stat-item:nth-child(-n + 2)::before {
            transform:
              scaleX(1);

            opacity: 1;
          }


          .vw-stat-description {
            max-width: 270px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767.98px) {

          .vw-stats-section {
            margin-top: -4px;

            padding-top: 0;
            padding-bottom: 30px;
          }


          .vw-stats-card {
            padding: 14px 12px;

            border-radius: 20px;
          }


          .vw-stat-item {
            padding: 16px 12px;
          }


          .vw-stat-item:nth-child(odd)::after {
            top: 16px;

            height:
              calc(100% - 32px);
          }


          .vw-stat-item:nth-child(-n + 2)::before {
            left: 12px;
            right: 12px;
          }


          .vw-stat-value {
            margin-bottom: 6px;

            font-size: 1.8rem;
          }


          .vw-stat-label {
            margin-bottom: 5px;

            font-size: .67rem;
          }


          .vw-stat-description {
            font-size: .61rem;

            line-height: 1.48;
          }


          .vw-stats-card-shine {
            display: none;
          }


          .vw-stats-transition-glow {
            width: 350px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 420px) {

          .vw-stats-card {
            padding: 11px 8px;

            border-radius: 18px;
          }


          .vw-stat-item {
            padding: 14px 9px;
          }


          .vw-stat-item:nth-child(odd)::after {
            top: 14px;

            height:
              calc(100% - 28px);
          }


          .vw-stat-item:nth-child(-n + 2)::before {
            left: 9px;
            right: 9px;
          }


          .vw-stat-value {
            font-size: 1.58rem;
          }


          .vw-stat-label {
            font-size: .62rem;
          }


          .vw-stat-description {
            font-size: .55rem;

            line-height: 1.42;
          }

        }


        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .vw-stats-card,
          .vw-stat-item,
          .vw-stats-card-shine,
          .vw-stats-card-glow,
          .vw-stats-transition-glow,
          .vw-stats-transition-pulse {
            transition: none !important;

            animation: none !important;

            filter: none !important;
          }


          .vw-stats-card,
          .vw-stat-item {
            opacity: 1 !important;

            transform: none !important;
          }


          .vw-stat-with-divider::after,
          .vw-stat-item:nth-child(-n + 2)::before {
            opacity: 1 !important;

            transform: none !important;
          }

        }

      `}</style>
    </section>
  );
}

export default Stats;