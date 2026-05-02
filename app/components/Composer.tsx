import React from "react";

type Props = {
  input: string;
  setInput: (v: string) => void;
  onKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  send: () => void;
  loading: boolean;
  finished: boolean;
};

export default function Composer({ input, setInput, onKey, send, loading, finished }: Props) {
  return (
    <div className="pb-6 pt-3">
      <div className={`group relative bg-white rounded-2xl transition-all duration-300 ${finished ? "opacity-50" : "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] focus-within:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]"}`}>
        <div className="flex items-end gap-2 p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={loading || finished}
            rows={1}
            placeholder={finished ? "Diagnostic complete" : "Type a message…"}
            className="flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed max-h-32"
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={send}
            disabled={loading || finished || !input.trim()}
            className="shrink-0 w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all duration-150 disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed disabled:active:scale-100"
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-90">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
