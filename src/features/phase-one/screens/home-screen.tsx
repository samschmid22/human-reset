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
  onActionDone: (actionId: string) => void;
  onActionReset: (actionId: string) => void;
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

function toMaturityStageLabel(stage: ReturnType<typeof getPlanMaturity>["stage"]): string {
  if (stage === "pending") {
    return "Pending";
  }

  if (stage === "early") {
    return "Early";
  }

  if (stage === "developing") {
    return "Developing";
  }

  if (stage === "refining") {
    return "Refining";
  }

  return "Calibrated";
}

function toStatusLabel(status: ActionStatus): string {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "snoozed") {
    return "Snoozed";
  }

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
  onActionDone,
  onActionReset,
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
  const maturity = getPlanMaturity(report.completedQuizCount, report.totalQuizCount);
  const hasSideColumn =
    Boolean(nextBestQuiz) || snoozedActions.length > 0 || completedActions.length > 0;

  function toggleDetails(actionId: string): void {
    setExpandedActionId((current) => (current === actionId ? null : actionId));
  }

  function renderActionControls(row: ActionRow, isPrimary: boolean) {
    const { action, statusView } = row;
    const isCompleted = statusView.status === "completed";
    const isSnoozed = statusView.status === "snoozed";
    const isExpanded = expandedActionId === action.id;
    const doneButtonLabel = isCompleted ? "Undo" : "Done";
    const snoozeButtonLabel = isSnoozed ? "Unsnooze" : "Snooze";

    return (
      <div className={cn("hr-action-controls", isPrimary && "is-primary")}>
        <Button
          className={cn("hr-action-button", isCompleted ? "is-undo" : "is-done")}
          onClick={() => (isCompleted ? onActionReset(action.id) : onActionDone(action.id))}
          size="sm"
          variant={isCompleted ? "quiet" : "primary"}
        >
          {doneButtonLabel}
        </Button>
        <Button
          className={cn("hr-action-button", isSnoozed && "is-unsnooze")}
          disabled={isCompleted}
          onClick={() => (isSnoozed ? onActionReset(action.id) : onActionSnooze(action.id))}
          size="sm"
          variant={isSnoozed ? "secondary" : "quiet"}
        >
          {snoozeButtonLabel}
        </Button>
        <Button
          className={cn("hr-action-button", "is-details", isExpanded && "is-open")}
          onClick={() => toggleDetails(action.id)}
          size="sm"
          variant="quiet"
        >
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
          <div className="hr-action-list-heading">
            <p className="hr-action-list-meta">{action.category}</p>
            {statusView.status !== "pending" ? (
              <span className={cn("hr-action-status-chip", `is-${statusView.status}`)}>
                {toStatusLabel(statusView.status)}
              </span>
            ) : null}
          </div>
          <h3 className="hr-item-title">{action.title}</h3>
          <p className="hr-item-description">{action.minimumStep}</p>
          {statusView.snoozedUntil ? (
            <p className="hr-action-list-status">Snoozed until {statusView.snoozedUntil}</p>
          ) : null}
        </div>
        {renderActionControls(row, false)}
        {isExpanded ? <ActionDetailView action={action} /> : null}
      </div>
    );
  }

  return (
    <ScreenContainer className="hr-home-screen">
      <section className="hr-home-intro-stack">
        <Card className="hr-home-hero" tone="accent">
          <div className="hr-home-hero-head">
            <p className="hr-overline">Dashboard</p>
            <span className="hr-home-hero-badge">{maturity.badge}</span>
          </div>
          <h2 className="hr-feature-title">
            {topPriority ? "Start here today" : "Start your reset plan"}
          </h2>
          <p className="hr-copy">
            {topPriority
              ? `${toFocusLabel(report.dailyPlan.focusStyle)} · up to ${report.dailyPlan.maxActions} guided actions`
              : "Complete your first category input to generate a practical, phased plan."}
          </p>
          {topPriority ? (
            <div className="hr-home-primary-action">
              <div className="hr-home-primary-main">
                <div className="hr-action-list-heading">
                  <p className="hr-action-list-meta">{topPriority.action.category}</p>
                  {topPriority.statusView.status !== "pending" ? (
                    <span className={cn("hr-action-status-chip", `is-${topPriority.statusView.status}`)}>
                      {toStatusLabel(topPriority.statusView.status)}
                    </span>
                  ) : null}
                </div>
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
          <div className="hr-home-stats-head">
            <p className="hr-overline">Plan Snapshot</p>
            <p className="hr-home-stats-caption">{maturity.progressLabel}</p>
          </div>
          <div className="hr-kpi-grid">
            <div className="hr-kpi">
              <div className="hr-kpi-main">
                <span className="hr-kpi-label">Plan Maturity</span>
                <strong>{calibrationPercent}%</strong>
              </div>
              <span className="hr-kpi-note">{toMaturityStageLabel(maturity.stage)}</span>
            </div>
            <div className="hr-kpi">
              <div className="hr-kpi-main">
                <span className="hr-kpi-label">Top Category</span>
                <strong>{report.highestPriorityCategory ?? "Pending"}</strong>
              </div>
              <span className="hr-kpi-note">Current emphasis</span>
            </div>
            <div className="hr-kpi">
              <div className="hr-kpi-main">
                <span className="hr-kpi-label">Actions Today</span>
                <strong>{pendingActions.length}</strong>
              </div>
              <span className="hr-kpi-note">{report.dailyPlan.maxActions} max/day</span>
            </div>
            <div className="hr-kpi">
              <div className="hr-kpi-main">
                <span className="hr-kpi-label">Reset Depth</span>
                <strong>{report.priorities.length}</strong>
              </div>
              <span className="hr-kpi-note">{activePhases} active phases</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="hr-home-content-grid">
        <div className="hr-home-main-column">
          {maturity.stage !== "calibrated" ? (
            <Card className="hr-calibration-banner" tone="soft">
              <p className="hr-overline">Plan Maturity</p>
              <h3 className="hr-item-title">{maturity.title}</h3>
              <p className="hr-copy">{maturity.summary}</p>
            </Card>
          ) : null}

          <SectionHeader
            subtitle="Do the top step first, then continue if capacity allows."
            title="Today’s Steps"
          />

          {actionRows.length > 0 ? (
            <Card className="hr-action-list-card">
              {additionalActions.length > 0 ? (
                <ContentStack>
                  {additionalActions.map((row) => renderActionListRow(row))}
                </ContentStack>
              ) : (
                <p className="hr-item-description">Today is focused on your primary action.</p>
              )}
            </Card>
          ) : (
            <Card className="hr-empty-state" tone="soft">
              <p className="hr-empty-title">No actions scheduled yet</p>
              <p className="hr-empty-copy">
                Complete a quiz to generate your first guided reset actions.
              </p>
            </Card>
          )}
        </div>

        {hasSideColumn ? (
          <aside className="hr-home-side-column">
            {nextBestQuiz ? (
              <Card className="hr-home-next-card" tone="soft">
                <div className="hr-card-row">
                  <div>
                    <p className="hr-overline">Next Category</p>
                    <h3 className="hr-item-title">{nextBestQuiz.title}</h3>
                    <p className="hr-item-description">
                      Complete this quiz to sharpen ranking and phase order.
                    </p>
                  </div>
                  <Button onClick={onOpenQuizzes} size="sm" variant="secondary">
                    Continue Quiz
                  </Button>
                </div>
              </Card>
            ) : null}

            {snoozedActions.length > 0 ? (
              <Card>
                <SectionHeader className="hr-subsection-header" title="Snoozed for Later" />
                <ContentStack>{snoozedActions.map((row) => renderActionListRow(row))}</ContentStack>
              </Card>
            ) : null}

            {completedActions.length > 0 ? (
              <Card>
                <SectionHeader className="hr-subsection-header" title="Completed Steps" />
                <ContentStack>{completedActions.map((row) => renderActionListRow(row))}</ContentStack>
              </Card>
            ) : null}
          </aside>
        ) : null}
      </section>
    </ScreenContainer>
  );
}
