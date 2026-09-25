"use client";

import { BrainCircuit, Send } from "lucide-react";
import { useState } from "react";

const starter = "Tell me about an API you built or improved. What problem did it solve, and how did you make design decisions?";

export default function Interview() {
  const [started, setStarted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [messages, setMessages] = useState([{ role: "AI interviewer", text: starter }]);
  const [report, setReport] = useState(false);
  const send = () => {
    if (!answer) return;
    setMessages([...messages, { role: "You", text: answer }, { role: "AI interviewer", text: "Thanks. How would you approach adding authentication, validation, and observability to that service?" }]);
    setAnswer("");
  };

  if (report) return <><p className="eyebrow">Interview report</p><h1 className="mt-2 text-3xl font-bold">A clear baseline to improve from.</h1><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[["Technical Knowledge", "72"], ["Problem Solving", "76"], ["Communication", "81"], ["Answer Structure", "70"], ["Role Knowledge", "68"], ["Time Management", "84"]].map(([label, score]) => <div key={label} className="card p-5"><p className="muted text-sm">{label}</p><b className="mt-2 block text-3xl text-brand">{score}%</b></div>)}</div><section className="card mt-6 p-6"><h2 className="font-bold">Suggested practice</h2><p className="mt-2 leading-7 muted">Use a concise situation-action-result structure, then practice explaining API security and Docker deployment choices with concrete trade-offs.</p><button onClick={() => { setReport(false); setStarted(false); }} className="btn btn-primary mt-5">Retry interview</button></section></>;

  if (!started) return <><p className="eyebrow">AI mock interview</p><h1 className="mt-2 text-3xl font-bold">Practice the conversation before it counts.</h1><p className="mt-2 muted">Text interviews adapt one question at a time based on your answers.</p><section className="card mt-7 max-w-2xl p-6"><label className="block text-sm font-bold">Target role<select className="mt-2 w-full rounded-xl border border-input bg-card p-3 text-foreground"><option>Backend Developer · Nova Systems</option><option>API Engineer · Lattice Labs</option></select></label><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Interview type<select className="mt-2 w-full rounded-xl border border-input bg-card p-3 text-foreground"><option>Technical</option><option>Coding</option><option>Behavioral</option><option>System Design</option><option>HR</option></select></label><label className="text-sm font-bold">Difficulty<select className="mt-2 w-full rounded-xl border border-input bg-card p-3 text-foreground"><option>Intermediate</option><option>Beginner</option><option>Advanced</option></select></label></div><button onClick={() => setStarted(true)} className="btn btn-primary mt-6"><BrainCircuit size={17} />Start interview</button></section></>;

  return <><div className="flex items-center justify-between"><div><p className="eyebrow">Technical mock interview</p><h1 className="mt-2 text-2xl font-bold">Backend Developer</h1></div><button onClick={() => setReport(true)} className="btn btn-secondary">Finish & report</button></div><section className="card mt-6 max-w-3xl p-5"><div className="space-y-4">{messages.map((message, index) => <div key={index} className={message.role === "You" ? "ml-auto max-w-[85%] rounded-2xl bg-brand p-4 text-sm text-primary-foreground" : "max-w-[85%] rounded-2xl border border-border bg-card p-4 text-sm text-card-foreground"}><b className="mb-1 block text-xs opacity-70">{message.role}</b>{message.text}</div>)}</div><div className="mt-5 flex gap-2 border-t border-line pt-4"><textarea value={answer} onChange={event => setAnswer(event.target.value)} className="min-h-20 flex-1 rounded-xl border border-input bg-card p-3 text-sm text-foreground" placeholder="Write your answer…" /><button onClick={send} className="btn btn-primary self-end"><Send size={16} /></button></div></section></>;
}
