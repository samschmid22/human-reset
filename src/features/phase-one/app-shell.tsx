"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BottomTabs } from "@/components/navigation/bottom-tabs";
import { Button } from "@/components/ui/button";
import {
  clearActionStatus,
  createInitialActionState,
  getDonePermanentActionIds,
  getDoneTodayCount,
  getSkippedActionIds,
  loadActionState,
  saveActionState,
  setActionDonePermanent,
  setActionDoneToday,
  setActionSkipped,
  setActionSnoozed,
  getTodayDateKey,
} from "@/features/actions/storage";
import { ActionState } from "@/features/actions/types";
import { generateFindingsRoadmap, removeInactiveFromResult } from "@/features/findings/engine";
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
import { TabId } from "@/features/phase-one/tabs";
import { QUIZ_DEFINITIONS } from "@/features/quizzes/registry";
import {
  createInitialQuizState,
  loadQuizState,
  normalizeQuizState,
  saveQuizState,
} from "@/features/quizzes/storage";
import { QuizState } from "@/features/quizzes/types";
import {
  checkStreakReset,
  createInitialStreakState,
  loadStreakState,
  maybeExtendStreak,
  saveStreakState,
} from "@/features/streak/storage";
import { StreakState } from "@/features/streak/types";

const searchableTabs: TabId[] = ["home", "roadmap", "vault"];
const vaultSearchTopics = [
  "Swaps library",
  "Home protocols",
  "Ingredient notes",
  "DIY and low-cost",
  "Air and fragrance baseline",
  "Kitchen contact reset",
  "Sleep environment reset",
  "Cleaning system simplification",
];

type SearchEntry = {
  id: string;
  label: string;
  meta: string;
  tab: TabId;
};

export function PhaseOneAppShell() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [streakState, setStreakState] = useState<StreakState>(() =>
    typeof window === "undefined" ? createInitialStreakState() : loadStreakState(),
  );
  const shellBodyRef = useRef<HTMLDivElement | null>(null);

  // Reset streak if user missed a day (run once on mount).
  useEffect(() => {
    const today = getTodayDateKey();
    const checked = checkStreakReset(streakState, today);
    if (checked.currentStreak !== streakState.currentStreak) {
      setStreakState(checked);
      saveStreakState(checked);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { findingsRoadmap, skippedRoadmapItems, donePermanentRoadmapItems } = useMemo(() => {
    const base = generateFindingsRoadmap({
      onboarding: onboardingState.responses,
      onboardingCompleted: onboardingState.completed,
      quizState,
      quizzes: QUIZ_DEFINITIONS,
    });
    const skippedIds = new Set(getSkippedActionIds(actionState));
    const donePermanentIds = new Set(getDonePermanentActionIds(actionState));
    const inactiveIds = new Set([...skippedIds, ...donePermanentIds]);

    const skipped = base.priorities.filter((item) => skippedIds.has(item.id));
    const donePermanent = base.priorities.filter((item) => donePermanentIds.has(item.id));

    return {
      findingsRoadmap: removeInactiveFromResult(base, inactiveIds),
      skippedRoadmapItems: skipped,
      donePermanentRoadmapItems: donePermanent,
    };
  }, [actionState, onboardingState.completed, onboardingState.responses, quizState]);

  const onboardingIncomplete = !onboardingState.completed;
  const searchEnabled = !onboardingIncomplete && searchableTabs.includes(activeTab);
  const maturity = getPlanMaturity(
    findingsRoadmap.completedQuizCount,
    findingsRoadmap.totalQuizCount,
  );
  const searchEntries = useMemo<SearchEntry[]>(() => {
    if (onboardingIncomplete) return [];

    const entries: SearchEntry[] = [];
    const seenIds = new Set<string>();

    function push(entry: SearchEntry): void {
      if (seenIds.has(entry.id)) return;
      seenIds.add(entry.id);
      entries.push(entry);
    }

    findingsRoadmap.priorities.forEach((item) => {
      push({ id: `action-${item.id}`, label: item.title, meta: `Roadmap action • ${item.category}`, tab: "roadmap" });
    });
    findingsRoadmap.dailyPlan.actions.forEach((item) => {
      push({ id: `daily-${item.id}`, label: item.title, meta: `Today • ${item.category}`, tab: "home" });
    });
    QUIZ_DEFINITIONS.forEach((quiz) => {
      push({ id: `quiz-${quiz.id}`, label: quiz.title, meta: "Quiz category", tab: "quizzes" });
    });
    vaultSearchTopics.forEach((topic) => {
      push({ id: `vault-${topic}`, label: topic, meta: "Vault topic", tab: "vault" });
    });

    return entries;
  }, [findingsRoadmap.dailyPlan.actions, findingsRoadmap.priorities, onboardingIncomplete]);

  const filteredSearchEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length === 0) return searchEntries.slice(0, 10);
    return searchEntries
      .filter((e) => e.label.toLowerCase().includes(query) || e.meta.toLowerCase().includes(query))
      .slice(0, 12);
  }, [searchEntries, searchQuery]);

  useEffect(() => {
    if (onboardingIncomplete) return;
    shellBodyRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [activeTab, onboardingIncomplete]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function commitStreak(nextActionState: ActionState): void {
    const today = getTodayDateKey();
    const doneCount = getDoneTodayCount(nextActionState, today);
    const paceTarget = Math.max(1, findingsRoadmap.dailyPlan.maxActions);
    const nextStreak = maybeExtendStreak(streakState, doneCount, paceTarget, today);
    if (nextStreak !== streakState) {
      setStreakState(nextStreak);
      saveStreakState(nextStreak);
    }
  }

  // ── Event handlers ─────────────────────────────────────────────────────────

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

  function handleActionDoneToday(actionId: string): void {
    const next = setActionDoneToday(actionState, actionId);
    saveActionState(next);
    setActionState(next);
    commitStreak(next);
  }

  function handleActionDonePermanent(actionId: string): void {
    const next = setActionDonePermanent(actionState, actionId);
    saveActionState(next);
    setActionState(next);
  }

  function handleActionSnooze(actionId: string): void {
    const next = setActionSnoozed(actionState, actionId);
    saveActionState(next);
    setActionState(next);
  }

  function handleActionSkip(actionId: string): void {
    const next = setActionSkipped(actionState, actionId);
    saveActionState(next);
    setActionState(next);
  }

  function handleActionReset(actionId: string): void {
    const next = clearActionStatus(actionState, actionId);
    saveActionState(next);
    setActionState(next);
  }

  function handleFocusStyleChange(style: "mixed" | "one_category"): void {
    const next: OnboardingState = {
      ...onboardingState,
      responses: { ...onboardingState.responses, focusStyle: style },
      updatedAt: new Date().toISOString(),
    };
    setOnboardingState(next);
    saveOnboardingState(next);
  }

  function handleTabChange(nextTab: TabId): void {
    setActiveTab(nextTab);
    setSearchOpen(false);
    setSearchQuery("");
  }

  function handleSearchToggle(): void {
    if (!searchEnabled) return;
    setSearchOpen((current) => !current);
  }

  function handleSearchResultSelect(tab: TabId): void {
    setActiveTab(tab);
    setSearchOpen(false);
    setSearchQuery("");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  function renderActiveScreen() {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            actionState={actionState}
            onActionDoneToday={handleActionDoneToday}
            onActionDonePermanent={handleActionDonePermanent}
            onActionReset={handleActionReset}
            onActionSkip={handleActionSkip}
            onActionSnooze={handleActionSnooze}
            onFocusStyleChange={handleFocusStyleChange}
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
            onActionDoneToday={handleActionDoneToday}
            onActionDonePermanent={handleActionDonePermanent}
            onActionReset={handleActionReset}
            onActionSkip={handleActionSkip}
            onActionSnooze={handleActionSnooze}
            report={findingsRoadmap}
          />
        );

      case "vault":
        return <VaultScreen />;

      case "profile":
        return (
          <ProfileScreen
            actionState={actionState}
            donePermanentRoadmapItems={donePermanentRoadmapItems}
            onActionUnskip={handleActionReset}
            onboardingState={onboardingState}
            onNavigateToQuizzes={() => handleTabChange("quizzes")}
            onOnboardingStateChange={handleOnboardingStateChange}
            report={findingsRoadmap}
            skippedRoadmapItems={skippedRoadmapItems}
            streakState={streakState}
          />
        );

      default:
        return (
          <HomeScreen
            actionState={actionState}
            onActionDoneToday={handleActionDoneToday}
            onActionDonePermanent={handleActionDonePermanent}
            onActionReset={handleActionReset}
            onActionSkip={handleActionSkip}
            onActionSnooze={handleActionSnooze}
            onFocusStyleChange={handleFocusStyleChange}
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
          <div className="hr-shell-header-left">
            <div aria-hidden="true" className="hr-shell-mark">
              <span className="hr-shell-mark-dot" />
            </div>
          </div>

          <div className="hr-shell-title-wrap">
            <h1 className="hr-shell-title">The Human Reset</h1>
            {!onboardingIncomplete ? (
              <p className="hr-shell-summary-line">
                {Math.round((findingsRoadmap.completedQuizCount / Math.max(1, findingsRoadmap.totalQuizCount)) * 100)}% calibrated
                {" · "}
                {streakState.currentStreak} day streak
                {" · "}
                {findingsRoadmap.completedQuizCount}/{findingsRoadmap.totalQuizCount} categories
              </p>
            ) : null}
          </div>

          <div className="hr-shell-header-right">
            <button
              aria-disabled={!searchEnabled}
              aria-expanded={searchOpen}
              aria-label={searchEnabled ? "Search" : "Search unavailable on this tab"}
              className="hr-icon-button"
              disabled={!searchEnabled}
              onClick={handleSearchToggle}
              type="button"
            >
              <svg aria-hidden="true" className="hr-shell-icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="10.5" cy="10.5" r="5.5" />
                <path d="m15 15 5 5" />
              </svg>
            </button>
          </div>
        </header>

        {searchOpen ? (
          <section aria-label="Search panel" className="hr-search-panel">
            <div className="hr-search-panel-row">
              <input
                autoFocus
                className="hr-input hr-search-input"
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                placeholder="Search actions, quizzes, and vault topics"
                type="search"
                value={searchQuery}
              />
              <Button onClick={() => setSearchOpen(false)} size="sm" variant="quiet">
                Close
              </Button>
            </div>

            <div className="hr-search-results" role="list">
              {filteredSearchEntries.length > 0 ? (
                filteredSearchEntries.map((entry) => (
                  <button
                    className="hr-search-result"
                    key={entry.id}
                    onClick={() => handleSearchResultSelect(entry.tab)}
                    role="listitem"
                    type="button"
                  >
                    <span className="hr-search-result-title">{entry.label}</span>
                    <span className="hr-search-result-meta">{entry.meta}</span>
                  </button>
                ))
              ) : (
                <p className="hr-search-empty">
                  No matches yet. Try a category, action, or vault topic.
                </p>
              )}
            </div>
          </section>
        ) : null}

        <div className="hr-shell-main">
          {!onboardingIncomplete ? (
            <BottomTabs activeTab={activeTab} onTabChange={handleTabChange} />
          ) : null}

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
        </div>
      </main>
    </div>
  );
}
