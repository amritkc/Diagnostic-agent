"use client";

import { useState, useEffect, useRef } from "react";
import { Message, Stage, ClusterScore, ChatResponse } from "@/lib/types";
import { INTRO_TEXT } from "@/lib/flow";
import Header from "./components/Header";
import Messages from "./components/Messages";
import Composer from "./components/Composer";
import { getStep } from "@/lib/ui";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INTRO_TEXT },
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("intro");
  const [scores, setScores] = useState<ClusterScore[]>([]);
  const [redirectCount, setRedirectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    const sentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          history: newHistory,
          userMessage: sentInput,
          scores,
          redirectCount,
        }),
      });

      const data: ChatResponse = await res.json();
      setMessages((prev) => [...newHistory, { role: "assistant", content: data.reply }]);
      setStage(data.nextStage);
      setRedirectCount(data.redirectCount ?? 0);
      if (data.capturedScore) {
        setScores((prev) => [...prev, data.capturedScore!]);
      }
    } catch {
      setMessages((prev) => [
        ...newHistory,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const finished = stage === "summary";
  const step = getStep(stage);

  return (
    <main className="min-h-screen bg-[#f6f5f2] text-neutral-900 antialiased">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-rose-100/30 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 flex flex-col h-screen">
        <Header step={step} />
        <Messages messages={messages} loading={loading} scores={scores} stage={stage} scrollRef={scrollRef} />
        <Composer input={input} setInput={setInput} onKey={onKey} send={send} loading={loading} finished={finished} messages={messages} scores={scores} />
      </div>
    </main>
  );
}
