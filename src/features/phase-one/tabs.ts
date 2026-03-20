export type TabId = "home" | "quizzes" | "roadmap" | "vault" | "profile";

export type TabDefinition = {
  id: TabId;
  label: string;
};

export const TABS: TabDefinition[] = [
  { id: "home", label: "Home" },
  { id: "quizzes", label: "Quizzes" },
  { id: "roadmap", label: "Roadmap" },
  { id: "vault", label: "Vault" },
  { id: "profile", label: "Profile" },
];
