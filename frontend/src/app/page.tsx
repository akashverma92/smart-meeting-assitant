// this going to be the landing page of the applciation.
// it will contain the basic information about the application and a button to navigate to the main app.

"use client";

import Hero from "@/src/components/landing/Hero";
import FeatureCards from "@/src/components/landing/FeatureCards";
import BackgroundAnimation from "@/src/components/landing/BackgroundAnimation";
import Footer from "@/src/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 relative">
      <BackgroundAnimation />

      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center sm:pt-32">
        <Hero />
        <FeatureCards />
      </main>

      <Footer />
    </div>
  );
}

