export type ActionStatus = "pending" | "completed" | "snoozed";

export type ActionStatusRecord = {
  actionId: string;
  status: ActionStatus;
  updatedAt: string;
  completedAt: string | null;
  snoozedUntil: string | null;
};

export type ActionState = {
  version: number;
  actions: Record<string, ActionStatusRecord>;
};

export type ActionStatusView = {
  status: ActionStatus;
  completedAt: string | null;
  snoozedUntil: string | null;
};
