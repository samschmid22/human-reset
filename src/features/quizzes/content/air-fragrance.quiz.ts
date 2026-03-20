import { QuizDefinition } from "@/features/quizzes/types";

export const airFragranceQuiz: QuizDefinition = {
  id: "air-fragrance",
  category: "Air + Fragrance",
  title: "Air + Fragrance Quiz",
  description:
    "Identify daily fragrance and air exposure pathways to support a simple, practical reset plan.",
  questions: [
    {
      id: "q1",
      prompt: "How often do you use plug-ins, automatic air fresheners, or scented gels?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely (1-2x/month)" },
        { id: "C", text: "Sometimes (1-2x/week)" },
        { id: "D", text: "Most days or always running" },
      ],
    },
    {
      id: "q2",
      prompt: "How often do you burn candles, wax melts, incense, or palo santo?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "1-3x/month" },
        { id: "C", text: "1-3x/week" },
        { id: "D", text: "4+ times/week or daily" },
      ],
    },
    {
      id: "q3",
      prompt: "Laundry scent: what best matches your detergent and dryer routine?",
      options: [
        { id: "A", text: "Fragrance-free detergent and no dryer sheets" },
        { id: "B", text: "Lightly scented detergent or occasional dryer sheets" },
        { id: "C", text: "Scented detergent and dryer sheets most loads" },
        { id: "D", text: "Strongly scented detergent and scent boosters" },
      ],
    },
    {
      id: "q4",
      prompt: "Do you use fabric softener?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Most loads" },
      ],
    },
    {
      id: "q5",
      prompt: "How scented is your daily personal care lineup (body, hair, lotion, fragrance)?",
      options: [
        { id: "A", text: "Mostly fragrance-free" },
        { id: "B", text: "Mixed lineup" },
        { id: "C", text: "Mostly scented" },
        { id: "D", text: "Heavy fragrance daily" },
      ],
    },
    {
      id: "q6",
      prompt: "How often do you use scented cleaning sprays?",
      options: [
        { id: "A", text: "Never or mostly unscented" },
        { id: "B", text: "Occasionally" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Multiple times/week or daily" },
      ],
    },
    {
      id: "q7",
      prompt: "Do you use room sprays or Febreze-type products?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Monthly" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Multiple times/week or daily" },
      ],
    },
    {
      id: "q8",
      prompt: "What is your home ventilation like most days?",
      options: [
        { id: "A", text: "Windows opened daily or strong fresh-air routine" },
        { id: "B", text: "Some ventilation a few days/week" },
        { id: "C", text: "Rarely ventilate" },
        { id: "D", text: "Almost never ventilate" },
      ],
    },
    {
      id: "q9",
      prompt: "Do you notice symptoms around fragrance (headaches, irritation, nausea, fog)?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Strong or immediate reactions" },
      ],
    },
    {
      id: "q10",
      prompt: "Which household sensitivity context is most accurate?",
      options: [
        { id: "A", text: "No pets/kids and no sensitivity concerns" },
        { id: "B", text: "Pets or mild sensitivity" },
        { id: "C", text: "Pets plus sensitivity concerns" },
        { id: "D", text: "High-sensitivity household" },
      ],
    },
  ],
};
