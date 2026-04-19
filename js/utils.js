// ─── utils.js ────────────────────────────────────────────────────
// Pure utility helpers — no DOM, no state, fully testable

export const pad = n => n.toString().padStart(2, "0");
export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
export const pct = (part, total) => total > 0 ? Math.round((part / total) * 100) : 0;

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function ydayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60), s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

export function formatDate(isoStr) {
  return new Date(isoStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
