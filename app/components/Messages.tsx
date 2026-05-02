import React from "react";
import { Message, ClusterScore, Stage } from "@/lib/types";
import ScoreCard from "./ScoreCard";

type Props = {
  messages: Message[];
  loading: boolean;
  scores: ClusterScore[];
  stage: Stage;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export default function Messages({ messages, loading, scores, stage, scrollRef }: Props) {
  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-rise`}>
          <div className={`max-w-[88%] whitespace-pre-wrap text-[15px] leading-[1.65] ${m.role === "user" ? "bg-neutral-900 text-neutral-50 rounded-2xl rounded-br-sm px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : "text-neutral-800"}`}>
            {m.content}
          </div>
        </div>
      ))}

      {stage === "summary" && scores.length === 3 && <ScoreCard scores={scores} />}

      {loading && (
        <div className="flex justify-start animate-rise">
          <div className="flex gap-1.5 px-1 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-typing [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-typing [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-typing [animation-delay:400ms]" />
          </div>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
}
