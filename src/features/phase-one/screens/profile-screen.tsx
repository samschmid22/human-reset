import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
import { FindingsRoadmapResult, RoadmapItem } from "@/features/findings/types";
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
  donePermanentRoadmapItems: RoadmapItem[];
  onActionUnskip: (actionId: string) => void;
  onboardingState: OnboardingState;
  onOnboardingStateChange: (next: OnboardingState) => void;
  report: FindingsRoadmapResult;
  skippedRoadmapItems: RoadmapItem[];
};

function formatList(values: string[]): string {
  if (values.length === 0) {
    return "Not set";
  }

  return values.join(", ");
}

function toggleArrayValue(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return values.filter((entry) => entry !== value);
  }

  return [...values, value];
}

function formatAutosaveTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Autosaved locally";
  }

  return `Autosaved locally at ${date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export function ProfileScreen({
  donePermanentRoadmapItems,
  onActionUnskip,
  onboardingState,
  onOnboardingStateChange,
  report,
  skippedRoadmapItems,
}: ProfileScreenProps) {
  const [newSensitivity, setNewSensitivity] = useState("");
  const responses = onboardingState.responses;
  const planReady = report.priorities.length > 0;
  const maturity = getPlanMaturity(report.completedQuizCount, report.totalQuizCount);
  const availableSensitivities = useMemo(
    () =>
      Array.from(new Set([...DEFAULT_SENSITIVITY_OPTIONS, ...responses.additionalSensitivities])),
    [responses.additionalSensitivities],
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

    commitResponses({
      ...responses,
      actionsPerDay: bounded,
      pacePreset: derivePacePreset(bounded),
    });
  }

  function handleAddSensitivity(): void {
    const normalized = newSensitivity.trim().toLowerCase().slice(0, 64);

    if (normalized.length === 0) {
      return;
    }

    if (availableSensitivities.includes(normalized)) {
      setNewSensitivity("");
      return;
    }

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
      additionalSensitivities: responses.additionalSensitivities.filter((entry) => entry !== value),
      sensitivities: responses.sensitivities.filter((entry) => entry !== value),
    });
  }

  return (
    <ScreenContainer className="hr-profile-screen">
      <Card className="hr-profile-hero" tone="accent">
        <div className="hr-card-row">
          <div>
            <p className="hr-overline">Profile + Settings</p>
            <h2 className="hr-feature-title">
              {planReady ? "Your reset profile is actively shaping your plan" : "Your reset profile is saved locally"}
            </h2>
            <p className="hr-copy">{maturity.summary}</p>
          </div>
          <div className="hr-profile-hero-stats">
            <span>{maturity.badge}</span>
            <span>{report.completedQuizCount}/{report.totalQuizCount} categories</span>
            <span>{report.priorities.length} actions</span>
          </div>
        </div>
        <p className="hr-profile-save-state">{formatAutosaveTimestamp(onboardingState.updatedAt)}</p>
      </Card>

      <SectionHeader subtitle="Settings update immediately and persist on this device." title="Plan Preferences" />

      <div className="hr-profile-grid">
        <Card className="hr-profile-settings-card">
          <h3 className="hr-item-title">Pace + Focus</h3>
          <ContentStack className="hr-setting-stack">
            <div className="hr-setting-row">
              <span className="hr-setting-label">Actions Per Day</span>
              <div className="hr-range-row">
                <input
                  className="hr-range"
                  max={20}
                  min={1}
                  onChange={(event) => updatePace(Number(event.currentTarget.value))}
                  type="range"
                  value={responses.actionsPerDay}
                />
                <span className="hr-setting-value">{responses.actionsPerDay}/day</span>
              </div>
            </div>

            <div className="hr-setting-row">
              <span className="hr-setting-label">Pace Preset</span>
              <div className="hr-chip-grid">
                {Object.entries(PACE_PRESET_CONFIG).map(([preset, config]) => (
                  <button
                    aria-pressed={responses.pacePreset === preset}
                    className={cn(
                      "hr-toggle-chip",
                      responses.pacePreset === preset && "is-selected",
                    )}
                    key={preset}
                    onClick={() =>
                      commitResponses({
                        ...responses,
                        actionsPerDay: config.actionsPerDay,
                        pacePreset: preset as OnboardingResponses["pacePreset"],
                      })
                    }
                    type="button"
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hr-setting-row">
              <span className="hr-setting-label">Focus Style</span>
              <div className="hr-segmented-control">
                <button
                  aria-pressed={responses.focusStyle === "mixed"}
                  className={cn(
                    "hr-segmented-control-button",
                    responses.focusStyle === "mixed" && "is-selected",
                  )}
                  onClick={() => commitResponses({ ...responses, focusStyle: "mixed" })}
                  type="button"
                >
                  Mixed categories
                </button>
                <button
                  aria-pressed={responses.focusStyle === "one_category"}
                  className={cn(
                    "hr-segmented-control-button",
                    responses.focusStyle === "one_category" && "is-selected",
                  )}
                  onClick={() => commitResponses({ ...responses, focusStyle: "one_category" })}
                  type="button"
                >
                  One category/day
                </button>
              </div>
            </div>

            <div className="hr-setting-row hr-setting-row-switch">
              <div>
                <span className="hr-setting-label">Notifications</span>
                <p className="hr-item-description">
                  Gentle local reminders for daily reset steps.
                </p>
              </div>
              <button
                aria-label="Toggle notifications"
                aria-pressed={responses.notificationsEnabled}
                className={cn(
                  "hr-switch",
                  responses.notificationsEnabled && "is-on",
                )}
                onClick={() =>
                  commitResponses({
                    ...responses,
                    notificationsEnabled: !responses.notificationsEnabled,
                  })
                }
                type="button"
              >
                <span className="hr-switch-knob" />
              </button>
            </div>
          </ContentStack>
        </Card>

        <Card className="hr-profile-settings-card">
          <h3 className="hr-item-title">Concerns + Sensitivities</h3>
          <ContentStack className="hr-setting-stack">
            <div className="hr-setting-row">
              <span className="hr-setting-label">Concerns</span>
              <div className="hr-chip-grid">
                {CONCERN_OPTIONS.map((concern) => (
                  <button
                    aria-pressed={responses.concerns.includes(concern)}
                    className={cn(
                      "hr-toggle-chip",
                      responses.concerns.includes(concern) && "is-selected",
                    )}
                    key={concern}
                    onClick={() =>
                      commitResponses({
                        ...responses,
                        concerns: toggleArrayValue(responses.concerns, concern),
                      })
                    }
                    type="button"
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>

            <div className="hr-setting-row">
              <span className="hr-setting-label">Sensitivities</span>
              <div className="hr-chip-grid">
                {availableSensitivities.map((entry) => (
                  <button
                    aria-pressed={responses.sensitivities.includes(entry)}
                    className={cn(
                      "hr-toggle-chip",
                      responses.sensitivities.includes(entry) && "is-selected",
                    )}
                    key={entry}
                    onClick={() =>
                      commitResponses({
                        ...responses,
                        sensitivities: toggleArrayValue(responses.sensitivities, entry),
                      })
                    }
                    type="button"
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>

            <div className="hr-setting-row">
              <span className="hr-setting-label">Add Sensitivity</span>
              <div className="hr-inline-input-row">
                <input
                  className="hr-input"
                  onChange={(event) => setNewSensitivity(event.currentTarget.value)}
                  placeholder="Add another sensitivity"
                  value={newSensitivity}
                />
                <Button onClick={handleAddSensitivity} size="sm" variant="quiet">
                  Add
                </Button>
              </div>
              {responses.additionalSensitivities.length > 0 ? (
                <div className="hr-chip-grid">
                  {responses.additionalSensitivities.map((entry) => (
                    <button
                      className="hr-removable-chip"
                      key={entry}
                      onClick={() => handleRemoveSensitivity(entry)}
                      type="button"
                    >
                      Remove {entry}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </ContentStack>
        </Card>

        <Card className="hr-profile-settings-card">
          <h3 className="hr-item-title">System Snapshot</h3>
          <ContentStack className="hr-setting-stack">
            <div className="hr-setting-row">
              <span className="hr-setting-label">Daily Plan</span>
              <span className="hr-setting-value">
                {report.dailyPlan.actions.length}/{report.dailyPlan.maxActions} scheduled
              </span>
            </div>
            <div className="hr-setting-row">
              <span className="hr-setting-label">Top Category</span>
              <span className="hr-setting-value">
                {report.highestPriorityCategory ?? "Not available yet"}
              </span>
            </div>
            <div className="hr-setting-row">
              <span className="hr-setting-label">Sensitivity Profile</span>
              <span className="hr-setting-value">{formatList(responses.sensitivities)}</span>
            </div>
            <div className="hr-setting-row">
              <span className="hr-setting-label">Custom Goal</span>
              <span className="hr-setting-value">
                {responses.customConcern.trim().length > 0 ? responses.customConcern : "Not set"}
              </span>
            </div>
          </ContentStack>
        </Card>
      </div>

      {skippedRoadmapItems.length > 0 ? (
        <>
          <SectionHeader
            subtitle="Actions you removed from your plan. Restore any to add it back."
            title="Skipped Items"
          />
          <Card className="hr-profile-skipped-card">
            <ContentStack className="hr-setting-stack">
              {skippedRoadmapItems.map((item) => (
                <div className="hr-profile-skipped-row" key={item.id}>
                  <div className="hr-profile-skipped-main">
                    <p className="hr-action-list-meta">{item.category}</p>
                    <h3 className="hr-item-title">{item.title}</h3>
                    <p className="hr-item-description">{item.minimumStep}</p>
                  </div>
                  <Button
                    onClick={() => onActionUnskip(item.id)}
                    size="sm"
                    variant="secondary"
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </ContentStack>
          </Card>
        </>
      ) : null}

      {donePermanentRoadmapItems.length > 0 ? (
        <>
          <SectionHeader
            subtitle="Actions you marked as permanently complete. Restore to put them back in your plan."
            title="Completed Items"
          />
          <Card className="hr-profile-skipped-card">
            <ContentStack className="hr-setting-stack">
              {donePermanentRoadmapItems.map((item) => (
                <div className="hr-profile-skipped-row" key={item.id}>
                  <div className="hr-profile-skipped-main">
                    <p className="hr-action-list-meta">{item.category}</p>
                    <h3 className="hr-item-title">{item.title}</h3>
                    <p className="hr-item-description">{item.minimumStep}</p>
                  </div>
                  <Button
                    onClick={() => onActionUnskip(item.id)}
                    size="sm"
                    variant="secondary"
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </ContentStack>
          </Card>
        </>
      ) : null}
    </ScreenContainer>
  );
}
