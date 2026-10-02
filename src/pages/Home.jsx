import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";

function Home() {
  return (
    <div className="vw-home-container">
      {/* 1. Hero Section & Trust Indicators */}
      <Hero />

      {/* 2. Key Metrics & Impact */}
      <Stats />

      {/* 3. Why VeriWork / Features */}
      <div id="features">
        <Features />
      </div>

      {/* 4. How It Works (5-Step Process) */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* 5. Final Empowerment / Call To Action */}
      <CTA />
    </div>
  );
}

export default Home;