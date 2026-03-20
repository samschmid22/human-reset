import { QUIZ_DEFINITIONS } from "@/features/quizzes/registry";
import {
  QuizAnswerMap,
  QuizDefinition,
  QuizOptionId,
  QuizProgress,
  QuizState,
  QuizStatus,
} from "@/features/quizzes/types";

const QUIZ_STORAGE_KEY = "human-reset.quizzes.v1";
const QUIZ_STORAGE_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isQuizOptionId(value: unknown): value is QuizOptionId {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

function normalizeDate(value: unknown): string {
  if (typeof value !== "string") {
    return new Date().toISOString();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function findFirstUnansweredIndex(quiz: QuizDefinition, answers: QuizAnswerMap): number {
  const index = quiz.questions.findIndex((question) => !answers[question.id]);
  return index === -1 ? quiz.questions.length - 1 : index;
}

function clampQuestionIndex(index: number, quiz: QuizDefinition): number {
  return Math.min(Math.max(index, 0), quiz.questions.length - 1);
}

export function createEmptyQuizProgress(quiz: QuizDefinition): QuizProgress {
  return {
    quizId: quiz.id,
    answers: {},
    currentQuestionIndex: 0,
    completed: false,
    startedAt: null,
    completedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeQuizProgress(raw: unknown, quiz: QuizDefinition): QuizProgress {
  if (!isRecord(raw)) {
    return createEmptyQuizProgress(quiz);
  }

  const answersRaw = isRecord(raw.answers) ? raw.answers : {};
  const answers: QuizAnswerMap = {};

  quiz.questions.forEach((question) => {
    const answerValue = answersRaw[question.id];

    if (!isQuizOptionId(answerValue)) {
      return;
    }

    const validOptionIds = new Set(question.options.map((option) => option.id));

    if (!validOptionIds.has(answerValue)) {
      return;
    }

    answers[question.id] = answerValue;
  });

  const answeredCount = Object.keys(answers).length;
  const completed = raw.completed === true && answeredCount === quiz.questions.length;

  const rawIndex = typeof raw.currentQuestionIndex === "number" ? Math.round(raw.currentQuestionIndex) : null;
  const fallbackIndex = completed ? quiz.questions.length - 1 : findFirstUnansweredIndex(quiz, answers);
  const currentQuestionIndex = clampQuestionIndex(rawIndex ?? fallbackIndex, quiz);

  return {
    quizId: typeof raw.quizId === "string" && raw.quizId.trim().length > 0 ? raw.quizId : quiz.id,
    answers,
    currentQuestionIndex,
    completed,
    startedAt: answeredCount > 0 ? normalizeDate(raw.startedAt) : null,
    completedAt: completed ? normalizeDate(raw.completedAt) : null,
    updatedAt: normalizeDate(raw.updatedAt),
  };
}

export function createInitialQuizState(quizzes: QuizDefinition[] = QUIZ_DEFINITIONS): QuizState {
  return {
    version: QUIZ_STORAGE_VERSION,
    quizzes: quizzes.reduce(
      (accumulator, quiz) => {
        accumulator[quiz.id] = createEmptyQuizProgress(quiz);
        return accumulator;
      },
      {} as Record<string, QuizProgress>,
    ),
  };
}

export function normalizeQuizState(raw: unknown, quizzes: QuizDefinition[] = QUIZ_DEFINITIONS): QuizState {
  const fallback = createInitialQuizState(quizzes);

  if (!isRecord(raw)) {
    return fallback;
  }

  const quizzesRaw = isRecord(raw.quizzes) ? raw.quizzes : {};

  return {
    version: QUIZ_STORAGE_VERSION,
    quizzes: quizzes.reduce(
      (accumulator, quiz) => {
        accumulator[quiz.id] = normalizeQuizProgress(quizzesRaw[quiz.id], quiz);
        return accumulator;
      },
      {} as Record<string, QuizProgress>,
    ),
  };
}

export function loadQuizState(quizzes: QuizDefinition[] = QUIZ_DEFINITIONS): QuizState {
  if (typeof window === "undefined") {
    return createInitialQuizState(quizzes);
  }

  const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);

  if (!raw) {
    return createInitialQuizState(quizzes);
  }

  try {
    return normalizeQuizState(JSON.parse(raw), quizzes);
  } catch {
    return createInitialQuizState(quizzes);
  }
}

export function saveQuizState(state: QuizState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state));
}

export function getAnsweredCount(progress: QuizProgress): number {
  return Object.keys(progress.answers).length;
}

export function getQuizStatus(progress: QuizProgress): QuizStatus {
  if (progress.completed) {
    return "completed";
  }

  return getAnsweredCount(progress) === 0 ? "not_started" : "in_progress";
}
