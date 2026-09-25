"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Keeps the theme class on <html>, before the first paint. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
