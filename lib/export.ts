import { Message, ClusterScore, Stage } from "./types";

export interface DiagnosticExport {
  exportedAt: string;
  completedAt: string;
  messages: Message[];
  scores: ClusterScore[];
  summary: {
    cluster1: { topic: string; score: number };
    cluster2: { topic: string; score: number };
    cluster3: { topic: string; score: number };
  };
}

export function generateDiagnosticJSON(
  messages: Message[],
  scores: ClusterScore[]
): DiagnosticExport {
  return {
    exportedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    messages,
    scores,
    summary: {
      cluster1: {
        topic: "Strategic Clarity",
        score: scores.find((s) => s.cluster === 1)?.rating ?? 0,
      },
      cluster2: {
        topic: "Focus & Prioritization",
        score: scores.find((s) => s.cluster === 2)?.rating ?? 0,
      },
      cluster3: {
        topic: "Decisions",
        score: scores.find((s) => s.cluster === 3)?.rating ?? 0,
      },
    },
  };
}

export function downloadJSON(data: DiagnosticExport, filename: string = "diagnostic-export.json") {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
