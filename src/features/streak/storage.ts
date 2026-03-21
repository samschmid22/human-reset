import { StreakState } from "@/features/streak/types";

const STREAK_KEY = "human-reset.streak.v1";
const STREAK_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDateKey(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getNextDay(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day + 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function createInitialStreakState(): StreakState {
  return { version: STREAK_VERSION, currentStreak: 0, lastStreakDate: null, longestStreak: 0 };
}

export function loadStreakState(): StreakState {
  if (typeof window === "undefined") return createInitialStreakState();
  const raw = window.localStorage.getItem(STREAK_KEY);
  if (!raw) return createInitialStreakState();
  try {
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) return createInitialStreakState();
    return {
      version: STREAK_VERSION,
      currentStreak: typeof parsed.currentStreak === "number" ? parsed.currentStreak : 0,
      lastStreakDate: isDateKey(parsed.lastStreakDate) ? parsed.lastStreakDate : null,
      longestStreak: typeof parsed.longestStreak === "number" ? parsed.longestStreak : 0,
    };
  } catch {
    return createInitialStreakState();
  }
}

export function saveStreakState(state: StreakState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STREAK_KEY, JSON.stringify(state));
}

/**
 * Call on app load: if the user's last streak date was more than 1 day ago, reset streak to 0.
 * No punishment messaging — the streak just silently resets.
 */
export function checkStreakReset(state: StreakState, today: string): StreakState {
  if (!state.lastStreakDate || state.currentStreak === 0) return state;
  if (state.lastStreakDate === today) return state;
  const expectedContinuation = getNextDay(state.lastStreakDate);
  if (today > expectedContinuation) {
    return { ...state, currentStreak: 0 };
  }
  return state;
}

/**
 * Call when a done_today action is recorded.
 * Extends the streak if doneCount >= paceTarget and this day hasn't been counted yet.
 */
export function maybeExtendStreak(
  state: StreakState,
  doneCount: number,
  paceTarget: number,
  today: string,
): StreakState {
  if (doneCount < paceTarget) return state;
  if (state.lastStreakDate === today) return state; // Already counted today.

  // Compute yesterday to check for consecutive-day streak.
  const [y, m, d] = today.split("-").map(Number);
  const prevDate = new Date(y, m - 1, d - 1);
  const yesterday = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(prevDate.getDate()).padStart(2, "0")}`;

  // If streak was last extended yesterday, continue it; otherwise start fresh from 1.
  const isConsecutive = state.lastStreakDate === yesterday;
  const newCurrent = isConsecutive ? state.currentStreak + 1 : 1;
  const newLongest = Math.max(state.longestStreak, newCurrent);

  return {
    ...state,
    currentStreak: newCurrent,
    lastStreakDate: today,
    longestStreak: newLongest,
  };
}
