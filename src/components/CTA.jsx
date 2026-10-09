import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShieldAlt } from "react-icons/fa";

function CTA() {
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
      className={`vw-cta-section-wrapper ${isVisible ? "vw-cta-visible" : ""
        }`}
    >
      {/* =========================================
          TRANSITION FROM HOW IT WORKS
      ========================================= */}

      <div className="vw-cta-transition">
        <div className="vw-cta-transition-line"></div>
        <div className="vw-cta-transition-glow"></div>
      </div>

      <div className="container py-5 my-2">
        <div className="vw-cta-section position-relative overflow-hidden">

          {/* =========================================
              DECORATIVE BACKGROUND ELEMENTS
          ========================================= */}

          <div className="vw-cta-bg-glow vw-cta-bg-glow-one"></div>
          <div className="vw-cta-bg-glow vw-cta-bg-glow-two"></div>

          <div className="vw-cta-orbit vw-cta-orbit-one"></div>
          <div className="vw-cta-orbit vw-cta-orbit-two"></div>

          <div className="vw-cta-dot-pattern">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Soft inner highlight */}
          <div className="vw-cta-inner-highlight"></div>

          <div
            className="row align-items-center position-relative"
            style={{ zIndex: 2 }}
          >
            {/* =========================================
                CONTENT
            ========================================= */}

            <div className="col-lg-8">
              <div className="vw-cta-content">

                {/* Eyebrow */}
                <div className="vw-cta-eyebrow">
                  <span className="vw-cta-dot"></span>

                  <span>BUILD TRUST. CREATE OPPORTUNITY.</span>
                </div>

                {/* Title */}
                <h2 className="vw-cta-title">
                  Empowering Domestic Workers
                  <br />
                  <span>Through Trust and Technology</span>
                </h2>

                {/* Description */}
                <p className="vw-cta-description">
                  Create a trusted digital identity and take
                  the next step toward a more secure and
                  transparent working relationship.
                </p>
              </div>
            </div>

            {/* =========================================
                CTA BUTTON
            ========================================= */}

            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="d-flex justify-content-lg-end">
                <Link
                  to="/get-started"
                  className="vw-cta-button"
                >
                  <span>Get Started Today</span>

                  <span className="vw-cta-arrow">
                    <FaArrowRight size={13} />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* =========================================
              TRUST FOOTER
          ========================================= */}

          <div className="vw-cta-trust">
            <FaShieldAlt />

            <span>Secure identity</span>

            <i></i>

            <span>Verified records</span>

            <i></i>

            <span>Transparent work history</span>
          </div>

          {/* =========================================
              BOTTOM ACCENT
          ========================================= */}

          <div className="vw-cta-bottom-accent"></div>
        </div>
      </div>

      <style>{`
        /* =========================================
           CTA WRAPPER
        ========================================= */

        .vw-cta-section-wrapper {
          position: relative;
          background: var(--color-bg);
          overflow: hidden;
        }


        /* =========================================
           TRANSITION FROM HOW IT WORKS
        ========================================= */

        .vw-cta-transition {
          position: relative;
          width: 100%;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .vw-cta-transition-line {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1px;
          height: 0;
          transform: translate(-50%, -50%);
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(53, 74, 54, 0.28),
            transparent
          );
          transition: height 1s ease;
        }

        .vw-cta-transition-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 180px;
          height: 70px;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            ellipse,
            rgba(53, 74, 54, 0.09),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 1.2s ease;
        }

        .vw-cta-visible .vw-cta-transition-line {
          height: 70px;
        }

        .vw-cta-visible .vw-cta-transition-glow {
          opacity: 1;
        }


        /* =========================================
           MAIN CTA
        ========================================= */

        .vw-cta-section {
          position: relative;
          min-height: 340px;
          padding: 60px 64px 82px;

          overflow: hidden;

          border-radius: 32px;

          background:
            radial-gradient(
              circle at 85% 18%,
              rgba(201, 138, 65, 0.20),
              transparent 28%
            ),
            radial-gradient(
              circle at 8% 105%,
              rgba(255, 255, 255, 0.055),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #304635 0%,
              var(--color-forest, #354A36) 52%,
              #263A2B 100%
            );

          box-shadow:
            0 24px 55px rgba(43, 38, 37, 0.14);

          isolation: isolate;

          opacity: 0;
          transform: translateY(35px) scale(0.985);
          filter: blur(4px);

          transition:
            opacity 0.8s ease,
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.8s ease;
        }

        .vw-cta-visible .vw-cta-section {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }


        /* =========================================
           INNER HIGHLIGHT
        ========================================= */

        .vw-cta-inner-highlight {
          position: absolute;
          inset: 1px;
          border-radius: 31px;

          border: 1px solid rgba(255, 255, 255, 0.075);

          pointer-events: none;
          z-index: 1;
        }


        /* =========================================
           DECORATIVE GLOWS
        ========================================= */

        .vw-cta-bg-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .vw-cta-bg-glow-one {
          width: 300px;
          height: 300px;

          right: -130px;
          top: -150px;

          border: 1px solid rgba(255, 255, 255, 0.09);

          box-shadow:
            0 0 80px rgba(201, 138, 65, 0.05);

          animation: vwCtaFloat 8s ease-in-out infinite;
        }

        .vw-cta-bg-glow-two {
          width: 210px;
          height: 210px;

          right: 110px;
          bottom: -145px;

          background:
            radial-gradient(
              circle,
              rgba(201, 138, 65, 0.10),
              transparent 68%
            );

          animation: vwCtaFloatReverse 10s ease-in-out infinite;
        }


        /* =========================================
           ORBITS
        ========================================= */

        .vw-cta-orbit {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .vw-cta-orbit-one {
          width: 145px;
          height: 145px;

          right: 40px;
          top: 85px;

          border: 1px solid rgba(255, 255, 255, 0.055);

          animation: vwCtaRotate 18s linear infinite;
        }

        .vw-cta-orbit-two {
          width: 95px;
          height: 95px;

          right: 65px;
          top: 110px;

          border: 1px dashed rgba(201, 138, 65, 0.13);

          animation: vwCtaRotateReverse 14s linear infinite;
        }


        /* =========================================
           DOT PATTERN
        ========================================= */

        .vw-cta-dot-pattern {
          position: absolute;

          left: 43%;
          bottom: 32px;

          display: grid;
          grid-template-columns: repeat(2, 5px);
          gap: 7px;

          opacity: 0.5;

          z-index: 0;
          pointer-events: none;
        }

        .vw-cta-dot-pattern span {
          display: block;

          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: rgba(255, 255, 255, 0.25);
        }


        /* =========================================
           CONTENT
        ========================================= */

        .vw-cta-content {
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 0.7s ease 0.2s,
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
        }

        .vw-cta-visible .vw-cta-content {
          opacity: 1;
          transform: translateY(0);
        }


        /* =========================================
           EYEBROW
        ========================================= */

        .vw-cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;

          margin-bottom: 15px;

          color: rgba(255, 255, 255, 0.68) !important;

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;

          opacity: 0;
          transform: translateX(-12px);

          transition:
            opacity 0.6s ease 0.35s,
            transform 0.6s ease 0.35s;
        }

        .vw-cta-visible .vw-cta-eyebrow {
          opacity: 1;
          transform: translateX(0);
        }

        .vw-cta-eyebrow > span:last-child {
          color: rgba(255, 255, 255, 0.68) !important;
        }

        .vw-cta-dot {
          width: 7px;
          height: 7px;

          flex: 0 0 7px;

          border-radius: 50%;

          background: var(--color-ochre, #C98A41);

          box-shadow:
            0 0 0 4px rgba(201, 138, 65, 0.12),
            0 0 16px rgba(201, 138, 65, 0.20);
        }


        /* =========================================
           TITLE
        ========================================= */

        .vw-cta-title {
          max-width: 760px;

          margin: 0;

          color: #FFFFFF !important;

          font-family:
            var(
              --font-serif,
              Georgia,
              serif
            );

          font-size: clamp(2rem, 3.5vw, 3.15rem);

          font-weight: 500;

          line-height: 1.08;

          letter-spacing: -0.04em;

          opacity: 0;
          transform: translateY(20px);

          transition:
            opacity 0.75s ease 0.42s,
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.42s;
        }

        .vw-cta-visible .vw-cta-title {
          opacity: 1;
          transform: translateY(0);
        }

        .vw-cta-title span {
          color: var(--color-ochre, #C98A41) !important;
          font-style: italic;
        }


        /* =========================================
           DESCRIPTION
        ========================================= */

        .vw-cta-description {
          max-width: 650px;

          margin: 19px 0 0;

          color: rgba(255, 255, 255, 0.72) !important;

          font-size: 0.96rem;

          line-height: 1.7;

          opacity: 0;
          transform: translateY(15px);

          transition:
            opacity 0.65s ease 0.55s,
            transform 0.7s ease 0.55s;
        }

        .vw-cta-visible .vw-cta-description {
          opacity: 1;
          transform: translateY(0);
        }


        /* =========================================
           BUTTON AREA
        ========================================= */

        .vw-cta-section .col-lg-4 > div {
          opacity: 0;
          transform: translateX(25px);

          transition:
            opacity 0.7s ease 0.55s,
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.55s;
        }

        .vw-cta-visible .col-lg-4 > div {
          opacity: 1;
          transform: translateX(0);
        }


        /* =========================================
           BUTTON
        ========================================= */

        .vw-cta-button {
          position: relative;

          display: inline-flex;
          align-items: center;

          gap: 12px;

          min-height: 54px;

          padding:
            8px
            9px
            8px
            22px;

          border-radius: 999px;

          background: var(--color-ochre, #C98A41);

          color: #FFFFFF !important;

          text-decoration: none;

          font-size: 0.88rem;
          font-weight: 800;

          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.16);

          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease,
            background 0.28s ease;
        }

        .vw-cta-button::before {
          content: "";

          position: absolute;
          inset: 0;

          border-radius: inherit;

          background:
            linear-gradient(
              110deg,
              transparent 25%,
              rgba(255,255,255,0.18) 50%,
              transparent 75%
            );

          transform: translateX(-120%);

          transition: transform 0.7s ease;

          pointer-events: none;
        }

        .vw-cta-button:hover::before {
          transform: translateX(120%);
        }

        .vw-cta-button span {
          color: #FFFFFF !important;
        }

        .vw-cta-button:hover {
          transform: translateY(-4px);

          background: #C89445;

          color: #FFFFFF !important;

          box-shadow:
            0 18px 35px rgba(0, 0, 0, 0.22);
        }

        .vw-cta-button:hover span {
          color: #FFFFFF !important;
        }


        /* =========================================
           ARROW CIRCLE
        ========================================= */

        .vw-cta-arrow {
          width: 36px;
          height: 36px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          flex: 0 0 36px;

          border-radius: 50%;

          background: rgba(255, 255, 255, 0.18);

          color: #FFFFFF !important;

          transition:
            transform 0.28s ease,
            background 0.28s ease;
        }

        .vw-cta-arrow svg {
          color: #FFFFFF !important;
        }

        .vw-cta-button:hover .vw-cta-arrow {
          transform: translateX(3px);

          background: rgba(255, 255, 255, 0.24);
        }


        /* =========================================
           TRUST FOOTER
        ========================================= */

        .vw-cta-trust {
          position: absolute;

          left: 64px;
          bottom: 24px;

          display: flex;
          align-items: center;

          gap: 9px;

          color: rgba(255, 255, 255, 0.53) !important;

          font-size: 0.62rem;
          font-weight: 700;

          opacity: 0;
          transform: translateY(10px);

          transition:
            opacity 0.65s ease 0.7s,
            transform 0.65s ease 0.7s;
        }

        .vw-cta-visible .vw-cta-trust {
          opacity: 1;
          transform: translateY(0);
        }

        .vw-cta-trust svg {
          color: rgba(201, 138, 65, 0.9) !important;
          font-size: 11px;
        }

        .vw-cta-trust span {
          color: rgba(255, 255, 255, 0.53) !important;
        }

        .vw-cta-trust i {
          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: rgba(255, 255, 255, 0.28);
        }


        /* =========================================
           BOTTOM ACCENT
        ========================================= */

        .vw-cta-bottom-accent {
          position: absolute;

          left: 64px;
          right: 64px;
          bottom: 0;

          height: 2px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(201, 138, 65, 0.55),
              transparent
            );

          transform: scaleX(0);

          transform-origin: center;

          transition:
            transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.75s;
        }

        .vw-cta-visible .vw-cta-bottom-accent {
          transform: scaleX(1);
        }


        /* =========================================
           ANIMATIONS
        ========================================= */

        @keyframes vwCtaFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(10px);
          }
        }

        @keyframes vwCtaFloatReverse {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes vwCtaRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vwCtaRotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }


        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 991px) {
          .vw-cta-section {
            padding: 48px 42px 78px;
          }

          .vw-cta-title {
            font-size: clamp(2rem, 5vw, 2.7rem);
          }

          .vw-cta-trust {
            left: 42px;
          }

          .vw-cta-bottom-accent {
            left: 42px;
            right: 42px;
          }
        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 767px) {
          .vw-cta-transition {
            height: 50px;
          }

          .vw-cta-transition-line {
            height: 50px;
          }

          .vw-cta-section {
            min-height: 380px;

            padding:
              40px
              26px
              82px;

            border-radius: 26px;
          }

          .vw-cta-title {
            font-size: 2rem;
            line-height: 1.12;
          }

          .vw-cta-description {
            font-size: 0.9rem;
          }

          .vw-cta-section .col-lg-4 {
            margin-top: 28px !important;
          }

          .vw-cta-section .col-lg-4 > div {
            transform: translateY(18px);
          }

          .vw-cta-visible .col-lg-4 > div {
            transform: translateY(0);
          }

          .vw-cta-button {
            width: 100%;
            justify-content: space-between;
          }

          .vw-cta-bg-glow-one {
            right: -140px;
          }

          .vw-cta-orbit-one,
          .vw-cta-orbit-two {
            opacity: 0.5;
          }

          .vw-cta-dot-pattern {
            display: none;
          }

          .vw-cta-trust {
            left: 26px;
            right: 26px;

            bottom: 22px;

            flex-wrap: wrap;

            gap: 7px;
          }

          .vw-cta-bottom-accent {
            left: 26px;
            right: 26px;
          }
        }


        /* =========================================
           SMALL MOBILE
        ========================================= */

        @media (max-width: 575px) {
          .vw-cta-section {
            min-height: 395px;

            padding:
              34px
              22px
              84px;
          }

          .vw-cta-title {
            font-size: 1.75rem;
          }

          .vw-cta-description {
            max-width: 100%;
          }

          .vw-cta-trust {
            left: 22px;
            right: 22px;
          }

          .vw-cta-bottom-accent {
            left: 22px;
            right: 22px;
          }
        }


        /* =========================================
           REDUCED MOTION
        ========================================= */

        @media (prefers-reduced-motion: reduce) {
          .vw-cta-section,
          .vw-cta-content,
          .vw-cta-eyebrow,
          .vw-cta-title,
          .vw-cta-description,
          .vw-cta-section .col-lg-4 > div,
          .vw-cta-trust,
          .vw-cta-bottom-accent,
          .vw-cta-transition-line,
          .vw-cta-transition-glow {
            transition: none !important;
          }

          .vw-cta-bg-glow-one,
          .vw-cta-bg-glow-two,
          .vw-cta-orbit-one,
          .vw-cta-orbit-two {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default CTA;