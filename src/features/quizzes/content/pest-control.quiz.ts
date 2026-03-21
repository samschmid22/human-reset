import { QuizDefinition } from "@/features/quizzes/types";

export const pestControlQuiz: QuizDefinition = {
  id: "pest-control",
  category: "Pest Control",
  title: "Pest Control Quiz",
  description:
    "Map pesticide use to support prevention-first habits.",
  questions: [
    {
      id: "q1",
      prompt: "How often do you use store-bought bug sprays indoors (ant/roach/spider sprays)?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "1-2x/year" },
        { id: "C", text: "Monthly" },
        { id: "D", text: "Weekly or more" },
      ],
    },
    {
      id: "q2",
      prompt: "Have you used foggers/bug bombs or heavy whole-room treatments?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Once a long time ago" },
        { id: "C", text: "Within the last year" },
        { id: "D", text: "Multiple times/year" },
      ],
    },
    {
      id: "q3",
      prompt: "Do you use professional pest control that sprays in/around the home?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely/one-time treatment" },
        { id: "C", text: "Quarterly" },
        { id: "D", text: "Monthly (or more)" },
      ],
    },
    {
      id: "q4",
      prompt: "When pests show up, what is your default response?",
      options: [
        { id: "A", text: "Prevention + targeted alternatives first (no spray)" },
        { id: "B", text: "Mostly prevention, sometimes spray" },
        { id: "C", text: "Mostly spray" },
        { id: "D", text: "Immediate spray every time" },
      ],
    },
    {
      id: "q5",
      prompt: "How often do you see pests inside (ants, roaches, spiders, fruit flies)?",
      options: [
        { id: "A", text: "Almost never" },
        { id: "B", text: "Occasionally (seasonal)" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Most days" },
      ],
    },
    {
      id: "q6",
      prompt:
        "Food exposure: how often is food left out or stored without tight sealing (crumbs, open bags, dishes overnight)?",
      options: [
        { id: "A", text: "Almost never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Most days" },
      ],
    },
    {
      id: "q7",
      prompt:
        "Trash + sink/drain routine: how consistent are you about taking out trash and keeping drains clean when pests appear?",
      options: [
        { id: "A", text: "Consistent (trash + sink/drains handled)" },
        { id: "B", text: "Usually consistent" },
        { id: "C", text: "Inconsistent" },
        { id: "D", text: "Rarely consistent" },
      ],
    },
    {
      id: "q8",
      prompt:
        "Entry points: how protected is your home (door seals, window screens, cracks, gaps under sinks)?",
      options: [
        { id: "A", text: "Well sealed/maintained" },
        { id: "B", text: "Mostly sealed, minor gaps" },
        { id: "C", text: "Noticeable gaps/cracks not addressed" },
        { id: "D", text: "Lots of gaps and likely pest entry points" },
      ],
    },
    {
      id: "q9",
      prompt:
        "Do you already use targeted simple alternatives before chemicals (vinegar/cinnamon/peppermint, baits/traps, fruit fly trap)?",
      options: [
        { id: "A", text: "Yes, always" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Rarely" },
        { id: "D", text: "Never" },
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
          text: "Asthma/migraines/sensitive skin or actively reducing endocrine disruptors",
        },
        { id: "D", text: "High-sensitivity household (baby, asthma, frequent reactions)" },
      ],
    },
  ],
};
