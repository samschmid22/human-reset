# Human Reset repo instructions

## Product rules
- Build Human Reset as a guided environmental reset app.
- Do not turn it into a generic wellness app or a gamified habit tracker.
- Do not show quiz scores to users.
- Do not add fear-based language, alarmist health claims, or color-coded diagnoses.
- Core v1 flow must remain:
  onboarding -> quizzes -> findings -> roadmap -> daily plan -> vault -> profile

## UX rules
- Light mode only for v1.
- UI should feel calm, premium, structured, and trustworthy.
- Clean card-based layout with strong separation from the background.
- Keep the experience simple, elegant, and not cluttered.
- Avoid gimmicky wellness visuals.

## Technical rules
- Use TypeScript.
- Use clean reusable components.
- Use local persistence for v1.
- Do not add auth unless explicitly requested.
- Do not add subscriptions, barcode scanning, AI chat, or other v2 features in v1.

## Content rules
- Quizzes are structured inputs, not entertainment.
- Do not invent quiz outcomes that are not grounded in the provided docs.
- Build the quiz system so category quiz content can be added incrementally from /docs/quizzes.

## Workflow rules
- Read AGENTS.md and /docs before major product changes.
- Work in phases, not all at once.
- Before coding, restate the task and list files to be changed.
- After coding, summarize exactly what changed.
- Flag any decisions that need approval instead of silently guessing.