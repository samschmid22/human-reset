import { QuizDefinition } from "@/features/quizzes/types";

export const laundryQuiz: QuizDefinition = {
  id: "laundry",
  category: "Laundry",
  title: "Laundry Quiz",
  description:
    "Identify laundry-related residue and fragrance exposure patterns across clothing, bedding, and washer habits.",
  questions: [
    {
      id: "q1",
      prompt: "What best describes your detergent?",
      options: [
        { id: "A", text: "Fragrance-free/dye-free" },
        { id: "B", text: "Lightly scented or free-and-clear with occasional scented loads" },
        { id: "C", text: "Scented detergent most loads" },
        {
          id: "D",
          text: "Strongly scented or odor-defense/long-lasting fragrance detergent",
        },
      ],
    },
    {
      id: "q2",
      prompt: "Do you use dryer sheets, scent beads, or scent boosters?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely (1-2x/month)" },
        { id: "C", text: "Sometimes (1-2x/week)" },
        { id: "D", text: "Most loads or always" },
      ],
    },
    {
      id: "q3",
      prompt: "Do you use fabric softener (liquid softener or other softening additives)?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Most loads" },
      ],
    },
    {
      id: "q4",
      prompt: "Do you use disinfecting/antibacterial/odor-killing laundry additives?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often (weekly or more)" },
      ],
    },
    {
      id: "q5",
      prompt: "How often do you wash bedding (sheets and pillowcases)?",
      options: [
        { id: "A", text: "Weekly or more" },
        { id: "B", text: "Every 2 weeks" },
        { id: "C", text: "Every 3-4 weeks" },
        { id: "D", text: "Less than monthly" },
      ],
    },
    {
      id: "q6",
      prompt: "Do clean clothes or your washer ever smell musty, sour, or mildewy?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Occasionally" },
        { id: "C", text: "Often" },
        { id: "D", text: "Yes, strongly/frequently" },
      ],
    },
    {
      id: "q7",
      prompt: "Do you leave the washer door open after loads (especially front-load)?",
      options: [
        { id: "A", text: "Always (until dry)" },
        { id: "B", text: "Usually" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Rarely/never" },
      ],
    },
    {
      id: "q8",
      prompt:
        "Stains/whitening: how often do you use strong stain sprays, bleach, or heavy-duty boosters?",
      options: [
        { id: "A", text: "Never or minimal" },
        { id: "B", text: "Monthly" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Multiple times/week" },
      ],
    },
    {
      id: "q9",
      prompt:
        "Fabrics: how much of your wardrobe/bedding is synthetic (polyester, nylon, athletic wear, microfiber)?",
      options: [
        { id: "A", text: "Mostly natural fibers (cotton/linen/wool)" },
        { id: "B", text: "Mixed" },
        { id: "C", text: "Mostly synthetic" },
        { id: "D", text: "Heavily synthetic with lots of athletic wear/blankets" },
      ],
    },
    {
      id: "q10",
      prompt: "Sensitivity factor: which best matches your household?",
      options: [
        { id: "A", text: "No sensitivities and no pets/kids" },
        { id: "B", text: "Pets or mild sensitivity (skin/allergies)" },
        {
          id: "C",
          text: "Sensitive skin/asthma/migraines or actively reducing endocrine disruptors",
        },
        { id: "D", text: "High-sensitivity household (baby, asthma, frequent reactions)" },
      ],
    },
  ],
};
