import { getActionTemplate } from "@/features/findings/content";
import {
  DailyPlan,
  Finding,
  FindingsRoadmapResult,
  GenerateFindingsInput,
  PriorityBand,
  ROADMAP_PHASE_ORDER,
  RoadmapItem,
  RoadmapPhaseId,
} from "@/features/findings/types";
import { OnboardingResponses } from "@/features/onboarding/types";
import { QuizDefinition, QuizOptionId } from "@/features/quizzes/types";

const OPTION_WEIGHT: Record<QuizOptionId, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

const CATEGORY_CONCERN_MAP: Record<string, string[]> = {
  "air + fragrance": [
    "sleep",
    "energy",
    "hormones",
    "fertility/pregnancy/baby safety",
    "skin",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "pet safety",
    "moving into a new place",
    "detox my home fast",
  ],
  water: [
    "sleep",
    "energy",
    "skin",
    "gut",
    "hormones",
    "fertility/pregnancy/baby safety",
    "weight/body composition",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "pet safety",
    "detox my home fast",
  ],
  "cleaning sprays": [
    "sleep",
    "energy",
    "hormones",
    "fertility/pregnancy/baby safety",
    "skin",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "pet safety",
    "moving into a new place",
    "detox my home fast",
  ],
  "cookware + food storage": [
    "energy",
    "hormones",
    "fertility/pregnancy/baby safety",
    "skin",
    "gut",
    "weight/body composition",
    "focus",
    "mood stability",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "detox my home fast",
  ],
  "food reset": [
    "sleep",
    "energy",
    "hormones",
    "fertility/pregnancy/baby safety",
    "skin",
    "gut",
    "weight/body composition",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "detox my home fast",
  ],
  laundry: [
    "sleep",
    "energy",
    "hormones",
    "fertility/pregnancy/baby safety",
    "skin",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "pet safety",
    "moving into a new place",
    "detox my home fast",
  ],
  "mind + stress": [
    "sleep",
    "energy",
    "hormones",
    "skin",
    "gut",
    "weight/body composition",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "detox my home fast",
  ],
  "personal care": [
    "sleep",
    "energy",
    "hormones",
    "fertility/pregnancy/baby safety",
    "skin",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "pet safety",
    "detox my home fast",
  ],
  "pest control": [
    "sleep",
    "energy",
    "hormones",
    "fertility/pregnancy/baby safety",
    "skin",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "pet safety",
    "moving into a new place",
    "detox my home fast",
  ],
  "sleep environment": [
    "sleep",
    "energy",
    "hormones",
    "skin",
    "gut",
    "weight/body composition",
    "focus",
    "mood stability",
    "stress/overwhelm",
    "inflammation",
    "migraines/headaches",
    "allergies/asthma",
    "detox my home fast",
  ],
};

const CATEGORY_TRIGGER_QUESTIONS: Record<string, string[]> = {
  "air-fragrance": ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q9"],
  water: ["q1", "q3", "q4", "q6", "q7", "q10"],
  "cleaning-sprays": ["q1", "q2", "q4", "q5", "q9", "q10"],
  "cookware-food-storage": ["q2", "q3", "q6", "q8", "q10"],
  "food-reset": ["q1", "q3", "q4", "q5", "q6", "q9", "q10"],
  laundry: ["q1", "q2", "q3", "q4", "q6", "q10"],
  "mind-stress": ["q1", "q2", "q3", "q5", "q6", "q7", "q10"],
  "personal-care": ["q1", "q2", "q3", "q4", "q5", "q8", "q10"],
  "pest-control": ["q1", "q2", "q3", "q4", "q5", "q10"],
  "sleep-environment": ["q1", "q2", "q3", "q4", "q6", "q8", "q9", "q10"],
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildEmptyRoadmapByPhase(): Record<RoadmapPhaseId, RoadmapItem[]> {
  return {
    stop_biggest_exposures: [],
    stabilize_baseline: [],
    swap_defaults: [],
    upgrade_environment: [],
    maintain: [],
  };
}

function createEmptyDailyPlan(onboarding: OnboardingResponses): DailyPlan {
  const maxActions = Math.max(1, Math.min(10, Math.round(onboarding.actionsPerDay)));

  return {
    date: new Date().toISOString().slice(0, 10),
    focusStyle: onboarding.focusStyle,
    maxActions,
    categoryLimit: onboarding.focusStyle === "mixed" ? Math.min(3, maxActions) : 1,
    focusCategory: null,
    actions: [],
  };
}

function createEmptyResult(input: GenerateFindingsInput): FindingsRoadmapResult {
  return {
    generatedAt: new Date().toISOString(),
    findings: [],
    priorities: [],
    roadmapByPhase: buildEmptyRoadmapByPhase(),
    dailyPlan: createEmptyDailyPlan(input.onboarding),
    completedQuizCount: 0,
    totalQuizCount: input.quizzes.length,
    nextBestQuizId: input.quizzes[0]?.id ?? null,
    highestPriorityCategory: null,
  };
}

function toFindingSeverity(weight: number): "low" | "moderate" | "high" {
  if (weight >= 3) {
    return "high";
  }

  if (weight >= 2) {
    return "moderate";
  }

  return "low";
}

function toFindingFrequency(weight: number): "occasional" | "repeated" | "daily" {
  if (weight >= 3) {
    return "daily";
  }

  if (weight >= 2) {
    return "repeated";
  }

  return "occasional";
}

function toPriorityBand(priorityScore: number): PriorityBand {
  if (priorityScore >= 8) {
    return "high";
  }

  if (priorityScore >= 4) {
    return "medium";
  }

  return "low";
}

function toRoadmapPhase(priorityScore: number): RoadmapPhaseId {
  if (priorityScore >= 9) {
    return "stop_biggest_exposures";
  }

  if (priorityScore >= 6) {
    return "stabilize_baseline";
  }

  if (priorityScore >= 4) {
    return "swap_defaults";
  }

  if (priorityScore >= 2.5) {
    return "upgrade_environment";
  }

  return "maintain";
}

function findConcernOverlap(onboarding: OnboardingResponses, category: string): number {
  const relatedConcerns = CATEGORY_CONCERN_MAP[category.toLowerCase()] ?? [];

  if (relatedConcerns.length === 0 || onboarding.concerns.length === 0) {
    return 0;
  }

  const concernSet = new Set(onboarding.concerns.map((concern) => concern.toLowerCase()));

  return relatedConcerns.filter((concern) => concernSet.has(concern)).length;
}

function buildSensitivityMultiplier(
  onboarding: OnboardingResponses,
  category: string,
  questionId: string,
  optionId: QuizOptionId,
): { flags: string[]; multiplier: number } {
  const flags: string[] = [];
  let multiplier = 1;

  if (onboarding.sensitivities.length > 0) {
    multiplier += Math.min(0.3, onboarding.sensitivities.length * 0.06);
    flags.push(...onboarding.sensitivities);
  }

  const concernOverlap = findConcernOverlap(onboarding, category);

  if (concernOverlap > 0) {
    multiplier += Math.min(0.2, concernOverlap * 0.08);
    flags.push("concern-aligned");
  }

  if (onboarding.concerns.includes("detox my home fast")) {
    multiplier += 0.08;
    flags.push("rapid-reset-preference");
  }

  if (onboarding.customConcern.trim().length > 0) {
    multiplier += 0.03;
  }

  if (questionId === "q10") {
    if (optionId === "C") {
      multiplier += 0.2;
      flags.push("heightened-household-sensitivity");
    }

    if (optionId === "D") {
      multiplier += 0.35;
      flags.push("high-household-sensitivity");
    }
  }

  return {
    flags: [...new Set(flags)],
    multiplier: round(multiplier),
  };
}

function isCategoryTrigger(
  quizId: string,
  questionId: string,
  optionId: QuizOptionId,
): boolean {
  if (optionId !== "C" && optionId !== "D") {
    return false;
  }

  const triggerQuestions = CATEGORY_TRIGGER_QUESTIONS[quizId];

  if (!triggerQuestions) {
    return false;
  }

  return triggerQuestions.includes(questionId);
}

function sortPriorities(items: RoadmapItem[]): RoadmapItem[] {
  return [...items].sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }

    const categoryCompare = a.category.localeCompare(b.category);

    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    return a.title.localeCompare(b.title);
  });
}

function pickFocusCategory(priorities: RoadmapItem[]): string | null {
  if (priorities.length === 0) {
    return null;
  }

  const categoryScores = new Map<string, number>();

  priorities.forEach((item) => {
    categoryScores.set(item.category, (categoryScores.get(item.category) ?? 0) + item.priorityScore);
  });

  return [...categoryScores.entries()].sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }

    return a[0].localeCompare(b[0]);
  })[0]?.[0] ?? null;
}

function buildDailyPlan(priorities: RoadmapItem[], onboarding: OnboardingResponses): DailyPlan {
  const maxActions = Math.max(1, Math.min(10, Math.round(onboarding.actionsPerDay)));
  const date = new Date().toISOString().slice(0, 10);

  if (priorities.length === 0) {
    return {
      date,
      focusStyle: onboarding.focusStyle,
      maxActions,
      categoryLimit: onboarding.focusStyle === "mixed" ? Math.min(3, maxActions) : 1,
      focusCategory: null,
      actions: [],
    };
  }

  if (onboarding.focusStyle === "one_category") {
    const focusCategory = pickFocusCategory(priorities);
    const selected: RoadmapItem[] = [];

    if (focusCategory) {
      priorities.forEach((item) => {
        if (item.category === focusCategory && selected.length < maxActions) {
          selected.push(item);
        }
      });
    }

    if (selected.length < maxActions) {
      priorities.forEach((item) => {
        if (selected.some((selectedItem) => selectedItem.id === item.id)) {
          return;
        }

        if (selected.length < maxActions) {
          selected.push(item);
        }
      });
    }

    return {
      date,
      focusStyle: onboarding.focusStyle,
      maxActions,
      categoryLimit: 1,
      focusCategory,
      actions: selected,
    };
  }

  const categoryLimit = Math.min(3, maxActions);
  const categoriesUsed = new Set<string>();
  const selected: RoadmapItem[] = [];

  priorities.forEach((item) => {
    if (selected.length >= maxActions) {
      return;
    }

    const categoryAlreadyUsed = categoriesUsed.has(item.category);

    if (!categoryAlreadyUsed && categoriesUsed.size >= categoryLimit) {
      return;
    }

    selected.push(item);
    categoriesUsed.add(item.category);
  });

  if (selected.length < maxActions) {
    priorities.forEach((item) => {
      if (selected.some((selectedItem) => selectedItem.id === item.id)) {
        return;
      }

      if (selected.length < maxActions) {
        selected.push(item);
      }
    });
  }

  return {
    date,
    focusStyle: onboarding.focusStyle,
    maxActions,
    categoryLimit,
    focusCategory: null,
    actions: selected,
  };
}

function getNextBestQuizId(quizzes: QuizDefinition[], quizState: GenerateFindingsInput["quizState"]): string | null {
  const inProgressQuiz = quizzes.find((quiz) => {
    const progress = quizState.quizzes[quiz.id];

    if (!progress || progress.completed) {
      return false;
    }

    return Object.keys(progress.answers).length > 0;
  });

  if (inProgressQuiz) {
    return inProgressQuiz.id;
  }

  const nextIncompleteQuiz = quizzes.find((quiz) => !quizState.quizzes[quiz.id]?.completed);
  return nextIncompleteQuiz?.id ?? null;
}

export function generateFindingsRoadmap(input: GenerateFindingsInput): FindingsRoadmapResult {
  if (!input.onboardingCompleted) {
    return createEmptyResult(input);
  }

  const findings: Finding[] = [];
  const roadmapItems: RoadmapItem[] = [];

  input.quizzes.forEach((quiz) => {
    const progress = input.quizState.quizzes[quiz.id];

    if (!progress) {
      return;
    }

    quiz.questions.forEach((question) => {
      const optionId = progress.answers[question.id];

      if (!optionId) {
        return;
      }

      const weight = OPTION_WEIGHT[optionId];

      if (weight <= 0) {
        return;
      }

      const selectedOption = question.options.find((option) => option.id === optionId);

      if (!selectedOption) {
        return;
      }

      const template = getActionTemplate(quiz, question);
      const trigger =
        (template.triggerOnHighAnswer && weight >= 2) ||
        isCategoryTrigger(quiz.id, question.id, optionId);
      const sensitivity = buildSensitivityMultiplier(
        input.onboarding,
        quiz.category,
        question.id,
        optionId,
      );
      const triggerBoost = trigger ? 1.22 : 1;
      const priorityScore = round(
        weight * weight * sensitivity.multiplier * template.feasibility * triggerBoost,
      );

      const findingId = `${quiz.id}:${question.id}`;
      const summary = `${quiz.category}: ${selectedOption.text}`;

      findings.push({
        id: findingId,
        quizId: quiz.id,
        quizTitle: quiz.title,
        category: quiz.category,
        questionId: question.id,
        questionPrompt: question.prompt,
        selectedOptionId: optionId,
        selectedOptionText: selectedOption.text,
        summary,
        severity: toFindingSeverity(weight),
        frequency: toFindingFrequency(weight),
        flags: sensitivity.flags,
        trigger,
        score: {
          severity: weight,
          frequency: weight,
          sensitivity: sensitivity.multiplier,
          feasibility: template.feasibility,
          triggerBoost,
          priority: priorityScore,
        },
      });

      roadmapItems.push({
        id: `${findingId}:action`,
        findingId,
        quizId: quiz.id,
        questionId: question.id,
        category: quiz.category,
        title: template.title,
        whyItMatters: template.whyItMatters,
        minimumStep: template.minimumStep,
        lowCostUpgrade: template.lowCostUpgrade,
        premiumUpgrade: template.premiumUpgrade,
        phase: toRoadmapPhase(priorityScore),
        priorityBand: toPriorityBand(priorityScore),
        priorityScore,
        trigger,
      });
    });
  });

  const priorities = sortPriorities(roadmapItems);
  const roadmapByPhase = buildEmptyRoadmapByPhase();

  priorities.forEach((item) => {
    roadmapByPhase[item.phase].push(item);
  });

  const completedQuizCount = input.quizzes.filter((quiz) => input.quizState.quizzes[quiz.id]?.completed).length;
  const dailyPlan = buildDailyPlan(priorities, input.onboarding);
  const highestPriorityCategory = priorities[0]?.category ?? null;
  const nextBestQuizId = getNextBestQuizId(input.quizzes, input.quizState);

  return {
    generatedAt: new Date().toISOString(),
    findings,
    priorities,
    roadmapByPhase,
    dailyPlan,
    completedQuizCount,
    totalQuizCount: input.quizzes.length,
    nextBestQuizId,
    highestPriorityCategory,
  };
}

export function getRoadmapPhaseCount(
  roadmapByPhase: FindingsRoadmapResult["roadmapByPhase"],
): Array<{ count: number; phase: RoadmapPhaseId }> {
  return ROADMAP_PHASE_ORDER.map((phase) => ({
    phase,
    count: roadmapByPhase[phase].length,
  }));
}
