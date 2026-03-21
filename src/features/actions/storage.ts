import { ActionState, ActionStatus, ActionStatusRecord, ActionStatusView } from "@/features/actions/types";

const ACTION_STORAGE_KEY = "human-reset.action-status.v1";
const ACTION_STORAGE_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isActionStatus(value: unknown): value is ActionStatus {
  return (
    value === "pending" ||
    value === "done_today" ||
    value === "done_permanent" ||
    value === "completed" || // backward-compat: treat as done_permanent
    value === "snoozed" ||
    value === "skipped"
  );
}

function migrateStatus(status: string): ActionStatus {
  // "completed" is the old permanent-done name — remap to done_permanent.
  if (status === "completed") return "done_permanent";
  return status as ActionStatus;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function isDateKey(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeTimestamp(value: unknown): string {
  if (typeof value !== "string") return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function normalizeRecord(
  value: unknown,
  actionId: string,
  todayKey: string,
): ActionStatusRecord | null {
  if (!isRecord(value) || actionId.trim().length === 0) return null;

  const rawStatus = isActionStatus(value.status) ? value.status : "pending";
  const status = migrateStatus(rawStatus as string);
  const updatedAt = normalizeTimestamp(value.updatedAt);

  // Skipped: persists indefinitely.
  if (status === "skipped") {
    return { actionId, status: "skipped", updatedAt, completedAt: null, completedDate: null, snoozedUntil: null };
  }

  // Done permanently: persists indefinitely.
  if (status === "done_permanent") {
    const completedAt = normalizeTimestamp(value.completedAt ?? value.updatedAt ?? updatedAt);
    return { actionId, status: "done_permanent", updatedAt, completedAt, completedDate: null, snoozedUntil: null };
  }

  // Done today: auto-resets if completedDate < today.
  if (status === "done_today") {
    const completedDate = isDateKey(value.completedDate) ? value.completedDate : todayKey;
    if (completedDate < todayKey) {
      return { actionId, status: "pending", updatedAt: new Date().toISOString(), completedAt: null, completedDate: null, snoozedUntil: null };
    }
    return { actionId, status: "done_today", updatedAt, completedAt: null, completedDate, snoozedUntil: null };
  }

  // Snoozed: auto-resets if snoozedUntil <= today.
  if (status === "snoozed") {
    const snoozedUntil = isDateKey(value.snoozedUntil) ? value.snoozedUntil : null;
    if (!snoozedUntil || todayKey >= snoozedUntil) {
      return { actionId, status: "pending", updatedAt: new Date().toISOString(), completedAt: null, completedDate: null, snoozedUntil: null };
    }
    return { actionId, status: "snoozed", updatedAt, completedAt: null, completedDate: null, snoozedUntil };
  }

  // Pending: we don't store these (derive absence as pending).
  return null;
}

export function getTodayDateKey(now: Date = new Date()): string {
  return toLocalDateKey(now);
}

export function getTomorrowDateKey(now: Date = new Date()): string {
  const date = new Date(now);
  date.setDate(date.getDate() + 1);
  return toLocalDateKey(date);
}

export function getNextDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day + 1);
  return toLocalDateKey(date);
}

export function createInitialActionState(): ActionState {
  return { version: ACTION_STORAGE_VERSION, actions: {} };
}

export function normalizeActionState(raw: unknown, todayKey: string = getTodayDateKey()): ActionState {
  if (!isRecord(raw)) return createInitialActionState();

  const actionsRaw = isRecord(raw.actions) ? raw.actions : {};
  const actions: Record<string, ActionStatusRecord> = {};

  Object.entries(actionsRaw).forEach(([actionId, value]) => {
    const normalized = normalizeRecord(value, actionId, todayKey);
    if (!normalized || normalized.status === "pending") return;
    actions[actionId] = normalized;
  });

  return { version: ACTION_STORAGE_VERSION, actions };
}

export function loadActionState(): ActionState {
  if (typeof window === "undefined") return createInitialActionState();
  const raw = window.localStorage.getItem(ACTION_STORAGE_KEY);
  if (!raw) return createInitialActionState();
  try {
    return normalizeActionState(JSON.parse(raw));
  } catch {
    return createInitialActionState();
  }
}

export function saveActionState(state: ActionState): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeActionState(state);
  window.localStorage.setItem(ACTION_STORAGE_KEY, JSON.stringify(normalized));
}

function upsertRecord(
  state: ActionState,
  actionId: string,
  record: ActionStatusRecord,
): ActionState {
  if (actionId.trim().length === 0) return normalizeActionState(state);
  const nextActions = { ...state.actions };
  if (record.status === "pending") {
    delete nextActions[actionId];
  } else {
    nextActions[actionId] = record;
  }
  return normalizeActionState({ version: ACTION_STORAGE_VERSION, actions: nextActions });
}

export function setActionDoneToday(state: ActionState, actionId: string, now: Date = new Date()): ActionState {
  return upsertRecord(state, actionId, {
    actionId,
    status: "done_today",
    updatedAt: now.toISOString(),
    completedAt: null,
    completedDate: getTodayDateKey(now),
    snoozedUntil: null,
  });
}

export function setActionDonePermanent(state: ActionState, actionId: string, now: Date = new Date()): ActionState {
  return upsertRecord(state, actionId, {
    actionId,
    status: "done_permanent",
    updatedAt: now.toISOString(),
    completedAt: now.toISOString(),
    completedDate: null,
    snoozedUntil: null,
  });
}

export function setActionSnoozed(state: ActionState, actionId: string, now: Date = new Date()): ActionState {
  return upsertRecord(state, actionId, {
    actionId,
    status: "snoozed",
    updatedAt: now.toISOString(),
    completedAt: null,
    completedDate: null,
    snoozedUntil: getTomorrowDateKey(now),
  });
}

export function setActionSkipped(state: ActionState, actionId: string, now: Date = new Date()): ActionState {
  return upsertRecord(state, actionId, {
    actionId,
    status: "skipped",
    updatedAt: now.toISOString(),
    completedAt: null,
    completedDate: null,
    snoozedUntil: null,
  });
}

export function clearActionStatus(state: ActionState, actionId: string): ActionState {
  const nextActions = { ...state.actions };
  delete nextActions[actionId];
  return normalizeActionState({ version: ACTION_STORAGE_VERSION, actions: nextActions });
}

export function getActionStatusView(
  state: ActionState,
  actionId: string,
  todayKey: string = getTodayDateKey(),
): ActionStatusView {
  const rawRecord = state.actions[actionId];
  if (!rawRecord) return { status: "pending", completedAt: null, completedDate: null, snoozedUntil: null };

  const normalized = normalizeRecord(rawRecord, actionId, todayKey);
  if (!normalized || normalized.status === "pending") {
    return { status: "pending", completedAt: null, completedDate: null, snoozedUntil: null };
  }

  return {
    status: normalized.status,
    completedAt: normalized.completedAt,
    completedDate: normalized.completedDate,
    snoozedUntil: normalized.snoozedUntil,
  };
}

export function getSkippedActionIds(state: ActionState): string[] {
  return Object.values(state.actions)
    .filter((r) => r.status === "skipped")
    .map((r) => r.actionId);
}

export function getDonePermanentActionIds(state: ActionState): string[] {
  return Object.values(state.actions)
    .filter((r) => r.status === "done_permanent")
    .map((r) => r.actionId);
}

export function getDoneTodayCount(state: ActionState, today: string = getTodayDateKey()): number {
  return Object.values(state.actions).filter(
    (r) => r.status === "done_today" && r.completedDate === today,
  ).length;
}
