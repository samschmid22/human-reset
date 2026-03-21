import { QuizDefinition } from "@/features/quizzes/types";

export const cookwareFoodStorageQuiz: QuizDefinition = {
  id: "cookware-food-storage",
  category: "Cookware + Food Storage",
  title: "Cookware + Food Storage Quiz",
  description:
    "Map cookware and storage habits for safer kitchen use.",
  questions: [
    {
      id: "q1",
      prompt: "What cookware do you use most for daily cooking?",
      options: [
        { id: "A", text: "Mostly stainless steel, cast iron, glass, or enamel" },
        { id: "B", text: "Mix of nonstick and stainless/cast iron" },
        { id: "C", text: "Mostly nonstick pans/pots" },
        {
          id: "D",
          text: "Almost all nonstick (including air fryer basket, rice cooker, or nonstick bakeware)",
        },
      ],
    },
    {
      id: "q2",
      prompt: "Condition of your nonstick: do you use any nonstick that is scratched, flaking, or worn?",
      options: [
        { id: "A", text: "No nonstick or all in good condition" },
        { id: "B", text: "Minor wear but not scratched" },
        { id: "C", text: "Scratched or worn, still used sometimes" },
        { id: "D", text: "Scratched/flaking and used often" },
      ],
    },
    {
      id: "q3",
      prompt: "Heat level: how often do you cook on high heat with nonstick (or preheat it empty)?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often" },
      ],
    },
    {
      id: "q4",
      prompt: "Cooking tools: what utensils do you use most on hot pans?",
      options: [
        { id: "A", text: "Wood, stainless, or silicone as main tools" },
        { id: "B", text: "Mix of wood/silicone and plastic" },
        { id: "C", text: "Mostly plastic utensils" },
        { id: "D", text: "Plastic utensils with occasional melting/warping" },
      ],
    },
    {
      id: "q5",
      prompt: "Food storage: what do you store leftovers in most often?",
      options: [
        { id: "A", text: "Glass containers" },
        { id: "B", text: "Mix of glass and plastic" },
        { id: "C", text: "Mostly plastic containers" },
        { id: "D", text: "Plastic plus plastic wrap directly on food often" },
      ],
    },
    {
      id: "q6",
      prompt: "Heat + plastic: how often do you microwave or reheat food in plastic containers or plastic wrap?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often" },
      ],
    },
    {
      id: "q7",
      prompt: "Hot liquids: what do you usually drink from? (coffee, tea, water)",
      options: [
        { id: "A", text: "Stainless/glass" },
        { id: "B", text: "Mix of stainless/glass and plastic" },
        { id: "C", text: "Mostly plastic bottles/cups" },
        { id: "D", text: "Plastic used daily and often left in heat" },
      ],
    },
    {
      id: "q8",
      prompt:
        "Takeout: how often do you eat hot food from takeout containers (plastic clamshells/bowls) or store food in them?",
      options: [
        { id: "A", text: "Rarely or never" },
        { id: "B", text: "1-3x/month" },
        { id: "C", text: "1-3x/week" },
        { id: "D", text: "4+ times/week" },
      ],
    },
    {
      id: "q9",
      prompt:
        "Packaged foods: how often do you rely on canned foods or heavily packaged foods as staples?",
      options: [
        { id: "A", text: "Rarely" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Very often (most days)" },
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
          text: "Fertility/hormone focus, migraines/asthma/sensitive skin, or reducing endocrine disruptors",
        },
        { id: "D", text: "High-sensitivity household (baby, asthma, frequent reactions)" },
      ],
    },
  ],
};
