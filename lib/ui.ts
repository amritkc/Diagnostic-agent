import { Stage } from "./types";

export function getStep(stage: Stage): number {
  if (
    stage === "intro" ||
    stage === "cluster1_question" ||
    stage === "cluster1_followup" ||
    stage === "cluster1_rating"
  )
    return 1;
  if (
    stage === "cluster2_question" ||
    stage === "cluster2_followup" ||
    stage === "cluster2_rating"
  )
    return 2;
  return 3;
}
