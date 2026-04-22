// ─── js/data/chapters/algebra.js ─────────────────────────────────
import { randInt, makeOpts, dyn } from "./_helpers.js";

export default {
  id:    "algebra",
  title: "Algebra & Equations",
  icon:  "🔢",
  color: "#fb923c",
  desc:  "Solve equations mentally. Master identities: (a+b)², a²−b², a³±b³.",

  questions: [
    {
      id: "alg_1",
      q:  "3x + 7 = 22. Find x.",
      options: [4, 5, 6, 7],
      answer:  5,
      trick:   "3x = 22−7 = 15 → x=5",
      steps:   ["3x = 22−7 = 15", "x = 15÷3 = 5 ✅"],
    },
    {
      id: "alg_2",
      q:  "x²−5x+6=0. Values of x?",
      options: ["2,3", "1,6", "3,4", "2,4"],
      answer:  "2,3",
      trick:   "Factors of 6 summing to 5: 2,3 → (x−2)(x−3)=0",
      steps: [
        "Product=6, Sum=5 → factors 2 and 3",
        "(x−2)(x−3) = 0 → x=2 or x=3 ✅",
      ],
    },
    {
      id: "alg_3",
      q:  "a+b=10, ab=21. Find a²+b².",
      options: [56, 57, 58, 60],
      answer:  58,
      trick:   "a²+b² = (a+b)²−2ab = 100−42 = 58",
      steps: [
        "Identity: a²+b² = (a+b)²−2ab",
        "= 100 − 2×21 = 58 ✅",
      ],
    },
    {
      id: "alg_4",
      q:  "x + 1/x = 3. Find x² + 1/x².",
      options: [7, 8, 9, 11],
      answer:  7,
      trick:   "(x+1/x)²=9 → x²+2+1/x²=9 → x²+1/x²=7",
      steps: [
        "Square: (x+1/x)² = 9",
        "x² + 2 + 1/x² = 9",
        "x² + 1/x² = 7 ✅",
      ],
    },
    {
      id: "alg_5",
      q:  "If a−b=3 and a²+b²=29, find ab.",
      options: [8, 9, 10, 11],
      answer:  10,
      trick:   "(a−b)²=a²−2ab+b² → 9=29−2ab → ab=10",
      steps: [
        "(a−b)² = a²−2ab+b²",
        "9 = 29 − 2ab",
        "2ab = 20 → ab = 10 ✅",
      ],
    },
    {
      id: "alg_6",
      q:  "If 2x−y=4 and x+y=5, find x.",
      options: [2, 3, 4, 5],
      answer:  3,
      trick:   "Add equations: 3x=9 → x=3",
      steps: [
        "2x−y = 4  ...(i)",
        "x+y  = 5  ...(ii)",
        "Add: 3x = 9 → x = 3 ✅",
      ],
    },
    // ── Dynamic ──────────────────────────────────────────────────
    dyn("alg_d1", () => {
      const x  = randInt(2, 12);
      const a  = randInt(2, 6);
      const c  = randInt(1, 15);
      const b  = a * x + c;
      return {
        q:       `If ${a}x + ${c} = ${b}, find x.`,
        options: makeOpts(x, 4),
        answer:  x,
        trick:   `${a}x = ${b−c} → x = ${x}`,
        steps: [
          `${a}x = ${b} − ${c} = ${b - c}`,
          `x = ${b - c} ÷ ${a} = ${x} ✅`,
        ],
      };
    }),
    dyn("alg_d2", () => {
      const a = randInt(3, 12), b = randInt(3, 12);
      const sum = a + b, prod = a * b;
      const sq = sum * sum - 2 * prod;
      return {
        q:       `a+b=${sum}, ab=${prod}. Find a²+b².`,
        options: makeOpts(sq, 5),
        answer:  sq,
        trick:   `(a+b)²−2ab = ${sum*sum}−${2*prod} = ${sq}`,
        steps: [
          `a²+b² = (a+b)²−2ab`,
          `= ${sum}²−2×${prod}`,
          `= ${sum*sum}−${2*prod} = ${sq} ✅`,
        ],
      };
    }),
  ],
};
