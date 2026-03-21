import { QuizDefinition } from "@/features/quizzes/types";

export const personalCareQuiz: QuizDefinition = {
  id: "personal-care",
  category: "Personal Care",
  title: "Personal Care Quiz",
  description:
    "Map leave-on products and fragrance in daily routines.",
  questions: [
    {
      id: "q1",
      prompt:
        "How often do you use products with fragrance/parfum (body wash, lotion, hair, skincare, deodorant)?",
      options: [
        { id: "A", text: "Almost never (mostly fragrance-free)" },
        { id: "B", text: "Sometimes (mixed routine)" },
        { id: "C", text: "Often (most products are scented)" },
        { id: "D", text: "Daily with strong scents across routine" },
      ],
    },
    {
      id: "q2",
      prompt: "Perfume/cologne: how often do you wear it?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Occasionally (special events)" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Most days" },
      ],
    },
    {
      id: "q3",
      prompt: "Deodorant/antiperspirant: what is your default?",
      options: [
        { id: "A", text: "Fragrance-free deodorant (no antiperspirant)" },
        { id: "B", text: "Lightly scented deodorant" },
        { id: "C", text: "Antiperspirant or strongly scented deodorant most days" },
        { id: "D", text: "Antiperspirant plus frequent reapplication/strong fragrance" },
      ],
    },
    {
      id: "q4",
      prompt:
        "Leave-on skincare: how many leave-on products do you apply daily (serums, moisturizer, SPF, eye cream)?",
      options: [
        { id: "A", text: "0-2 products" },
        { id: "B", text: "3-4 products" },
        { id: "C", text: "5-7 products" },
        { id: "D", text: "8+ products (daily layering)" },
      ],
    },
    {
      id: "q5",
      prompt:
        "Hair products: how often do you use leave-in products (leave-in conditioner, styling cream, oil, hairspray, dry shampoo)?",
      options: [
        { id: "A", text: "Never or very rarely" },
        { id: "B", text: "1-2x/week" },
        { id: "C", text: "Most wash days" },
        { id: "D", text: "Daily with multiple leave-ins" },
      ],
    },
    {
      id: "q6",
      prompt: "Body lotion/oils: how often do you apply leave-on body products over large areas?",
      options: [
        { id: "A", text: "Rarely" },
        { id: "B", text: "A few times/week" },
        { id: "C", text: "Most days" },
        { id: "D", text: "Daily with thick layers" },
      ],
    },
    {
      id: "q7",
      prompt:
        "Makeup: how often do you wear long-wear makeup and keep it on for many hours?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "1-2x/week" },
        { id: "C", text: "3-5x/week" },
        { id: "D", text: "Most days" },
      ],
    },
    {
      id: "q8",
      prompt: "Sunscreen: what type do you use most when you use it?",
      options: [
        { id: "A", text: "Mineral sunscreen or minimal use with sun-smart habits" },
        { id: "B", text: "Mix of mineral and chemical" },
        { id: "C", text: "Mostly chemical sunscreen" },
        { id: "D", text: "Chemical sunscreen frequently with repeated reapplication" },
      ],
    },
    {
      id: "q9",
      prompt: "Nails: how often do you use gel/acrylics, frequent polish, or strong removers?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "Monthly" },
        { id: "C", text: "Every 2 weeks" },
        { id: "D", text: "Weekly or constant (always on)" },
      ],
    },
    {
      id: "q10",
      prompt: "Sensitivity factor: which best matches your household context?",
      options: [
        { id: "A", text: "No sensitivities and no skin/hormone focus" },
        { id: "B", text: "Mild sensitivity (skin/allergies)" },
        {
          id: "C",
          text: "Acne/eczema/migraines or hormone/fertility focus or reducing endocrine disruptors",
        },
        {
          id: "D",
          text: "High sensitivity (frequent reactions or pregnancy/baby context in home)",
        },
      ],
    },
  ],
};
