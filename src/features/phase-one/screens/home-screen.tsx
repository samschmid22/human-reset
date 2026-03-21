"use client";

import { useMemo, useState } from "react";

import { ActionDetailView } from "@/components/actions/action-detail-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getActionStatusView } from "@/features/actions/storage";
import { ActionState, ActionStatus, ActionStatusView } from "@/features/actions/types";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
import { FindingsRoadmapResult, RoadmapItem } from "@/features/findings/types";
import { QuizDefinition } from "@/features/quizzes/types";
import { cn } from "@/lib/cn";

type HomeScreenProps = {
  actionState: ActionState;
  onActionDoneToday: (actionId: string) => void;
  onActionDonePermanent: (actionId: string) => void;
  onActionReset: (actionId: string) => void;
  onActionSkip: (actionId: string) => void;
  onActionSnooze: (actionId: string) => void;
  onFocusStyleChange: (style: "mixed" | "one_category") => void;
  onOpenQuizzes: () => void;
  quizDefinitions: QuizDefinition[];
  report: FindingsRoadmapResult;
};

type ActionRow = {
  action: RoadmapItem;
  statusView: ActionStatusView;
};

function toStatusLabel(status: ActionStatus): string {
  if (status === "done_today") return "Done today";
  if (status === "done_permanent") return "Completed";
  if (status === "snoozed") return "Snoozed";
  if (status === "skipped") return "Skipped";
  return "Pending";
}

function buildActionRows(actions: RoadmapItem[], actionState: ActionState): ActionRow[] {
  return actions.map((action) => ({
    action,
    statusView: getActionStatusView(actionState, action.id),
  }));
}

export function HomeScreen({
  actionState,
  onActionDoneToday,
  onActionDonePermanent,
  onActionReset,
  onActionSkip,
  onActionSnooze,
  onFocusStyleChange,
  onOpenQuizzes,
  quizDefinitions,
  report,
}: HomeScreenProps) {
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [snoozedExpanded, setSnoozedExpanded] = useState(false);

  const actionRows = useMemo(
    () => buildActionRows(report.dailyPlan.actions, actionState),
    [actionState, report.dailyPlan.actions],
  );

  const pendingActions = actionRows.filter((row) => row.statusView.status === "pending");
  const snoozedActions = actionRows.filter((row) => row.statusView.status === "snoozed");
  const doneTodayActions = actionRows.filter((row) => row.statusView.status === "done_today");

  const topPriority = pendingActions[0] ?? actionRows[0] ?? null;
  const additionalActions = pendingActions.slice(1);
  const maturity = getPlanMaturity(report.completedQuizCount, report.totalQuizCount);

  // Suppress unused variable warning — quizDefinitions kept for future use
  void quizDefinitions;
  void onFocusStyleChange;

  function toggleDetails(actionId: string): void {
    setExpandedActionId((current) => (current === actionId ? null : actionId));
  }

  function renderActionControls(row: ActionRow) {
    const { action, statusView } = row;
    const isDoneToday = statusView.status === "done_today";
    const isSnoozed = statusView.status === "snoozed";
    const isExpanded = expandedActionId === action.id;
    const doneButtonLabel = isDoneToday ? "Undo" : "Done";
    const snoozeButtonLabel = isSnoozed ? "Unsnooze" : "Snooze";

    return (
      <div className="hr-action-controls">
        <Button
          className={cn("hr-action-button", isSnoozed && "is-unsnooze")}
          disabled={isDoneToday}
          onClick={() => (isSnoozed ? onActionReset(action.id) : onActionSnooze(action.id))}
          size="sm"
          variant="quiet"
        >
          {snoozeButtonLabel}
        </Button>
        <Button
          className={cn("hr-action-button", "is-details", isExpanded && "is-open")}
          onClick={() => toggleDetails(action.id)}
          size="sm"
          variant="quiet"
        >
          {isExpanded ? "Hide" : "Details"}
        </Button>
        <Button
          className="hr-action-button is-skip"
          disabled={isDoneToday}
          onClick={() => onActionSkip(action.id)}
          size="sm"
          variant="quiet"
        >
          Skip
        </Button>
        <Button
          className={cn("hr-action-button", isDoneToday ? "is-undo" : "is-done")}
          onClick={() => (isDoneToday ? onActionReset(action.id) : onActionDoneToday(action.id))}
          size="sm"
          variant={isDoneToday ? "secondary" : "primary"}
        >
          {doneButtonLabel}
        </Button>
      </div>
    );
  }

  function renderActionListRow(row: ActionRow) {
    const { action, statusView } = row;
    const isExpanded = expandedActionId === action.id;

    return (
      <div className="hr-action-list-row" key={action.id}>
        <div className="hr-action-list-content">
          <div className="hr-action-list-heading">
            <p className="hr-action-list-meta">{action.category}</p>
            {statusView.status !== "pending" ? (
              <span className={cn("hr-action-status-chip", `is-${statusView.status}`)}>
                {toStatusLabel(statusView.status)}
              </span>
            ) : null}
          </div>
          <h3 className="hr-item-title">{action.title}</h3>
          {statusView.snoozedUntil ? (
            <p className="hr-action-list-status">Snoozed until {statusView.snoozedUntil}</p>
          ) : null}
        </div>
        {renderActionControls(row)}
        {isExpanded ? (
          <ActionDetailView
            action={action}
            onDonePermanent={() => onActionDonePermanent(action.id)}
          />
        ) : null}
      </div>
    );
  }

  return (
    <ScreenContainer className="hr-home-screen">
      <section className="hr-home-main-column">
        {maturity.stage !== "calibrated" ? (
          <Card className="hr-calibration-banner" tone="soft">
            <p className="hr-overline">Plan Maturity</p>
            <h3 className="hr-item-title">{maturity.title}</h3>
            <p className="hr-copy">{maturity.summary}</p>
            <Button onClick={onOpenQuizzes} size="sm" variant="secondary">
              Complete a quiz
            </Button>
          </Card>
        ) : null}

        <SectionHeader title="Today's Steps" />

        {topPriority ? (
          <Card className="hr-action-list-card">
            {/* Primary action */}
            <div className="hr-action-list-row is-primary-row">
              <div className="hr-action-list-content">
                <div className="hr-action-list-heading">
                  <p className="hr-action-list-meta">{topPriority.action.category}</p>
                  {topPriority.statusView.status !== "pending" ? (
                    <span className={cn("hr-action-status-chip", `is-${topPriority.statusView.status}`)}>
                      {toStatusLabel(topPriority.statusView.status)}
                    </span>
                  ) : null}
                </div>
                <h3 className="hr-item-title">{topPriority.action.title}</h3>
              </div>
              {renderActionControls(topPriority)}
              {expandedActionId === topPriority.action.id ? (
                <ActionDetailView
                  action={topPriority.action}
                  onDonePermanent={() => onActionDonePermanent(topPriority.action.id)}
                />
              ) : null}
            </div>

            {additionalActions.length > 0 ? (
              <ContentStack className="hr-action-additional-stack">
                {additionalActions.map((row) => renderActionListRow(row))}
              </ContentStack>
            ) : null}
          </Card>
        ) : (
          <Card className="hr-empty-state" tone="soft">
            <p className="hr-empty-title">No actions scheduled yet</p>
            <p className="hr-empty-copy">
              Complete a quiz to generate your first guided reset actions.
            </p>
          </Card>
        )}

        {snoozedActions.length > 0 ? (
          <Card className="hr-snooze-summary-card">
            <button
              className="hr-snooze-summary-toggle"
              onClick={() => setSnoozedExpanded((v) => !v)}
              type="button"
            >
              <span className="hr-snooze-summary-label">
                Snoozed for later
                <span className="hr-snooze-summary-count">{snoozedActions.length}</span>
              </span>
              <svg aria-hidden="true" className={cn("hr-snooze-chevron", snoozedExpanded && "is-open")} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" height="14" width="14">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {snoozedExpanded ? (
              <ContentStack className="hr-snooze-list">
                {snoozedActions.map((row) => renderActionListRow(row))}
              </ContentStack>
            ) : null}
          </Card>
        ) : null}

        {doneTodayActions.length > 0 ? (
          <Card className="hr-snooze-summary-card">
            <div className="hr-snooze-summary-toggle">
              <span className="hr-snooze-summary-label">
                Done today
                <span className="hr-snooze-summary-count">{doneTodayActions.length}</span>
              </span>
            </div>
            <ContentStack className="hr-snooze-list">
              {doneTodayActions.map((row) => renderActionListRow(row))}
            </ContentStack>
          </Card>
        ) : null}
      </section>
    </ScreenContainer>
  );
}
