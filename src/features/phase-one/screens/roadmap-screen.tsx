import { useMemo, useState } from "react";

import { ActionDetailView } from "@/components/actions/action-detail-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
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

function toPriorityTone(priorityBand: "low" | "medium" | "high"): "neutral" | "accent" | "success" {
  if (priorityBand === "high") {
    return "accent";
  }

  if (priorityBand === "medium") {
    return "success";
  }

  return "neutral";
}

function toStatusTone(status: ActionStatus): "neutral" | "accent" | "success" {
  if (status === "completed") {
    return "success";
  }

  if (status === "snoozed") {
    return "neutral";
  }

  return "accent";
}

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

  const phaseCounts = getRoadmapPhaseCount(report.roadmapByPhase);
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

  function toggleDetails(actionId: string): void {
    setExpandedActionId((current) => (current === actionId ? null : actionId));
  }

  function renderPriorityCard(item: RoadmapItem) {
    const statusView = getActionStatusView(actionState, item.id);
    const isCompleted = statusView.status === "completed";
    const isSnoozed = statusView.status === "snoozed";
    const isExpanded = expandedActionId === item.id;

    return (
      <Card
        className={cn(
          "hr-action-card",
          isCompleted && "is-completed",
          isSnoozed && "is-snoozed",
        )}
        key={item.id}
      >
        <div className="hr-card-row">
          <div>
            <InlineGroup>
              <Pill tone="accent">{item.category}</Pill>
              <Pill>{ROADMAP_PHASE_LABELS[item.phase]}</Pill>
            </InlineGroup>
            <h3 className="hr-item-title">{item.title}</h3>
            <p className="hr-item-description">{item.whyItMatters}</p>
          </div>
          <div className="hr-action-pill-stack">
            <Pill tone={toStatusTone(statusView.status)}>{toStatusLabel(statusView.status)}</Pill>
            <Pill tone={toPriorityTone(item.priorityBand)}>{item.priorityBand}</Pill>
          </div>
        </div>

        <p className="hr-item-description">Minimum step: {item.minimumStep}</p>

        <InlineGroup>
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
        </InlineGroup>

        {isSnoozed && statusView.snoozedUntil ? (
          <p className="hr-item-description hr-action-status-note">
            Snoozed until {statusView.snoozedUntil}.
          </p>
        ) : null}

        {isExpanded ? <ActionDetailView action={item} /> : null}
      </Card>
    );
  }

  return (
    <ScreenContainer>
      {report.priorities.length === 0 ? (
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">Roadmap is waiting for quiz findings</p>
          <p className="hr-empty-copy">
            As quiz answers are added, findings are ranked into priorities and organized into phases.
          </p>
        </Card>
      ) : (
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">{report.priorities.length} roadmap actions generated</p>
          <p className="hr-empty-copy">
            Ranking uses deterministic severity, frequency, sensitivity, and feasibility factors.
          </p>
          <InlineGroup>
            <Pill tone="accent">{statusSummary.pending} active</Pill>
            <Pill tone="success">{statusSummary.completed} completed</Pill>
            <Pill>{statusSummary.snoozed} snoozed</Pill>
          </InlineGroup>
        </Card>
      )}

      <SectionHeader
        subtitle="Sorted by deterministic priority score (no user-facing quiz scores)."
        title="By Priority"
      />

      {report.priorities.length > 0 ? (
        <ContentStack>{report.priorities.map((item) => renderPriorityCard(item))}</ContentStack>
      ) : null}

      <SectionHeader
        subtitle="Adaptive phase buckets generated from the ranked priorities."
        title="By Phase"
      />

      <ContentStack>
        {phaseCounts.map((entry) => {
          const firstItem = report.roadmapByPhase[entry.phase][0];

          return (
            <Card key={entry.phase} tone="soft">
              <div className="hr-card-row">
                <h3 className="hr-item-title">{ROADMAP_PHASE_LABELS[entry.phase]}</h3>
                <Pill tone={entry.count > 0 ? "accent" : "neutral"}>{entry.count} items</Pill>
              </div>
              <p className="hr-item-description">
                {firstItem
                  ? `Highest item in this phase: ${firstItem.title}`
                  : "No items in this phase yet."}
              </p>
            </Card>
          );
        })}
      </ContentStack>
    </ScreenContainer>
  );
}
