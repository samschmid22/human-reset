import { ReactNode, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
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
// Settings icon — colored rounded square with white SVG inside
// ---------------------------------------------------------------------------
function SettingIcon({ bg = "#228C22", children }: { bg?: string; children: ReactNode }) {
  return (
    <span className="hr-setting-icon" style={{ background: bg }}>
      {children}
    </span>
  );
}

// Icon SVGs
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
const IconBell = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconRefresh = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
  </svg>
);
const IconTrash = () => (
  <svg fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconChevron = () => (
  <svg className="hr-setting-chevron" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// ---------------------------------------------------------------------------
// Settings row component
// ---------------------------------------------------------------------------
type SettingsRowProps = {
  bg?: string;
  children?: ReactNode;
  expanded?: boolean;
  icon: ReactNode;
  isFirst?: boolean;
  label: string;
  onTap?: () => void;
  right?: ReactNode;
};

function SettingsRow({ bg, children, expanded, icon, isFirst, label, onTap, right }: SettingsRowProps) {
  return (
    <div className={cn("hr-setting-row-wrap", !isFirst && "has-divider")}>
      <button
        className="hr-setting-row"
        disabled={!onTap}
        onClick={onTap}
        type="button"
      >
        <SettingIcon bg={bg}>{icon}</SettingIcon>
        <span className="hr-setting-row-label">{label}</span>
        <span className="hr-setting-row-right">{right}</span>
        {onTap ? <IconChevron /> : null}
      </button>
      {expanded && children ? (
        <div className="hr-setting-row-content">{children}</div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section label
// ---------------------------------------------------------------------------
function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="hr-settings-section-label">{children}</p>;
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
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
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

  function toggleRow(id: string): void {
    setExpandedRow((prev) => (prev === id ? null : id));
  }

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

  return (
    <ScreenContainer className="hr-profile-screen">

      {/* Slim stats bar */}
      <p className="hr-profile-stats-bar">
        Completed: {completedCount} · Quizzes: {report.completedQuizCount}/{report.totalQuizCount} · {maturity.badge}
      </p>

      {/* MY RESET */}
      <SectionLabel>My Reset</SectionLabel>
      <Card className="hr-settings-card">
        <SettingsRow
          bg="#228C22"
          expanded={expandedRow === "pace"}
          icon={<IconLeaf />}
          isFirst
          label="Daily Pace"
          onTap={() => toggleRow("pace")}
          right={<span className="hr-setting-row-value">{responses.actionsPerDay}/day</span>}
        >
          <div className="hr-setting-expand-inner">
            <div className="hr-setting-row-inner">
              <span className="hr-setting-label">Actions per day</span>
              <div className="hr-range-row">
                <input
                  className="hr-range"
                  max={20}
                  min={1}
                  onChange={(e) => updatePace(Number(e.currentTarget.value))}
                  type="range"
                  value={responses.actionsPerDay}
                />
                <span className="hr-setting-value">{responses.actionsPerDay}/day</span>
              </div>
            </div>
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
        </SettingsRow>

        <SettingsRow
          bg="#228C22"
          expanded={expandedRow === "focus"}
          icon={<IconTarget />}
          label="Focus Style"
          onTap={() => toggleRow("focus")}
          right={<span className="hr-setting-row-value">{focusLabel}</span>}
        >
          <div className="hr-setting-expand-inner">
            <div className="hr-chip-grid">
              {(["mixed", "one_category"] as const).map((style) => (
                <button
                  aria-pressed={responses.focusStyle === style}
                  className={cn("hr-toggle-chip", responses.focusStyle === style && "is-selected")}
                  key={style}
                  onClick={() => commitResponses({ ...responses, focusStyle: style })}
                  type="button"
                >
                  {style === "mixed" ? "Mixed" : "One category"}
                </button>
              ))}
            </div>
          </div>
        </SettingsRow>

        <SettingsRow
          bg="#3d6b3d"
          icon={<IconMap />}
          label="Current Phase"
          right={<span className="hr-setting-row-value hr-setting-row-value--truncate">{currentPhaseLabel}</span>}
        />
      </Card>

      {/* HEALTH PROFILE */}
      <SectionLabel>Health Profile</SectionLabel>
      <Card className="hr-settings-card">
        <SettingsRow
          bg="#228C22"
          expanded={expandedRow === "concerns"}
          icon={<IconHeart />}
          isFirst
          label="Concerns"
          onTap={() => toggleRow("concerns")}
          right={<span className="hr-setting-row-value hr-setting-row-value--truncate">{concernsLabel}</span>}
        >
          <div className="hr-setting-expand-inner">
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
        </SettingsRow>

        <SettingsRow
          bg="#228C22"
          expanded={expandedRow === "sensitivities"}
          icon={<IconZap />}
          label="Sensitivities"
          onTap={() => toggleRow("sensitivities")}
          right={<span className="hr-setting-row-value hr-setting-row-value--truncate">{sensLabel}</span>}
        >
          <div className="hr-setting-expand-inner">
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
            <div className="hr-inline-input-row">
              <input
                className="hr-input"
                onChange={(e) => setNewSensitivity(e.currentTarget.value)}
                placeholder="Add sensitivity"
                value={newSensitivity}
              />
              <Button onClick={handleAddSensitivity} size="sm" variant="quiet">Add</Button>
            </div>
            {responses.additionalSensitivities.length > 0 ? (
              <div className="hr-chip-grid">
                {responses.additionalSensitivities.map((entry) => (
                  <button className="hr-removable-chip" key={entry} onClick={() => handleRemoveSensitivity(entry)} type="button">
                    Remove {entry}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </SettingsRow>
      </Card>

      {/* SKIPPED ITEMS */}
      {skippedRoadmapItems.length > 0 ? (
        <>
          <SectionLabel>Skipped Items</SectionLabel>
          <Card className="hr-settings-card">
            <SettingsRow
              bg="#3d6b3d"
              expanded={expandedRow === "skipped"}
              icon={<IconSkip />}
              isFirst
              label="Skipped Actions"
              onTap={() => toggleRow("skipped")}
              right={<span className="hr-setting-row-value">{skippedRoadmapItems.length}</span>}
            >
              <ContentStack className="hr-setting-expand-inner">
                {skippedRoadmapItems.map((item) => (
                  <div className="hr-profile-skipped-row" key={item.id}>
                    <div className="hr-profile-skipped-main">
                      <p className="hr-action-list-meta">{item.category}</p>
                      <h3 className="hr-item-title">{item.title}</h3>
                    </div>
                    <Button onClick={() => onActionUnskip(item.id)} size="sm" variant="secondary">Restore</Button>
                  </div>
                ))}
              </ContentStack>
            </SettingsRow>
          </Card>
        </>
      ) : null}

      {/* COMPLETED ITEMS */}
      {donePermanentRoadmapItems.length > 0 ? (
        <>
          <SectionLabel>Completed Items</SectionLabel>
          <Card className="hr-settings-card">
            <SettingsRow
              bg="#228C22"
              expanded={expandedRow === "completed"}
              icon={<IconCheck />}
              isFirst
              label="Completed Actions"
              onTap={() => toggleRow("completed")}
              right={<span className="hr-setting-row-value">{donePermanentRoadmapItems.length}</span>}
            >
              <ContentStack className="hr-setting-expand-inner">
                {donePermanentRoadmapItems.map((item) => (
                  <div className="hr-profile-skipped-row" key={item.id}>
                    <div className="hr-profile-skipped-main">
                      <p className="hr-action-list-meta">{item.category}</p>
                      <h3 className="hr-item-title">{item.title}</h3>
                    </div>
                    <Button onClick={() => onActionUnskip(item.id)} size="sm" variant="secondary">Restore</Button>
                  </div>
                ))}
              </ContentStack>
            </SettingsRow>
          </Card>
        </>
      ) : null}

      {/* SETTINGS */}
      <SectionLabel>Settings</SectionLabel>
      <Card className="hr-settings-card">
        <SettingsRow
          bg="#228C22"
          icon={<IconBell />}
          isFirst
          label="Notifications"
          onTap={() => commitResponses({ ...responses, notificationsEnabled: !responses.notificationsEnabled })}
          right={
            <button
              aria-label="Toggle notifications"
              aria-pressed={responses.notificationsEnabled}
              className={cn("hr-switch", responses.notificationsEnabled && "is-on")}
              onClick={(e) => { e.stopPropagation(); commitResponses({ ...responses, notificationsEnabled: !responses.notificationsEnabled }); }}
              type="button"
            >
              <span className="hr-switch-knob" />
            </button>
          }
        />

        <SettingsRow
          bg="#3d6b3d"
          icon={<IconRefresh />}
          label="Recalculate Roadmap"
          onTap={onNavigateToQuizzes}
          right={<span className="hr-setting-row-value">Go to Quizzes</span>}
        />

        <SettingsRow
          bg="#8b2020"
          icon={<IconTrash />}
          label="Reset All Data"
          onTap={handleResetData}
          right={
            <span className={cn("hr-setting-row-value", resetConfirm && "hr-setting-row-value--danger")}>
              {resetConfirm ? "Tap to confirm" : "Erase all data"}
            </span>
          }
        />
      </Card>

    </ScreenContainer>
  );
}
