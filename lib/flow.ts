import { Stage } from "./types";

export const INTRO_TEXT = `Peter Drucker once said: "Strategy is a commodity, execution is an art."

Most organizations don't fail because of bad strategy. They fail because strategy doesn't translate into everyday operations — into clarity, prioritization, decisions, and follow-through.

In the next few minutes, I'll guide you through a short structured conversation across three areas: strategic clarity, focus, and decisions. At the end, you'll have a clearer picture of where your organization creates impact — and where it loses momentum.

Ready to begin?`;

export const CLUSTER1_QUESTION = `Let's start with direction. In many organizations, the strategy is clear at the top — but interpreted differently in everyday operations.

If you formulate the strategic direction or mission of your company, department, or team for the next 12 months in one sentence — what would that sentence be?`;

export const CLUSTER1_RATING_PROMPT = `On a scale of 1 to 5, how clearly is your strategic direction currently formulated — and how strongly does it actually guide decisions in everyday operations?`;

export const CLUSTER2_QUESTION = `Now let's talk about focus. Many organizations lose impact not because of the wrong goals — but because too many things are pursued at the same time.

When you look at your current initiatives: are you working toward a few clear priorities, or on multiple topics in parallel?`;

export const CLUSTER2_RATING_PROMPT = `On a scale of 1 to 5, how consistently are you currently able to create focus — meaning to set priorities and at the same time consciously refrain from other topics?`;

export const CLUSTER3_QUESTION = `Now let's talk about decisions. When direction and focus are in place, decisions become the bridge to action.

Are important decisions in your organization made quickly — or are they further analyzed, aligned, and possibly postponed?`;

export const CLUSTER3_RATING_PROMPT = `On a scale of 1 to 5, how effective is your organization at making timely decisions and consistently implementing them afterward?`;

export function nextStage(current: Stage): Stage {
  const order: Stage[] = [
    "intro",
    "cluster1_question",
    "cluster1_followup",
    "cluster1_rating",
    "cluster2_question",
    "cluster2_followup",
    "cluster2_rating",
    "cluster3_question",
    "cluster3_followup",
    "cluster3_rating",
    "summary",
  ];
  const idx = order.indexOf(current);
  return order[Math.min(idx + 1, order.length - 1)];
}

export function extractRating(text: string): number | null {
  const trimmed = text.trim();
  // Match an integer or decimal between 1 and 5 (e.g. "4", "4.5", "4.22")
  const match = trimmed.match(/(?<![\d.])([1-5](?:\.\d+)?|5\.0+)(?![\d])/);
  if (!match) return null;
  const n = parseFloat(match[1]);
  if (n < 1 || n > 5) return null;
  // Round to 1 decimal place for clean display
  return Math.round(n * 10) / 10;
}