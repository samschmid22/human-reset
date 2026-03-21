import { QuizDefinition } from "@/features/quizzes/types";

export const sleepEnvironmentQuiz: QuizDefinition = {
  id: "sleep-environment",
  category: "Sleep Environment",
  title: "Sleep Environment Quiz",
  description:
    "Share what your bedroom and wind-down routine actually look like.",
  questions: [
    {
      id: "q1",
      prompt: "Sleep schedule: how consistent is your bedtime and wake time?",
      options: [
        { id: "A", text: "Consistent most days (within ~1 hour)" },
        { id: "B", text: "Somewhat consistent (varies 1-2 hours)" },
        { id: "C", text: "Inconsistent (varies 2-3 hours)" },
        { id: "D", text: "Very inconsistent (varies 3+ hours)" },
      ],
    },
    {
      id: "q2",
      prompt: "Screens at night: how often are you on phone/laptop/TV in the last 60 minutes before sleep?",
      options: [
        { id: "A", text: "Never/almost never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Every night" },
      ],
    },
    {
      id: "q3",
      prompt: "Light in your bedroom at night (streetlights, LEDs, hallway light, TV glow):",
      options: [
        { id: "A", text: "Pitch dark" },
        { id: "B", text: "Mostly dark with small light sources" },
        { id: "C", text: "Noticeable light in the room" },
        { id: "D", text: "Bright enough to read or multiple light sources" },
      ],
    },
    {
      id: "q4",
      prompt: "Do you fall asleep with TV on, videos playing, or while scrolling?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often/nightly" },
      ],
    },
    {
      id: "q5",
      prompt: "Bedroom temperature: how often do you sleep in a room that feels too warm?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Most nights" },
      ],
    },
    {
      id: "q6",
      prompt: "Caffeine timing: when do you typically have your last caffeine?",
      options: [
        { id: "A", text: "None or before 10 AM" },
        { id: "B", text: "Before noon" },
        { id: "C", text: "Afternoon (12-4 PM)" },
        { id: "D", text: "Late afternoon/evening (after 4 PM)" },
      ],
    },
    {
      id: "q7",
      prompt: "Alcohol: how often do you drink within 3 hours of bedtime?",
      options: [
        { id: "A", text: "Never/rarely" },
        { id: "B", text: "1-3x/month" },
        { id: "C", text: "1-3x/week" },
        { id: "D", text: "4+ times/week" },
      ],
    },
    {
      id: "q8",
      prompt: "Wake-ups: how often do you wake in the night and struggle to fall back asleep?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "1-2x/week" },
        { id: "C", text: "3-5x/week" },
        { id: "D", text: "Most nights" },
      ],
    },
    {
      id: "q9",
      prompt: "Air quality: do you wake congested/dry-throat, or does your room feel stuffy?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Strongly/consistently" },
      ],
    },
    {
      id: "q10",
      prompt: "Sensitivity factor: which best matches your sleep context?",
      options: [
        { id: "A", text: "No major sleep issues and no high-sensitivity goals" },
        { id: "B", text: "Mild sleep goals (better mornings/energy)" },
        {
          id: "C",
          text: "Strong goals or frequent fatigue (anxiety, acne, hormone/fertility, training recovery)",
        },
        {
          id: "D",
          text: "High sensitivity (insomnia patterns, migraines, panic/anxiety spikes, chronic fatigue)",
        },
      ],
    },
  ],
};
