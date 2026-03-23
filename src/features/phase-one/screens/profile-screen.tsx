import { ReactNode, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/layout";
import { ActionState } from "@/features/actions/types";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
import { FindingsRoadmapResult, RoadmapItem, ROADMAP_PHASE_LABELS } from "@/features/findings/types";
import {
  clampActionsPerDay,
  CONCERN_OPTIONS,
  DEFAULT_SENSITIVITY_OPTIONS,
  derivePacePreset,
  PACE_PRESET_CONFIG,
} from "@/features/onboarding/constants";
import { OnboardingResponses, OnboardingState } from "@/features/onboarding/types";
import { cn } from "@/lib/cn";

type SubScreen = "pace" | "focus" | "concerns" | "sensitivities" | "skipped" | "completed" | "reset";

type ProfileScreenProps = {
  actionState: ActionState;
  donePermanentRoadmapItems: RoadmapItem[];
  onActionUnskip: (actionId: string) => void;
  onboardingState: OnboardingState;
  onNavigateToQuizzes: () => void;
  onOnboardingStateChange: (next: OnboardingState) => void;
  report: FindingsRoadmapResult;
  skippedRoadmapItems: RoadmapItem[];
};

function toggleArrayValue(values: string[], value: string): string[] {
  if (values.includes(value)) return values.filter((e) => e !== value);
  return [...values, value];
}

function getCurrentPhaseLabel(report: FindingsRoadmapResult): string {
  const phases = Object.keys(report.roadmapByPhase) as Array<keyof typeof report.roadmapByPhase>;
  for (const phase of phases) {
    if (report.roadmapByPhase[phase].length > 0) return ROADMAP_PHASE_LABELS[phase];
  }
  return "Not started";
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function SettingIcon({ bg = "#228C22", children }: { bg?: string; children: ReactNode }) {
  return (
    <span className="hr-setting-icon" style={{ background: bg }}>
      {children}
    </span>
  );
}

const IconLeaf = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
const IconTarget = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconMap = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" /><path d="M9 3v15M15 6v15" />
  </svg>
);
const IconHeart = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconZap = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconSkip = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" x2="19" y1="5" y2="19" />
  </svg>
);
const IconCheck = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconQuiz = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);
const IconTrash = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconChevronRight = () => (
  <svg className="hr-setting-chevron" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const IconChevronLeft = () => (
  <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

// ---------------------------------------------------------------------------
// Settings row
// ---------------------------------------------------------------------------
type SettingsRowProps = {
  bg?: string;
  icon: ReactNode;
  isFirst?: boolean;
  label: string;
  onTap?: () => void;
  rightNode?: ReactNode;
  value?: string;
};

function SettingsRow({ bg, icon, isFirst, label, onTap, rightNode, value }: SettingsRowProps) {
  return (
    <div className={cn("hr-setting-row-wrap", !isFirst && "has-divider")}>
      <button
        className="hr-setting-row"
        disabled={!onTap && !rightNode}
        onClick={onTap}
        type="button"
      >
        <SettingIcon bg={bg}>{icon}</SettingIcon>
        <span className="hr-setting-row-label">{label}</span>
        {value ? <span className="hr-setting-row-value">{value}</span> : null}
        {rightNode ?? null}
        {onTap ? <IconChevronRight /> : null}
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="hr-settings-section-label">{children}</p>;
}

// ---------------------------------------------------------------------------
// Sub-screen wrapper
// ---------------------------------------------------------------------------
function SubScreenView({
  children,
  onBack,
  title,
}: {
  children: ReactNode;
  onBack: () => void;
  title: string;
}) {
  return (
    <ScreenContainer className="hr-profile-screen">
      <div className="hr-subscreen-header">
        <button className="hr-subscreen-back" onClick={onBack} type="button">
          <IconChevronLeft />
          <span>Profile</span>
        </button>
        <h2 className="hr-subscreen-title">{title}</h2>
      </div>
      {children}
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ProfileScreen({
  actionState,
  donePermanentRoadmapItems,
  onActionUnskip,
  onboardingState,
  onNavigateToQuizzes,
  onOnboardingStateChange,
  report,
  skippedRoadmapItems,
}: ProfileScreenProps) {
  const [activeScreen, setActiveScreen] = useState<SubScreen | null>(null);
  const [newSensitivity, setNewSensitivity] = useState("");
  const [resetConfirm, setResetConfirm] = useState(false);

  const responses = onboardingState.responses;
  const maturity = getPlanMaturity(report.completedQuizCount, report.totalQuizCount);

  const availableSensitivities = useMemo(
    () => Array.from(new Set([...DEFAULT_SENSITIVITY_OPTIONS, ...responses.additionalSensitivities])),
    [responses.additionalSensitivities],
  );

  const completedCount = useMemo(
    () => Object.values(actionState.actions).filter((s) => s.status === "done_permanent").length,
    [actionState.actions],
  );

  function commitResponses(nextResponses: OnboardingResponses): void {
    onOnboardingStateChange({
      ...onboardingState,
      responses: nextResponses,
      updatedAt: new Date().toISOString(),
    });
  }

  function updatePace(actionsPerDay: number): void {
    const bounded = clampActionsPerDay(actionsPerDay);
    commitResponses({ ...responses, actionsPerDay: bounded, pacePreset: derivePacePreset(bounded) });
  }

  function handleAddSensitivity(): void {
    const normalized = newSensitivity.trim().toLowerCase().slice(0, 64);
    if (normalized.length === 0) return;
    if (availableSensitivities.includes(normalized)) { setNewSensitivity(""); return; }
    commitResponses({
      ...responses,
      additionalSensitivities: [...responses.additionalSensitivities, normalized],
      sensitivities: [...responses.sensitivities, normalized],
    });
    setNewSensitivity("");
  }

  function handleRemoveSensitivity(value: string): void {
    commitResponses({
      ...responses,
      additionalSensitivities: responses.additionalSensitivities.filter((e) => e !== value),
      sensitivities: responses.sensitivities.filter((e) => e !== value),
    });
  }

  function handleResetData(): void {
    if (!resetConfirm) { setResetConfirm(true); return; }
    localStorage.clear();
    window.location.reload();
  }

  const focusLabel = responses.focusStyle === "one_category" ? "One category" : "Mixed";
  const concernsLabel = responses.concerns.length > 0
    ? responses.concerns.slice(0, 2).join(", ") + (responses.concerns.length > 2 ? "…" : "")
    : "None set";
  const sensLabel = responses.sensitivities.length > 0
    ? responses.sensitivities.slice(0, 2).join(", ") + (responses.sensitivities.length > 2 ? "…" : "")
    : "None set";
  const currentPhaseLabel = getCurrentPhaseLabel(report);

  // ── Sub-screens ─────────────────────────────────────────────────────────────

  if (activeScreen === "pace") {
    return (
      <SubScreenView onBack={() => setActiveScreen(null)} title="Daily Pace">
        <Card tone="soft">
          <div className="hr-subscreen-section">
            <p className="hr-subscreen-section-label">Actions per day</p>
            <div className="hr-range-row">
              <input
                className="hr-range"
                max={20}
                min={1}
                onChange={(e) => updatePace(Number(e.currentTarget.value))}
                type="range"
                value={responses.actionsPerDay}
              />
              <span className="hr-subscreen-range-value">{responses.actionsPerDay}/day</span>
            </div>
          </div>
          <div className="hr-subscreen-section">
            <p className="hr-subscreen-section-label">Preset</p>
            <div className="hr-chip-grid">
              {Object.entries(PACE_PRESET_CONFIG).map(([preset, config]) => (
                <button
                  aria-pressed={responses.pacePreset === preset}
                  className={cn("hr-toggle-chip", responses.pacePreset === preset && "is-selected")}
                  key={preset}
                  onClick={() => commitResponses({ ...responses, actionsPerDay: config.actionsPerDay, pacePreset: preset as OnboardingResponses["pacePreset"] })}
                  type="button"
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </SubScreenView>
    );
  }

  if (activeScreen === "focus") {
    return (
      <SubScreenView onBack={() => setActiveScreen(null)} title="Focus Style">
        <Card tone="soft">
          <div className="hr-subscreen-section">
            <p className="hr-subscreen-section-label">How to serve your daily actions</p>
            <div className="hr-chip-grid">
              {(["mixed", "one_category"] as const).map((style) => (
                <button
                  aria-pressed={responses.focusStyle === style}
                  className={cn("hr-toggle-chip", responses.focusStyle === style && "is-selected")}
                  key={style}
                  onClick={() => commitResponses({ ...responses, focusStyle: style })}
                  type="button"
                >
                  {style === "mixed" ? "Mixed — variety across categories" : "One category — go deep"}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </SubScreenView>
    );
  }

  if (activeScreen === "concerns") {
    return (
      <SubScreenView onBack={() => setActiveScreen(null)} title="Health Concerns">
        <Card tone="soft">
          <div className="hr-subscreen-section">
            <p className="hr-subscreen-section-label">Select all that apply</p>
            <div className="hr-chip-grid">
              {CONCERN_OPTIONS.map((concern) => (
                <button
                  aria-pressed={responses.concerns.includes(concern)}
                  className={cn("hr-toggle-chip", responses.concerns.includes(concern) && "is-selected")}
                  key={concern}
                  onClick={() => commitResponses({ ...responses, concerns: toggleArrayValue(responses.concerns, concern) })}
                  type="button"
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </SubScreenView>
    );
  }

  if (activeScreen === "sensitivities") {
    return (
      <SubScreenView onBack={() => setActiveScreen(null)} title="Sensitivities">
        <Card tone="soft">
          <div className="hr-subscreen-section">
            <p className="hr-subscreen-section-label">Select all that apply</p>
            <div className="hr-chip-grid">
              {availableSensitivities.map((entry) => (
                <button
                  aria-pressed={responses.sensitivities.includes(entry)}
                  className={cn("hr-toggle-chip", responses.sensitivities.includes(entry) && "is-selected")}
                  key={entry}
                  onClick={() => commitResponses({ ...responses, sensitivities: toggleArrayValue(responses.sensitivities, entry) })}
                  type="button"
                >
                  {entry}
                </button>
              ))}
            </div>
          </div>
          <div className="hr-subscreen-section hr-subscreen-section--bordered">
            <p className="hr-subscreen-section-label">Add custom</p>
            <div className="hr-inline-input-row">
              <input
                className="hr-input"
                onChange={(e) => setNewSensitivity(e.currentTarget.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddSensitivity(); }}
                placeholder="Type a sensitivity and press Add"
                value={newSensitivity}
              />
              <Button onClick={handleAddSensitivity} size="sm" variant="quiet">Add</Button>
            </div>
            {responses.additionalSensitivities.length > 0 ? (
              <div className="hr-chip-grid" style={{ marginTop: 8 }}>
                {responses.additionalSensitivities.map((entry) => (
                  <button className="hr-removable-chip" key={entry} onClick={() => handleRemoveSensitivity(entry)} type="button">
                    ✕ {entry}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      </SubScreenView>
    );
  }

  if (activeScreen === "skipped") {
    return (
      <SubScreenView onBack={() => setActiveScreen(null)} title="Skipped Actions">
        <Card className="hr-settings-card">
          {skippedRoadmapItems.map((item, i) => (
            <div className={cn("hr-setting-row-wrap", i > 0 && "has-divider")} key={item.id}>
              <div className="hr-skipped-item-row">
                <div className="hr-skipped-item-main">
                  <p className="hr-overline">{item.category}</p>
                  <p className="hr-skipped-item-title">{item.title}</p>
                </div>
                <Button onClick={() => onActionUnskip(item.id)} size="sm" variant="secondary">Restore</Button>
              </div>
            </div>
          ))}
        </Card>
      </SubScreenView>
    );
  }

  if (activeScreen === "completed") {
    return (
      <SubScreenView onBack={() => setActiveScreen(null)} title="Completed Actions">
        <Card className="hr-settings-card">
          {donePermanentRoadmapItems.map((item, i) => (
            <div className={cn("hr-setting-row-wrap", i > 0 && "has-divider")} key={item.id}>
              <div className="hr-skipped-item-row">
                <div className="hr-skipped-item-main">
                  <p className="hr-overline">{item.category}</p>
                  <p className="hr-skipped-item-title">{item.title}</p>
                </div>
                <Button onClick={() => onActionUnskip(item.id)} size="sm" variant="secondary">Undo</Button>
              </div>
            </div>
          ))}
        </Card>
      </SubScreenView>
    );
  }

  if (activeScreen === "reset") {
    return (
      <SubScreenView onBack={() => { setActiveScreen(null); setResetConfirm(false); }} title="Reset All Data">
        <Card tone="soft">
          <div className="hr-subscreen-section">
            <p className="hr-copy">This will permanently erase all your quiz answers, action progress, and onboarding data. This cannot be undone.</p>
          </div>
          <div className="hr-subscreen-section hr-subscreen-section--bordered">
            <Button
              onClick={handleResetData}
              size="sm"
              variant={resetConfirm ? "primary" : "secondary"}
            >
              {resetConfirm ? "Tap again to confirm — this cannot be undone" : "Erase all data"}
            </Button>
            {resetConfirm ? (
              <button
                className="hr-subscreen-cancel-link"
                onClick={() => setResetConfirm(false)}
                type="button"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </Card>
      </SubScreenView>
    );
  }

  // ── Main list ──────────────────────────────────────────────────────────────

  return (
    <ScreenContainer className="hr-profile-screen">

      <p className="hr-profile-stats-bar">
        {completedCount} done · {report.completedQuizCount}/{report.totalQuizCount} quizzes · {maturity.badge}
      </p>

      <SectionLabel>My Reset</SectionLabel>
      <Card className="hr-settings-card">
        <SettingsRow
          bg="#228C22"
          icon={<IconLeaf />}
          isFirst
          label="Daily Pace"
          onTap={() => setActiveScreen("pace")}
          value={`${responses.actionsPerDay}/day`}
        />
        <SettingsRow
          bg="#228C22"
          icon={<IconTarget />}
          label="Focus Style"
          onTap={() => setActiveScreen("focus")}
          value={focusLabel}
        />
        <SettingsRow
          bg="#3d6b3d"
          icon={<IconMap />}
          label="Current Phase"
          value={currentPhaseLabel}
        />
      </Card>

      <SectionLabel>Health Profile</SectionLabel>
      <Card className="hr-settings-card">
        <SettingsRow
          bg="#228C22"
          icon={<IconHeart />}
          isFirst
          label="Concerns"
          onTap={() => setActiveScreen("concerns")}
        />
        <SettingsRow
          bg="#228C22"
          icon={<IconZap />}
          label="Sensitivities"
          onTap={() => setActiveScreen("sensitivities")}
        />
        <SettingsRow
          bg="#3d6b3d"
          icon={<IconQuiz />}
          label="Quizzes"
          onTap={onNavigateToQuizzes}
          value={`${report.completedQuizCount} of ${report.totalQuizCount} complete`}
        />
      </Card>

      {(skippedRoadmapItems.length > 0 || donePermanentRoadmapItems.length > 0) ? (
        <>
          <SectionLabel>My Progress</SectionLabel>
          <Card className="hr-settings-card">
            {skippedRoadmapItems.length > 0 ? (
              <SettingsRow
                bg="#3d6b3d"
                icon={<IconSkip />}
                isFirst
                label="Skipped Actions"
                onTap={() => setActiveScreen("skipped")}
                value={String(skippedRoadmapItems.length)}
              />
            ) : null}
            {donePermanentRoadmapItems.length > 0 ? (
              <SettingsRow
                bg="#228C22"
                icon={<IconCheck />}
                isFirst={skippedRoadmapItems.length === 0}
                label="Completed Actions"
                onTap={() => setActiveScreen("completed")}
                value={String(donePermanentRoadmapItems.length)}
              />
            ) : null}
          </Card>
        </>
      ) : null}

      <SectionLabel>App</SectionLabel>
      <Card className="hr-settings-card">
        <SettingsRow
          bg="#8b2020"
          icon={<IconTrash />}
          isFirst
          label="Reset All Data"
          onTap={() => setActiveScreen("reset")}
        />
      </Card>

    </ScreenContainer>
  );
}
