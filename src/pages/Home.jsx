import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";

function Home() {
  return (
    <div className="vw-home-container">

      {/* =====================================================
          1. HERO
      ===================================================== */}

      <div className="vw-home-hero-wrap">
        <Hero />

        {/* 
          Soft visual bridge between Hero and Stats.
          This does not contain any functional content.
        */}
        <div className="vw-hero-stats-bridge">
          <div className="vw-bridge-glow" />

          <div className="vw-bridge-signal">
            <span className="vw-bridge-signal-dot" />
            <span className="vw-bridge-signal-line" />
            <span className="vw-bridge-signal-dot vw-bridge-signal-dot-bottom" />
          </div>

          <div className="vw-bridge-text">
            <span>TRUSTED DATA</span>
          </div>
        </div>
      </div>


      {/* =====================================================
          2. KEY METRICS & IMPACT
      ===================================================== */}

      <Stats />


      {/* =====================================================
          3. WHY VERIWORK / FEATURES
      ===================================================== */}

      <div id="features">
        <Features />
      </div>


      {/* =====================================================
          4. HOW IT WORKS
      ===================================================== */}

      <div id="how-it-works">
        <HowItWorks />
      </div>


      {/* =====================================================
          5. FINAL CTA
      ===================================================== */}

      <CTA />


      {/* =====================================================
          HOME TRANSITION STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           HOME BASE
        ===================================================== */

        .vw-home-container {
          position: relative;
          width: 100%;
          overflow: hidden;

          background: var(--color-bg);
        }


        /* =====================================================
           HERO WRAPPER
        ===================================================== */

        .vw-home-hero-wrap {
          position: relative;
          z-index: 2;
        }


        /* =====================================================
           HERO → STATS BRIDGE
        ===================================================== */

        .vw-hero-stats-bridge {
          position: absolute;

          left: 0;
          right: 0;

          bottom: -1px;

          height: 145px;

          display: flex;
          align-items: flex-end;
          justify-content: center;

          pointer-events: none;

          z-index: 10;

          overflow: hidden;
        }


        /*
          Large soft gradient that visually melts
          the Hero into the Stats section.
        */

        .vw-hero-stats-bridge::before {
          content: "";

          position: absolute;

          left: 0;
          right: 0;
          bottom: 0;

          height: 145px;

          background:
            linear-gradient(
              to bottom,
              rgba(239,236,230,0),
              rgba(239,236,230,.45) 42%,
              var(--color-bg) 100%
            );
        }


        /* =====================================================
           MOVING AMBIENT GLOW
        ===================================================== */

        .vw-bridge-glow {
          position: absolute;

          left: 50%;
          bottom: -120px;

          width: 430px;
          height: 250px;

          transform: translateX(-50%);

          border-radius: 50%;

          background:
            radial-gradient(
              ellipse,
              rgba(53,74,54,.10) 0%,
              rgba(53,74,54,.035) 42%,
              transparent 72%
            );

          filter: blur(8px);

          animation:
            vwBridgeGlow 7s ease-in-out infinite;
        }


        /* =====================================================
           VERIFICATION SIGNAL
        ===================================================== */

        .vw-bridge-signal {
          position: absolute;

          left: 50%;
          bottom: 18px;

          width: 2px;
          height: 90px;

          transform: translateX(-50%);

          display: flex;
          flex-direction: column;
          align-items: center;

          opacity: .55;
        }


        .vw-bridge-signal-line {
          position: relative;

          width: 1px;
          height: 62px;

          overflow: hidden;

          background:
            linear-gradient(
              to bottom,
              rgba(53,74,54,.08),
              rgba(53,74,54,.35),
              rgba(53,74,54,.08)
            );
        }


        /*
          Moving verification pulse.
        */

        .vw-bridge-signal-line::after {
          content: "";

          position: absolute;

          top: -18px;
          left: 0;

          width: 1px;
          height: 18px;

          background: var(--color-forest);

          box-shadow:
            0 0 8px rgba(53,74,54,.55);

          animation:
            vwSignalTravel 2.8s ease-in-out infinite;
        }


        .vw-bridge-signal-dot {
          width: 7px;
          height: 7px;

          flex-shrink: 0;

          border-radius: 50%;

          background: var(--color-forest);

          box-shadow:
            0 0 0 5px rgba(53,74,54,.08),
            0 0 14px rgba(53,74,54,.18);
        }


        .vw-bridge-signal-dot-bottom {
          animation:
            vwBridgeDotPulse 2.8s ease-in-out infinite;
        }


        /* =====================================================
           BRIDGE LABEL
        ===================================================== */

        .vw-bridge-text {
          position: absolute;

          left: 50%;
          bottom: 4px;

          transform: translateX(-50%);

          padding: 5px 9px;

          background: rgba(255,255,255,.68);

          border: 1px solid rgba(221,216,206,.7);

          border-radius: var(--radius-pill);

          backdrop-filter: blur(8px);

          -webkit-backdrop-filter: blur(8px);

          opacity: .72;
        }


        .vw-bridge-text span {
          color: var(--color-text-light) !important;

          font-family: var(--font-sans);

          font-size: .47rem;

          font-weight: 800;

          letter-spacing: .12em;

          white-space: nowrap;
        }


        /* =====================================================
           ANIMATIONS
        ===================================================== */

        @keyframes vwBridgeGlow {

          0%,
          100% {
            transform:
              translateX(-50%)
              scale(1);

            opacity: .55;
          }

          50% {
            transform:
              translateX(-50%)
              scale(1.12);

            opacity: .9;
          }

        }


        @keyframes vwSignalTravel {

          0% {
            top: -18px;
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          75% {
            opacity: 1;
          }

          100% {
            top: 62px;
            opacity: 0;
          }

        }


        @keyframes vwBridgeDotPulse {

          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 0 0 5px rgba(53,74,54,.08),
              0 0 14px rgba(53,74,54,.18);
          }

          50% {
            transform: scale(1.18);
            box-shadow:
              0 0 0 8px rgba(53,74,54,.05),
              0 0 20px rgba(53,74,54,.25);
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767.98px) {

          .vw-hero-stats-bridge {
            height: 110px;
          }


          .vw-hero-stats-bridge::before {
            height: 110px;
          }


          .vw-bridge-signal {
            height: 72px;
            bottom: 12px;
          }


          .vw-bridge-signal-line {
            height: 46px;
          }


          .vw-bridge-glow {
            width: 320px;
            height: 190px;

            bottom: -95px;
          }


          .vw-bridge-text {
            display: none;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .vw-bridge-glow,
          .vw-bridge-signal-line::after,
          .vw-bridge-signal-dot-bottom {
            animation: none !important;
          }

        }

      `}</style>
    </div>
  );
}

export default Home;