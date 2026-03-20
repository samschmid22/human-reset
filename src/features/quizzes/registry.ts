import { QUIZ_CONTENT_SEED } from "@/features/quizzes/content";
import { QuizDefinition, QuizOptionId } from "@/features/quizzes/types";

const REQUIRED_OPTION_IDS: QuizOptionId[] = ["A", "B", "C", "D"];

function hasAllRequiredOptions(quiz: QuizDefinition): boolean {
  return quiz.questions.every((question) => {
    const optionIds = question.options.map((option) => option.id);

    return (
      question.options.length === 4 &&
      REQUIRED_OPTION_IDS.every((requiredId) => optionIds.includes(requiredId))
    );
  });
}

function hasUniqueQuestionIds(quiz: QuizDefinition): boolean {
  const ids = quiz.questions.map((question) => question.id);

  return new Set(ids).size === ids.length;
}

function hasValidShape(quiz: QuizDefinition): boolean {
  if (!quiz.id.trim() || !quiz.title.trim() || !quiz.category.trim()) {
    return false;
  }

  if (quiz.questions.length !== 10) {
    return false;
  }

  return quiz.questions.every(
    (question) =>
      question.id.trim().length > 0 &&
      question.prompt.trim().length > 0 &&
      question.options.every((option) => option.text.trim().length > 0),
  );
}

function isValidQuizDefinition(quiz: QuizDefinition): boolean {
  return hasValidShape(quiz) && hasUniqueQuestionIds(quiz) && hasAllRequiredOptions(quiz);
}

function buildQuizRegistry(quizzes: QuizDefinition[]): QuizDefinition[] {
  const uniqueIds = new Set<string>();

  return quizzes.filter((quiz) => {
    if (!isValidQuizDefinition(quiz)) {
      return false;
    }

    if (uniqueIds.has(quiz.id)) {
      return false;
    }

    uniqueIds.add(quiz.id);
    return true;
  });
}

export const QUIZ_DEFINITIONS: QuizDefinition[] = buildQuizRegistry(QUIZ_CONTENT_SEED);

export const QUIZ_DEFINITION_MAP: Record<string, QuizDefinition> = QUIZ_DEFINITIONS.reduce(
  (accumulator, quiz) => {
    accumulator[quiz.id] = quiz;
    return accumulator;
  },
  {} as Record<string, QuizDefinition>,
);

export function getQuizDefinition(quizId: string): QuizDefinition | null {
  return QUIZ_DEFINITION_MAP[quizId] ?? null;
}
