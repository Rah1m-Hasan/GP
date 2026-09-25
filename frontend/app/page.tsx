"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { EvidenceSection } from "@/components/landing/EvidenceSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { RecruiterSection } from "@/components/landing/RecruiterSection";
import { RoleChoiceModal } from "@/components/landing/RoleChoiceModal";
import { SeekerSection } from "@/components/landing/SeekerSection";
import { SplitAudience } from "@/components/landing/SplitAudience";
import { Testimonials } from "@/components/landing/Testimonials";
import { TrustSection } from "@/components/landing/TrustSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { WorkflowSection } from "@/components/landing/WorkflowSection";

export default function Home() {
  const [choiceOpen, setChoiceOpen] = useState(false);
  const openChoice = () => setChoiceOpen(true);

  return (
    <div className="landing-page">
      <LandingNavbar onGetStarted={openChoice} />
      <main>
        <Hero onGetStarted={openChoice} />
        <TrustStrip />
        <WorkflowSection />
        <SeekerSection onGetStarted={openChoice} />
        <RecruiterSection onGetStarted={openChoice} />
        <SplitAudience onGetStarted={openChoice} />
        <ProductShowcase />
        <EvidenceSection />
        <ComparisonSection />
        <HowItWorks />
        <Testimonials />
        <TrustSection />
        <FinalCTA onGetStarted={openChoice} />
      </main>
      <Footer />
      <AnimatePresence>
        {choiceOpen && <RoleChoiceModal close={() => setChoiceOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
