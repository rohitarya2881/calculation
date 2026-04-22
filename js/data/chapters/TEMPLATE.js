// ─── js/data/chapters/TEMPLATE.js ────────────────────────────────
//
// HOW TO USE THIS TEMPLATE:
//   1. Copy this file, rename it  e.g. profit-loss.js
//   2. Fill in the chapter metadata (id, title, icon, color, desc)
//   3. Add your questions to the `questions` array
//   4. Register it in  js/chapters.js  (one import line + one array entry)
//
// QUESTION TYPES:
//
//   A) STATIC question (fixed values):
//      { id, q, options:[a,b,c,d], answer, trick, steps:[] }
//
//   B) DYNAMIC question (random numbers each time):
//      dyn("unique_id", () => {
//        const x = randInt(2, 20);
//        return { q: `...${x}...`, options: makeOpts(answer), answer, trick, steps:[] }
//      })
//
// RULES FOR ALL QUESTIONS:
//   ✅ Must be solvable mentally — no pen/paper needed
//   ✅ 4 options always (use makeOpts() for auto-generation)
//   ✅ steps[] shows solution after quiz ends — be clear and short
//   ✅ trick = one-liner formula/shortcut (shown prominently)
//   ✅ id must be unique across ALL chapter files
//
// ─────────────────────────────────────────────────────────────────

import { randInt, makeOpts, dyn } from "./_helpers.js";

export default {
  id:    "template",          // unique key — change this!
  title: "Chapter Name",      // shown in UI card
  icon:  "📌",               // emoji icon for card
  color: "#8b7cf8",          // accent color (hex)
  desc:  "One line about what this chapter covers.",

  questions: [

    // ── Example: Static question ────────────────────────────────
    {
      id:      "tmpl_1",
      q:       "If speed = 60 km/h and time = 2 hours, distance = ?",
      options: [100, 110, 120, 130],
      answer:  120,
      trick:   "Distance = Speed × Time = 60 × 2 = 120 km",
      steps: [
        "Formula: Distance = Speed × Time",
        "= 60 × 2 = 120 km ✅",
      ],
    },

    // ── Example: Dynamic question ───────────────────────────────
    dyn("tmpl_dyn_1", () => {
      const speed = randInt(20, 80) * 5;   // e.g. 40, 60, 80...
      const time  = randInt(1, 5);
      const dist  = speed * time;
      return {
        q:       `Speed = ${speed} km/h, Time = ${time} hr. Distance?`,
        options: makeOpts(dist),
        answer:  dist,
        trick:   `D = S × T = ${speed} × ${time} = ${dist} km`,
        steps: [
          "Formula: Distance = Speed × Time",
          `= ${speed} × ${time} = ${dist} km ✅`,
        ],
      };
    }),

  ],
};
