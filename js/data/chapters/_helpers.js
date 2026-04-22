// ─── js/data/chapters/_helpers.js ────────────────────────────────
// Shared helpers for all chapter question files.
// Every chapter file imports from here — do NOT duplicate these.

import { randInt } from "../../utils.js";

export { randInt };

/** Shuffle correct answer in with wrong distractors */
export function shuffleOpts(correct, wrongs) {
  return [correct, ...wrongs].sort(() => Math.random() - 0.5);
}

/**
 * Auto-generate 3 wrong options around `correct`.
 * spread = max distance from correct answer (default = 20% of value)
 */
export function makeOpts(correct, spread = null) {
  const s = spread || Math.max(2, Math.round(Math.abs(correct) * 0.2) || 5);
  const w = new Set();
  let t   = 0;
  while (w.size < 3 && t++ < 80) {
    const v = correct + (Math.random() < 0.5 ? 1 : -1) * randInt(1, s);
    if (v !== correct && v > 0) w.add(v);
  }
  return shuffleOpts(correct, Array.from(w));
}

/**
 * Wrap a generator function as a dynamic question entry.
 * Usage:  dyn("unique_id", () => ({ q, options, answer, trick, steps }))
 */
export function dyn(id, genFn) {
  return { id, gen: genFn };
}
