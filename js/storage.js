// ─── storage.js ──────────────────────────────────────────────────
// All data persistence. Single source of truth for app state.
// Import this wherever data is read or written.

import { todayStr, ydayStr } from "./utils.js";

const KEY = "calcspeed_v1";

const MODES = [
  "addition", "subtraction", "multiplication", "division",
  "table", "mixed", "square", "cube", "percentage", "simplification"
];

export function defaultData() {
  const modeStreaks = {};
  MODES.forEach(m => { modeStreaks[m] = { streak: 0, lastDate: null }; });

  const sessions = {};
  [...MODES, "mock", "speed"].forEach(m => { sessions[m] = { sessions: [] }; });

  return {
    streak: 0,
    lastPracticeDate: null,
    xp: 0,
    level: 1,
    examDate: null,
    diagResult: null,
    badges: [],
    wrongHistory: [],       // { date, mode, question, correct, given }
    modeStreaks,
    daily: { date: null, completed: false, challenge: null },
    ...sessions,
  };
}

export function loadData() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultData();
  try {
    const d = JSON.parse(raw);
    // Hydrate missing keys from newer schema versions
    const def = defaultData();
    Object.keys(def).forEach(k => { if (d[k] === undefined) d[k] = def[k]; });
    return d;
  } catch {
    return defaultData();
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearAllData() {
  localStorage.removeItem(KEY);
}

// ── Streak helpers ────────────────────────────────────────────────

export function updateStreak(data) {
  const today = todayStr(), last = data.lastPracticeDate;
  if (!last) { data.streak = 1; data.lastPracticeDate = today; return; }
  if (last === today) return;
  data.streak = last === ydayStr() ? (data.streak || 0) + 1 : 1;
  data.lastPracticeDate = today;
}

export function updateModeStreak(data, mode) {
  const today = todayStr();
  if (!data.modeStreaks[mode]) data.modeStreaks[mode] = { streak: 0, lastDate: null };
  const last = data.modeStreaks[mode].lastDate;
  if (last === today) return;
  data.modeStreaks[mode].streak = !last ? 1 : last === ydayStr() ? data.modeStreaks[mode].streak + 1 : 1;
  data.modeStreaks[mode].lastDate = today;
}

// ── Wrong history ─────────────────────────────────────────────────

export function recordWrong(data, { mode, question, correct, given }) {
  if (!data.wrongHistory) data.wrongHistory = [];
  data.wrongHistory.unshift({
    date: new Date().toISOString(),
    mode,
    question,
    correct,
    given,
  });
  if (data.wrongHistory.length > 200) data.wrongHistory.pop();
}

export function pushSession(data, bucket, session) {
  if (!data[bucket]) data[bucket] = { sessions: [] };
  data[bucket].sessions.push(session);
  if (data[bucket].sessions.length > 100) data[bucket].sessions.shift();
}
