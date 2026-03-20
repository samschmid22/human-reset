import { FocusStyle, OnboardingResponses } from "@/features/onboarding/types";
import { QuizDefinition, QuizOptionId, QuizState } from "@/features/quizzes/types";

export type FindingSeverity = "low" | "moderate" | "high";
export type FindingFrequency = "occasional" | "repeated" | "daily";
export type PriorityBand = "low" | "medium" | "high";

export type RoadmapPhaseId =
  | "stop_biggest_exposures"
  | "stabilize_baseline"
  | "swap_defaults"
  | "upgrade_environment"
  | "maintain";

export const ROADMAP_PHASE_ORDER: RoadmapPhaseId[] = [
  "stop_biggest_exposures",
  "stabilize_baseline",
  "swap_defaults",
  "upgrade_environment",
  "maintain",
];

export const ROADMAP_PHASE_LABELS: Record<RoadmapPhaseId, string> = {
  stop_biggest_exposures: "Stop biggest exposures",
  stabilize_baseline: "Stabilize baseline",
  swap_defaults: "Swap defaults",
  upgrade_environment: "Upgrade environment",
  maintain: "Maintain",
};

export type FindingScoreBreakdown = {
  severity: number;
  frequency: number;
  sensitivity: number;
  feasibility: number;
  triggerBoost: number;
  priority: number;
};

export type Finding = {
  id: string;
  quizId: string;
  quizTitle: string;
  category: string;
  questionId: string;
  questionPrompt: string;
  selectedOptionId: QuizOptionId;
  selectedOptionText: string;
  summary: string;
  severity: FindingSeverity;
  frequency: FindingFrequency;
  flags: string[];
  trigger: boolean;
  score: FindingScoreBreakdown;
};

export type RoadmapItem = {
  id: string;
  findingId: string;
  quizId: string;
  questionId: string;
  category: string;
  title: string;
  whyItMatters: string;
  minimumStep: string;
  lowCostUpgrade: string;
  premiumUpgrade: string;
  phase: RoadmapPhaseId;
  priorityBand: PriorityBand;
  priorityScore: number;
  trigger: boolean;
};

export type DailyPlan = {
  date: string;
  focusStyle: FocusStyle;
  maxActions: number;
  categoryLimit: number;
  focusCategory: string | null;
  actions: RoadmapItem[];
};

export type FindingsRoadmapResult = {
  generatedAt: string;
  findings: Finding[];
  priorities: RoadmapItem[];
  roadmapByPhase: Record<RoadmapPhaseId, RoadmapItem[]>;
  dailyPlan: DailyPlan;
  completedQuizCount: number;
  totalQuizCount: number;
  nextBestQuizId: string | null;
  highestPriorityCategory: string | null;
};

export type GenerateFindingsInput = {
  onboarding: OnboardingResponses;
  onboardingCompleted: boolean;
  quizState: QuizState;
  quizzes: QuizDefinition[];
};

export type FindingActionTemplate = {
  title: string;
  whyItMatters: string;
  minimumStep: string;
  lowCostUpgrade: string;
  premiumUpgrade: string;
  feasibility: number;
  triggerOnHighAnswer: boolean;
};
