import { useMemo, useState } from "react";

import { ActionDetailView } from "@/components/actions/action-detail-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { getActionStatusView } from "@/features/actions/storage";
import { ActionState, ActionStatus, ActionStatusView } from "@/features/actions/types";
import { FindingsRoadmapResult, RoadmapItem, ROADMAP_PHASE_LABELS } from "@/features/findings/types";
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
  return focusStyle === "one_category" ? "One category / day" : "Mixed categories";
}

function toPriorityPillTone(priorityBand: "low" | "medium" | "high"): "neutral" | "accent" | "success" {
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

function buildActionRows(
  actions: RoadmapItem[],
  actionState: ActionState,
): ActionRow[] {
  return actions.map((action) => ({
    action,
    statusView: getActionStatusView(actionState, action.id),
  }));
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

  const nextBestQuiz = report.nextBestQuizId
    ? (quizDefinitions.find((quiz) => quiz.id === report.nextBestQuizId) ?? null)
    : null;
  const activePhases = Object.values(report.roadmapByPhase).filter((items) => items.length > 0).length;
  const roadmapBuildPercent = report.priorities.length > 0 ? Math.round((activePhases / 5) * 100) : 0;

  function toggleDetails(actionId: string): void {
    setExpandedActionId((current) => (current === actionId ? null : actionId));
  }

  function renderActionCard(row: ActionRow) {
    const { action, statusView } = row;
    const isExpanded = expandedActionId === action.id;
    const isCompleted = statusView.status === "completed";
    const isSnoozed = statusView.status === "snoozed";

    return (
      <Card
        className={cn(
          "hr-home-action-card hr-action-card",
          isCompleted && "is-completed",
          isSnoozed && "is-snoozed",
        )}
        key={action.id}
      >
        <div className="hr-card-row">
          <div>
            <InlineGroup>
              <Pill>{action.category}</Pill>
              <Pill tone="accent">{ROADMAP_PHASE_LABELS[action.phase]}</Pill>
            </InlineGroup>
            <h3 className="hr-item-title">{action.title}</h3>
            <p className="hr-item-description">{action.minimumStep}</p>
          </div>
          <div className="hr-action-pill-stack">
            <Pill tone={toStatusTone(statusView.status)}>{toStatusLabel(statusView.status)}</Pill>
            <Pill tone={toPriorityPillTone(action.priorityBand)}>{action.priorityBand}</Pill>
          </div>
        </div>

        <InlineGroup>
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
        </InlineGroup>

        {isSnoozed && statusView.snoozedUntil ? (
          <p className="hr-item-description hr-action-status-note">
            Snoozed until {statusView.snoozedUntil}.
          </p>
        ) : null}

        {isExpanded ? <ActionDetailView action={action} /> : null}
      </Card>
    );
  }

  return (
    <ScreenContainer>
      <Card tone="accent">
        <ContentStack>
          <InlineGroup>
            <Pill tone="accent">Today&apos;s Focus</Pill>
            <Pill>{toFocusLabel(report.dailyPlan.focusStyle)}</Pill>
            <Pill>Up to {report.dailyPlan.maxActions}/day</Pill>
          </InlineGroup>

          <h2 className="hr-feature-title">
            {actionRows.length > 0
              ? "Your Daily Plan Is Ready"
              : "Complete a quiz to generate your first daily plan"}
          </h2>

          <p className="hr-copy">
            {actionRows.length > 0
              ? "Actions are derived from your onboarding settings and quiz findings, with local Done and Snooze state saved on this device."
              : "Onboarding is complete. Your Home, Roadmap, and Profile views will populate as quiz findings are added."}
          </p>
        </ContentStack>
      </Card>

      <SectionHeader
        subtitle="Structured actions selected from your highest-priority roadmap items."
        title="Today&apos;s Actions"
      />

      {actionRows.length > 0 ? (
        <ContentStack>
          {pendingActions.length > 0 ? pendingActions.map((row) => renderActionCard(row)) : null}

          {pendingActions.length === 0 ? (
            <Card className="hr-empty-state" tone="soft">
              <p className="hr-empty-title">No active actions right now</p>
              <p className="hr-empty-copy">
                You have completed or snoozed all currently scheduled actions.
              </p>
            </Card>
          ) : null}
        </ContentStack>
      ) : (
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">No actions scheduled yet</p>
          <p className="hr-empty-copy">
            Start with a category quiz to generate structured findings and prioritized roadmap actions.
          </p>
          <Button onClick={onOpenQuizzes} size="sm" variant="secondary">
            Go to Quizzes
          </Button>
        </Card>
      )}

      {snoozedActions.length > 0 ? (
        <>
          <SectionHeader
            subtitle="Snoozed actions are deferred temporarily and remain in your roadmap."
            title="Snoozed"
          />
          <ContentStack>{snoozedActions.map((row) => renderActionCard(row))}</ContentStack>
        </>
      ) : null}

      {completedActions.length > 0 ? (
        <>
          <SectionHeader
            subtitle="Completed actions stay visible for progress continuity."
            title="Completed"
          />
          <ContentStack>{completedActions.map((row) => renderActionCard(row))}</ContentStack>
        </>
      ) : null}

      {nextBestQuiz ? (
        <Card tone="soft">
          <InlineGroup>
            <Pill tone="accent">Next Best Quiz</Pill>
            <Pill>
              {report.completedQuizCount} of {report.totalQuizCount} complete
            </Pill>
          </InlineGroup>
          <h3 className="hr-item-title">{nextBestQuiz.title}</h3>
          <p className="hr-item-description">{nextBestQuiz.description}</p>
          <Button onClick={onOpenQuizzes} size="sm" variant="secondary">
            Continue Quiz Work
          </Button>
        </Card>
      ) : null}

      <SectionHeader
        subtitle="Progress reflects roadmap structure and execution planning, never quiz score visuals."
        title="Roadmap Progress"
      />

      <Card>
        <div className="hr-progress-row">
          <div className="hr-progress-ring">
            <strong>{roadmapBuildPercent}%</strong>
            <span>Plan Built</span>
          </div>
          <div className="hr-progress-copy">
            <p className="hr-item-description">
              {report.priorities.length > 0
                ? `${report.priorities.length} prioritized actions across ${activePhases} active phases.`
                : "No findings ranked yet. Complete a quiz to generate priorities."}
            </p>
            <InlineGroup>
              <Pill>{report.findings.length} findings</Pill>
              <Pill>
                {completedActions.length} marked done
              </Pill>
            </InlineGroup>
          </div>
        </div>
      </Card>
    </ScreenContainer>
  );
}
