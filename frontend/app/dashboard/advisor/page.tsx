"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";

type Message = { role: "Career Advisor" | "You"; text: string };

export default function Advisor() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "Career Advisor", text: "Hi Alex — I can help you choose what to learn or understand your job matches." }]);
  const ask = async (question: string) => {
    if (!question.trim() || sending) return;
    setMessages(items => [...items, { role: "You", text: question }]);
    setInput("");
    setSending(true);
    try {
      const reply = await api.advisor(question);
      setMessages(items => [...items, { role: "Career Advisor", text: `${reply.message}${reply.recommendations.length ? `\n\nNext steps: ${reply.recommendations.join(" · ")}` : ""}` }]);
    } catch (reason) {
      setMessages(items => [...items, { role: "Career Advisor", text: reason instanceof ApiError ? reason.message : "The advisor is temporarily unavailable." }]);
    } finally { setSending(false); }
  };

  return <><p className="eyebrow">AI career advisor</p><h1 className="mt-2 text-3xl font-bold">Career guidance grounded in your progress.</h1><p className="mt-2 muted">Advice can explain and recommend; it cannot verify skills or change your scores.</p><section className="card mt-7 flex min-h-[540px] max-w-4xl flex-col p-5"><div className="flex flex-wrap gap-2 border-b border-line pb-4">{["What should I learn next?", "Am I ready to apply?", "Create a 30-day plan"].map(question => <button onClick={() => ask(question)} key={question} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:border-brand hover:bg-muted">{question}</button>)}</div><div className="flex-1 space-y-4 py-5">{messages.map((message, index) => <div key={index} className={message.role === "You" ? "ml-auto max-w-[80%] whitespace-pre-line rounded-2xl bg-brand p-4 text-sm text-primary-foreground" : "max-w-[85%] whitespace-pre-line rounded-2xl border border-border bg-card p-4 text-sm leading-6 text-card-foreground"}><b className="mb-1 block text-xs opacity-70">{message.role}</b>{message.text}</div>)}{sending && <p className="text-sm muted">Thinking…</p>}</div><div className="flex gap-2 border-t border-line pt-4"><input value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => event.key === "Enter" && ask(input)} className="flex-1 rounded-xl border border-input bg-card px-3 py-3 text-foreground" placeholder="Ask about your career…" /><button disabled={sending} onClick={() => ask(input)} className="btn btn-primary"><Send size={16} /></button></div></section></>;
}
