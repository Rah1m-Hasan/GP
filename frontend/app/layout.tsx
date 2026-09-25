import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Skillbridge AI", description: "The AI-Powered Bridge Between Education and Employment" };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
