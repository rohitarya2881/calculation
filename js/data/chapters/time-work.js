// ─── js/data/chapters/time-work.js ───────────────────────────────
import { randInt, makeOpts, dyn } from "./_helpers.js";

// LCM helper (used in dynamic generators)
function lcm(a, b) { let x = a, y = b; while (y) [x, y] = [y, x % y]; return (a * b) / x; }

export default {
  id:    "tw",
  title: "Time & Work",
  icon:  "⚙️",
  color: "#34d399",
  desc:  "LCM method is king. Total work = LCM, find rate per day, solve instantly.",

  questions: [
    {
      id: "tw_1",
      q:  "A finishes in 10 days, B in 15 days. Together?",
      options: [5, 6, 7, 8],
      answer:  6,
      trick:   "LCM(10,15)=30. A=3/day, B=2/day. Together=5/day → 30÷5=6 days",
      steps: [
        "Total work = LCM(10,15) = 30 units",
        "A does 30÷10 = 3 units/day",
        "B does 30÷15 = 2 units/day",
        "Together = 5 units/day → 30÷5 = 6 days ✅",
      ],
    },
    {
      id: "tw_2",
      q:  "Tap fills tank in 6 hrs, another empties in 8 hrs. Both open. Fill time?",
      options: [20, 22, 24, 28],
      answer:  24,
      trick:   "LCM=24. Fill 4/hr, empty 3/hr. Net=1/hr → 24 hrs",
      steps: [
        "LCM(6,8) = 24 units",
        "Fill = 4 units/hr, Empty = 3 units/hr",
        "Net = 1 unit/hr → 24 hours ✅",
      ],
    },
    {
      id: "tw_3",
      q:  "20 workers finish in 12 days. Workers needed to finish in 8 days?",
      options: [25, 28, 30, 32],
      answer:  30,
      trick:   "Men × Days = constant. 20×12 = W×8 → W=30",
      steps: [
        "Total work = 20 × 12 = 240 man-days",
        "Workers = 240 ÷ 8 = 30 ✅",
      ],
    },
    {
      id: "tw_4",
      q:  "A works twice as fast as B. Together finish in 12 days. B alone?",
      options: [24, 30, 36, 40],
      answer:  36,
      trick:   "A=2x/day, B=x/day. Together 3x=1/12 → x=1/36 → B=36 days",
      steps: [
        "Let B's rate = 1/B. A's rate = 2/B",
        "Together: 3/B = 1/12 → B = 36 days ✅",
      ],
    },
    {
      id: "tw_5",
      q:  "A+B together in 8 days. A alone in 12. B alone?",
      options: [20, 22, 24, 28],
      answer:  24,
      trick:   "1/B = 1/8 − 1/12 = 3/24 − 2/24 = 1/24 → B=24",
      steps: [
        "1/B = 1/8 − 1/12",
        "= 3/24 − 2/24 = 1/24",
        "B = 24 days ✅",
      ],
    },
    {
      id: "tw_6",
      q:  "A can do ¼ of work in 5 days. Total days for A?",
      options: [15, 18, 20, 25],
      answer:  20,
      trick:   "¼ work in 5 days → full work = 5×4 = 20 days",
      steps: [
        "¼ work takes 5 days",
        "Full work = 5 × 4 = 20 days ✅",
      ],
    },
    // ── Dynamic ──────────────────────────────────────────────────
    dyn("tw_d1", () => {
      const a = [6, 8, 10, 12, 15][randInt(0, 4)];
      const b = [10, 12, 15, 20, 24][randInt(0, 4)];
      const l = lcm(a, b);
      const ra = l / a, rb = l / b;
      const ans = Math.round(l / (ra + rb));
      return {
        q:       `A finishes in ${a} days, B in ${b} days. Together?`,
        options: makeOpts(ans, 3),
        answer:  ans,
        trick:   `LCM(${a},${b})=${l}. A=${ra}/d, B=${rb}/d. Together=${ra+rb}/d → ${ans} days`,
        steps: [
          `LCM(${a},${b}) = ${l} units`,
          `A = ${ra}/day, B = ${rb}/day`,
          `Together = ${ra+rb}/day → ${l}÷${ra+rb} = ${ans} days ✅`,
        ],
      };
    }),
    dyn("tw_d2", () => {
      const men  = randInt(10, 30);
      const days = randInt(8, 20);
      const newDays = [days - 4, days - 2, days + 2, days + 4][randInt(0, 3)];
      const newMen  = Math.round(men * days / newDays);
      return {
        q:       `${men} workers finish in ${days} days. Workers for ${newDays} days?`,
        options: makeOpts(newMen, Math.round(newMen * 0.15)),
        answer:  newMen,
        trick:   `Workers = ${men}×${days}÷${newDays} = ${newMen}`,
        steps: [
          `Total = ${men} × ${days} = ${men * days} man-days`,
          `Workers = ${men * days} ÷ ${newDays} = ${newMen} ✅`,
        ],
      };
    }),
  ],
};
