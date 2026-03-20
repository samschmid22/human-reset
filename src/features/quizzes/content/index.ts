import { airFragranceQuiz } from "@/features/quizzes/content/air-fragrance.quiz";
import { cleaningSpraysQuiz } from "@/features/quizzes/content/cleaning-sprays.quiz";
import { cookwareFoodStorageQuiz } from "@/features/quizzes/content/cookware-food-storage.quiz";
import { foodResetQuiz } from "@/features/quizzes/content/food-reset.quiz";
import { laundryQuiz } from "@/features/quizzes/content/laundry.quiz";
import { mindStressQuiz } from "@/features/quizzes/content/mind-stress.quiz";
import { personalCareQuiz } from "@/features/quizzes/content/personal-care.quiz";
import { pestControlQuiz } from "@/features/quizzes/content/pest-control.quiz";
import { sleepEnvironmentQuiz } from "@/features/quizzes/content/sleep-environment.quiz";
import { waterQuiz } from "@/features/quizzes/content/water.quiz";
import { QuizDefinition } from "@/features/quizzes/types";

export const QUIZ_CONTENT_SEED: QuizDefinition[] = [
  airFragranceQuiz,
  cleaningSpraysQuiz,
  cookwareFoodStorageQuiz,
  foodResetQuiz,
  laundryQuiz,
  mindStressQuiz,
  personalCareQuiz,
  pestControlQuiz,
  sleepEnvironmentQuiz,
  waterQuiz,
];
