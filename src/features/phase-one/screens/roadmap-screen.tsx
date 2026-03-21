import { useMemo, useState } from "react";

import { ActionDetailView } from "@/components/actions/action-detail-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getActionStatusView } from "@/features/actions/storage";
import { ActionState, ActionStatus } from "@/features/actions/types";
import { getRoadmapPhaseCount } from "@/features/findings/engine";
import { FindingsRoadmapResult, RoadmapItem, ROADMAP_PHASE_LABELS } from "@/features/findings/types";
import { cn } from "@/lib/cn";

type RoadmapScreenProps = {
  actionState: ActionState;
  onActionDoneToday: (actionId: string) => void;
  onActionDonePermanent: (actionId: string) => void;
  onActionReset: (actionId: string) => void;
  onActionSkip: (actionId: string) => void;
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
  if (status === "done_today") return "Done today";
  if (status === "done_permanent") return "Completed";
  if (status === "snoozed") return "Snoozed";
  if (status === "skipped") return "Skipped";
  return "Pending";
}

export function RoadmapScreen({
  actionState,
  onActionDoneToday,
  onActionDonePermanent,
  onActionReset,
  onActionSkip,
  onActionSnooze,
  report,
}: RoadmapScreenProps) {
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const phaseProgress = useMemo<PhaseProgress[]>(() => {
    return getRoadmapPhaseCount(report.roadmapByPhase).map((entry) => {
      const items = report.roadmapByPhase[entry.phase];
      const summary = items.reduce(
        (accumulator, item) => {
          const status = getActionStatusView(actionState, item.id).status;
          if (status === "done_today" || status === "done_permanent") {
            accumulator.done += 1;
          } else if (status === "snoozed") {
            accumulator.snoozed += 1;
          } else if (status === "pending") {
            accumulator.pending += 1;
          }
          return accumulator;
        },
        { pending: 0, done: 0, snoozed: 0 },
      );

      return {
        phase: entry.phase,
        count: entry.count,
        pending: summary.pending,
        completed: summary.done,
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

  function togglePhaseExpand(phase: string, state: PhaseVisualState): void {
    if (state === "current") return;
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) {
        next.delete(phase);
      } else {
        next.add(phase);
      }
      return next;
    });
  }

  function isPhaseExpanded(phase: string, state: PhaseVisualState): boolean {
    if (state === "current") return true;
    return expandedPhases.has(phase);
  }

  function renderActionRow(item: RoadmapItem) {
    const statusView = getActionStatusView(actionState, item.id);
    const isDoneToday = statusView.status === "done_today";
    const isSnoozed = statusView.status === "snoozed";
    const isExpanded = expandedActionId === item.id;
    const doneButtonLabel = isDoneToday ? "Undo" : "Done";
    const snoozeButtonLabel = isSnoozed ? "Unsnooze" : "Snooze";

    return (
      <div
        className={cn(
          "hr-roadmap-action-row",
          isDoneToday && "is-done-today",
          isSnoozed && "is-snoozed",
        )}
        key={item.id}
      >
        <div className="hr-roadmap-action-main">
          <p className="hr-action-list-meta">{item.category}</p>
          <h3 className="hr-item-title">{item.title}</h3>
          {statusView.status !== "pending" ? (
            <p className="hr-action-list-status">
              {toStatusLabel(statusView.status)}
              {statusView.snoozedUntil ? ` until ${statusView.snoozedUntil}` : ""}
            </p>
          ) : null}
        </div>

        <div className="hr-action-controls">
          <Button
            className={cn("hr-action-button", isDoneToday ? "is-undo" : "is-done")}
            onClick={() => (isDoneToday ? onActionReset(item.id) : onActionDoneToday(item.id))}
            size="sm"
            variant={isDoneToday ? "quiet" : "primary"}
          >
            {doneButtonLabel}
          </Button>
          <Button
            className={cn("hr-action-button", isSnoozed && "is-unsnooze")}
            disabled={isDoneToday}
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
            {isExpanded ? "Hide" : "Details"}
          </Button>
          <Button
            className="hr-action-button is-skip"
            disabled={isDoneToday}
            onClick={() => onActionSkip(item.id)}
            size="sm"
            variant="quiet"
          >
            Skip
          </Button>
        </div>

        {isExpanded ? (
          <ActionDetailView
            action={item}
            onDonePermanent={() => onActionDonePermanent(item.id)}
          />
        ) : null}
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
      ) : null}

      <SectionHeader title="Roadmap Timeline" />

      <ol className="hr-roadmap-journey-list">
          {phaseProgress.map((entry, index) => {
            const state = getPhaseVisualState(index, entry.count);
            const items = report.roadmapByPhase[entry.phase];
            const expanded = isPhaseExpanded(entry.phase, state);
            const canToggle = state !== "current" && entry.count > 0;

            return (
              <li className={cn("hr-roadmap-journey-item", `is-${state}`)} key={entry.phase}>
                <div className="hr-roadmap-journey-node">
                  <div className={cn("hr-roadmap-node-dot", `is-${state}`)} />
                  {index < phaseProgress.length - 1 ? (
                    <div className="hr-roadmap-node-spine" />
                  ) : null}
                </div>

                <div className="hr-roadmap-journey-content">
                  <button
                    className={cn("hr-roadmap-phase-header", canToggle && "is-clickable")}
                    disabled={!canToggle}
                    onClick={() => togglePhaseExpand(entry.phase, state)}
                    type="button"
                  >
                    <div className="hr-roadmap-phase-header-left">
                      <h3 className="hr-item-title">{ROADMAP_PHASE_LABELS[entry.phase]}</h3>
                      {entry.count > 0 ? (
                        <span className="hr-roadmap-phase-meta">
                          {entry.pending} active · {entry.completed} done
                        </span>
                      ) : null}
                    </div>
                    <div className="hr-roadmap-phase-header-right">
                      {state !== "empty" ? (
                        <span className={cn("hr-roadmap-phase-state", `is-${state}`)}>
                          {state === "current" ? "Current" : state === "next" ? "Next" : state === "complete" ? "Done" : "Later"}
                        </span>
                      ) : null}
                      {entry.count > 0 ? (
                        <svg
                          aria-hidden="true"
                          className={cn("hr-snooze-chevron", expanded && "is-open")}
                          fill="none"
                          height="14"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="14"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      ) : null}
                    </div>
                  </button>

                  {expanded && items.length > 0 ? (
                    <ContentStack className="hr-roadmap-journey-actions">
                      {items.map((item) => renderActionRow(item))}
                    </ContentStack>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
    </ScreenContainer>
  );
}
