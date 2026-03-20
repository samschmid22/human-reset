import { QuizDefinition } from "@/features/quizzes/types";

export const waterQuiz: QuizDefinition = {
  id: "water",
  category: "Water",
  title: "Water Quiz",
  description:
    "Identify drinking, cooking, and shower water exposure habits to support a clean filtration baseline.",
  questions: [
    {
      id: "q1",
      prompt: "What water do you drink most of the time at home?",
      options: [
        { id: "A", text: "Reverse osmosis or high-quality filtered water" },
        { id: "B", text: "Filtered water most of the time" },
        { id: "C", text: "Mostly tap water" },
        { id: "D", text: "Tap water daily with no filtering" },
      ],
    },
    {
      id: "q2",
      prompt: "Do you know what is in your local tap water?",
      options: [
        { id: "A", text: "Yes, I review reports" },
        { id: "B", text: "I looked once" },
        { id: "C", text: "I have not checked yet" },
        { id: "D", text: "Never checked" },
      ],
    },
    {
      id: "q3",
      prompt: "How often do you drink from plastic bottles?",
      options: [
        { id: "A", text: "Never (glass/stainless only)" },
        { id: "B", text: "Occasionally" },
        { id: "C", text: "Weekly" },
        { id: "D", text: "Daily" },
      ],
    },
    {
      id: "q4",
      prompt: "Do you drink from plastic bottles that have been in heat?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often" },
      ],
    },
    {
      id: "q5",
      prompt: "How often do you make hot drinks with unfiltered tap water?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often" },
      ],
    },
    {
      id: "q6",
      prompt: "Do you use a shower filter?",
      options: [
        { id: "A", text: "Yes" },
        { id: "B", text: "No, but planning to" },
        { id: "C", text: "No, have not looked into it" },
        { id: "D", text: "No, and shower irritation is common" },
      ],
    },
    {
      id: "q7",
      prompt: "Does shower water leave skin or hair feeling dry or irritated?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Strongly or consistently" },
      ],
    },
    {
      id: "q8",
      prompt: "Do you rely on fridge dispenser or ice maker as your main filter source?",
      options: [
        { id: "A", text: "No" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Yes, main source" },
      ],
    },
    {
      id: "q9",
      prompt: "When out of home, what is your default water habit?",
      options: [
        { id: "A", text: "Bring my own stainless or glass bottle" },
        { id: "B", text: "Buy bottled water sometimes" },
        { id: "C", text: "Buy bottled water often" },
        { id: "D", text: "Drink whatever is available" },
      ],
    },
    {
      id: "q10",
      prompt: "Which sensitivity context best matches your household?",
      options: [
        { id: "A", text: "No major sensitivity goals" },
        { id: "B", text: "Mild sensitivity" },
        { id: "C", text: "Hormone/fertility or sensitivity-focused" },
        { id: "D", text: "High-sensitivity household" },
      ],
    },
  ],
};
