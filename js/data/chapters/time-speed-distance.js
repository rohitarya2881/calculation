// ─── js/data/chapters/time-speed-distance.js ─────────────────────
import { randInt, makeOpts, dyn } from "./_helpers.js";

export default {
  id:    "tsd",
  title: "Time, Speed & Distance",
  icon:  "🚗",
  color: "#60a5fa",
  desc:  "Speed = D÷T. Master the triangle, relative speed, and average speed tricks.",

  questions: [
    {
      id: "tsd_1",
      q:  "A train travels 240 km in 4 hours. Speed?",
      options: [50, 55, 60, 65],
      answer:  60,
      trick:   "Speed = D ÷ T = 240 ÷ 4 = 60 km/h",
      steps:   ["Speed = Distance ÷ Time", "= 240 ÷ 4 = 60 km/h ✅"],
    },
    {
      id: "tsd_2",
      q:  "Car at 60 km/h. Time to cover 150 km?",
      options: ["2 hr", "2.5 hr", "3 hr", "1.5 hr"],
      answer:  "2.5 hr",
      trick:   "Time = D ÷ S = 150 ÷ 60 = 2.5 hr",
      steps:   ["Time = Distance ÷ Speed", "= 150 ÷ 60 = 2.5 hours ✅"],
    },
    {
      id: "tsd_3",
      q:  "Two trains 300 m and 200 m cross each other in 10s (opposite). Combined speed?",
      options: [40, 45, 50, 60],
      answer:  50,
      trick:   "Opposite → add lengths. (300+200)÷10 = 50 m/s",
      steps: [
        "Opposite direction: total length = 300+200 = 500 m",
        "Combined speed = 500 ÷ 10 = 50 m/s ✅",
      ],
    },
    {
      id: "tsd_4",
      q:  "Speed increases by 25%. Time decreases by?",
      options: ["20%", "25%", "15%", "33%"],
      answer:  "20%",
      trick:   "S×T = constant. New T = T/1.25 → decrease = 1−1/1.25 = 20%",
      steps: [
        "Distance fixed ⟹ Speed × Time = constant",
        "New time = T ÷ 1.25",
        "Reduction = T − T/1.25 = 20% of T ✅",
      ],
    },
    {
      id: "tsd_5",
      q:  "Half distance at 20 km/h, rest at 30 km/h. Average speed?",
      options: [24, 25, 26, 23],
      answer:  24,
      trick:   "Equal distances: Avg = 2ab/(a+b) = 2×20×30/50 = 24 km/h",
      steps: [
        "For equal distances: Avg = 2ab / (a+b)",
        "= 2×20×30 / (20+30) = 1200/50 = 24 km/h ✅",
      ],
    },
    {
      id: "tsd_6",
      q:  "A covers 200 m in 20 s, B covers 300 m in 25 s. Ratio of speeds A:B?",
      options: ["5:6", "6:5", "2:3", "3:2"],
      answer:  "5:6",
      trick:   "A = 10 m/s, B = 12 m/s → 10:12 = 5:6",
      steps: [
        "A's speed = 200÷20 = 10 m/s",
        "B's speed = 300÷25 = 12 m/s",
        "Ratio = 10:12 = 5:6 ✅",
      ],
    },
    // ── Dynamic ──────────────────────────────────────────────────
    dyn("tsd_d1", () => {
      const s = [30, 40, 50, 60, 75, 80, 90, 100][randInt(0, 7)];
      const t = [1, 1.5, 2, 2.5, 3, 4][randInt(0, 5)];
      const d = s * t;
      return {
        q:       `Vehicle travels at ${s} km/h for ${t} hr. Distance?`,
        options: makeOpts(d, Math.round(d * 0.15)),
        answer:  d,
        trick:   `D = S × T = ${s} × ${t} = ${d} km`,
        steps:   ["Distance = Speed × Time", `= ${s} × ${t} = ${d} km ✅`],
      };
    }),
    dyn("tsd_d2", () => {
      const d = [60, 90, 120, 150, 180, 240][randInt(0, 5)];
      const t = [2, 3, 4, 5, 6][randInt(0, 4)];
      const s = d / t;
      return {
        q:       `Distance ${d} km covered in ${t} hrs. Speed?`,
        options: makeOpts(s, 8),
        answer:  s,
        trick:   `S = D÷T = ${d}÷${t} = ${s} km/h`,
        steps:   ["Speed = Distance ÷ Time", `= ${d} ÷ ${t} = ${s} km/h ✅`],
      };
    }),
    dyn("tsd_d3", () => {
      const s = [40, 50, 60, 80][randInt(0, 3)];
      const d = s * randInt(2, 6);
      const t = d / s;
      return {
        q:       `At ${s} km/h, time to cover ${d} km?`,
        options: makeOpts(t, 2),
        answer:  t,
        trick:   `T = D÷S = ${d}÷${s} = ${t} hr`,
        steps:   ["Time = Distance ÷ Speed", `= ${d} ÷ ${s} = ${t} hr ✅`],
      };
    }),
  ],
};
