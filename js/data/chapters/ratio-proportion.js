// ─── js/data/chapters/ratio-proportion.js ────────────────────────
import { randInt, makeOpts, dyn } from "./_helpers.js";

export default {
  id:    "ratio",
  title: "Ratio & Proportion",
  icon:  "⚖️",
  color: "#a78bfa",
  desc:  "Put x=ak, y=bk. Master compound ratios and partnership splits fast.",

  questions: [
    {
      id: "rat_1",
      q:  "A:B=3:5, B:C=2:3. Find A:B:C.",
      options: ["6:10:15", "3:5:7", "2:5:8", "9:15:20"],
      answer:  "6:10:15",
      trick:   "Make B common: A:B=6:10, B:C=10:15 → A:B:C=6:10:15",
      steps: [
        "A:B = 3:5 → ×2 → 6:10",
        "B:C = 2:3 → ×5 → 10:15",
        "A:B:C = 6:10:15 ✅",
      ],
    },
    {
      id: "rat_2",
      q:  "Rs 1200 divided in 3:5. Smaller share?",
      options: [400, 420, 450, 480],
      answer:  450,
      trick:   "Total parts=8. Smaller = 3/8 × 1200 = 450",
      steps: ["Parts = 3+5 = 8", "Smaller = 3/8 × 1200 = 450 ✅"],
    },
    {
      id: "rat_3",
      q:  "If x:y=4:5, find (3x+2y):(4x+y).",
      options: ["22:21", "21:22", "11:10", "4:5"],
      answer:  "22:21",
      trick:   "x=4k,y=5k → (12+10):(16+5) = 22:21",
      steps: [
        "Let x=4k, y=5k",
        "3x+2y = 12k+10k = 22k",
        "4x+y  = 16k+5k  = 21k",
        "Ratio = 22:21 ✅",
      ],
    },
    {
      id: "rat_4",
      q:  "A,B,C invest 2:3:5. Profit Rs 4000. C's share?",
      options: [1600, 1800, 2000, 2200],
      answer:  2000,
      trick:   "C = 5/10 × 4000 = 2000",
      steps: ["Total parts = 10", "C = 5/10 × 4000 = 2000 ✅"],
    },
    {
      id: "rat_5",
      q:  "Mean proportional of 4 and 16?",
      options: [6, 8, 10, 12],
      answer:  8,
      trick:   "√(4×16) = √64 = 8",
      steps:   ["Mean proportional = √(a×b)", "= √(4×16) = √64 = 8 ✅"],
    },
    {
      id: "rat_6",
      q:  "Ratio of ages of A:B = 3:4. Sum of ages = 28. A's age?",
      options: [10, 12, 14, 16],
      answer:  12,
      trick:   "A = 3/7 × 28 = 12",
      steps:   ["Total parts = 7", "A = 3/7 × 28 = 12 years ✅"],
    },
    // ── Dynamic ──────────────────────────────────────────────────
    dyn("rat_d1", () => {
      const a = randInt(2, 7), b = randInt(2, 7);
      const total = randInt(3, 10) * (a + b);
      const bigger = Math.max(a, b);
      const bigShare = Math.round(total * bigger / (a + b));
      return {
        q:       `Rs ${total} divided in ${a}:${b}. Larger share?`,
        options: makeOpts(bigShare, Math.round(total * 0.08)),
        answer:  bigShare,
        trick:   `Larger = ${bigger}/${a+b} × ${total} = ${bigShare}`,
        steps: [
          `Parts = ${a}+${b} = ${a+b}`,
          `Larger share = ${bigger}/${a+b} × ${total} = ${bigShare} ✅`,
        ],
      };
    }),
    dyn("rat_d2", () => {
      const [p, q2, r] = [randInt(2,5), randInt(2,5), randInt(2,5)];
      const total = randInt(5, 10) * (p + q2 + r);
      const cShare = Math.round(total * r / (p + q2 + r));
      return {
        q:       `A:B:C = ${p}:${q2}:${r}. Total Rs ${total}. C gets?`,
        options: makeOpts(cShare, Math.round(total * 0.08)),
        answer:  cShare,
        trick:   `C = ${r}/${p+q2+r} × ${total} = ${cShare}`,
        steps: [
          `Total parts = ${p+q2+r}`,
          `C = ${r}/${p+q2+r} × ${total} = ${cShare} ✅`,
        ],
      };
    }),
  ],
};
