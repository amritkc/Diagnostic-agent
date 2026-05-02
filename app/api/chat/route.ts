import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getSystemPrompt } from "@/lib/prompts";
import {
  ChatRequest,
  ChatResponse,
  ClusterScore,
  Stage,
} from "@/lib/types";
import {
  CLUSTER1_QUESTION,
  CLUSTER1_RATING_PROMPT,
  CLUSTER2_QUESTION,
  CLUSTER2_RATING_PROMPT,
  CLUSTER3_QUESTION,
  CLUSTER3_RATING_PROMPT,
  extractRating,
} from "@/lib/flow";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { stage, history, userMessage, scores } = body;
    const currentRedirects = body.redirectCount ?? 0;

    // ─────────────────────────────────────────────
    // INTRO → Cluster 1 question
    // ─────────────────────────────────────────────
    if (stage === "intro") {
      return NextResponse.json<ChatResponse>({
        reply: CLUSTER1_QUESTION,
        nextStage: "cluster1_followup",
        redirectCount: 0,
      });
    }

    // ─────────────────────────────────────────────
    // FOLLOWUP STAGES → coach with knowledge base
    // ─────────────────────────────────────────────
    if (
      stage === "cluster1_followup" ||
      stage === "cluster2_followup" ||
      stage === "cluster3_followup"
    ) {
      const systemPrompt = getSystemPrompt(stage);

      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: userMessage },
        ],
        temperature: 0.4,
        max_tokens: 300,
        response_format: { type: "json_object" },
      });

      const raw = completion.choices[0].message.content ?? "{}";
      let parsed: { is_redirect: boolean; reply: string };
      try {
        parsed = JSON.parse(raw);
        if (typeof parsed.is_redirect !== "boolean" || typeof parsed.reply !== "string") {
          parsed = { is_redirect: false, reply: raw };
        }
      } catch {
        parsed = { is_redirect: false, reply: raw };
      }

      const ratingPrompt =
        stage === "cluster1_followup"
          ? CLUSTER1_RATING_PROMPT
          : stage === "cluster2_followup"
          ? CLUSTER2_RATING_PROMPT
          : CLUSTER3_RATING_PROMPT;

      const advanceTo: Stage =
        stage === "cluster1_followup"
          ? "cluster1_rating"
          : stage === "cluster2_followup"
          ? "cluster2_rating"
          : "cluster3_rating";

      // Soft cap: after 2 redirects on this cluster, move on anyway
      if (parsed.is_redirect && currentRedirects >= 2) {
        return NextResponse.json<ChatResponse>({
          reply: `No problem — let's move on for now.\n\n${ratingPrompt}`,
          nextStage: advanceTo,
          redirectCount: 0,
        });
      }

      // Redirect: stay on this stage, no rating prompt
      if (parsed.is_redirect) {
        return NextResponse.json<ChatResponse>({
          reply: parsed.reply,
          nextStage: stage,
          redirectCount: currentRedirects + 1,
        });
      }

      // Real answer: coach + rating prompt
      return NextResponse.json<ChatResponse>({
        reply: `${parsed.reply}\n\n${ratingPrompt}`,
        nextStage: advanceTo,
        redirectCount: 0,
      });
    }

    // ─────────────────────────────────────────────
    // RATING STAGES → validate number, bridge to next cluster
    // ─────────────────────────────────────────────
    if (
      stage === "cluster1_rating" ||
      stage === "cluster2_rating" ||
      stage === "cluster3_rating"
    ) {
      const rating = extractRating(userMessage);
      if (rating === null) {
        return NextResponse.json<ChatResponse>({
          reply: "Could you give me a number from 1 to 5? Decimals are fine.",
          nextStage: stage,
          redirectCount: currentRedirects,
        });
      }

      const clusterNum =
        stage === "cluster1_rating" ? 1 : stage === "cluster2_rating" ? 2 : 3;

      const priorUserAnswers = history.filter((m) => m.role === "user");
      const userAnswerForCluster =
        priorUserAnswers[priorUserAnswers.length - 1]?.content ?? "";

      const capturedScore: ClusterScore = {
        cluster: clusterNum as 1 | 2 | 3,
        rating,
        userAnswer: userAnswerForCluster,
      };

      const ack = `Got it — a ${rating}. Thank you.`;
      let nextOpening = "";
      let advanceTo: Stage;

      if (stage === "cluster1_rating") {
        nextOpening = CLUSTER2_QUESTION;
        advanceTo = "cluster2_followup";
      } else if (stage === "cluster2_rating") {
        nextOpening = CLUSTER3_QUESTION;
        advanceTo = "cluster3_followup";
      } else {
        nextOpening = await buildSummary([...scores, capturedScore]);
        advanceTo = "summary";
      }

      return NextResponse.json<ChatResponse>({
        reply: `${ack}\n\n${nextOpening}`,
        nextStage: advanceTo,
        capturedScore,
        redirectCount: 0,
      });
    }

    // Fallback
    return NextResponse.json<ChatResponse>({
      reply: "Thank you for the conversation.",
      nextStage: "summary",
      redirectCount: 0,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function buildSummary(scores: ClusterScore[]): Promise<string> {
  const topics: Record<number, string> = {
    1: "Strategic Clarity",
    2: "Focus",
    3: "Decisions",
  };
  const summaryInput = scores
    .map(
      (s) =>
        `${topics[s.cluster]}: rated ${s.rating}/5. Their answer was: "${s.userAnswer}"`
    )
    .join("\n");

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: getSystemPrompt("summary") },
      {
        role: "user",
        content: `Here are the diagnostic results to summarize:\n\n${summaryInput}`,
      },
    ],
    temperature: 0.6,
    max_tokens: 350,
  });

  return completion.choices[0].message.content ?? "";
}