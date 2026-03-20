import { FocusStyle, OnboardingState, OnboardingStepId, PacePreset } from "@/features/onboarding/types";

export const ONBOARDING_STEPS: OnboardingStepId[] = [
  "concerns",
  "pace",
  "focus_style",
  "sensitivities",
];

export const CONCERN_OPTIONS = [
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
  "pet safety",
  "moving into a new place",
  "detox my home fast",
];

export const DEFAULT_SENSITIVITY_OPTIONS = [
  "baby/trying",
  "pets",
  "asthma",
  "migraines",
  "eczema/sensitive skin",
  "fragrance sensitivity",
];

export const PACE_PRESET_CONFIG: Record<
  PacePreset,
  { actionsPerDay: number; description: string; label: string; rangeLabel: string }
> = {
  recovery: {
    actionsPerDay: 2,
    description: "Gentle pace with low daily load.",
    label: "Recovery",
    rangeLabel: "1-2/day",
  },
  standard: {
    actionsPerDay: 4,
    description: "Balanced pace for steady progress.",
    label: "Standard",
    rangeLabel: "3-5/day",
  },
  intensive: {
    actionsPerDay: 8,
    description: "Faster pace for concentrated reset work.",
    label: "Intensive",
    rangeLabel: "6-10/day",
  },
  sprint: {
    actionsPerDay: 10,
    description: "Highest v1 pace (capped in this phase).",
    label: "Sprint",
    rangeLabel: "10/day",
  },
};

export const DEFAULT_FOCUS_STYLE: FocusStyle = "mixed";
export const DEFAULT_PACE_PRESET: PacePreset = "standard";
export const DEFAULT_ACTIONS_PER_DAY = PACE_PRESET_CONFIG[DEFAULT_PACE_PRESET].actionsPerDay;

export function createDefaultOnboardingState(): OnboardingState {
  return {
    completed: false,
    currentStep: 0,
    responses: {
      concerns: [],
      customConcern: "",
      actionsPerDay: DEFAULT_ACTIONS_PER_DAY,
      pacePreset: DEFAULT_PACE_PRESET,
      focusStyle: DEFAULT_FOCUS_STYLE,
      sensitivities: [],
      additionalSensitivities: [],
      notificationsEnabled: false,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function clampActionsPerDay(value: number): number {
  return Math.min(10, Math.max(1, value));
}

export function derivePacePreset(actionsPerDay: number): PacePreset {
  if (actionsPerDay <= 2) {
    return "recovery";
  }

  if (actionsPerDay <= 5) {
    return "standard";
  }

  if (actionsPerDay <= 9) {
    return "intensive";
  }

  return "sprint";
}
