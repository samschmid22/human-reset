import { QuizDefinition } from "@/features/quizzes/types";

export const cleaningSpraysQuiz: QuizDefinition = {
  id: "cleaning-sprays",
  category: "Cleaning Sprays",
  title: "Cleaning Sprays + Wipes Quiz",
  description:
    "Identify daily cleaner, disinfectant, and aerosol exposure patterns to support a simpler low-fume cleaning baseline.",
  questions: [
    {
      id: "q1",
      prompt:
        "How often do you use disinfecting wipes (Clorox/Lysol-style) on counters, bathroom, or high-touch surfaces?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Monthly" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Multiple times/week or daily" },
      ],
    },
    {
      id: "q2",
      prompt:
        "How often do you use disinfectant sprays or aerosol cleaners (bathroom sprays, \"kills 99.9%\" sprays)?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Monthly" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Multiple times/week or daily" },
      ],
    },
    {
      id: "q3",
      prompt:
        "How often do you use all-purpose sprays that are scented or say \"fresh scent\" or similar?",
      options: [
        { id: "A", text: "Never or unscented only" },
        { id: "B", text: "Occasionally" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Multiple times/week or daily" },
      ],
    },
    {
      id: "q4",
      prompt:
        "Do you use bleach, ammonia, or heavy-duty chemical cleaners (or other strong-fume cleaners) in your routine?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often" },
      ],
    },
    {
      id: "q5",
      prompt: "When you clean, how good is ventilation (windows open or fans on)?",
      options: [
        { id: "A", text: "Always ventilate" },
        { id: "B", text: "Usually" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Rarely or never" },
      ],
    },
    {
      id: "q6",
      prompt:
        "Do you clean small enclosed areas with chemicals (shower, toilet area, under-sink zones) where fumes build up?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often" },
      ],
    },
    {
      id: "q7",
      prompt:
        "Do you use antibacterial soaps, antibacterial sprays, or sanitizing products as a default (not just for illness)?",
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
        "Floors: how often do you use strong scented floor cleaners or disinfecting floor products?",
      options: [
        { id: "A", text: "Never or simple cleaner only" },
        { id: "B", text: "Monthly" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Multiple times/week" },
      ],
    },
    {
      id: "q9",
      prompt:
        "Do you notice symptoms during or after cleaning (headache, throat irritation, cough, dizziness, skin flare)?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Strong or immediate" },
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
