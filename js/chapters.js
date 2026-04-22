// ─── js/chapters.js ──────────────────────────────────────────────
//
// ╔══════════════════════════════════════════════════════════════╗
// ║  CHAPTER REGISTRY — the ONLY file you edit to add chapters  ║
// ╚══════════════════════════════════════════════════════════════╝
//
// TO ADD A NEW CHAPTER:
//   Step 1: Create  js/data/chapters/your-chapter.js
//           (copy TEMPLATE.js, fill in questions)
//   Step 2: Add ONE import line below
//   Step 3: Add the imported variable to CHAPTERS array
//   Done ✅ — shows up automatically in the app
//
// ─────────────────────────────────────────────────────────────────

import TSD      from "./data/chapters/time-speed-distance.js";
import TW       from "./data/chapters/time-work.js";
import RATIO    from "./data/chapters/ratio-proportion.js";
import AVG      from "./data/chapters/average.js";
import MIXTURE  from "./data/chapters/mixture-alligation.js";
import ALGEBRA  from "./data/chapters/algebra.js";
import GEOMETRY from "./data/chapters/geometry.js";
import DI       from "./data/chapters/data-interpretation.js";
// import PROFIT  from "./data/chapters/profit-loss.js";
// import SI_CI  from "./data/chapters/simple-compound-interest.js";
// import NUMBER  from "./data/chapters/number-system.js";
// import PERCENT from "./data/chapters/percentage.js";

const CHAPTERS = [
  TSD, TW, RATIO, AVG, MIXTURE, ALGEBRA, GEOMETRY, DI,
  // PROFIT, SI_CI, NUMBER, PERCENT,
];

export function resolveQuestion(q) {
  if (typeof q.gen === "function") return { ...q.gen(), id: q.id };
  return q;
}

export function getChapterQuestions(chapterId, count = 10) {
  const ch = CHAPTERS.find(c => c.id === chapterId);
  if (!ch) return [];
  return [...ch.questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, ch.questions.length))
    .map(resolveQuestion);
}

export function getChapterMeta() {
  return CHAPTERS.map(({ id, title, icon, color, desc, questions }) => ({
    id, title, icon, color, desc, count: questions.length,
  }));
}
