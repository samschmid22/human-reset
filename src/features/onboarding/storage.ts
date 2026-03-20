import {
  clampActionsPerDay,
  createDefaultOnboardingState,
  DEFAULT_SENSITIVITY_OPTIONS,
  derivePacePreset,
  ONBOARDING_STEPS,
} from "@/features/onboarding/constants";
import { FocusStyle, OnboardingState, PacePreset } from "@/features/onboarding/types";

const STORAGE_KEY = "human-reset.onboarding.v1";
const MAX_TAG_LENGTH = 64;
const MAX_TEXT_LENGTH = 180;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeTag(value: string): string {
  return value.trim().toLowerCase().slice(0, MAX_TAG_LENGTH);
}

function sanitizeTags(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const unique = new Set<string>();

  values.forEach((value) => {
    if (typeof value !== "string") {
      return;
    }

    const normalized = sanitizeTag(value);

    if (normalized.length === 0) {
      return;
    }

    unique.add(normalized);
  });

  return [...unique];
}

function normalizeFocusStyle(value: unknown): FocusStyle {
  return value === "one_category" ? "one_category" : "mixed";
}

function normalizePacePreset(value: unknown, actionsPerDay: number): PacePreset {
  if (value === "recovery" || value === "standard" || value === "intensive" || value === "sprint") {
    return value;
  }

  return derivePacePreset(actionsPerDay);
}

function normalizeUpdatedAt(value: unknown): string {
  if (typeof value !== "string") {
    return new Date().toISOString();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

export function normalizeOnboardingState(value: unknown): OnboardingState {
  const fallback = createDefaultOnboardingState();

  if (!isRecord(value)) {
    return fallback;
  }

  const responsesRaw = isRecord(value.responses) ? value.responses : {};
  const actionsPerDayRaw =
    typeof responsesRaw.actionsPerDay === "number"
      ? responsesRaw.actionsPerDay
      : fallback.responses.actionsPerDay;
  const actionsPerDay = clampActionsPerDay(Math.round(actionsPerDayRaw));

  const additionalSensitivities = sanitizeTags(responsesRaw.additionalSensitivities);
  const sensitivityPool = new Set([...DEFAULT_SENSITIVITY_OPTIONS, ...additionalSensitivities]);
  const sensitivities = sanitizeTags(responsesRaw.sensitivities).filter((item) => sensitivityPool.has(item));

  const customConcern =
    typeof responsesRaw.customConcern === "string"
      ? responsesRaw.customConcern.trim().slice(0, MAX_TEXT_LENGTH)
      : fallback.responses.customConcern;

  const currentStepRaw = typeof value.currentStep === "number" ? Math.round(value.currentStep) : 0;
  const currentStep = Math.min(Math.max(currentStepRaw, 0), ONBOARDING_STEPS.length - 1);

  return {
    completed: value.completed === true,
    currentStep,
    responses: {
      concerns: sanitizeTags(responsesRaw.concerns),
      customConcern,
      actionsPerDay,
      pacePreset: normalizePacePreset(responsesRaw.pacePreset, actionsPerDay),
      focusStyle: normalizeFocusStyle(responsesRaw.focusStyle),
      sensitivities,
      additionalSensitivities,
      notificationsEnabled: responsesRaw.notificationsEnabled === true,
    },
    updatedAt: normalizeUpdatedAt(value.updatedAt),
  };
}

export function loadOnboardingState(): OnboardingState {
  if (typeof window === "undefined") {
    return createDefaultOnboardingState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return createDefaultOnboardingState();
  }

  try {
    return normalizeOnboardingState(JSON.parse(raw));
  } catch {
    return createDefaultOnboardingState();
  }
}

export function saveOnboardingState(state: OnboardingState): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeOnboardingState(state);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function clearOnboardingState(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
