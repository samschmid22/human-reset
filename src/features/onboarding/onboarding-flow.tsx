"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScreenContainer } from "@/components/ui/layout";
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

const stepContent: Record<OnboardingStepId, { title: string }> = {
  concerns: { title: "What matters most to you?" },
  pace: { title: "Set your pace" },
  focus_style: { title: "Choose your focus style" },
  sensitivities: { title: "Any sensitivities?" },
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
  const [showWelcome, setShowWelcome] = useState(
    (initialState ?? createDefaultOnboardingState()).currentStep === 0,
  );

  const currentStepIndex = Math.min(
    Math.max(state.currentStep, 0),
    ONBOARDING_STEPS.length - 1,
  );
  const currentStepId = ONBOARDING_STEPS[currentStepIndex];
  const metadata = stepContent[currentStepId];

  // Scroll to top on every navigation
  useEffect(() => {
    const el = document.querySelector(".hr-shell-body");
    if (el) el.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [currentStepIndex, showWelcome]);

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

  if (showWelcome) {
    return (
      <div className="hr-welcome-screen">
        <div className="hr-founder-quote-card">
          <p className="hr-founder-quote-body">
            "They spent billions making it easy to buy things that slowly harm you. The science
            existed. The risk was known.{" "}
            <strong>You just weren't supposed to find out.</strong>{" "}
            Welcome to The Human Reset. Now do something with it."
          </p>
          <p className="hr-founder-quote-attr">— The Founder</p>
        </div>
        <Button onClick={() => setShowWelcome(false)} size="md" variant="primary">
          I'm ready →
        </Button>
      </div>
    );
  }

  return (
    <ScreenContainer className="hr-onboarding-screen">
      <div className="hr-onb-top">
        <h2 className="hr-onb-title">{metadata.title}</h2>
        <p className="hr-onb-step-counter">Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}</p>
        <div className="hr-onb-step-dots">
          {ONBOARDING_STEPS.map((step, i) => (
            <div className={cn("hr-onb-dot", i <= currentStepIndex && "is-active")} key={step} />
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="hr-onb-actions">
        <Button onClick={handleContinue} size="md" variant="primary">
          {currentStepIndex === ONBOARDING_STEPS.length - 1 ? "Finish →" : "Next →"}
        </Button>
        {currentStepIndex > 0 ? (
          <button className="hr-onb-back-btn" onClick={handleBack} type="button">
            ← Back
          </button>
        ) : null}
      </div>
    </ScreenContainer>
  );
}
