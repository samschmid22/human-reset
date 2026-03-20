"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/layout";
import { QuizHub } from "@/features/quizzes/components/quiz-hub";
import { QuizPlayer } from "@/features/quizzes/components/quiz-player";
import { getQuizDefinition, QUIZ_DEFINITIONS } from "@/features/quizzes/registry";
import { createEmptyQuizProgress } from "@/features/quizzes/storage";
import { QuizProgress, QuizState } from "@/features/quizzes/types";

type QuizzesScreenProps = {
  onQuizStateChange: (next: QuizState) => void;
  quizState: QuizState;
};

export function QuizzesScreen({ onQuizStateChange, quizState }: QuizzesScreenProps) {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const selectedQuiz = selectedQuizId ? getQuizDefinition(selectedQuizId) : null;
  const selectedProgress = selectedQuiz
    ? (quizState.quizzes[selectedQuiz.id] ?? createEmptyQuizProgress(selectedQuiz))
    : null;

  function commit(mutator: (current: QuizState) => QuizState): void {
    onQuizStateChange(mutator(quizState));
  }

  function handleProgressChange(nextProgress: QuizProgress): void {
    if (!selectedQuiz) {
      return;
    }

    commit((current) => ({
      ...current,
      quizzes: {
        ...current.quizzes,
        [selectedQuiz.id]: nextProgress,
      },
    }));
  }

  if (QUIZ_DEFINITIONS.length === 0) {
    return (
      <ScreenContainer>
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">No quizzes available</p>
          <p className="hr-empty-copy">
            Quiz content could not be loaded. Add valid quiz files to the quizzes content registry.
          </p>
        </Card>
      </ScreenContainer>
    );
  }

  if (!selectedQuiz || !selectedProgress) {
    return (
      <QuizHub
        onOpenQuiz={setSelectedQuizId}
        quizzes={QUIZ_DEFINITIONS}
        quizState={quizState}
      />
    );
  }

  return (
    <QuizPlayer
      onBackToHub={() => setSelectedQuizId(null)}
      onProgressChange={handleProgressChange}
      progress={selectedProgress}
      quiz={selectedQuiz}
    />
  );
}
