import React from "react";
type Props = { step: number };
export default function Header({ step }: Props) {
  return (
    <header className="pt-8 pb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <h1 className="text-[14px] font-medium tracking-tight text-neutral-900">
            Execution Diagnostic
          </h1>
        </div>
        <span className="text-[11px] text-neutral-400 tabular-nums tracking-wider">
          {step}/3
        </span>
      </div>

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full transition-all duration-700 ease-out ${
              i < step ? "bg-neutral-900" : i === step ? "bg-neutral-300" : "bg-neutral-200/60"
            }`}
          />
        ))}
      </div>
    </header>
  );
}
