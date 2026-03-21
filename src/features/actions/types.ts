/**
 * done_today   — completed for the current calendar day; auto-resets to pending the next day.
 * done_permanent — explicitly marked as permanently complete; removed from active plan.
 * snoozed      — postponed until tomorrow.
 * skipped      — hard-skipped; removed from active plan; reversible in Profile.
 */
export type ActionStatus = "pending" | "done_today" | "done_permanent" | "snoozed" | "skipped";

export type ActionStatusRecord = {
  actionId: string;
  status: ActionStatus;
  updatedAt: string;
  /** ISO timestamp — set when status is done_permanent. */
  completedAt: string | null;
  /** YYYY-MM-DD — set when status is done_today; clears when date < today. */
  completedDate: string | null;
  snoozedUntil: string | null;
};

export type ActionState = {
  version: number;
  actions: Record<string, ActionStatusRecord>;
};

export type ActionStatusView = {
  status: ActionStatus;
  completedAt: string | null;
  completedDate: string | null;
  snoozedUntil: string | null;
};
