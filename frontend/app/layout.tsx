import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
export const metadata: Metadata = { title: "Skillbridge AI", description: "The AI-Powered Bridge Between Education and Employment", icons: { icon: "/brand/logo.png", apple: "/brand/logo.png" } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en" suppressHydrationWarning><body><ThemeProvider>{children}</ThemeProvider></body></html>; }
