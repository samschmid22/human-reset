export type QuizOptionId = "A" | "B" | "C" | "D";

export type QuizAnswerOption = {
  id: QuizOptionId;
  text: string;
};

export type QuizQuestion = {
  id: string;
  options: [QuizAnswerOption, QuizAnswerOption, QuizAnswerOption, QuizAnswerOption];
  prompt: string;
};

export type QuizDefinition = {
  category: string;
  description: string;
  id: string;
  questions: QuizQuestion[];
  title: string;
};

export type QuizStatus = "not_started" | "in_progress" | "completed";

export type QuizAnswerMap = Record<string, QuizOptionId>;

export type QuizProgress = {
  answers: QuizAnswerMap;
  completed: boolean;
  completedAt: string | null;
  currentQuestionIndex: number;
  quizId: string;
  startedAt: string | null;
  updatedAt: string;
};

export type QuizState = {
  quizzes: Record<string, QuizProgress>;
  version: number;
};
