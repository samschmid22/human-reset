import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
import { getAnsweredCount, getQuizStatus } from "@/features/quizzes/storage";
import { QuizDefinition, QuizState, QuizStatus } from "@/features/quizzes/types";
import { cn } from "@/lib/cn";

type QuizHubProps = {
  onOpenQuiz: (quizId: string) => void;
  quizzes: QuizDefinition[];
  quizState: QuizState;
};

const statusLabelMap: Record<QuizStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Complete",
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

  return (
    <ScreenContainer className="hr-quizzes-screen">
      <Card className="hr-quiz-overview-card" tone="soft">
        <div className="hr-card-row">
          <div>
            <p className="hr-overline">Quiz Intake</p>
            <h2 className="hr-feature-title">Calibrate your reset plan</h2>
            <p className="hr-copy">{maturity.summary}</p>
          </div>
          {nextQuiz ? (
            <Button onClick={() => onOpenQuiz(nextQuiz.quiz.id)} size="sm" variant="secondary">
              {nextQuiz.status === "in_progress" ? "Continue" : "Start next"}
            </Button>
          ) : null}
        </div>

        <div className="hr-quiz-stat-grid">
          <div className="hr-quiz-stat">
            <span className="hr-kpi-label">Complete</span>
            <strong>{completedCount}</strong>
          </div>
          <div className="hr-quiz-stat">
            <span className="hr-kpi-label">In progress</span>
            <strong>{inProgressCount}</strong>
          </div>
          <div className="hr-quiz-stat">
            <span className="hr-kpi-label">Not started</span>
            <strong>{notStartedCount}</strong>
          </div>
          <div className="hr-quiz-stat">
            <span className="hr-kpi-label">Plan calibration</span>
            <strong>{overallPercent}%</strong>
          </div>
        </div>
      </Card>

      <SectionHeader subtitle="Complete categories progressively to sharpen roadmap quality." title="Category Inputs" />

      <Card className="hr-quiz-list-card">
        <ContentStack className="hr-quiz-list-stack">
          {orderedQuizMeta.map((entry) => {
            const isNext = nextQuiz?.quiz.id === entry.quiz.id;

            return (
              <div className={cn("hr-quiz-row", isNext && "is-next")} key={entry.quiz.id}>
                <div className="hr-quiz-row-main">
                  <div className="hr-quiz-row-title">
                    <h3 className="hr-item-title">{entry.quiz.title}</h3>
                    <span className={cn("hr-quiz-status-badge", `is-${entry.status}`)}>
                      {statusLabelMap[entry.status]}
                    </span>
                  </div>
                  <p className="hr-item-description">{entry.quiz.description}</p>
                  <div className="hr-quiz-row-progress">
                    <span>{entry.answeredCount} of {entry.quiz.questions.length}</span>
                    <div className="hr-linear-progress" role="presentation">
                      <div className="hr-linear-progress-bar" style={{ width: `${entry.percent}%` }} />
                    </div>
                  </div>
                </div>

                <Button onClick={() => onOpenQuiz(entry.quiz.id)} size="sm" variant="secondary">
                  {buttonLabelMap[entry.status]}
                </Button>
              </div>
            );
          })}
        </ContentStack>
      </Card>
    </ScreenContainer>
  );
}
