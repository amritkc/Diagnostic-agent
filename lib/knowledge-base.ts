export const cluster1_mission = {
  topic: "Strategic Clarity / Mission",
  qualityCriteria: [
    "Causal logic of impact (how does it create value?)",
    "Clear customer benefit (for whom?)",
    "Includes economic viability (profitability is part of the logic)",
    "Operationalizable — guides concrete decisions",
    "Distinct from a vision (today's value creation, not a future image)",
  ],
  commonMistakes: [
    "Marketing language ('be the best', 'market leader', 'world-class')",
    "Confusing mission with vision (future image vs. today's logic)",
    "Pure performance statements ('we deliver high-quality X')",
    "Missing economic viability — innovation without profitability logic",
    "Too abstract to guide decisions",
    "Transformation description instead of value creation logic",
  ],
  reflectionQuestions: [
    "For whom do we create value?",
    "How is economic value generated?",
    "What is our unique contribution?",
    "Is profitability part of the logic?",
    "Does this mission resolve our tensions?",
  ],
  goodExample:
    "'Innovative and sustainably viable drive solutions.' — names the offering, includes economic viability, guides decisions.",
};

export const cluster2_focus = {
  topic: "Focus & Prioritization",
  qualityCriteria: [
    "A small number of clear priorities (typically 3 or fewer)",
    "Conscious stopping of other initiatives, not just adding new ones",
    "Priorities visible in resource allocation, not just slides",
    "Trade-offs are made explicit",
  ],
  commonMistakes: [
    "Many parallel initiatives without ranking",
    "Adding new priorities without removing old ones",
    "Calling everything a priority (which means nothing is)",
    "No mechanism to consciously stop work",
  ],
  reflectionQuestions: [
    "How many initiatives have been added in the past months?",
    "Which ones were consciously stopped?",
    "What gets less attention because of these priorities?",
    "Could a team member name the top 3 priorities consistently?",
  ],
};

export const cluster3_decisions = {
  topic: "Decisions",
  qualityCriteria: [
    "Decisions are made within a clear timeframe",
    "Decision rights are clear (who decides what)",
    "Decisions are followed through, not re-opened",
    "Speed and quality are balanced — not endless analysis, not reckless",
  ],
  commonMistakes: [
    "Endless rounds of alignment and analysis",
    "Decisions made but not implemented",
    "Re-opening settled decisions when uncomfortable",
    "Unclear decision ownership",
  ],
  reflectionQuestions: [
    "How long does a typical important decision take?",
    "Are decisions implemented or revisited?",
    "Who has the right to decide what?",
    "What does your team do when a decision is uncomfortable?",
  ],
};

export const knowledgeBase = {
  1: cluster1_mission,
  2: cluster2_focus,
  3: cluster3_decisions,
};