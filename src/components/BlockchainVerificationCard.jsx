import React from "react";
import {
  FaFileAlt,
  FaHashtag,
  FaCube,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaLink,
} from "react-icons/fa";

function BlockchainVerificationCard({
  recordId,
  verificationStatus,
  hash,
}) {
  const isVerified = verificationStatus === "Verified";

  const displayHash =
    hash ||
    `0x7a8f${recordId
      ? recordId.slice(-6)
      : "3b91c4"
    }...9e21`;

  const steps = [
    {
      number: "01",
      icon: <FaFileAlt />,
      title: "Record Created",
      desc: "Employer registers employment record",
      type: "green",
    },
    {
      number: "02",
      icon: <FaHashtag />,
      title: "Cryptographic Hash",
      desc: "SHA-256 fingerprint generated",
      type: "purple",
    },
    {
      number: "03",
      icon: <FaCube />,
      title: "Blockchain Ledger",
      desc: "Anchored to decentralized network",
      type: "amber",
    },
    {
      number: "04",
      icon: <FaCheckCircle />,
      title: isVerified
        ? "Tamper-Proof Verified"
        : "Verification Pending",
      desc: isVerified
        ? "Permanent & verifiable work identity"
        : "Awaiting network confirmation",
      type: isVerified ? "green" : "amber",
    },
  ];

  return (
    <section className="vw-blockchain-card">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="vw-blockchain-header">

        <div className="vw-blockchain-heading">

          <div className="vw-blockchain-icon">
            <FaShieldAlt />
          </div>

          <div>
            <span className="vw-blockchain-eyebrow">
              VERIFICATION PROTOCOL
            </span>

            <h3>
              VeriWork Blockchain Trust Architecture
            </h3>

            <p>
              Transparent cryptographic verification pipeline
            </p>
          </div>

        </div>


        <div
          className={
            isVerified
              ? "vw-chain-badge verified"
              : "vw-chain-badge pending"
          }
        >
          {isVerified ? (
            <>
              <FaCheckCircle />
              Verified on Chain
            </>
          ) : (
            <>
              <span className="vw-pending-dot" />
              Pending Chain Anchor
            </>
          )}
        </div>

      </div>


      {/* =========================================
          PIPELINE
      ========================================= */}

      <div className="vw-blockchain-pipeline">

        {steps.map((step, idx) => (

          <React.Fragment key={idx}>

            <div
              className={`vw-chain-step ${step.type}`}
            >

              <div className="vw-chain-step-top">

                <div className="vw-chain-step-icon">
                  {step.icon}
                </div>

                <span className="vw-chain-step-number">
                  {step.number}
                </span>

              </div>

              <h4>
                {step.title}
              </h4>

              <p>
                {step.desc}
              </p>

            </div>


            {idx < steps.length - 1 && (
              <div className="vw-chain-arrow">
                <FaArrowRight />
              </div>
            )}

          </React.Fragment>

        ))}

      </div>


      {/* =========================================
          HASH FOOTER
      ========================================= */}

      <div className="vw-blockchain-proof">

        <div className="vw-proof-main">

          <div className="vw-proof-icon">
            <FaLink />
          </div>

          <div>
            <span>
              IMMUTABLE HASH
            </span>

            <code>
              {displayHash}
            </code>
          </div>

        </div>


        <div className="vw-proof-note">
          Powered by VeriWork Smart Contracts
          <span />
          Zero Central Tampering
        </div>

      </div>


      <style>{`

        /* =========================================
           MAIN CARD
        ========================================= */

        .vw-blockchain-card {
          position: relative;
          margin: 28px 0;
          padding: 30px;
          overflow: hidden;

          border: 1px solid rgba(43, 38, 37, 0.075);
          border-radius: 26px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.78),
              rgba(249,247,242,0.88)
            );

          box-shadow:
            0 16px 45px rgba(43,38,37,0.055);
        }


        .vw-blockchain-card::before {
          content: "";
          position: absolute;

          width: 250px;
          height: 250px;

          top: -160px;
          right: -100px;

          border: 1px solid rgba(74,103,80,0.08);
          border-radius: 50%;

          pointer-events: none;
        }


        /* =========================================
           HEADER
        ========================================= */

        .vw-blockchain-header {
          position: relative;
          z-index: 1;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 28px;
        }


        .vw-blockchain-heading {
          display: flex;
          align-items: center;
          gap: 14px;
        }


        .vw-blockchain-icon {
          width: 46px;
          height: 46px;

          flex: 0 0 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          background:
            rgba(74,103,80,0.10);

          color:
            var(--color-forest, #4A6750) !important;

          box-shadow:
            inset 0 0 0 1px
            rgba(74,103,80,0.06);
        }


        .vw-blockchain-icon svg {
          color:
            var(--color-forest, #4A6750) !important;
        }


        .vw-blockchain-eyebrow {
          display: block;

          margin-bottom: 4px;

          color:
            var(--color-forest, #4A6750) !important;

          font-size: 0.61rem;

          font-weight: 800;

          letter-spacing: 0.14em;

          text-transform: uppercase;
        }


        .vw-blockchain-heading h3 {
          margin: 0;

          color:
            var(--color-text, #2B2625) !important;

          font-family:
            var(
              --font-serif,
              Georgia,
              serif
            );

          font-size: 1.45rem;

          font-weight: 600;

          letter-spacing: -0.025em;
        }


        .vw-blockchain-heading p {
          margin: 4px 0 0;

          color:
            var(
              --color-text-muted,
              #756F69
            ) !important;

          font-size: 0.76rem;
        }


        /* =========================================
           STATUS BADGE
        ========================================= */

        .vw-chain-badge {
          display: inline-flex;

          align-items: center;
          gap: 7px;

          flex-shrink: 0;

          padding: 8px 12px;

          border-radius: 999px;

          font-size: 0.65rem;

          font-weight: 800;

          letter-spacing: 0.02em;
        }


        .vw-chain-badge.verified {
          background:
            rgba(74,103,80,0.10);

          color:
            #41644A !important;

          border:
            1px solid rgba(74,103,80,0.12);
        }


        .vw-chain-badge.verified svg {
          color:
            #4A6750 !important;
        }


        .vw-chain-badge.pending {
          background:
            rgba(212,163,89,0.13);

          color:
            #93692C !important;

          border:
            1px solid rgba(212,163,89,0.18);
        }


        .vw-pending-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #C18A37;

          box-shadow:
            0 0 0 4px
            rgba(193,138,55,0.12);
        }


        /* =========================================
           PIPELINE
        ========================================= */

        .vw-blockchain-pipeline {
          position: relative;
          z-index: 1;

          display: grid;

          grid-template-columns:
            1fr 28px 1fr 28px 1fr 28px 1fr;

          align-items: stretch;

          gap: 0;
        }


        .vw-chain-step {
          position: relative;

          min-height: 155px;

          padding: 17px;

          border: 1px solid;

          border-radius: 17px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }


        .vw-chain-step:hover {
          transform: translateY(-3px);

          box-shadow:
            0 12px 25px
            rgba(43,38,37,0.07);
        }


        /* GREEN */

        .vw-chain-step.green {
          background:
            rgba(74,103,80,0.065);

          border-color:
            rgba(74,103,80,0.15);
        }


        /* PURPLE */

        .vw-chain-step.purple {
          background:
            rgba(139,92,246,0.055);

          border-color:
            rgba(139,92,246,0.15);
        }


        /* AMBER */

        .vw-chain-step.amber {
          background:
            rgba(212,163,89,0.08);

          border-color:
            rgba(212,163,89,0.20);
        }


        .vw-chain-step-top {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 16px;
        }


        .vw-chain-step-icon {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #FFFFFF;

          box-shadow:
            0 4px 13px
            rgba(43,38,37,0.06);
        }


        .vw-chain-step.green
          .vw-chain-step-icon {
          color:
            var(--color-forest, #4A6750);
        }


        .vw-chain-step.purple
          .vw-chain-step-icon {
          color: #8B5CF6;
        }


        .vw-chain-step.amber
          .vw-chain-step-icon {
          color: #B27B27;
        }


        .vw-chain-step-icon svg {
          color: inherit !important;
          font-size: 17px;
        }


        .vw-chain-step-number {
          color:
            rgba(43,38,37,0.35);

          font-size: 0.61rem;

          font-weight: 900;

          letter-spacing: 0.08em;
        }


        .vw-chain-step h4 {
          margin: 0 0 6px;

          color:
            var(--color-text, #2B2625) !important;

          font-size: 0.82rem;

          font-weight: 800;

          line-height: 1.35;
        }


        .vw-chain-step p {
          margin: 0;

          color:
            var(
              --color-text-muted,
              #756F69
            ) !important;

          font-size: 0.72rem;

          line-height: 1.55;
        }


        /* =========================================
           ARROWS
        ========================================= */

        .vw-chain-arrow {
          display: flex;

          align-items: center;
          justify-content: center;

          color:
            rgba(74,103,80,0.35);
        }


        .vw-chain-arrow svg {
          font-size: 11px;
        }


        /* =========================================
           PROOF FOOTER
        ========================================= */

        .vw-blockchain-proof {
          position: relative;
          z-index: 1;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          margin-top: 20px;

          padding: 13px 15px;

          border:
            1px solid
            rgba(43,38,37,0.07);

          border-radius: 13px;

          background:
            rgba(239,236,230,0.62);
        }


        .vw-proof-main {
          display: flex;

          align-items: center;

          gap: 10px;

          min-width: 0;
        }


        .vw-proof-icon {
          width: 32px;
          height: 32px;

          flex: 0 0 32px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          background: #FFFFFF;

          color:
            var(--color-forest, #4A6750);
        }


        .vw-proof-main > div:last-child {
          min-width: 0;
        }


        .vw-proof-main span {
          display: block;

          margin-bottom: 3px;

          color:
            #817A73 !important;

          font-size: 0.57rem;

          font-weight: 800;

          letter-spacing: 0.11em;
        }


        .vw-proof-main code {
          display: block;

          max-width: 430px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          padding: 3px 7px;

          border:
            1px solid
            rgba(74,103,80,0.12);

          border-radius: 6px;

          background: #FFFFFF;

          color:
            var(--color-forest, #4A6750) !important;

          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;

          font-size: 0.68rem;
        }


        .vw-proof-note {
          display: flex;

          align-items: center;

          gap: 8px;

          flex-shrink: 0;

          color:
            #817A73 !important;

          font-size: 0.63rem;

          text-align: right;
        }


        .vw-proof-note span {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background:
            var(--color-forest, #4A6750);
        }


        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1050px) {

          .vw-blockchain-pipeline {
            grid-template-columns:
              repeat(2, 1fr);

            gap: 12px;
          }


          .vw-chain-arrow {
            display: none;
          }


          .vw-chain-step {
            min-height: 145px;
          }

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 700px) {

          .vw-blockchain-card {
            padding: 21px;

            border-radius: 21px;
          }


          .vw-blockchain-header {
            align-items: flex-start;

            flex-direction: column;

            gap: 15px;

            margin-bottom: 21px;
          }


          .vw-blockchain-heading {
            align-items: flex-start;
          }


          .vw-blockchain-heading h3 {
            font-size: 1.22rem;
          }


          .vw-blockchain-heading p {
            font-size: 0.7rem;
          }


          .vw-chain-badge {
            align-self: flex-start;
          }


          .vw-blockchain-pipeline {
            grid-template-columns: 1fr;
          }


          .vw-chain-step {
            min-height: auto;

            padding: 16px;
          }


          .vw-chain-step-top {
            margin-bottom: 12px;
          }


          .vw-blockchain-proof {
            align-items: flex-start;

            flex-direction: column;

            gap: 11px;
          }


          .vw-proof-note {
            text-align: left;
          }


          .vw-proof-main {
            width: 100%;
          }


          .vw-proof-main code {
            max-width: calc(100vw - 105px);
          }

        }

      `}</style>
    </section>
  );
}

export default BlockchainVerificationCard;