import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { SharedTopCard } from "@/components/ui/shared-top-card";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
import { getAnsweredCount, getQuizStatus } from "@/features/quizzes/storage";
import { QuizDefinition, QuizState, QuizStatus } from "@/features/quizzes/types";

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

  function renderQuizCards(entries: typeof orderedQuizMeta) {
    return entries.map((entry) => (
      <Card className="hr-quiz-card" key={entry.quiz.id}>
        <div className="hr-quiz-card-main">
          <h3 className="hr-quiz-card-title">{entry.quiz.title}</h3>
          <p className="hr-quiz-card-description">{entry.quiz.description}</p>
        </div>
        <div className="hr-quiz-card-controls">
          <Button onClick={() => onOpenQuiz(entry.quiz.id)} size="sm" variant="primary">
            {buttonLabelMap[entry.status]}
          </Button>
        </div>
      </Card>
    ));
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
        <>
          <p className="hr-quiz-group-label">
            Continue now <span className="hr-quiz-group-count">{inProgressQuizzes.length}</span>
          </p>
          <div className="hr-quiz-cards-list">{renderQuizCards(inProgressQuizzes)}</div>
        </>
      ) : null}

      {notStartedQuizzes.length > 0 ? (
        <>
          <p className="hr-quiz-group-label">
            Start next <span className="hr-quiz-group-count">{notStartedQuizzes.length}</span>
          </p>
          <div className="hr-quiz-cards-list">{renderQuizCards(notStartedQuizzes)}</div>
        </>
      ) : null}

      {completedQuizzes.length > 0 ? (
        <>
          <p className="hr-quiz-group-label">
            Completed <span className="hr-quiz-group-count">{completedQuizzes.length}</span>
          </p>
          <div className="hr-quiz-cards-list">{renderQuizCards(completedQuizzes)}</div>
        </>
      ) : null}
    </ScreenContainer>
  );
}
