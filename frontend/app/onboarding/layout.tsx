import { ThemeToggle } from "@/components/theme-toggle";

// Onboarding has its own lightweight header rather than an app shell.
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <><div className="fixed right-4 top-4 z-40"><ThemeToggle /></div>{children}</>;
}
