import { QuizDefinition } from "@/features/quizzes/types";

export const mindStressQuiz: QuizDefinition = {
  id: "mind-stress",
  category: "Mind + Stress",
  title: "Mind + Stress Quiz",
  description:
    "Identify daily nervous-system load patterns and recovery habits to support a steadier, lower-overwhelm baseline.",
  questions: [
    {
      id: "q1",
      prompt: "How would you rate your average daily stress level right now?",
      options: [
        { id: "A", text: "Low and manageable" },
        { id: "B", text: "Moderate but mostly manageable" },
        { id: "C", text: "High and impacts mood/energy" },
        { id: "D", text: "Very high and feels constant" },
      ],
    },
    {
      id: "q2",
      prompt:
        "How often do you feel mentally wired, restless, or unable to fully relax even when you have time?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Most days" },
      ],
    },
    {
      id: "q3",
      prompt:
        "How often do you doomscroll or consume stressful content (news/drama/social spirals) that spikes anxiety or anger?",
      options: [
        { id: "A", text: "Rarely/never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Daily" },
      ],
    },
    {
      id: "q4",
      prompt:
        "Phone habit: how often is your phone the first thing you check after waking or the last thing before sleep?",
      options: [
        { id: "A", text: "Never/almost never" },
        { id: "B", text: "Sometimes" },
        { id: "C", text: "Often" },
        { id: "D", text: "Daily" },
      ],
    },
    {
      id: "q5",
      prompt:
        "Coping: how often do you rely on substances to shift state (weed, alcohol, nicotine, heavy caffeine) when stressed?",
      options: [
        { id: "A", text: "Never" },
        { id: "B", text: "Rarely" },
        { id: "C", text: "Sometimes" },
        { id: "D", text: "Often" },
      ],
    },
    {
      id: "q6",
      prompt: "When you are stressed, how do you usually respond?",
      options: [
        { id: "A", text: "Regulate quickly (walk, breathe, talk it out, solve)" },
        { id: "B", text: "Eventually regulate, but it takes time" },
        { id: "C", text: "Spiral (ruminate, overthink, freeze)" },
        { id: "D", text: "Avoid/escape (scroll, snack, isolate, numb)" },
      ],
    },
    {
      id: "q7",
      prompt:
        "Recovery routine: how often do you intentionally do calming practices (breathing, meditation, prayer, journaling, stretching)?",
      options: [
        { id: "A", text: "Most days" },
        { id: "B", text: "3-4x/week" },
        { id: "C", text: "1-2x/week" },
        { id: "D", text: "Rarely/never" },
      ],
    },
    {
      id: "q8",
      prompt:
        "Movement: how often do you move enough to release stress (walk, lift, run, yoga, sports)?",
      options: [
        { id: "A", text: "Most days" },
        { id: "B", text: "3-4x/week" },
        { id: "C", text: "1-2x/week" },
        { id: "D", text: "Rarely/never" },
      ],
    },
    {
      id: "q9",
      prompt:
        "Connection: how often do you get real connection (quality time, honest conversation, laughter) versus isolating?",
      options: [
        { id: "A", text: "Most days" },
        { id: "B", text: "A few times/week" },
        { id: "C", text: "Occasionally" },
        { id: "D", text: "Rarely" },
      ],
    },
    {
      id: "q10",
      prompt: "Sensitivity factor: which best matches your current stress sensitivity?",
      options: [
        { id: "A", text: "Stress does not affect sleep/skin/gut much" },
        { id: "B", text: "Mild sensitivity; I bounce back" },
        { id: "C", text: "High sensitivity (stress triggers symptoms/cravings)" },
        { id: "D", text: "Very high sensitivity (overwhelm/shutdown/fragile baseline)" },
      ],
    },
  ],
};
