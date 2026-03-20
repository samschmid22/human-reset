import { ActionState, ActionStatus, ActionStatusRecord, ActionStatusView } from "@/features/actions/types";

const ACTION_STORAGE_KEY = "human-reset.action-status.v1";
const ACTION_STORAGE_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isActionStatus(value: unknown): value is ActionStatus {
  return value === "pending" || value === "completed" || value === "snoozed";
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function isDateKey(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeTimestamp(value: unknown): string {
  if (typeof value !== "string") {
    return new Date().toISOString();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function normalizeRecord(
  value: unknown,
  actionId: string,
  todayKey: string,
): ActionStatusRecord | null {
  if (!isRecord(value) || actionId.trim().length === 0) {
    return null;
  }

  const status = isActionStatus(value.status) ? value.status : "pending";
  const updatedAt = normalizeTimestamp(value.updatedAt);

  const completedAt =
    status === "completed" ? normalizeTimestamp(value.completedAt ?? updatedAt) : null;
  const snoozedUntil = status === "snoozed" && isDateKey(value.snoozedUntil) ? value.snoozedUntil : null;

  if (status === "snoozed" && (!snoozedUntil || todayKey >= snoozedUntil)) {
    return {
      actionId,
      status: "pending",
      updatedAt: new Date().toISOString(),
      completedAt: null,
      snoozedUntil: null,
    };
  }

  return {
    actionId,
    status,
    updatedAt,
    completedAt,
    snoozedUntil,
  };
}

export function getTodayDateKey(now: Date = new Date()): string {
  return toLocalDateKey(now);
}

export function getTomorrowDateKey(now: Date = new Date()): string {
  const date = new Date(now);
  date.setDate(date.getDate() + 1);
  return toLocalDateKey(date);
}

export function createInitialActionState(): ActionState {
  return {
    version: ACTION_STORAGE_VERSION,
    actions: {},
  };
}

export function normalizeActionState(raw: unknown, todayKey: string = getTodayDateKey()): ActionState {
  if (!isRecord(raw)) {
    return createInitialActionState();
  }

  const actionsRaw = isRecord(raw.actions) ? raw.actions : {};
  const actions: Record<string, ActionStatusRecord> = {};

  Object.entries(actionsRaw).forEach(([actionId, value]) => {
    const normalized = normalizeRecord(value, actionId, todayKey);

    if (!normalized) {
      return;
    }

    if (normalized.status === "pending") {
      return;
    }

    actions[actionId] = normalized;
  });

  return {
    version: ACTION_STORAGE_VERSION,
    actions,
  };
}

export function loadActionState(): ActionState {
  if (typeof window === "undefined") {
    return createInitialActionState();
  }

  const raw = window.localStorage.getItem(ACTION_STORAGE_KEY);

  if (!raw) {
    return createInitialActionState();
  }

  try {
    return normalizeActionState(JSON.parse(raw));
  } catch {
    return createInitialActionState();
  }
}

export function saveActionState(state: ActionState): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeActionState(state);
  window.localStorage.setItem(ACTION_STORAGE_KEY, JSON.stringify(normalized));
}

function upsert(
  state: ActionState,
  actionId: string,
  status: ActionStatus,
  now: Date,
  snoozedUntil: string | null,
): ActionState {
  if (actionId.trim().length === 0) {
    return normalizeActionState(state);
  }

  const updatedAt = now.toISOString();
  const nextRecord: ActionStatusRecord = {
    actionId,
    status,
    updatedAt,
    completedAt: status === "completed" ? updatedAt : null,
    snoozedUntil: status === "snoozed" ? snoozedUntil : null,
  };

  const nextActions = { ...state.actions };

  if (nextRecord.status === "pending") {
    delete nextActions[actionId];
  } else {
    nextActions[actionId] = nextRecord;
  }

  return normalizeActionState({
    version: ACTION_STORAGE_VERSION,
    actions: nextActions,
  });
}

export function setActionCompleted(state: ActionState, actionId: string, now: Date = new Date()): ActionState {
  return upsert(state, actionId, "completed", now, null);
}

export function setActionSnoozed(state: ActionState, actionId: string, now: Date = new Date()): ActionState {
  return upsert(state, actionId, "snoozed", now, getTomorrowDateKey(now));
}

export function clearActionStatus(state: ActionState, actionId: string, now: Date = new Date()): ActionState {
  return upsert(state, actionId, "pending", now, null);
}

export function getActionStatusView(
  state: ActionState,
  actionId: string,
  todayKey: string = getTodayDateKey(),
): ActionStatusView {
  const rawRecord = state.actions[actionId];

  if (!rawRecord) {
    return {
      status: "pending",
      completedAt: null,
      snoozedUntil: null,
    };
  }

  const normalized = normalizeRecord(rawRecord, actionId, todayKey);

  if (!normalized || normalized.status === "pending") {
    return {
      status: "pending",
      completedAt: null,
      snoozedUntil: null,
    };
  }

  return {
    status: normalized.status,
    completedAt: normalized.completedAt,
    snoozedUntil: normalized.snoozedUntil,
  };
}
