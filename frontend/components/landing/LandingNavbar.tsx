"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  ["Product", "#product"],
  ["For Job Seekers", "#job-seekers"],
  ["For Recruiters", "#recruiters"],
  ["How It Works", "#how-it-works"],
  ["About", "#about"],
];

export function LandingNavbar({ onGetStarted }: { onGetStarted: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <header className={`landing-nav ${scrolled ? "landing-nav-scrolled" : ""}`}>
    <div className="shell flex h-[72px] items-center justify-between gap-4">
      <Link href="/" className="brand-lockup" aria-label="Skillbridge AI home">
        <Image className="brand-mark" src="/brand/logo.png" width={36} height={36} alt="" aria-hidden="true" /><span>Skillbridge <em>AI</em></span>
      </Link>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
        {links.map(([label, href]) => <a key={label} className="nav-link" href={href}>{label}</a>)}
      </nav>
      <div className="hidden items-center gap-3 sm:flex">
        <ThemeToggle />
        <Link href="/auth" className="nav-signin">Sign In</Link>
        <button onClick={onGetStarted} className="landing-button landing-button-primary">Get Started <ArrowRight size={15} /></button>
      </div>
      <div className="flex items-center gap-2 sm:hidden"><ThemeToggle /><button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close navigation" : "Open navigation"}>
        {open ? <X size={20} /> : <Menu size={21} />}
      </button></div>
    </div>
    {open && <div id="mobile-nav" className="mobile-nav shell">
      <nav aria-label="Mobile navigation">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}</nav>
      <div className="flex gap-3"><Link href="/auth" className="landing-button landing-button-secondary flex-1">Sign In</Link><button onClick={() => { setOpen(false); onGetStarted(); }} className="landing-button landing-button-primary flex-1">Get Started</button></div>
    </div>}
  </header>;
}
