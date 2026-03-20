export type PacePreset = "recovery" | "standard" | "intensive" | "sprint";
export type FocusStyle = "mixed" | "one_category";
export type OnboardingStepId = "concerns" | "pace" | "focus_style" | "sensitivities";

export type OnboardingResponses = {
  concerns: string[];
  customConcern: string;
  actionsPerDay: number;
  pacePreset: PacePreset;
  focusStyle: FocusStyle;
  sensitivities: string[];
  additionalSensitivities: string[];
  notificationsEnabled: boolean;
};

export type OnboardingState = {
  completed: boolean;
  currentStep: number;
  responses: OnboardingResponses;
  updatedAt: string;
};
