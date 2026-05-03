import React, { useRef, useEffect } from "react";
import { Message, ClusterScore } from "@/lib/types";
import { generateDiagnosticJSON, downloadJSON } from "@/lib/export";
import { useVoiceInput } from "@/lib/useVoiceInput";

type Props = {
  input: string;
  setInput: (v: string) => void;
  onKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  send: () => void;
  loading: boolean;
  finished: boolean;
  messages: Message[];
  scores: ClusterScore[];
};

export default function Composer({ input, setInput, onKey, send, loading, finished, messages, scores }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, error, startListening, stopListening } = useVoiceInput((transcript) => {
    const newInput = input ? input + " " + transcript : transcript;
    setInput(newInput);
  });

  // Reset textarea height and focus after message is sent
  useEffect(() => {
    if (textareaRef.current && input === "") {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }, [input]);

  function handleExport() {
    const data = generateDiagnosticJSON(messages, scores);
    const timestamp = new Date().toISOString().split("T")[0];
    downloadJSON(data, `diagnostic-${timestamp}.json`);
  }

  function resizeTextarea(e: React.FormEvent<HTMLTextAreaElement>) {
    const t = e.currentTarget;
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 128) + "px";
  }

  function toggleVoice() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  return (
    <div className="pb-6 pt-3 space-y-2">
      {finished && (
        <button
          onClick={handleExport}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-white text-[14px] font-medium hover:bg-emerald-600 active:scale-95 transition-all duration-150 shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
        >
          Export Chat as JSON
        </button>
      )}

      {isListening && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:400ms]" />
          </span>
          <span className="text-[13px] text-blue-700 font-medium">Listening...</span>
        </div>
      )}

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200">
          <p className="text-[13px] text-red-700">{error}</p>
        </div>
      )}

      <div className={`group relative bg-white rounded-2xl transition-all duration-300 ${finished ? "opacity-50" : "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] focus-within:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]"}`}>
        <div className="flex items-end gap-2 p-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            onInput={resizeTextarea}
            disabled={loading || finished}
            rows={1}
            placeholder={finished ? "Diagnostic complete" : "Type or speak your message…"}
            className="flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed max-h-32"
          />
          <button
            onClick={toggleVoice}
            disabled={loading || finished}
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${
              isListening
                ? "bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            } disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed`}
            title="Click to speak"
            aria-label="Voice input"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
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
