import { QuizDefinition } from "@/features/quizzes/types";

export const foodResetQuiz: QuizDefinition = {
  id: "food-reset",
  category: "Food Reset",
  title: "Food Reset Quiz",
  description:
    "Map processed food and additive patterns in your diet.",
  questions: [
    {
      id: "q1",
      prompt: "How often do you eat fast food, takeout, or restaurant meals?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "1-3x/month" },
        { id: "C", text: "1-3x/week" },
        { id: "D", text: "4+ times/week" },
      ],
    },
    {
      id: "q2",
      prompt:
        "When you eat out, how often is it deep-fried or cooked in restaurant-oil style foods (fries, chips, fried appetizers)?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Most times I eat out" },
      ],
    },
    {
      id: "q3",
      prompt:
        "How often do you eat ultra-processed convenience foods (frozen meals, packaged snacks, boxed foods, instant foods)?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "1-3x/month" },
        { id: "C", text: "1-3x/week" },
        { id: "D", text: "Most days" },
      ],
    },
    {
      id: "q4",
      prompt:
        "Sauces/condiments: how often do you use store-bought sauces, dressings, mayo, or ketchup as a daily staple?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Daily (multiple meals)" },
      ],
    },
    {
      id: "q5",
      prompt:
        "Sugar cravings: how often do you eat sweets or dessert-like foods (cookies, candy, pastries) or sugary drinks?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "Weekly" },
        { id: "C", text: "Several times/week" },
        { id: "D", text: "Daily" },
      ],
    },
    {
      id: "q6",
      prompt:
        "Artificial sweeteners (diet soda, zero-sugar drinks, sugar-free syrups, protein products with sweeteners):",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often/daily" },
      ],
    },
    {
      id: "q7",
      prompt:
        "Food dyes (Red 40, Yellow 5, Blue 1): how often do you eat or drink dyed products (candy, cereals, sports drinks, bright snacks)?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often" },
      ],
    },
    {
      id: "q8",
      prompt:
        "Health-processed foods (protein bars, low-fat snacks, fake meats, diet foods):",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "Monthly" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Most days" },
      ],
    },
    {
      id: "q9",
      prompt:
        "Home cooking: how often do you cook a real meal at home (protein + carb + produce + healthy fat)?",
      options: [
        { id: "A", text: "Most days" },
        { id: "B", text: "3-4x/week" },
        { id: "C", text: "1-2x/week" },
        { id: "D", text: "Rarely/never" },
      ],
    },
    {
      id: "q10",
      prompt: "Sensitivity factor: which best matches you?",
      options: [
        { id: "A", text: "No sensitivities and no hormone/skin/gut focus" },
        { id: "B", text: "Mild goals (energy/fitness)" },
        {
          id: "C",
          text: "Strong goals (skin/gut/hormone focus) or frequent cravings/energy crashes",
        },
        {
          id: "D",
          text: "High sensitivity (migraines, anxiety, IBS, acne flares, fertility focus)",
        },
      ],
    },
  ],
};
