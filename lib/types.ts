export type Stage =
  | "intro"
  | "cluster1_question"
  | "cluster1_followup"
  | "cluster1_rating"
  | "cluster2_question"
  | "cluster2_followup"
  | "cluster2_rating"
  | "cluster3_question"
  | "cluster3_followup"
  | "cluster3_rating"
  | "summary";

export type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export interface ClusterScore {
  cluster: 1 | 2 | 3;
  rating: number;
  userAnswer: string;
}

export interface ChatRequest {
  stage: Stage;
  history: Message[];
  userMessage: string;
  scores: ClusterScore[];
  redirectCount?: number;
}

export interface ChatResponse {
  reply: string;
  nextStage: Stage;
  capturedScore?: ClusterScore;
  redirectCount?: number;
}