import { useEffect, useRef, useState } from "react";

import {
  FaIdCard,
  FaShieldAlt,
  FaRupeeSign,
  FaStar,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaIdCard size={21} />,
      iconClass: "vw-feature-icon-sage",
      title: "Digital Identity",
      description:
        "Create a verifiable work profile with skills and experience.",
    },
    {
      icon: <FaShieldAlt size={21} />,
      iconClass: "vw-feature-icon-sage",
      title: "Secure Verification",
      description:
        "Employer verification and trusted records on blockchain.",
    },
    {
      icon: <FaRupeeSign size={21} />,
      iconClass: "vw-feature-icon-sage",
      title: "Payment Tracking",
      description:
        "UPI payments recorded securely with full transparency.",
    },
    {
      icon: <FaStar size={21} />,
      iconClass: "vw-feature-icon-ochre",
      title: "Ratings & Reviews",
      description:
        "Build trust through genuine employer ratings.",
    },
  ];

  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

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
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className={`vw-features-section ${isVisible ? "vw-features-visible" : ""
        }`}
    >

      {/* =====================================================
          SECTION TRANSITION
      ===================================================== */}

      <div className="vw-features-transition">

        <div className="vw-features-transition-glow" />

        <div className="vw-features-transition-line">
          <span />
        </div>

      </div>


      <div className="container">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="vw-features-header">

          <div className="vw-features-eyebrow">
            <span className="vw-features-eyebrow-line" />

            <span>
              Built for Trust
            </span>

            <span className="vw-features-eyebrow-line vw-eyebrow-line-right" />
          </div>


          <h2 className="vw-features-title">
            Why <span>VeriWork?</span>
          </h2>


          <p className="vw-features-subtitle">
            Simple solutions for real problems
          </p>

        </div>


        {/* =====================================================
            FEATURE CARDS
        ===================================================== */}

        <div className="vw-features-grid">

          {features.map((feature, index) => (
            <div
              className="vw-feature-card"
              key={index}
              style={{
                "--feature-delay": `${index * 120}ms`,
              }}
            >

              {/* Top accent */}

              <div
                className={`vw-feature-accent ${index === 3
                    ? "vw-feature-accent-ochre"
                    : ""
                  }`}
              />


              {/* Icon */}

              <div className="vw-feature-icon-wrapper">

                <div className={feature.iconClass}>
                  {feature.icon}
                </div>

              </div>


              {/* Card Number */}

              <span className="vw-feature-number">
                0{index + 1}
              </span>


              {/* Title */}

              <h3 className="vw-feature-title">
                {feature.title}
              </h3>


              {/* Description */}

              <p className="vw-feature-description">
                {feature.description}
              </p>


              {/* Bottom detail */}

              <div className="vw-feature-bottom">
                <span className="vw-feature-bottom-line" />
                <span className="vw-feature-bottom-dot" />
              </div>

            </div>
          ))}

        </div>

      </div>


      <style>{`

        /* =====================================================
           FEATURES SECTION
        ===================================================== */

        .vw-features-section {
          position: relative;

          width: 100%;

          padding-top: 76px;
          padding-bottom: 86px;

          background: var(--color-bg);

          overflow: hidden;
        }


        /* =====================================================
           STATS → FEATURES TRANSITION
        ===================================================== */

        .vw-features-transition {
          position: absolute;

          top: -80px;
          left: 0;
          right: 0;

          height: 130px;

          pointer-events: none;

          overflow: hidden;

          z-index: 0;
        }


        .vw-features-transition-glow {
          position: absolute;

          left: 50%;
          top: 30px;

          width: 620px;
          height: 130px;

          transform:
            translateX(-50%)
            scale(.82);

          border-radius: 50%;

          background:
            radial-gradient(
              ellipse,
              rgba(53, 74, 54, .075) 0%,
              rgba(53, 74, 54, .025) 42%,
              transparent 72%
            );

          filter: blur(14px);

          opacity: 0;

          transition:
            opacity 1.2s ease,
            transform 1.2s cubic-bezier(.22, 1, .36, 1);
        }


        .vw-features-visible
        .vw-features-transition-glow {
          opacity: 1;

          transform:
            translateX(-50%)
            scale(1);
        }


        .vw-features-transition-line {
          position: absolute;

          left: 50%;
          top: 25px;

          width: 1px;
          height: 55px;

          transform:
            translateX(-50%)
            scaleY(0);

          transform-origin: top;

          background:
            linear-gradient(
              to bottom,
              rgba(53, 74, 54, 0),
              rgba(53, 74, 54, .3),
              rgba(53, 74, 54, 0)
            );

          opacity: 0;

          transition:
            transform .8s cubic-bezier(.22, 1, .36, 1) .2s,
            opacity .6s ease .2s;
        }


        .vw-features-visible
        .vw-features-transition-line {
          opacity: 1;

          transform:
            translateX(-50%)
            scaleY(1);
        }


        .vw-features-transition-line span {
          position: absolute;

          left: 50%;
          bottom: 0;

          width: 6px;
          height: 6px;

          transform:
            translateX(-50%)
            scale(.5);

          border-radius: 50%;

          background: var(--color-forest);

          box-shadow:
            0 0 0 6px rgba(53, 74, 54, .06),
            0 0 15px rgba(53, 74, 54, .18);

          transition:
            transform .5s ease .8s;
        }


        .vw-features-visible
        .vw-features-transition-line span {
          transform:
            translateX(-50%)
            scale(1);
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .vw-features-header {
          position: relative;

          z-index: 2;

          max-width: 650px;

          margin: 0 auto 46px;

          text-align: center;

          opacity: 0;

          transform:
            translateY(35px);

          filter: blur(4px);

          transition:
            opacity .75s cubic-bezier(.22, 1, .36, 1),
            transform .8s cubic-bezier(.22, 1, .36, 1),
            filter .8s ease;
        }


        .vw-features-visible
        .vw-features-header {
          opacity: 1;

          transform:
            translateY(0);

          filter: blur(0);
        }


        /* =====================================================
           EYEBROW
        ===================================================== */

        .vw-features-eyebrow {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          margin-bottom: 15px;

          color: var(--color-forest) !important;

          font-family: var(--font-sans);

          font-size: .69rem;

          font-weight: 800;

          letter-spacing: .11em;

          text-transform: uppercase;
        }


        .vw-features-eyebrow-line {
          display: block;

          width: 22px;
          height: 2px;

          background: var(--color-ochre);

          border-radius: 999px;

          transform:
            scaleX(0);

          transform-origin: right;

          transition:
            transform .65s cubic-bezier(.22, 1, .36, 1) .35s;
        }


        .vw-eyebrow-line-right {
          transform-origin: left;
        }


        .vw-features-visible
        .vw-features-eyebrow-line {
          transform:
            scaleX(1);
        }


        .vw-features-eyebrow span {
          color: var(--color-forest) !important;
        }


        /* =====================================================
           TITLE
        ===================================================== */

        .vw-features-title {
          margin: 0 0 10px;

          color: var(--color-text) !important;

          font-family: var(--font-serif);

          font-size:
            clamp(2.45rem, 4vw, 3.45rem);

          font-weight: 700;

          line-height: 1.05;

          letter-spacing: -.035em;
        }


        .vw-features-title span {
          color: var(--color-forest) !important;

          position: relative;
        }


        /*
          Small highlight that sweeps beneath
          "VeriWork?"
        */

        .vw-features-title span::after {
          content: "";

          position: absolute;

          left: 0;
          right: 0;

          bottom: -4px;

          height: 3px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              var(--color-forest),
              rgba(53, 74, 54, .12)
            );

          transform:
            scaleX(0);

          transform-origin: left;

          transition:
            transform .7s cubic-bezier(.22, 1, .36, 1) .65s;
        }


        .vw-features-visible
        .vw-features-title span::after {
          transform:
            scaleX(1);
        }


        /* =====================================================
           SUBTITLE
        ===================================================== */

        .vw-features-subtitle {
          margin: 0;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: .92rem;

          font-weight: 400;

          line-height: 1.6;
        }


        /* =====================================================
           FEATURE GRID
        ===================================================== */

        .vw-features-grid {
          position: relative;

          z-index: 2;

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 17px;
        }


        /* =====================================================
           FEATURE CARD
        ===================================================== */

        .vw-feature-card {
          position: relative;

          min-height: 285px;

          display: flex;

          flex-direction: column;

          padding: 27px 25px 22px;

          overflow: hidden;

          background:
            rgba(255, 255, 255, .63);

          border:
            1px solid rgba(43, 38, 37, .075);

          border-radius: 20px;

          box-shadow:
            0 7px 25px rgba(43, 38, 37, .035);

          /*
            Scroll entrance.
          */

          opacity: 0;

          transform:
            translateY(55px)
            scale(.965);

          filter: blur(5px);

          transition:
            opacity .72s cubic-bezier(.22, 1, .36, 1)
              var(--feature-delay),
            transform .82s cubic-bezier(.22, 1, .36, 1)
              var(--feature-delay),
            filter .75s ease
              var(--feature-delay),
            box-shadow .28s ease,
            border-color .28s ease,
            background-color .28s ease;
        }


        .vw-features-visible
        .vw-feature-card {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);

          filter: blur(0);
        }


        /* =====================================================
           CARD HOVER
        ===================================================== */

        .vw-feature-card:hover {
          transform:
            translateY(-7px)
            scale(1.008);

          background:
            rgba(255, 255, 255, .9);

          border-color:
            rgba(53, 74, 54, .14);

          box-shadow:
            0 20px 42px rgba(43, 38, 37, .09);
        }


        /* =====================================================
           TOP ACCENT
        ===================================================== */

        .vw-feature-accent {
          position: absolute;

          top: 0;
          left: 25px;

          width: 34px;
          height: 3px;

          background: var(--color-forest);

          border-radius:
            0 0 999px 999px;

          transform:
            scaleX(0);

          transform-origin: left;

          transition:
            transform .55s cubic-bezier(.22, 1, .36, 1)
              calc(var(--feature-delay) + 250ms);
        }


        .vw-features-visible
        .vw-feature-accent {
          transform:
            scaleX(1);
        }


        .vw-feature-accent-ochre {
          background: var(--color-ochre);
        }


        /* =====================================================
           ICON
        ===================================================== */

        .vw-feature-icon-wrapper {
          margin-bottom: 23px;

          opacity: 0;

          transform:
            translateY(15px)
            scale(.82)
            rotate(-5deg);

          transition:
            opacity .55s ease
              calc(var(--feature-delay) + 230ms),
            transform .65s cubic-bezier(.22, 1, .36, 1)
              calc(var(--feature-delay) + 230ms);
        }


        .vw-features-visible
        .vw-feature-icon-wrapper {
          opacity: 1;

          transform:
            translateY(0)
            scale(1)
            rotate(0);
        }


        .vw-feature-icon-sage,
        .vw-feature-icon-ochre {
          width: 49px;
          height: 49px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 15px;

          transition:
            transform .28s ease,
            box-shadow .28s ease;
        }


        .vw-feature-icon-sage {
          color: var(--color-forest) !important;

          background:
            var(--color-forest-light);
        }


        .vw-feature-icon-ochre {
          color: var(--color-ochre) !important;

          background:
            var(--color-ochre-light);
        }


        .vw-feature-card:hover
        .vw-feature-icon-sage,

        .vw-feature-card:hover
        .vw-feature-icon-ochre {
          transform:
            translateY(-3px)
            rotate(-3deg)
            scale(1.04);

          box-shadow:
            0 8px 18px rgba(53, 74, 54, .08);
        }


        .vw-feature-icon-sage svg,
        .vw-feature-icon-ochre svg {
          color: inherit !important;
        }


        /* =====================================================
           NUMBER
        ===================================================== */

        .vw-feature-number {
          position: absolute;

          top: 24px;
          right: 23px;

          color:
            rgba(53, 74, 54, .17) !important;

          font-family: var(--font-serif);

          font-size: .78rem;

          font-weight: 700;

          letter-spacing: .04em;

          opacity: 0;

          transform:
            translateY(-8px);

          transition:
            opacity .5s ease
              calc(var(--feature-delay) + 320ms),
            transform .55s ease
              calc(var(--feature-delay) + 320ms);
        }


        .vw-features-visible
        .vw-feature-number {
          opacity: 1;

          transform:
            translateY(0);
        }


        /* =====================================================
           TITLE
        ===================================================== */

        .vw-feature-title {
          margin: 0 0 10px;

          color: var(--color-text) !important;

          font-family: var(--font-sans);

          font-size: 1rem;

          font-weight: 750;

          line-height: 1.3;

          letter-spacing: -.01em;

          opacity: 0;

          transform:
            translateY(12px);

          transition:
            opacity .55s ease
              calc(var(--feature-delay) + 320ms),
            transform .55s cubic-bezier(.22, 1, .36, 1)
              calc(var(--feature-delay) + 320ms);
        }


        .vw-features-visible
        .vw-feature-title {
          opacity: 1;

          transform:
            translateY(0);
        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .vw-feature-description {
          max-width: 245px;

          margin: 0;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: .76rem;

          font-weight: 400;

          line-height: 1.65;

          opacity: 0;

          transform:
            translateY(10px);

          transition:
            opacity .55s ease
              calc(var(--feature-delay) + 390ms),
            transform .55s cubic-bezier(.22, 1, .36, 1)
              calc(var(--feature-delay) + 390ms);
        }


        .vw-features-visible
        .vw-feature-description {
          opacity: 1;

          transform:
            translateY(0);
        }


        /* =====================================================
           BOTTOM DETAIL
        ===================================================== */

        .vw-feature-bottom {
          display: flex;

          align-items: center;

          gap: 5px;

          margin-top: auto;

          padding-top: 22px;

          opacity: 0;

          transform:
            translateX(-8px);

          transition:
            opacity .5s ease
              calc(var(--feature-delay) + 480ms),
            transform .5s ease
              calc(var(--feature-delay) + 480ms);
        }


        .vw-features-visible
        .vw-feature-bottom {
          opacity: 1;

          transform:
            translateX(0);
        }


        .vw-feature-bottom-line {
          width: 24px;
          height: 1px;

          background:
            rgba(53, 74, 54, .22);

          transition:
            width .28s ease;
        }


        .vw-feature-card:hover
        .vw-feature-bottom-line {
          width: 38px;
        }


        .vw-feature-bottom-dot {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: var(--color-ochre);
        }


        /* =====================================================
           LARGE TABLET
        ===================================================== */

        @media (max-width: 1199px) {

          .vw-features-section {
            padding-top: 65px;
            padding-bottom: 72px;
          }


          .vw-features-grid {
            gap: 13px;
          }


          .vw-feature-card {
            padding-left: 21px;
            padding-right: 21px;
          }


          .vw-feature-accent {
            left: 21px;
          }


          .vw-feature-number {
            right: 19px;
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 991.98px) {

          .vw-features-section {
            padding-top: 60px;
            padding-bottom: 68px;
          }


          .vw-features-header {
            margin-bottom: 35px;
          }


          .vw-features-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 16px;
          }


          .vw-feature-card {
            min-height: 255px;
          }


          .vw-feature-description {
            max-width: 310px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767.98px) {

          .vw-features-section {
            padding-top: 52px;
            padding-bottom: 58px;
          }


          .vw-features-header {
            margin-bottom: 29px;

            padding: 0 10px;
          }


          .vw-features-eyebrow {
            margin-bottom: 12px;

            font-size: .62rem;
          }


          .vw-features-eyebrow-line {
            width: 16px;
          }


          .vw-features-title {
            font-size: 2.5rem;
          }


          .vw-features-subtitle {
            font-size: .82rem;
          }


          .vw-features-grid {
            grid-template-columns: 1fr;

            gap: 12px;
          }


          .vw-feature-card {
            min-height: 0;

            padding: 23px 21px 20px;
          }


          .vw-feature-accent {
            left: 21px;
          }


          .vw-feature-number {
            top: 22px;
            right: 21px;
          }


          .vw-feature-icon-wrapper {
            margin-bottom: 18px;
          }


          .vw-feature-icon-sage,
          .vw-feature-icon-ochre {
            width: 45px;
            height: 45px;

            border-radius: 13px;
          }


          .vw-feature-title {
            font-size: .94rem;
          }


          .vw-feature-description {
            max-width: none;

            font-size: .73rem;
          }


          .vw-feature-bottom {
            padding-top: 17px;
          }


          .vw-features-transition-glow {
            width: 360px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 420px) {

          .vw-features-section {
            padding-top: 46px;
            padding-bottom: 52px;
          }


          .vw-features-title {
            font-size: 2.25rem;
          }


          .vw-feature-card {
            padding: 21px 18px 18px;
          }


          .vw-feature-accent {
            left: 18px;
          }


          .vw-feature-number {
            right: 18px;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .vw-features-transition-glow,
          .vw-features-transition-line,
          .vw-features-transition-line span,
          .vw-features-header,
          .vw-feature-card,
          .vw-feature-accent,
          .vw-feature-icon-wrapper,
          .vw-feature-number,
          .vw-feature-title,
          .vw-feature-description,
          .vw-feature-bottom {
            animation: none !important;

            transition: none !important;

            filter: none !important;
          }


          .vw-features-header,
          .vw-feature-card,
          .vw-feature-icon-wrapper,
          .vw-feature-number,
          .vw-feature-title,
          .vw-feature-description,
          .vw-feature-bottom {
            opacity: 1 !important;

            transform: none !important;
          }


          .vw-feature-accent {
            transform: scaleX(1) !important;
          }


          .vw-features-transition-line {
            opacity: 1 !important;

            transform:
              translateX(-50%)
              scaleY(1) !important;
          }


          .vw-features-transition-line span {
            transform:
              translateX(-50%)
              scale(1) !important;
          }

        }

      `}</style>
    </section>
  );
}

export default Features;