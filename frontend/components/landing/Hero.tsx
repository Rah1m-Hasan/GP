"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  const reduced = useReducedMotion();
  const rise = (delay = 0) => ({ initial: { opacity: 0, y: reduced ? 0 : 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.58, delay } });
  return <section className="hero-section">
    <div className="hero-halo" />
    <div className="shell hero-grid">
      <motion.div {...rise()} className="hero-copy">
        <p className="section-kicker"><Sparkles size={14} /> AI-powered career and hiring platform</p>
        <h1>Don&apos;t Just Find Jobs.<br />Become <span>Ready</span> For Them.</h1>
        <p className="hero-description">Skillbridge AI analyzes your capabilities, reveals the skills you&apos;re missing, builds a personalized path to close those gaps, and connects you with opportunities based on real evidence.</p>
        <div className="hero-actions"><button onClick={onGetStarted} className="landing-button landing-button-primary">Get Started <ArrowRight size={17} /></button><Link href="#how-it-works" className="landing-button landing-button-secondary">Explore How It Works</Link></div>
        <p className="hero-trust"><CheckCircle2 size={16} /> For job seekers, students, professionals and hiring teams.</p>
      </motion.div>
      <motion.div {...rise(.16)} className="hero-visual" aria-label="Skillbridge career readiness product preview">
        <div className="hero-photo"><Image src="/images/landing/hero-professionals.webp" fill priority sizes="(max-width: 1024px) 100vw, 52vw" alt="Young professionals collaborating around a laptop" /></div>
        <motion.div animate={reduced ? {} : { y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="floating-card readiness-card"><span>Career Readiness</span><strong>68%</strong><small>Backend Developer</small><div className="mini-progress"><i /></div></motion.div>
        <motion.div animate={reduced ? {} : { y: [0, 6, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: .5 }} className="floating-card match-card"><span>Job Match</span><strong>87%</strong><small>Strong match · 12 roles</small></motion.div>
        <div className="floating-card skills-card"><div><b>Python</b><span className="verified-dot">Verified 91%</span></div><div><b>Docker</b><span className="gap-dot">Skill gap</span></div></div>
      </motion.div>
    </div>
  </section>;
}
