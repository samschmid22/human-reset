import { useMemo, useState } from "react";

import { ActionDetailView } from "@/components/actions/action-detail-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getActionStatusView } from "@/features/actions/storage";
import { ActionState, ActionStatus } from "@/features/actions/types";
import { getRoadmapPhaseCount } from "@/features/findings/engine";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
import { FindingsRoadmapResult, RoadmapItem, ROADMAP_PHASE_LABELS } from "@/features/findings/types";
import { cn } from "@/lib/cn";

type RoadmapScreenProps = {
  actionState: ActionState;
  onActionDone: (actionId: string) => void;
  onActionReset: (actionId: string) => void;
  onActionSnooze: (actionId: string) => void;
  report: FindingsRoadmapResult;
};

type PhaseProgress = {
  completed: number;
  count: number;
  pending: number;
  phase: keyof FindingsRoadmapResult["roadmapByPhase"];
  snoozed: number;
};

type PhaseVisualState = "current" | "next" | "complete" | "later" | "empty";

function toStatusLabel(status: ActionStatus): string {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "snoozed") {
    return "Snoozed";
  }

  return "Pending";
}

function toPhaseStateLabel(state: PhaseVisualState): string {
  if (state === "current") {
    return "Current";
  }

  if (state === "next") {
    return "Next";
  }

  if (state === "complete") {
    return "Completed";
  }

  if (state === "later") {
    return "Later";
  }

  return "Waiting";
}

function toPhaseStateCopy(state: PhaseVisualState): string {
  if (state === "current") {
    return "Primary focus right now.";
  }

  if (state === "next") {
    return "Next in your journey.";
  }

  if (state === "complete") {
    return "This phase is largely finished.";
  }

  if (state === "later") {
    return "Planned after current phases settle.";
  }

  return "No actions assigned yet.";
}

export function RoadmapScreen({
  actionState,
  onActionDone,
  onActionReset,
  onActionSnooze,
  report,
}: RoadmapScreenProps) {
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  const phaseProgress = useMemo<PhaseProgress[]>(() => {
    return getRoadmapPhaseCount(report.roadmapByPhase).map((entry) => {
      const items = report.roadmapByPhase[entry.phase];
      const summary = items.reduce(
        (accumulator, item) => {
          const status = getActionStatusView(actionState, item.id).status;
          accumulator[status] += 1;
          return accumulator;
        },
        { pending: 0, completed: 0, snoozed: 0 } as Record<ActionStatus, number>,
      );

      return {
        phase: entry.phase,
        count: entry.count,
        pending: summary.pending,
        completed: summary.completed,
        snoozed: summary.snoozed,
      };
    });
  }, [actionState, report.roadmapByPhase]);

  const currentPhaseIndex = useMemo(() => {
    const withPending = phaseProgress.findIndex((entry) => entry.pending > 0);

    if (withPending >= 0) {
      return withPending;
    }

    const withAnyItems = phaseProgress.findIndex((entry) => entry.count > 0);
    return withAnyItems >= 0 ? withAnyItems : 0;
  }, [phaseProgress]);

  const nextPhaseIndex = useMemo(() => {
    const next = phaseProgress.findIndex(
      (entry, index) => index > currentPhaseIndex && entry.count > 0,
    );

    return next >= 0 ? next : null;
  }, [currentPhaseIndex, phaseProgress]);

  const statusSummary = useMemo(() => {
    return report.priorities.reduce(
      (accumulator, item) => {
        const status = getActionStatusView(actionState, item.id).status;
        accumulator[status] += 1;
        return accumulator;
      },
      { pending: 0, completed: 0, snoozed: 0 } as Record<ActionStatus, number>,
    );
  }, [actionState, report.priorities]);
  const maturity = getPlanMaturity(report.completedQuizCount, report.totalQuizCount);

  function getPhaseVisualState(index: number, count: number): PhaseVisualState {
    if (count === 0) {
      return "empty";
    }

    if (index === currentPhaseIndex) {
      return "current";
    }

    if (nextPhaseIndex !== null && index === nextPhaseIndex) {
      return "next";
    }

    if (index < currentPhaseIndex) {
      return "complete";
    }

    return "later";
  }

  function toggleDetails(actionId: string): void {
    setExpandedActionId((current) => (current === actionId ? null : actionId));
  }

  function renderActionRow(item: RoadmapItem) {
    const statusView = getActionStatusView(actionState, item.id);
    const isCompleted = statusView.status === "completed";
    const isSnoozed = statusView.status === "snoozed";
    const isExpanded = expandedActionId === item.id;
    const doneButtonLabel = isCompleted ? "Undo" : "Done";
    const snoozeButtonLabel = isSnoozed ? "Unsnooze" : "Snooze";

    return (
      <div
        className={cn(
          "hr-roadmap-action-row",
          isCompleted && "is-completed",
          isSnoozed && "is-snoozed",
        )}
        key={item.id}
      >
        <div className="hr-roadmap-action-main">
          <p className="hr-action-list-meta">{item.category}</p>
          <h3 className="hr-item-title">{item.title}</h3>
          <p className="hr-item-description">{item.minimumStep}</p>
          {statusView.status !== "pending" ? (
            <p className="hr-action-list-status">
              {toStatusLabel(statusView.status)}
              {statusView.snoozedUntil ? ` until ${statusView.snoozedUntil}` : ""}
            </p>
          ) : null}
        </div>

        <div className="hr-action-controls">
          <Button
            className={cn("hr-action-button", isCompleted ? "is-undo" : "is-done")}
            onClick={() => (isCompleted ? onActionReset(item.id) : onActionDone(item.id))}
            size="sm"
            variant={isCompleted ? "quiet" : "primary"}
          >
            {doneButtonLabel}
          </Button>
          <Button
            className={cn("hr-action-button", isSnoozed && "is-unsnooze")}
            disabled={isCompleted}
            onClick={() => (isSnoozed ? onActionReset(item.id) : onActionSnooze(item.id))}
            size="sm"
            variant={isSnoozed ? "secondary" : "quiet"}
          >
            {snoozeButtonLabel}
          </Button>
          <Button
            className={cn("hr-action-button", "is-details", isExpanded && "is-open")}
            onClick={() => toggleDetails(item.id)}
            size="sm"
            variant="quiet"
          >
            {isExpanded ? "Hide Details" : "Details"}
          </Button>
        </div>

        {isExpanded ? <ActionDetailView action={item} /> : null}
      </div>
    );
  }

  return (
    <ScreenContainer className="hr-roadmap-screen">
      {report.priorities.length === 0 ? (
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">Roadmap is waiting for quiz findings</p>
          <p className="hr-empty-copy">
            Complete a category input to generate your first phased journey.
          </p>
        </Card>
      ) : (
        <Card className="hr-roadmap-summary-card" tone="soft">
          <p className="hr-overline">{maturity.badge}</p>
          <h2 className="hr-item-title">{maturity.title}</h2>
          <p className="hr-item-description">{maturity.summary}</p>
          <InlineGroup className="hr-roadmap-summary-inline">
            <div className="hr-roadmap-summary-item">
              <span className="hr-kpi-label">Active</span>
              <strong>{statusSummary.pending}</strong>
            </div>
            <div className="hr-roadmap-summary-item">
              <span className="hr-kpi-label">Completed</span>
              <strong>{statusSummary.completed}</strong>
            </div>
            <div className="hr-roadmap-summary-item">
              <span className="hr-kpi-label">Snoozed</span>
              <strong>{statusSummary.snoozed}</strong>
            </div>
            <div className="hr-roadmap-summary-item">
              <span className="hr-kpi-label">Coverage</span>
              <strong>{report.completedQuizCount}/{report.totalQuizCount}</strong>
              <span className="hr-kpi-note">{maturity.progressLabel}</span>
            </div>
          </InlineGroup>
        </Card>
      )}

      <SectionHeader
        subtitle="Move from biggest friction points to stable home defaults."
        title="Reset Journey"
      />

      <Card className="hr-roadmap-journey-card">
        <ol className="hr-roadmap-journey-list">
          {phaseProgress.map((entry, index) => {
            const state = getPhaseVisualState(index, entry.count);
            const topItem = report.roadmapByPhase[entry.phase][0];

            return (
              <li className={cn("hr-roadmap-journey-item", `is-${state}`)} key={entry.phase}>
                <div className="hr-roadmap-journey-dot" />
                <div className="hr-roadmap-journey-content">
                  <div className="hr-roadmap-journey-header">
                    <h3 className="hr-item-title">{ROADMAP_PHASE_LABELS[entry.phase]}</h3>
                    <div className="hr-roadmap-journey-header-right">
                      <span className={cn("hr-roadmap-phase-state", `is-${state}`)}>
                        {toPhaseStateLabel(state)}
                      </span>
                      <span className="hr-roadmap-phase-count">{entry.count}</span>
                    </div>
                  </div>
                  <p className="hr-item-description">
                    {topItem ? topItem.title : "No actions in this phase yet."}
                  </p>
                  {entry.count > 0 ? (
                    <p className="hr-roadmap-phase-meta">
                      {entry.pending} active • {entry.completed} completed • {entry.snoozed} snoozed
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <SectionHeader
        subtitle="Practical actions grouped by phase, status, and current sequence."
        title="Phase Details"
      />

      <ContentStack className="hr-roadmap-phase-stack">
        {phaseProgress.map((entry, index) => {
          const items = report.roadmapByPhase[entry.phase];
          const state = getPhaseVisualState(index, entry.count);

          if (items.length === 0) {
            return null;
          }

          return (
            <Card className={cn("hr-roadmap-phase-card", `is-${state}`)} key={entry.phase}>
              <div className="hr-card-row">
                <div>
                  <p className="hr-overline">Phase</p>
                  <h3 className="hr-item-title">{ROADMAP_PHASE_LABELS[entry.phase]}</h3>
                  <p className="hr-item-description">{toPhaseStateCopy(state)}</p>
                </div>
                <div className="hr-roadmap-phase-header-right">
                  <span className={cn("hr-roadmap-phase-state", `is-${state}`)}>
                    {toPhaseStateLabel(state)}
                  </span>
                  <span className="hr-roadmap-phase-count">{items.length}</span>
                </div>
              </div>

              <ContentStack>
                {items.map((item) => renderActionRow(item))}
              </ContentStack>
            </Card>
          );
        })}
      </ContentStack>
    </ScreenContainer>
  );
}
