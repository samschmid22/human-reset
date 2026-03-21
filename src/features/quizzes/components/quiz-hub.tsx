import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { SharedTopCard } from "@/components/ui/shared-top-card";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
import { getAnsweredCount, getQuizStatus } from "@/features/quizzes/storage";
import { QuizDefinition, QuizState, QuizStatus } from "@/features/quizzes/types";
import { cn } from "@/lib/cn";

type QuizHubProps = {
  onOpenQuiz: (quizId: string) => void;
  quizzes: QuizDefinition[];
  quizState: QuizState;
};

const buttonLabelMap: Record<QuizStatus, string> = {
  not_started: "Start",
  in_progress: "Continue",
  completed: "Review",
};

export function QuizHub({ onOpenQuiz, quizzes, quizState }: QuizHubProps) {
  const quizMeta = quizzes.map((quiz) => {
    const progress = quizState.quizzes[quiz.id];
    const status = getQuizStatus(progress);
    const answeredCount = getAnsweredCount(progress);
    const percent = Math.round((answeredCount / quiz.questions.length) * 100);

    return {
      answeredCount,
      percent,
      quiz,
      status,
    };
  });
  const statusOrder: Record<QuizStatus, number> = {
    in_progress: 0,
    not_started: 1,
    completed: 2,
  };
  const orderedQuizMeta = [...quizMeta].sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    return a.quiz.title.localeCompare(b.quiz.title);
  });

  const completedCount = quizMeta.filter((entry) => entry.status === "completed").length;
  const inProgressCount = quizMeta.filter((entry) => entry.status === "in_progress").length;
  const notStartedCount = quizMeta.filter((entry) => entry.status === "not_started").length;
  const overallPercent = quizzes.length > 0 ? Math.round((completedCount / quizzes.length) * 100) : 0;
  const nextQuiz =
    quizMeta.find((entry) => entry.status === "in_progress") ??
    quizMeta.find((entry) => entry.status === "not_started") ??
    null;
  const maturity = getPlanMaturity(completedCount, quizzes.length);
  const inProgressQuizzes = orderedQuizMeta.filter((entry) => entry.status === "in_progress");
  const notStartedQuizzes = orderedQuizMeta.filter((entry) => entry.status === "not_started");
  const completedQuizzes = orderedQuizMeta.filter((entry) => entry.status === "completed");

  function renderQuizRows(entries: typeof orderedQuizMeta) {
    return entries.map((entry) => {
      const isNext = nextQuiz?.quiz.id === entry.quiz.id;

      return (
        <div className={cn("hr-quiz-row", isNext && "is-next")} key={entry.quiz.id}>
          <div className="hr-quiz-row-main">
            <h3 className="hr-item-title">{entry.quiz.title}</h3>
            <p className="hr-item-description">{entry.quiz.description}</p>
          </div>

          <div className="hr-quiz-row-right">
            <span className="hr-quiz-row-count">{entry.answeredCount}/{entry.quiz.questions.length}</span>
            <Button onClick={() => onOpenQuiz(entry.quiz.id)} size="sm" variant="secondary">
              {buttonLabelMap[entry.status]}
            </Button>
          </div>
        </div>
      );
    });
  }

  return (
    <ScreenContainer className="hr-quizzes-screen">
      <SharedTopCard
        action={
          nextQuiz ? (
            <Button onClick={() => onOpenQuiz(nextQuiz.quiz.id)} size="sm" variant="primary">
              {nextQuiz.status === "in_progress" ? "Continue" : "Start next"}
            </Button>
          ) : null
        }
        className="hr-quiz-overview-card"
        metrics={[
          { label: "Completed", value: completedCount },
          { label: "In progress", value: inProgressCount },
          { label: "Not started", value: notStartedCount },
          { label: "Plan calibration", value: `${overallPercent}%` },
        ]}
        overline="Quiz Intake"
        summary={maturity.summary}
        title="Calibrate your reset plan"
      />

      <SectionHeader title="Category Inputs" />

      {inProgressQuizzes.length > 0 ? (
        <Card className="hr-quiz-list-card">
          <div className="hr-quiz-group-head">
            <p className="hr-overline">Continue Now</p>
            <span className="hr-roadmap-phase-count">{inProgressQuizzes.length}</span>
          </div>
          <ContentStack className="hr-quiz-list-stack">{renderQuizRows(inProgressQuizzes)}</ContentStack>
        </Card>
      ) : null}

      {notStartedQuizzes.length > 0 ? (
        <Card className="hr-quiz-list-card">
          <div className="hr-quiz-group-head">
            <p className="hr-overline">Start Next</p>
            <span className="hr-roadmap-phase-count">{notStartedQuizzes.length}</span>
          </div>
          <ContentStack className="hr-quiz-list-stack">{renderQuizRows(notStartedQuizzes)}</ContentStack>
        </Card>
      ) : null}

      {completedQuizzes.length > 0 ? (
        <Card className="hr-quiz-list-card">
          <div className="hr-quiz-group-head">
            <p className="hr-overline">Completed Inputs</p>
            <span className="hr-roadmap-phase-count">{completedQuizzes.length}</span>
          </div>
          <ContentStack className="hr-quiz-list-stack">{renderQuizRows(completedQuizzes)}</ContentStack>
        </Card>
      ) : null}
    </ScreenContainer>
  );
}
