import { useMemo, useState } from "react";

import { ActionDetailView } from "@/components/actions/action-detail-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getActionStatusView } from "@/features/actions/storage";
import { ActionState, ActionStatus, ActionStatusView } from "@/features/actions/types";
import { FindingsRoadmapResult, RoadmapItem } from "@/features/findings/types";
import { QuizDefinition } from "@/features/quizzes/types";
import { cn } from "@/lib/cn";

type HomeScreenProps = {
  actionState: ActionState;
  onActionDone: (actionId: string) => void;
  onActionSnooze: (actionId: string) => void;
  onOpenQuizzes: () => void;
  quizDefinitions: QuizDefinition[];
  report: FindingsRoadmapResult;
};

type ActionRow = {
  action: RoadmapItem;
  statusView: ActionStatusView;
};

function toFocusLabel(focusStyle: FindingsRoadmapResult["dailyPlan"]["focusStyle"]): string {
  return focusStyle === "one_category" ? "One category/day" : "Mixed categories";
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

function buildActionRows(actions: RoadmapItem[], actionState: ActionState): ActionRow[] {
  return actions.map((action) => ({
    action,
    statusView: getActionStatusView(actionState, action.id),
  }));
}

function toCalibrationLabel(completed: number, total: number): string {
  if (total <= 0) {
    return "Plan is waiting for quiz input";
  }

  if (completed <= 1) {
    return "Calibrating early plan";
  }

  if (completed < total) {
    return "Plan still refining";
  }

  return "Plan calibrated";
}

export function HomeScreen({
  actionState,
  onActionDone,
  onActionSnooze,
  onOpenQuizzes,
  quizDefinitions,
  report,
}: HomeScreenProps) {
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  const actionRows = useMemo(
    () => buildActionRows(report.dailyPlan.actions, actionState),
    [actionState, report.dailyPlan.actions],
  );

  const pendingActions = actionRows.filter((row) => row.statusView.status === "pending");
  const snoozedActions = actionRows.filter((row) => row.statusView.status === "snoozed");
  const completedActions = actionRows.filter((row) => row.statusView.status === "completed");

  const topPriority = pendingActions[0] ?? actionRows[0] ?? null;
  const additionalActions = pendingActions.slice(1);
  const nextBestQuiz = report.nextBestQuizId
    ? (quizDefinitions.find((quiz) => quiz.id === report.nextBestQuizId) ?? null)
    : null;
  const activePhases = Object.values(report.roadmapByPhase).filter((items) => items.length > 0).length;
  const calibrationPercent =
    report.totalQuizCount > 0 ? Math.round((report.completedQuizCount / report.totalQuizCount) * 100) : 0;

  function toggleDetails(actionId: string): void {
    setExpandedActionId((current) => (current === actionId ? null : actionId));
  }

  function renderActionControls(row: ActionRow, isPrimary: boolean) {
    const { action, statusView } = row;
    const isCompleted = statusView.status === "completed";
    const isSnoozed = statusView.status === "snoozed";
    const isExpanded = expandedActionId === action.id;

    return (
      <div className={cn("hr-action-controls", isPrimary && "is-primary")}>
        <Button
          disabled={isCompleted}
          onClick={() => onActionDone(action.id)}
          size="sm"
          variant="secondary"
        >
          {isCompleted ? "Completed" : "Done"}
        </Button>
        <Button
          disabled={isCompleted || isSnoozed}
          onClick={() => onActionSnooze(action.id)}
          size="sm"
          variant="quiet"
        >
          {isSnoozed ? "Snoozed" : "Snooze"}
        </Button>
        <Button onClick={() => toggleDetails(action.id)} size="sm" variant="quiet">
          {isExpanded ? "Hide Details" : "Details"}
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
          <p className="hr-action-list-meta">{action.category}</p>
          <h3 className="hr-item-title">{action.title}</h3>
          <p className="hr-item-description">{action.minimumStep}</p>
          <p className="hr-action-list-status">
            {toStatusLabel(statusView.status)}
            {statusView.snoozedUntil ? ` until ${statusView.snoozedUntil}` : ""}
          </p>
        </div>
        {renderActionControls(row, false)}
        {isExpanded ? <ActionDetailView action={action} /> : null}
      </div>
    );
  }

  return (
    <ScreenContainer className="hr-home-screen">
      <section className="hr-home-dashboard-grid">
        <Card className="hr-home-hero" tone="accent">
          <p className="hr-overline">Today</p>
          <h2 className="hr-feature-title">
            {topPriority ? "Start with your top priority action" : "Take your next quiz to generate today’s plan"}
          </h2>
          <p className="hr-copy">
            {topPriority
              ? `${toFocusLabel(report.dailyPlan.focusStyle)} • up to ${report.dailyPlan.maxActions} actions today`
              : "Your dashboard will populate as quiz input is completed."}
          </p>
          {topPriority ? (
            <div className="hr-home-primary-action">
              <div>
                <p className="hr-action-list-meta">{topPriority.action.category}</p>
                <h3 className="hr-item-title">{topPriority.action.title}</h3>
                <p className="hr-item-description">{topPriority.action.minimumStep}</p>
              </div>
              {renderActionControls(topPriority, true)}
              {expandedActionId === topPriority.action.id ? <ActionDetailView action={topPriority.action} /> : null}
            </div>
          ) : (
            <Button onClick={onOpenQuizzes} size="sm" variant="secondary">
              Go to Quizzes
            </Button>
          )}
        </Card>

        <Card className="hr-home-stats" tone="surface">
          <div className="hr-kpi-grid">
            <div className="hr-kpi">
              <span className="hr-kpi-label">Plan Calibration</span>
              <strong>{calibrationPercent}%</strong>
              <span className="hr-kpi-note">
                {report.completedQuizCount}/{report.totalQuizCount} quizzes
              </span>
            </div>
            <div className="hr-kpi">
              <span className="hr-kpi-label">Top Category</span>
              <strong>{report.highestPriorityCategory ?? "Pending"}</strong>
              <span className="hr-kpi-note">Current emphasis</span>
            </div>
            <div className="hr-kpi">
              <span className="hr-kpi-label">Actions Today</span>
              <strong>{pendingActions.length}</strong>
              <span className="hr-kpi-note">{report.dailyPlan.maxActions} max/day</span>
            </div>
            <div className="hr-kpi">
              <span className="hr-kpi-label">Roadmap Depth</span>
              <strong>{report.priorities.length}</strong>
              <span className="hr-kpi-note">{activePhases} active phases</span>
            </div>
          </div>
        </Card>
      </section>

      {report.completedQuizCount < report.totalQuizCount ? (
        <Card className="hr-calibration-banner" tone="soft">
          <p className="hr-overline">{toCalibrationLabel(report.completedQuizCount, report.totalQuizCount)}</p>
          <p className="hr-copy">
            Plan confidence is still building. Complete more category quizzes to sharpen action ranking.
          </p>
        </Card>
      ) : null}

      <SectionHeader title="Today’s Action Queue" />

      {actionRows.length > 0 ? (
        <Card className="hr-action-list-card">
          {additionalActions.length > 0 ? (
            <ContentStack>
              {additionalActions.map((row) => renderActionListRow(row))}
            </ContentStack>
          ) : (
            <p className="hr-item-description">No additional active actions after your top priority.</p>
          )}
        </Card>
      ) : (
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">No actions scheduled yet</p>
          <p className="hr-empty-copy">Complete a quiz to generate your first prioritized action queue.</p>
        </Card>
      )}

      {nextBestQuiz ? (
        <Card className="hr-home-next-card" tone="soft">
          <div className="hr-card-row">
            <div>
              <p className="hr-overline">What to do next</p>
              <h3 className="hr-item-title">{nextBestQuiz.title}</h3>
              <p className="hr-item-description">{nextBestQuiz.description}</p>
            </div>
            <Button onClick={onOpenQuizzes} size="sm" variant="secondary">
              Continue Quiz
            </Button>
          </div>
        </Card>
      ) : null}

      {(snoozedActions.length > 0 || completedActions.length > 0) ? (
        <section className="hr-home-secondary-grid">
          {snoozedActions.length > 0 ? (
            <Card>
              <SectionHeader className="hr-subsection-header" title="Snoozed" />
              <ContentStack>{snoozedActions.map((row) => renderActionListRow(row))}</ContentStack>
            </Card>
          ) : null}

          {completedActions.length > 0 ? (
            <Card>
              <SectionHeader className="hr-subsection-header" title="Completed" />
              <ContentStack>{completedActions.map((row) => renderActionListRow(row))}</ContentStack>
            </Card>
          ) : null}
        </section>
      ) : null}
    </ScreenContainer>
  );
}
