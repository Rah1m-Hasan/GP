import { Activity, Award, BarChart3, BookOpen, BriefcaseBusiness, BrainCircuit, FileText, GraduationCap, LayoutDashboard, MessageCircle, Settings, Sparkles, Trophy, UserRound } from "lucide-react";
export const navItems = [
  ["Overview", "/dashboard", LayoutDashboard], ["Career Profile", "/dashboard/profile", UserRound], ["Jobs", "/dashboard/jobs", BriefcaseBusiness], ["Skill Analysis", "/dashboard/skills", BarChart3], ["Learning", "/dashboard/learning", BookOpen], ["Assessments", "/dashboard/assessments", GraduationCap], ["Mock Interview", "/dashboard/interview", BrainCircuit], ["Career Advisor", "/dashboard/advisor", MessageCircle], ["Resume Studio", "/dashboard/resume", FileText], ["Applications", "/dashboard/applications", Activity], ["Achievements", "/dashboard/achievements", Trophy]
] as const;
export { Activity, Award, BarChart3, BookOpen, BriefcaseBusiness, BrainCircuit, FileText, GraduationCap, MessageCircle, Settings, Sparkles, Trophy, UserRound };
