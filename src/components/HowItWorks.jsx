import { useEffect, useRef, useState } from "react";

import {
  FaHome,
  FaShieldAlt,
  FaUserTie,
  FaReceipt,
  FaStar,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <FaHome size={18} />,
      title: "Worker Registers",
      desc: "Create a digital profile with skills and experience.",
    },
    {
      step: "02",
      icon: <FaShieldAlt size={18} />,
      title: "Identity is Verified",
      desc: "Verification by employers and secure blockchain storage.",
    },
    {
      step: "03",
      icon: <FaUserTie size={18} />,
      title: "Employer Hires",
      desc: "Connect with verified workers.",
    },
    {
      step: "04",
      icon: <FaReceipt size={18} />,
      title: "Payments Recorded",
      desc: "UPI payments automatically update work history.",
    },
    {
      step: "05",
      icon: <FaStar size={18} />,
      title: "Build Reputation",
      desc: "Collect ratings and build a trusted profile.",
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
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className={`vw-how-section ${isVisible ? "vw-how-visible" : ""
        }`}
    >
      {/* =====================================================
          FEATURES → HOW IT WORKS TRANSITION
      ===================================================== */}

      <div className="vw-how-transition">

        <div className="vw-how-transition-glow" />

        <div className="vw-how-transition-line">
          <span />
        </div>

      </div>


      <div className="container">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="vw-how-header">

          <div className="vw-how-eyebrow">

            <span className="vw-how-eyebrow-line" />

            <span>
              The VeriWork Journey
            </span>

          </div>


          <h2 className="vw-how-title">
            How <span>It Works</span>
          </h2>


          <p className="vw-how-subtitle">
            A simple and transparent process for everyone
          </p>

        </div>


        {/* =====================================================
            DESKTOP JOURNEY
        ===================================================== */}

        <div className="vw-steps-wrapper">

          {/* Base line */}

          <div className="vw-steps-line" />

          {/* Animated progress */}

          <div className="vw-steps-progress">

            <span className="vw-progress-orb" />

          </div>


          <div className="vw-steps-grid">

            {steps.map((item, index) => (
              <div
                key={index}
                className="vw-step-item"
                style={{
                  "--step-delay": `${index * 150}ms`,
                }}
              >

                {/* Step number */}

                <div className="vw-step-number">
                  {item.step}
                </div>


                {/* Icon */}

                <div className="vw-step-icon">

                  <span className="vw-step-icon-inner">
                    {item.icon}
                  </span>

                  <span className="vw-step-active-ring" />

                </div>


                {/* Completed indicator */}

                <div className="vw-step-complete">
                  <FaCheck size={7} />
                </div>


                {/* Content */}

                <div className="vw-step-content">

                  <h3 className="vw-step-title">
                    {item.title}
                  </h3>

                  <p className="vw-step-description">
                    {item.desc}
                  </p>

                </div>


                {/* Connecting arrow */}

                {index < steps.length - 1 && (
                  <div className="vw-step-arrow">

                    <FaArrowRight size={11} />

                  </div>
                )}

              </div>
            ))}

          </div>

        </div>


        {/* =====================================================
            MOBILE JOURNEY
        ===================================================== */}

        <div className="vw-mobile-steps">

          <div className="vw-mobile-progress-line" />

          {steps.map((item, index) => (
            <div
              key={index}
              className="vw-mobile-step"
              style={{
                "--step-delay": `${index * 150}ms`,
              }}
            >

              {/* Timeline */}

              <div className="vw-mobile-timeline">

                <div className="vw-mobile-icon">

                  <span>
                    {item.icon}
                  </span>

                </div>

                <div className="vw-mobile-step-complete">
                  <FaCheck size={6} />
                </div>

                {index < steps.length - 1 && (
                  <div className="vw-mobile-line" />
                )}

              </div>


              {/* Content */}

              <div className="vw-mobile-step-content">

                <div className="vw-mobile-step-number">
                  STEP {item.step}
                </div>

                <h3 className="vw-mobile-step-title">
                  {item.title}
                </h3>

                <p className="vw-mobile-step-description">
                  {item.desc}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>


      <style>{`

        /* =====================================================
           MAIN SECTION
        ===================================================== */

        .vw-how-section {
          position: relative;

          width: 100%;

          padding-top: 84px;
          padding-bottom: 96px;

          background: var(--color-bg);

          overflow: hidden;
        }


        /* =====================================================
           FEATURES → HOW IT WORKS TRANSITION
        ===================================================== */

        .vw-how-transition {
          position: absolute;

          top: -85px;

          left: 0;
          right: 0;

          height: 135px;

          pointer-events: none;

          overflow: hidden;

          z-index: 0;
        }


        .vw-how-transition-glow {
          position: absolute;

          left: 50%;
          top: 25px;

          width: 620px;
          height: 130px;

          transform:
            translateX(-50%)
            scale(.8);

          border-radius: 50%;

          background:
            radial-gradient(
              ellipse,
              rgba(53,74,54,.07),
              rgba(53,74,54,.025) 40%,
              transparent 72%
            );

          filter: blur(14px);

          opacity: 0;

          transition:
            opacity 1.2s ease,
            transform 1.2s cubic-bezier(.22,1,.36,1);
        }


        .vw-how-visible
        .vw-how-transition-glow {
          opacity: 1;

          transform:
            translateX(-50%)
            scale(1);
        }


        .vw-how-transition-line {
          position: absolute;

          left: 50%;
          top: 20px;

          width: 1px;
          height: 60px;

          transform:
            translateX(-50%)
            scaleY(0);

          transform-origin: top;

          background:
            linear-gradient(
              to bottom,
              transparent,
              rgba(53,74,54,.25),
              transparent
            );

          opacity: 0;

          transition:
            transform .8s cubic-bezier(.22,1,.36,1) .15s,
            opacity .6s ease .15s;
        }


        .vw-how-visible
        .vw-how-transition-line {
          opacity: 1;

          transform:
            translateX(-50%)
            scaleY(1);
        }


        .vw-how-transition-line span {
          position: absolute;

          left: 50%;
          bottom: 0;

          width: 6px;
          height: 6px;

          transform:
            translateX(-50%)
            scale(.4);

          border-radius: 50%;

          background: var(--color-forest);

          box-shadow:
            0 0 0 6px rgba(53,74,54,.06),
            0 0 15px rgba(53,74,54,.18);

          transition:
            transform .5s ease .8s;
        }


        .vw-how-visible
        .vw-how-transition-line span {
          transform:
            translateX(-50%)
            scale(1);
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .vw-how-header {
          position: relative;

          z-index: 2;

          max-width: 650px;

          margin: 0 auto 58px;

          text-align: center;

          opacity: 0;

          transform:
            translateY(35px);

          filter: blur(4px);

          transition:
            opacity .75s cubic-bezier(.22,1,.36,1),
            transform .8s cubic-bezier(.22,1,.36,1),
            filter .8s ease;
        }


        .vw-how-visible
        .vw-how-header {
          opacity: 1;

          transform:
            translateY(0);

          filter: blur(0);
        }


        /* =====================================================
           EYEBROW
        ===================================================== */

        .vw-how-eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 9px;

          margin-bottom: 15px;

          color: var(--color-forest) !important;

          font-family: var(--font-sans);

          font-size: .69rem;

          font-weight: 800;

          letter-spacing: .11em;

          text-transform: uppercase;
        }


        .vw-how-eyebrow-line {
          width: 22px;
          height: 2px;

          background: var(--color-ochre);

          border-radius: 999px;

          transform:
            scaleX(0);

          transform-origin: right;

          transition:
            transform .65s cubic-bezier(.22,1,.36,1) .3s;
        }


        .vw-how-visible
        .vw-how-eyebrow-line {
          transform:
            scaleX(1);
        }


        .vw-how-eyebrow span {
          color: var(--color-forest) !important;
        }


        /* =====================================================
           TITLE
        ===================================================== */

        .vw-how-title {
          margin: 0 0 10px;

          color: var(--color-text) !important;

          font-family: var(--font-serif);

          font-size:
            clamp(2.45rem,4vw,3.45rem);

          font-weight: 700;

          line-height: 1.05;

          letter-spacing: -.035em;
        }


        .vw-how-title span {
          position: relative;

          color: var(--color-forest) !important;
        }


        .vw-how-title span::after {
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
              rgba(53,74,54,.12)
            );

          transform:
            scaleX(0);

          transform-origin: left;

          transition:
            transform .7s cubic-bezier(.22,1,.36,1) .65s;
        }


        .vw-how-visible
        .vw-how-title span::after {
          transform:
            scaleX(1);
        }


        /* =====================================================
           SUBTITLE
        ===================================================== */

        .vw-how-subtitle {
          margin: 0;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: .92rem;

          line-height: 1.6;
        }


        /* =====================================================
           DESKTOP FLOW
        ===================================================== */

        .vw-steps-wrapper {
          position: relative;

          width: 100%;

          z-index: 2;
        }


        /* =====================================================
           BASE LINE
        ===================================================== */

        .vw-steps-line {
          position: absolute;

          top: 36px;

          left: 10%;

          width: 80%;

          height: 1px;

          background:
            rgba(53,74,54,.12);

          z-index: 0;
        }


        /* =====================================================
           ANIMATED PROGRESS LINE
        ===================================================== */

        .vw-steps-progress {
          position: absolute;

          top: 36px;

          left: 10%;

          width: 0;

          height: 2px;

          background:
            linear-gradient(
              90deg,
              var(--color-forest),
              rgba(53,74,54,.55)
            );

          border-radius: 999px;

          z-index: 1;

          box-shadow:
            0 0 8px rgba(53,74,54,.14);

          transition:
            width 1.8s cubic-bezier(.22,1,.36,1)
            .75s;
        }


        .vw-how-visible
        .vw-steps-progress {
          width: 80%;
        }


        /* =====================================================
           PROGRESS ORB
        ===================================================== */

        .vw-progress-orb {
          position: absolute;

          right: -4px;
          top: 50%;

          width: 8px;
          height: 8px;

          transform:
            translateY(-50%);

          border-radius: 50%;

          background: var(--color-forest);

          box-shadow:
            0 0 0 6px rgba(53,74,54,.07),
            0 0 14px rgba(53,74,54,.28);

          opacity: 0;

          transition:
            opacity .35s ease 2s;
        }


        .vw-how-visible
        .vw-progress-orb {
          opacity: 1;
        }


        /* =====================================================
           STEP GRID
        ===================================================== */

        .vw-steps-grid {
          position: relative;

          display: grid;

          grid-template-columns:
            repeat(5,minmax(0,1fr));

          gap: 8px;

          z-index: 2;
        }


        /* =====================================================
           STEP
        ===================================================== */

        .vw-step-item {
          position: relative;

          display: flex;

          flex-direction: column;

          align-items: center;

          min-width: 0;

          padding: 0 10px;

          text-align: center;

          opacity: 0;

          transform:
            translateY(35px)
            scale(.94);

          filter: blur(4px);

          transition:
            opacity .7s cubic-bezier(.22,1,.36,1)
              var(--step-delay),
            transform .8s cubic-bezier(.22,1,.36,1)
              var(--step-delay),
            filter .7s ease
              var(--step-delay);
        }


        .vw-how-visible
        .vw-step-item {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);

          filter: blur(0);
        }


        /* =====================================================
           NUMBER
        ===================================================== */

        .vw-step-number {
          position: absolute;

          top: -2px;

          left: calc(50% + 23px);

          color:
            rgba(53,74,54,.16) !important;

          font-family: var(--font-serif);

          font-size: .72rem;

          font-weight: 700;

          letter-spacing: .04em;

          z-index: 3;

          opacity: 0;

          transform:
            translateY(-7px);

          transition:
            opacity .5s ease
              calc(var(--step-delay) + 220ms),
            transform .5s ease
              calc(var(--step-delay) + 220ms);
        }


        .vw-how-visible
        .vw-step-number {
          opacity: 1;

          transform:
            translateY(0);
        }


        /* =====================================================
           ICON
        ===================================================== */

        .vw-step-icon {
          position: relative;

          width: 72px;
          height: 72px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          color: var(--color-forest) !important;

          background: var(--color-bg);

          border:
            1px solid rgba(53,74,54,.16);

          border-radius: 50%;

          box-shadow:
            0 4px 15px rgba(43,38,37,.045);

          transition:
            transform .3s ease,
            background-color .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }


        .vw-step-icon::before {
          content: "";

          position: absolute;

          inset: 6px;

          background:
            var(--color-forest-light);

          border-radius: 50%;

          z-index: 0;

          transform:
            scale(.7);

          opacity: 0;

          transition:
            transform .65s cubic-bezier(.22,1,.36,1)
              calc(var(--step-delay) + 150ms),
            opacity .5s ease
              calc(var(--step-delay) + 150ms);
        }


        .vw-how-visible
        .vw-step-icon::before {
          transform:
            scale(1);

          opacity: 1;
        }


        .vw-step-icon-inner {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;
          justify-content: center;

          color: var(--color-forest) !important;

          transform:
            scale(.5)
            rotate(-12deg);

          opacity: 0;

          transition:
            transform .65s cubic-bezier(.22,1,.36,1)
              calc(var(--step-delay) + 230ms),
            opacity .5s ease
              calc(var(--step-delay) + 230ms);
        }


        .vw-how-visible
        .vw-step-icon-inner {
          transform:
            scale(1)
            rotate(0);

          opacity: 1;
        }


        .vw-step-icon svg {
          color: var(--color-forest) !important;
        }


        .vw-step-active-ring {
          position: absolute;

          inset: -5px;

          border:
            1px solid rgba(53,74,54,.16);

          border-radius: 50%;

          transform:
            scale(.7);

          opacity: 0;

          transition:
            transform .7s cubic-bezier(.22,1,.36,1)
              calc(var(--step-delay) + 300ms),
            opacity .5s ease
              calc(var(--step-delay) + 300ms);
        }


        .vw-how-visible
        .vw-step-active-ring {
          transform:
            scale(1);

          opacity: 1;
        }


        .vw-step-item:hover .vw-step-icon {
          transform:
            translateY(-5px)
            scale(1.04);

          background: #FFFFFF;

          border-color:
            rgba(53,74,54,.28);

          box-shadow:
            0 12px 28px rgba(43,38,37,.10);
        }


        .vw-step-item:hover
        .vw-step-active-ring {
          border-color:
            rgba(53,74,54,.28);

          transform:
            scale(1.08);
        }


        /* =====================================================
           COMPLETED DOT
        ===================================================== */

        .vw-step-complete {
          position: absolute;

          top: -2px;

          right: calc(50% - 39px);

          width: 17px;
          height: 17px;

          display: flex;

          align-items: center;
          justify-content: center;

          color: white !important;

          background: var(--color-forest);

          border:
            2px solid var(--color-bg);

          border-radius: 50%;

          z-index: 5;

          opacity: 0;

          transform:
            scale(.4);

          transition:
            opacity .45s ease
              calc(var(--step-delay) + 430ms),
            transform .5s cubic-bezier(.22,1,.36,1)
              calc(var(--step-delay) + 430ms);
        }


        .vw-how-visible
        .vw-step-complete {
          opacity: 1;

          transform:
            scale(1);
        }


        .vw-step-complete svg {
          color: white !important;
        }


        /* =====================================================
           CONTENT
        ===================================================== */

        .vw-step-content {
          max-width: 190px;

          margin-top: 22px;

          opacity: 0;

          transform:
            translateY(12px);

          transition:
            opacity .55s ease
              calc(var(--step-delay) + 300ms),
            transform .6s cubic-bezier(.22,1,.36,1)
              calc(var(--step-delay) + 300ms);
        }


        .vw-how-visible
        .vw-step-content {
          opacity: 1;

          transform:
            translateY(0);
        }


        .vw-step-title {
          margin: 0 0 8px;

          color: var(--color-text) !important;

          font-family: var(--font-sans);

          font-size: .9rem;

          font-weight: 750;

          line-height: 1.3;

          letter-spacing: -.01em;
        }


        .vw-step-description {
          margin: 0;

          color: var(--color-text-muted) !important;

          font-family: var(--font-sans);

          font-size: .7rem;

          font-weight: 400;

          line-height: 1.6;
        }


        /* =====================================================
           ARROW
        ===================================================== */

        .vw-step-arrow {
          position: absolute;

          top: 25px;

          right: -11px;

          width: 22px;
          height: 22px;

          display: flex;

          align-items: center;
          justify-content: center;

          color: var(--color-ochre) !important;

          background: var(--color-bg);

          border-radius: 50%;

          z-index: 4;

          opacity: 0;

          transform:
            translateX(-8px);

          transition:
            opacity .5s ease
              calc(var(--step-delay) + 500ms),
            transform .5s cubic-bezier(.22,1,.36,1)
              calc(var(--step-delay) + 500ms);
        }


        .vw-how-visible
        .vw-step-arrow {
          opacity: 1;

          transform:
            translateX(0);
        }


        .vw-step-arrow svg {
          color: var(--color-ochre) !important;
        }


        /* =====================================================
           MOBILE FLOW
        ===================================================== */

        .vw-mobile-steps {
          display: none;
        }


        /* =====================================================
           LARGE TABLET
        ===================================================== */

        @media (max-width:1199px) {

          .vw-how-section {
            padding-top: 68px;
            padding-bottom: 76px;
          }


          .vw-how-header {
            margin-bottom: 48px;
          }


          .vw-step-item {
            padding: 0 6px;
          }


          .vw-step-icon {
            width: 64px;
            height: 64px;
          }


          .vw-step-content {
            max-width: 170px;

            margin-top: 19px;
          }


          .vw-step-title {
            font-size: .83rem;
          }


          .vw-step-description {
            font-size: .65rem;
          }


          .vw-step-arrow {
            right: -9px;
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width:991.98px) {

          .vw-how-section {
            padding-top: 60px;
            padding-bottom: 68px;
          }


          .vw-how-header {
            margin-bottom: 38px;
          }


          .vw-steps-line,
          .vw-steps-progress {
            display: none;
          }


          .vw-steps-grid {
            grid-template-columns:
              repeat(3,minmax(0,1fr));

            row-gap: 38px;
          }


          .vw-step-item {
            padding: 0 12px;
          }


          .vw-step-arrow {
            display: none;
          }


          .vw-step-number {
            left: calc(50% + 20px);
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width:767.98px) {

          .vw-how-section {
            padding-top: 52px;
            padding-bottom: 60px;
          }


          .vw-how-header {
            margin-bottom: 36px;

            padding: 0 10px;
          }


          .vw-how-eyebrow {
            margin-bottom: 12px;

            font-size: .62rem;
          }


          .vw-how-title {
            font-size: 2.5rem;
          }


          .vw-how-subtitle {
            font-size: .82rem;
          }


          /* Hide desktop flow */

          .vw-steps-wrapper {
            display: none;
          }


          /* Show mobile timeline */

          .vw-mobile-steps {
            position: relative;

            display: flex;

            flex-direction: column;

            max-width: 520px;

            margin: 0 auto;
          }


          .vw-mobile-progress-line {
            position: absolute;

            top: 26px;
            bottom: 55px;

            left: 32px;

            width: 1px;

            background:
              linear-gradient(
                to bottom,
                rgba(53,74,54,.08),
                rgba(53,74,54,.2),
                rgba(53,74,54,.08)
              );

            transform:
              scaleY(0);

            transform-origin: top;

            transition:
              transform 1.6s cubic-bezier(.22,1,.36,1) .4s;
          }


          .vw-how-visible
          .vw-mobile-progress-line {
            transform:
              scaleY(1);
          }


          .vw-mobile-step {
            position: relative;

            display: grid;

            grid-template-columns:
              64px 1fr;

            column-gap: 17px;

            min-height: 120px;

            opacity: 0;

            transform:
              translateY(25px);

            filter: blur(3px);

            transition:
              opacity .65s cubic-bezier(.22,1,.36,1)
                var(--step-delay),
              transform .7s cubic-bezier(.22,1,.36,1)
                var(--step-delay),
              filter .65s ease
                var(--step-delay);
          }


          .vw-how-visible
          .vw-mobile-step {
            opacity: 1;

            transform:
              translateY(0);

            filter: blur(0);
          }


          .vw-mobile-timeline {
            position: relative;

            display: flex;

            justify-content: center;
          }


          .vw-mobile-icon {
            position: relative;

            width: 52px;
            height: 52px;

            display: flex;

            align-items: center;
            justify-content: center;

            flex-shrink: 0;

            color: var(--color-forest) !important;

            background:
              var(--color-forest-light);

            border:
              1px solid rgba(53,74,54,.13);

            border-radius: 50%;

            z-index: 2;

            box-shadow:
              0 5px 16px rgba(43,38,37,.05);

            transform:
              scale(.8);

            transition:
              transform .6s cubic-bezier(.22,1,.36,1)
                calc(var(--step-delay) + 170ms);
          }


          .vw-how-visible
          .vw-mobile-icon {
            transform:
              scale(1);
          }


          .vw-mobile-icon span {
            display: flex;

            color: var(--color-forest) !important;
          }


          .vw-mobile-icon svg {
            color: var(--color-forest) !important;
          }


          .vw-mobile-line {
            position: absolute;

            top: 52px;
            bottom: 0;

            left: 50%;

            width: 1px;

            background:
              rgba(53,74,54,.13);

            transform:
              translateX(-50%)
              scaleY(.2);

            transform-origin: top;

            transition:
              transform .7s cubic-bezier(.22,1,.36,1)
                calc(var(--step-delay) + 350ms);
          }


          .vw-how-visible
          .vw-mobile-line {
            transform:
              translateX(-50%)
              scaleY(1);
          }


          .vw-mobile-step-complete {
            position: absolute;

            top: -2px;
            right: 2px;

            width: 16px;
            height: 16px;

            display: flex;

            align-items: center;
            justify-content: center;

            color: white !important;

            background: var(--color-forest);

            border:
              2px solid var(--color-bg);

            border-radius: 50%;

            z-index: 3;

            opacity: 0;

            transform:
              scale(.4);

            transition:
              opacity .4s ease
                calc(var(--step-delay) + 400ms),
              transform .45s cubic-bezier(.22,1,.36,1)
                calc(var(--step-delay) + 400ms);
          }


          .vw-how-visible
          .vw-mobile-step-complete {
            opacity: 1;

            transform:
              scale(1);
          }


          .vw-mobile-step-complete svg {
            color: white !important;
          }


          .vw-mobile-step-content {
            padding: 2px 0 30px;

            opacity: 0;

            transform:
              translateX(12px);

            transition:
              opacity .55s ease
                calc(var(--step-delay) + 220ms),
              transform .6s cubic-bezier(.22,1,.36,1)
                calc(var(--step-delay) + 220ms);
          }


          .vw-how-visible
          .vw-mobile-step-content {
            opacity: 1;

            transform:
              translateX(0);
          }


          .vw-mobile-step-number {
            margin-bottom: 5px;

            color: var(--color-ochre) !important;

            font-family: var(--font-sans);

            font-size: .6rem;

            font-weight: 800;

            letter-spacing: .1em;
          }


          .vw-mobile-step-title {
            margin: 0 0 6px;

            color: var(--color-text) !important;

            font-family: var(--font-sans);

            font-size: .92rem;

            font-weight: 750;

            line-height: 1.3;
          }


          .vw-mobile-step-description {
            max-width: 330px;

            margin: 0;

            color: var(--color-text-muted) !important;

            font-family: var(--font-sans);

            font-size: .73rem;

            line-height: 1.6;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width:420px) {

          .vw-how-section {
            padding-top: 46px;
            padding-bottom: 52px;
          }


          .vw-how-title {
            font-size: 2.25rem;
          }


          .vw-mobile-step {
            grid-template-columns:
              56px 1fr;

            column-gap: 13px;
          }


          .vw-mobile-progress-line {
            left: 28px;
          }


          .vw-mobile-icon {
            width: 46px;
            height: 46px;
          }


          .vw-mobile-line {
            top: 46px;
          }


          .vw-mobile-step-content {
            padding-bottom: 27px;
          }


          .vw-mobile-step-title {
            font-size: .86rem;
          }


          .vw-mobile-step-description {
            font-size: .68rem;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .vw-how-transition-glow,
          .vw-how-transition-line,
          .vw-how-transition-line span,
          .vw-how-header,
          .vw-step-item,
          .vw-step-number,
          .vw-step-icon,
          .vw-step-icon::before,
          .vw-step-icon-inner,
          .vw-step-active-ring,
          .vw-step-complete,
          .vw-step-content,
          .vw-step-arrow,
          .vw-mobile-progress-line,
          .vw-mobile-step,
          .vw-mobile-icon,
          .vw-mobile-line,
          .vw-mobile-step-complete,
          .vw-mobile-step-content {
            animation: none !important;

            transition: none !important;

            filter: none !important;
          }


          .vw-how-header,
          .vw-step-item,
          .vw-step-number,
          .vw-step-icon,
          .vw-step-icon-inner,
          .vw-step-complete,
          .vw-step-content,
          .vw-step-arrow,
          .vw-mobile-step,
          .vw-mobile-icon,
          .vw-mobile-step-complete,
          .vw-mobile-step-content {
            opacity: 1 !important;

            transform: none !important;
          }


          .vw-step-icon::before {
            opacity: 1 !important;

            transform: scale(1) !important;
          }


          .vw-step-active-ring {
            opacity: 1 !important;

            transform: scale(1) !important;
          }


          .vw-steps-progress {
            width: 80% !important;

            transition: none !important;
          }


          .vw-mobile-progress-line {
            transform: scaleY(1) !important;
          }


          .vw-mobile-line {
            transform:
              translateX(-50%)
              scaleY(1) !important;
          }

        }

      `}</style>
    </section>
  );
}

export default HowItWorks;