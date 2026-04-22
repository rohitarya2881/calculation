// ─── js/data/chapters/data-interpretation.js ─────────────────────
import { randInt, makeOpts, dyn } from "./_helpers.js";

export default {
  id:    "di",
  title: "Data Interpretation",
  icon:  "📈",
  color: "#818cf8",
  desc:  "Read tables and charts fast. Always find total first, then calculate %.",

  questions: [
    {
      id: "di_1",
      q:  "Sales: Jan=200, Feb=250, Mar=300. Average monthly?",
      options: [230, 245, 250, 260],
      answer:  250,
      trick:   "(200+250+300)/3 = 750/3 = 250",
      steps:   ["Sum = 750", "Avg = 750÷3 = 250 ✅"],
    },
    {
      id: "di_2",
      q:  "Revenue 2022=Rs40L, 2023=Rs50L. % increase?",
      options: [20, 22, 25, 30],
      answer:  25,
      trick:   "(50−40)/40×100 = 25%",
      steps:   ["Increase = 10L", "% = 10/40×100 = 25% ✅"],
    },
    {
      id: "di_3",
      q:  "Pie chart: Rent sector = 72°. % of budget?",
      options: [15, 18, 20, 25],
      answer:  20,
      trick:   "72/360×100 = 20%",
      steps:   ["% = (72÷360)×100 = 20% ✅"],
    },
    {
      id: "di_4",
      q:  "Table: A=40, B=60, C=80, D=20. B as % of total?",
      options: [25, 28, 30, 32],
      answer:  30,
      trick:   "Total=200. B%=60/200×100=30%",
      steps:   ["Total = 200", "B% = 60/200×100 = 30% ✅"],
    },
    {
      id: "di_5",
      q:  "Sales: 2021=400, 2023=700. % growth over base year?",
      options: [65, 70, 75, 80],
      answer:  75,
      trick:   "(700−400)/400×100 = 75%",
      steps:   ["Growth = 300", "% = 300/400×100 = 75% ✅"],
    },
    {
      id: "di_6",
      q:  "Bar chart: 5 bars with values 10,20,30,40,50. Median bar value?",
      options: [20, 25, 30, 35],
      answer:  30,
      trick:   "Sorted values: 10,20,30,40,50. Middle = 30",
      steps: [
        "Arrange in order: 10, 20, 30, 40, 50",
        "Middle value (3rd of 5) = 30 ✅",
      ],
    },
    // ── Dynamic ──────────────────────────────────────────────────
    dyn("di_d1", () => {
      const base = randInt(200, 800);
      const pct  = [10, 20, 25, 50][randInt(0, 3)];
      const final = Math.round(base * (1 + pct / 100));
      return {
        q:       `Value grew from ${base} to ${final}. % increase?`,
        options: makeOpts(pct, 8),
        answer:  pct,
        trick:   `(${final}−${base})/${base}×100 = ${pct}%`,
        steps: [
          `Increase = ${final}−${base} = ${final - base}`,
          `% = ${final - base}/${base}×100 = ${pct}% ✅`,
        ],
      };
    }),
    dyn("di_d2", () => {
      const sectors = [randInt(20,60), randInt(20,60), randInt(20,60)];
      const total   = sectors.reduce((a,b)=>a+b, 0);
      const deg     = Math.round(sectors[0] / total * 360);
      const pct     = Math.round(sectors[0] / total * 100);
      return {
        q:       `Pie chart: largest sector = ${deg}° out of 360°. Percentage?`,
        options: makeOpts(pct, 8),
        answer:  pct,
        trick:   `${deg}/360×100 = ${pct}%`,
        steps: [
          `% = (${deg}÷360)×100`,
          `= ${pct}% ✅`,
        ],
      };
    }),
  ],
};
