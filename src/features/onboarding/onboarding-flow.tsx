"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import {
  clampActionsPerDay,
  CONCERN_OPTIONS,
  createDefaultOnboardingState,
  DEFAULT_SENSITIVITY_OPTIONS,
  derivePacePreset,
  ONBOARDING_STEPS,
  PACE_PRESET_CONFIG,
} from "@/features/onboarding/constants";
import { ConcernsStep } from "@/features/onboarding/steps/concerns-step";
import { FocusStyleStep } from "@/features/onboarding/steps/focus-style-step";
import { PaceStep } from "@/features/onboarding/steps/pace-step";
import { PreferencesStep } from "@/features/onboarding/steps/preferences-step";
import { OnboardingState, OnboardingStepId } from "@/features/onboarding/types";
import { cn } from "@/lib/cn";

type OnboardingFlowProps = {
  initialState: OnboardingState;
  onComplete: (state: OnboardingState) => void;
  onStateChange: (state: OnboardingState) => void;
};

const stepContent: Record<
  OnboardingStepId,
  { subtitle: string; title: string }
> = {
  concerns: {
    title: "Biggest Concerns",
    subtitle: "Select outcomes you want to improve. You can choose multiple.",
  },
  pace: {
    title: "Set Your Pace",
    subtitle: "Choose how many actions per day feels realistic for your schedule.",
  },
  focus_style: {
    title: "Choose Focus Style",
    subtitle: "Pick whether you prefer one category/day or a mixed approach.",
  },
  sensitivities: {
    title: "Sensitivities & Preferences",
    subtitle: "Mark sensitivity context and optional reminder preference.",
  },
};

function toggleArrayValue(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return values.filter((entry) => entry !== value);
  }

  return [...values, value];
}

export function OnboardingFlow({ initialState, onComplete, onStateChange }: OnboardingFlowProps) {
  const [state, setState] = useState<OnboardingState>(
    initialState ?? createDefaultOnboardingState(),
  );

  const currentStepIndex = Math.min(
    Math.max(state.currentStep, 0),
    ONBOARDING_STEPS.length - 1,
  );
  const currentStepId = ONBOARDING_STEPS[currentStepIndex];
  const metadata = stepContent[currentStepId];

  function commit(next: OnboardingState): void {
    setState(next);
    onStateChange(next);
  }

  function updateResponses(
    updater: (draft: OnboardingState["responses"]) => OnboardingState["responses"],
  ): void {
    const next: OnboardingState = {
      ...state,
      responses: updater(state.responses),
      updatedAt: new Date().toISOString(),
    };

    commit(next);
  }

  function goToStep(stepIndex: number): void {
    const bounded = Math.min(Math.max(stepIndex, 0), ONBOARDING_STEPS.length - 1);
    commit({
      ...state,
      currentStep: bounded,
      updatedAt: new Date().toISOString(),
    });
  }

  function handleContinue(): void {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
      return;
    }

    const completedState: OnboardingState = {
      ...state,
      completed: true,
      currentStep: ONBOARDING_STEPS.length - 1,
      updatedAt: new Date().toISOString(),
    };

    commit(completedState);
    onComplete(completedState);
  }

  function handleBack(): void {
    goToStep(currentStepIndex - 1);
  }

  function renderStep() {
    switch (currentStepId) {
      case "concerns":
        return (
          <ConcernsStep
            concerns={state.responses.concerns}
            customConcern={state.responses.customConcern}
            onCustomConcernChange={(value) =>
              updateResponses((responses) => ({
                ...responses,
                customConcern: value.trimStart().slice(0, 180),
              }))
            }
            onToggleConcern={(concern) =>
              updateResponses((responses) => ({
                ...responses,
                concerns: toggleArrayValue(responses.concerns, concern),
              }))
            }
            options={CONCERN_OPTIONS}
          />
        );

      case "pace":
        return (
          <PaceStep
            actionsPerDay={state.responses.actionsPerDay}
            onActionsPerDayChange={(value) =>
              updateResponses((responses) => {
                const actionsPerDay = clampActionsPerDay(value);

                return {
                  ...responses,
                  actionsPerDay,
                  pacePreset: derivePacePreset(actionsPerDay),
                };
              })
            }
            onPresetSelect={(preset) =>
              updateResponses((responses) => ({
                ...responses,
                actionsPerDay: PACE_PRESET_CONFIG[preset].actionsPerDay,
                pacePreset: preset,
              }))
            }
            selectedPreset={state.responses.pacePreset}
          />
        );

      case "focus_style":
        return (
          <FocusStyleStep
            focusStyle={state.responses.focusStyle}
            onFocusStyleChange={(value) =>
              updateResponses((responses) => ({
                ...responses,
                focusStyle: value,
              }))
            }
          />
        );

      case "sensitivities":
        return (
          <PreferencesStep
            additionalSensitivities={state.responses.additionalSensitivities}
            notificationsEnabled={state.responses.notificationsEnabled}
            onAddSensitivity={(value) =>
              updateResponses((responses) => {
                if (responses.additionalSensitivities.includes(value)) {
                  return responses;
                }

                return {
                  ...responses,
                  additionalSensitivities: [...responses.additionalSensitivities, value],
                  sensitivities: responses.sensitivities.includes(value)
                    ? responses.sensitivities
                    : [...responses.sensitivities, value],
                };
              })
            }
            onNotificationPreferenceChange={(value) =>
              updateResponses((responses) => ({
                ...responses,
                notificationsEnabled: value,
              }))
            }
            onRemoveAdditionalSensitivity={(value) =>
              updateResponses((responses) => ({
                ...responses,
                additionalSensitivities: responses.additionalSensitivities.filter(
                  (entry) => entry !== value,
                ),
                sensitivities: responses.sensitivities.filter((entry) => entry !== value),
              }))
            }
            onToggleSensitivity={(value) =>
              updateResponses((responses) => ({
                ...responses,
                sensitivities: toggleArrayValue(responses.sensitivities, value),
              }))
            }
            selectedSensitivities={state.responses.sensitivities}
            sensitivityDefaults={DEFAULT_SENSITIVITY_OPTIONS}
          />
        );

      default:
        return null;
    }
  }

  return (
    <ScreenContainer className="hr-onboarding-screen">
      <Card className="hr-onboarding-header-card">
        <InlineGroup>
          <Pill tone="accent">
            Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
          </Pill>
          <Pill>Onboarding</Pill>
        </InlineGroup>
        <h2 className="hr-feature-title">{metadata.title}</h2>
        <p className="hr-copy hr-onboarding-header-copy">{metadata.subtitle}</p>
        <div className="hr-step-track hr-onboarding-step-track">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              className={cn("hr-step-dot", index <= currentStepIndex && "is-active")}
              key={step}
            />
          ))}
        </div>
      </Card>

      {renderStep()}

      <Card className="hr-onboarding-cta-card" tone="soft">
        <InlineGroup className="hr-onboarding-nav">
          <Button
            disabled={currentStepIndex === 0}
            onClick={handleBack}
            size="md"
            variant="quiet"
          >
            Back
          </Button>
          <Button onClick={handleContinue} size="md" variant="primary">
            {currentStepIndex === ONBOARDING_STEPS.length - 1 ? "Finish Onboarding" : "Continue"}
          </Button>
        </InlineGroup>
      </Card>
    </ScreenContainer>
  );
}
