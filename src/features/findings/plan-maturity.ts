export type PlanMaturityStage =
  | "pending"
  | "early"
  | "developing"
  | "refining"
  | "calibrated";

export type PlanMaturity = {
  badge: string;
  progressLabel: string;
  stage: PlanMaturityStage;
  summary: string;
  title: string;
};

function buildProgressLabel(completedCategories: number, totalCategories: number): string {
  return `${completedCategories} of ${totalCategories} categories completed`;
}

export function getPlanMaturity(
  completedCategories: number,
  totalCategories: number,
): PlanMaturity {
  if (totalCategories <= 0) {
    return {
      stage: "pending",
      badge: "Plan setup",
      title: "Roadmap is waiting for quiz input",
      progressLabel: "0 of 0 categories completed",
      summary: "Complete a category quiz to generate your first roadmap actions.",
    };
  }

  const boundedCompleted = Math.max(0, Math.min(completedCategories, totalCategories));
  const progressLabel = buildProgressLabel(boundedCompleted, totalCategories);
  const completionRatio = boundedCompleted / totalCategories;

  if (boundedCompleted <= 1) {
    return {
      stage: "early",
      badge: "Early plan",
      title: "Initial roadmap",
      progressLabel,
      summary: `${progressLabel}. Complete more quizzes to sharpen recommendations.`,
    };
  }

  if (completionRatio < 0.5) {
    return {
      stage: "developing",
      badge: "Developing plan",
      title: "Roadmap is still calibrating",
      progressLabel,
      summary: `${progressLabel}. Each completed category improves ranking precision.`,
    };
  }

  if (completionRatio < 1) {
    return {
      stage: "refining",
      badge: "Refining plan",
      title: "Roadmap is becoming more precise",
      progressLabel,
      summary: `${progressLabel}. Finish remaining quizzes for full category coverage.`,
    };
  }

  return {
    stage: "calibrated",
    badge: "Calibrated plan",
    title: "Full roadmap coverage",
    progressLabel,
    summary: `${progressLabel}. Recommendations now reflect all current categories.`,
  };
}
