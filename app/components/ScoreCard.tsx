import React from "react";
import { ClusterScore } from "@/lib/types";

type Props = { scores: ClusterScore[] };

export default function ScoreCard({ scores }: Props) {
  return (
    <div className="mt-8 animate-rise">
      <div className="bg-white/60 backdrop-blur-sm border border-neutral-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-medium">
            Your scores
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-neutral-500">Complete</span>
          </div>
        </div>
        <div className="space-y-5">
          {[
            { num: 1, label: "Strategic Clarity" },
            { num: 2, label: "Focus" },
            { num: 3, label: "Decisions" },
          ].map(({ num, label }, i) => {
            const score = scores.find((s) => s.cluster === num)?.rating ?? 0;
            return (
              <div key={num} className="animate-slide-in" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[14px] text-neutral-700">{label}</span>
                  <span className="text-[15px] text-neutral-900 font-medium tabular-nums">
                    {score}
                    <span className="text-neutral-400 font-normal text-[13px]"> {' '} / 5</span>
                  </span>
                </div>
                <div className="relative bg-neutral-100 h-[3px] rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-neutral-900 rounded-full"
                    style={{
                      width: `${(score / 5) * 100}%`,
                      animation: `grow-${num} 900ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 120 + 200}ms both`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
