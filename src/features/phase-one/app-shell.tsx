"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BottomTabs } from "@/components/navigation/bottom-tabs";
import {
  createInitialActionState,
  loadActionState,
  saveActionState,
  setActionCompleted,
  setActionSnoozed,
} from "@/features/actions/storage";
import { ActionState } from "@/features/actions/types";
import { generateFindingsRoadmap } from "@/features/findings/engine";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import { createDefaultOnboardingState } from "@/features/onboarding/constants";
import { loadOnboardingState, saveOnboardingState } from "@/features/onboarding/storage";
import { OnboardingState } from "@/features/onboarding/types";
import { HomeScreen } from "@/features/phase-one/screens/home-screen";
import { ProfileScreen } from "@/features/phase-one/screens/profile-screen";
import { QuizzesScreen } from "@/features/phase-one/screens/quizzes-screen";
import { RoadmapScreen } from "@/features/phase-one/screens/roadmap-screen";
import { VaultScreen } from "@/features/phase-one/screens/vault-screen";
import { TABS, TabId } from "@/features/phase-one/tabs";
import { QUIZ_DEFINITIONS } from "@/features/quizzes/registry";
import {
  createInitialQuizState,
  loadQuizState,
  normalizeQuizState,
  saveQuizState,
} from "@/features/quizzes/storage";
import { QuizState } from "@/features/quizzes/types";

const searchableTabs: TabId[] = ["home", "roadmap", "vault"];

export function PhaseOneAppShell() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(
    () =>
      typeof window === "undefined" ? createDefaultOnboardingState() : loadOnboardingState(),
  );
  const [quizState, setQuizState] = useState<QuizState>(() =>
    typeof window === "undefined" ? createInitialQuizState() : loadQuizState(),
  );
  const [actionState, setActionState] = useState<ActionState>(() =>
    typeof window === "undefined" ? createInitialActionState() : loadActionState(),
  );
  const shellBodyRef = useRef<HTMLDivElement | null>(null);

  const findingsRoadmap = useMemo(
    () =>
      generateFindingsRoadmap({
        onboarding: onboardingState.responses,
        onboardingCompleted: onboardingState.completed,
        quizState,
        quizzes: QUIZ_DEFINITIONS,
      }),
    [onboardingState.completed, onboardingState.responses, quizState],
  );

  const onboardingIncomplete = !onboardingState.completed;
  const searchEnabled = !onboardingIncomplete && searchableTabs.includes(activeTab);
  const activeTabLabel = onboardingIncomplete
    ? "Onboarding"
    : (TABS.find((tab) => tab.id === activeTab)?.label ?? "Home");
  const maturity = getPlanMaturity(
    findingsRoadmap.completedQuizCount,
    findingsRoadmap.totalQuizCount,
  );
  const completionLabel = onboardingIncomplete ? "Setup in progress" : maturity.progressLabel;

  useEffect(() => {
    if (onboardingIncomplete) {
      return;
    }

    shellBodyRef.current?.scrollTo({ top: 0 });
  }, [activeTab, onboardingIncomplete]);

  function handleOnboardingStateChange(next: OnboardingState): void {
    setOnboardingState(next);
    saveOnboardingState(next);
  }

  function handleOnboardingComplete(next: OnboardingState): void {
    setOnboardingState(next);
    saveOnboardingState(next);
    setActiveTab("home");
  }

  function handleQuizStateChange(next: QuizState): void {
    const normalized = normalizeQuizState(next, QUIZ_DEFINITIONS);
    setQuizState(normalized);
    saveQuizState(normalized);
  }

  function handleRecalculateRoadmap(): void {
    const latestOnboarding = loadOnboardingState();
    const latestQuizState = loadQuizState();

    setOnboardingState(latestOnboarding);
    setQuizState(latestQuizState);
  }

  function handleActionDone(actionId: string): void {
    setActionState((current) => {
      const next = setActionCompleted(current, actionId);
      saveActionState(next);
      return next;
    });
  }

  function handleActionSnooze(actionId: string): void {
    setActionState((current) => {
      const next = setActionSnoozed(current, actionId);
      saveActionState(next);
      return next;
    });
  }

  function handleTabChange(nextTab: TabId): void {
    setActiveTab(nextTab);
  }

  function renderActiveScreen() {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            actionState={actionState}
            onActionDone={handleActionDone}
            onActionSnooze={handleActionSnooze}
            onOpenQuizzes={() => handleTabChange("quizzes")}
            quizDefinitions={QUIZ_DEFINITIONS}
            report={findingsRoadmap}
          />
        );

      case "quizzes":
        return <QuizzesScreen onQuizStateChange={handleQuizStateChange} quizState={quizState} />;

      case "roadmap":
        return (
          <RoadmapScreen
            actionState={actionState}
            onActionDone={handleActionDone}
            onActionSnooze={handleActionSnooze}
            report={findingsRoadmap}
          />
        );

      case "vault":
        return <VaultScreen />;

      case "profile":
        return (
          <ProfileScreen
            onboardingState={onboardingState}
            onRecalculateRoadmap={handleRecalculateRoadmap}
            report={findingsRoadmap}
          />
        );

      default:
        return (
          <HomeScreen
            actionState={actionState}
            onActionDone={handleActionDone}
            onActionSnooze={handleActionSnooze}
            onOpenQuizzes={() => handleTabChange("quizzes")}
            quizDefinitions={QUIZ_DEFINITIONS}
            report={findingsRoadmap}
          />
        );
    }
  }

  return (
    <div className="hr-app-root">
      <main aria-label="The Human Reset" className="hr-shell" role="application">
        <header className="hr-shell-header">
          <div aria-hidden="true" className="hr-shell-mark">
            HR
          </div>

          <div className="hr-shell-title-wrap">
            <h1 className="hr-shell-title">The Human Reset</h1>
            <p className="hr-shell-context">{activeTabLabel}</p>
          </div>

          <div className="hr-shell-header-side">
            <p className="hr-shell-meta">{completionLabel}</p>
            <button
              aria-disabled={!searchEnabled}
              aria-label={searchEnabled ? "Search" : "Search unavailable on this tab"}
              className="hr-icon-button"
              disabled={!searchEnabled}
              type="button"
            >
              <svg aria-hidden="true" className="hr-shell-icon" fill="none" viewBox="0 0 24 24">
                <circle cx="10" cy="10" r="5" />
                <path d="m14 14 5 5" />
              </svg>
            </button>
          </div>
        </header>

        <div className="hr-shell-body" ref={shellBodyRef}>
          {onboardingIncomplete ? (
            <OnboardingFlow
              initialState={onboardingState}
              onComplete={handleOnboardingComplete}
              onStateChange={handleOnboardingStateChange}
            />
          ) : (
            renderActiveScreen()
          )}
        </div>

        {!onboardingIncomplete ? <BottomTabs activeTab={activeTab} onTabChange={handleTabChange} /> : null}
      </main>
    </div>
  );
}
