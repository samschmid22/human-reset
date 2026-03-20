import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { getAnsweredCount, getQuizStatus } from "@/features/quizzes/storage";
import { QuizDefinition, QuizState, QuizStatus } from "@/features/quizzes/types";

type QuizHubProps = {
  onOpenQuiz: (quizId: string) => void;
  quizzes: QuizDefinition[];
  quizState: QuizState;
};

const statusLabelMap: Record<QuizStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Complete",
};

const statusToneMap: Record<QuizStatus, "neutral" | "accent" | "success"> = {
  not_started: "neutral",
  in_progress: "accent",
  completed: "success",
};

const buttonLabelMap: Record<QuizStatus, string> = {
  not_started: "Start Quiz",
  in_progress: "Continue",
  completed: "View Completed",
};

export function QuizHub({ onOpenQuiz, quizzes, quizState }: QuizHubProps) {
  return (
    <ScreenContainer>
      <Card className="hr-empty-state" tone="soft">
        <p className="hr-empty-title">Category Quizzes</p>
        <p className="hr-empty-copy">
          One question per screen. Responses save automatically and can be completed over time.
        </p>
      </Card>

      <SectionHeader
        subtitle="No scores are shown. Quiz answers are structured inputs for future roadmap logic."
        title="Available Quizzes"
      />

      <ContentStack>
        {quizzes.map((quiz) => {
          const progress = quizState.quizzes[quiz.id];
          const status = getQuizStatus(progress);
          const answeredCount = getAnsweredCount(progress);

          return (
            <Card key={quiz.id}>
              <div className="hr-card-row">
                <div>
                  <h3 className="hr-item-title">{quiz.title}</h3>
                  <p className="hr-item-description">{quiz.description}</p>
                </div>
                <Pill tone={statusToneMap[status]}>{statusLabelMap[status]}</Pill>
              </div>

              <p className="hr-item-description">
                {answeredCount} of {quiz.questions.length} questions answered
              </p>

              <Button onClick={() => onOpenQuiz(quiz.id)} size="sm" variant="secondary">
                {buttonLabelMap[status]}
              </Button>
            </Card>
          );
        })}
      </ContentStack>
    </ScreenContainer>
  );
}
