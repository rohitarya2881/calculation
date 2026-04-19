// ─── daily.js ────────────────────────────────────────────────────
// Daily challenge — deterministic per calendar day, shared across sessions.

import { todayStr } from "./utils.js";

const MODES   = ["multiplication", "addition", "division", "table", "percentage", "mixed"];
const LEVELS  = ["easy", "medium", "hard"];
const MINUTES = [3, 5, 7];
const BONUS_XP = 50;

function pickForDay(seed) {
  return {
    mode:    MODES[seed % MODES.length],
    level:   LEVELS[(seed * 7) % LEVELS.length],
    minutes: MINUTES[(seed * 11) % MINUTES.length],
    bonusXP: BONUS_XP,
  };
}

export function getOrCreateDaily(data) {
  const today = todayStr();
  if (data.daily?.date === today && data.daily?.challenge) return data.daily.challenge;
  const seed = Number(today.replaceAll("-", ""));
  const challenge = pickForDay(seed);
  data.daily = { date: today, completed: false, challenge };
  return challenge;
}

export function isDailyDone(data) {
  return data.daily?.date === todayStr() && data.daily?.completed === true;
}

export function markDailyDone(data) {
  data.daily = { ...data.daily, date: todayStr(), completed: true };
}
