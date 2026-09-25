"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Auth() { const router = useRouter(); const [email, setEmail] = useState("alex@skillbridge.demo"); return <main className="grid min-h-screen place-items-center bg-background p-5"><section className="card w-full max-w-md p-8"><div className="flex items-center justify-between gap-4"><Link href="/" className="flex items-center gap-2 font-bold"><Image src="/brand/logo.png" width={32} height={32} alt="" aria-hidden="true" />Skillbridge AI</Link><ThemeToggle /></div><p className="eyebrow mt-9">Welcome back</p><h1 className="mt-2 text-3xl font-bold">Continue your career momentum.</h1><p className="mt-3 text-sm muted">Use the prefilled demo account to explore the platform.</p><label className="mt-7 block text-sm font-bold">Email<input value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-line px-3 py-3 outline-brand" type="email" /></label><label className="mt-4 block text-sm font-bold">Password<input defaultValue="demo-password" className="mt-2 w-full rounded-xl border border-line px-3 py-3 outline-brand" type="password" /></label><button onClick={() => { localStorage.setItem("skillbridge-auth", "demo"); router.push("/dashboard"); }} className="btn btn-primary mt-6 w-full">Sign in</button><p className="mt-5 text-center text-sm muted">New here? <Link className="font-bold text-brand" href="/onboarding">Create your profile</Link></p></section></main>; }
