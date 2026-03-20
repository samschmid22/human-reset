"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/layout";
import { QuizHub } from "@/features/quizzes/components/quiz-hub";
import { QuizPlayer } from "@/features/quizzes/components/quiz-player";
import { getQuizDefinition, QUIZ_DEFINITIONS } from "@/features/quizzes/registry";
import {
  createEmptyQuizProgress,
  createInitialQuizState,
  loadQuizState,
  normalizeQuizState,
  saveQuizState,
} from "@/features/quizzes/storage";
import { QuizProgress, QuizState } from "@/features/quizzes/types";

export function QuizzesScreen() {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>(() =>
    typeof window === "undefined" ? createInitialQuizState() : loadQuizState(),
  );

  const selectedQuiz = selectedQuizId ? getQuizDefinition(selectedQuizId) : null;
  const selectedProgress = selectedQuiz
    ? (quizState.quizzes[selectedQuiz.id] ?? createEmptyQuizProgress(selectedQuiz))
    : null;

  function commit(mutator: (current: QuizState) => QuizState): void {
    setQuizState((current) => {
      const normalized = normalizeQuizState(mutator(current), QUIZ_DEFINITIONS);
      saveQuizState(normalized);
      return normalized;
    });
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
