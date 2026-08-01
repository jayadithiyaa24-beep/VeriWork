import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";

function Home() {
  return (
    <>
      <Hero />

      <div id="features">
        <Features />
      </div>

      <Stats />

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <CTA />
    </>
  );
}

export default Home;