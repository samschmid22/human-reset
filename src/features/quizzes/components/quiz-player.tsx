import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { getAnsweredCount } from "@/features/quizzes/storage";
import { QuizDefinition, QuizOptionId, QuizProgress } from "@/features/quizzes/types";
import { cn } from "@/lib/cn";

type QuizPlayerProps = {
  onBackToHub: () => void;
  onProgressChange: (progress: QuizProgress) => void;
  progress: QuizProgress;
  quiz: QuizDefinition;
};

function createTimestamp(): string {
  return new Date().toISOString();
}

export function QuizPlayer({ onBackToHub, onProgressChange, progress, quiz }: QuizPlayerProps) {
  const [isReviewingCompletedQuiz, setIsReviewingCompletedQuiz] = useState(false);

  const questionIndex = Math.min(Math.max(progress.currentQuestionIndex, 0), quiz.questions.length - 1);
  const currentQuestion = quiz.questions[questionIndex];
  const selectedOption = progress.answers[currentQuestion.id];
  const answeredCount = getAnsweredCount(progress);
  const isLastQuestion = questionIndex === quiz.questions.length - 1;

  const progressPercent = useMemo(
    () => Math.round(((questionIndex + 1) / quiz.questions.length) * 100),
    [questionIndex, quiz.questions.length],
  );

  function commit(next: QuizProgress): void {
    onProgressChange({
      ...next,
      updatedAt: createTimestamp(),
    });
  }

  function handleSelectOption(optionId: QuizOptionId): void {
    commit({
      ...progress,
      answers: {
        ...progress.answers,
        [currentQuestion.id]: optionId,
      },
      startedAt: progress.startedAt ?? createTimestamp(),
    });
  }

  function handlePrevious(): void {
    if (questionIndex === 0) {
      return;
    }

    commit({
      ...progress,
      currentQuestionIndex: questionIndex - 1,
    });
  }

  function handleNext(): void {
    if (!selectedOption) {
      return;
    }

    if (questionIndex < quiz.questions.length - 1) {
      commit({
        ...progress,
        currentQuestionIndex: questionIndex + 1,
        startedAt: progress.startedAt ?? createTimestamp(),
      });
      return;
    }

    if (progress.completed && isReviewingCompletedQuiz) {
      setIsReviewingCompletedQuiz(false);
      return;
    }

    commit({
      ...progress,
      completed: true,
      completedAt: createTimestamp(),
      currentQuestionIndex: quiz.questions.length - 1,
      startedAt: progress.startedAt ?? createTimestamp(),
    });
  }

  if (progress.completed && !isReviewingCompletedQuiz) {
    return (
      <ScreenContainer>
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">Category Input Saved</p>
          <p className="hr-empty-copy">
            {quiz.title} is complete. This category now shapes your reset roadmap.
          </p>
          <InlineGroup>
            <Pill tone="success">{quiz.questions.length} answered</Pill>
            <p className="hr-action-detail-meta">No score shown</p>
          </InlineGroup>
        </Card>

        <Card>
          <InlineGroup>
            <Button onClick={onBackToHub} size="md" variant="quiet">
              Back to Quizzes
            </Button>
            <Button onClick={() => setIsReviewingCompletedQuiz(true)} size="md" variant="secondary">
              Review Answers
            </Button>
          </InlineGroup>
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SectionHeader
        action={<Pill tone="accent">Question {questionIndex + 1} of {quiz.questions.length}</Pill>}
        subtitle="One question per screen. Responses save automatically."
        title={quiz.title}
      />

      <Card tone="soft">
        <InlineGroup>
          <Pill>{answeredCount} answered</Pill>
          <p className="hr-action-detail-meta">{progressPercent}% complete</p>
        </InlineGroup>
        <div className="hr-linear-progress" role="presentation">
          <div className="hr-linear-progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      <Card>
        <ContentStack>
          <h3 className="hr-item-title hr-quiz-prompt">{currentQuestion.prompt}</h3>

          <div className="hr-quiz-option-list">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <button
                  aria-pressed={isSelected}
                  className={cn("hr-quiz-option", isSelected && "is-selected")}
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  type="button"
                >
                  <span className="hr-quiz-option-key">{option.id}</span>
                  <span className="hr-quiz-option-text">{option.text}</span>
                </button>
              );
            })}
          </div>
        </ContentStack>
      </Card>

      <Card tone="soft">
        <div className="hr-quiz-nav">
          <Button disabled={questionIndex === 0} onClick={handlePrevious} size="md" variant="quiet">
            Previous
          </Button>
          <Button disabled={!selectedOption} onClick={handleNext} size="md" variant="primary">
            {isLastQuestion
              ? progress.completed && isReviewingCompletedQuiz
                ? "Back to Completed"
                : "Complete Quiz"
              : "Next"}
          </Button>
        </div>
      </Card>

      <button className="hr-quiz-back-button" onClick={onBackToHub} type="button">
        Back to Categories
      </button>
    </ScreenContainer>
  );
}
