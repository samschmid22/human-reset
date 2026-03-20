import { useMemo, useState } from "react";

import { ActionDetailView } from "@/components/actions/action-detail-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getActionStatusView } from "@/features/actions/storage";
import { ActionState, ActionStatus } from "@/features/actions/types";
import { getRoadmapPhaseCount } from "@/features/findings/engine";
import { FindingsRoadmapResult, RoadmapItem, ROADMAP_PHASE_LABELS } from "@/features/findings/types";
import { cn } from "@/lib/cn";

type RoadmapScreenProps = {
  actionState: ActionState;
  onActionDone: (actionId: string) => void;
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

  return "Active";
}

export function RoadmapScreen({
  actionState,
  onActionDone,
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
          <p className="hr-action-list-status">
            {toStatusLabel(statusView.status)}
            {statusView.snoozedUntil ? ` until ${statusView.snoozedUntil}` : ""}
          </p>
        </div>

        <div className="hr-action-controls">
          <Button
            disabled={isCompleted}
            onClick={() => onActionDone(item.id)}
            size="sm"
            variant="secondary"
          >
            {isCompleted ? "Completed" : "Done"}
          </Button>
          <Button
            disabled={isCompleted || isSnoozed}
            onClick={() => onActionSnooze(item.id)}
            size="sm"
            variant="quiet"
          >
            {isSnoozed ? "Snoozed" : "Snooze"}
          </Button>
          <Button onClick={() => toggleDetails(item.id)} size="sm" variant="quiet">
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
            Complete a category quiz to generate your first phase journey and action queue.
          </p>
        </Card>
      ) : (
        <Card className="hr-roadmap-summary-card" tone="soft">
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
              <span className="hr-kpi-label">Total Actions</span>
              <strong>{report.priorities.length}</strong>
            </div>
          </InlineGroup>
        </Card>
      )}

      <SectionHeader title="Roadmap Journey" />

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
                    <span className="hr-roadmap-phase-count">{entry.count}</span>
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

      <SectionHeader title="Actions by Phase" />

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
                </div>
                <span className="hr-roadmap-phase-count">{items.length}</span>
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
