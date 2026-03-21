export type StreakState = {
  version: number;
  /** Consecutive days the user has met their pace target. */
  currentStreak: number;
  /** The last calendar day (YYYY-MM-DD) the streak was extended. */
  lastStreakDate: string | null;
  /** All-time high streak. */
  longestStreak: number;
};
