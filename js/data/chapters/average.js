// ─── js/data/chapters/average.js ─────────────────────────────────
import { randInt, makeOpts, dyn } from "./_helpers.js";

export default {
  id:    "avg",
  title: "Average",
  icon:  "📊",
  color: "#fbbf24",
  desc:  "Avg = Sum÷Count. Use deviation method — it's 3× faster than recalculating.",

  questions: [
    {
      id: "avg_1",
      q:  "Avg of 5 numbers is 20. Remove 30. New average?",
      options: [17, 17.5, 18, 18.5],
      answer:  17.5,
      trick:   "New sum = 5×20−30 = 70. Avg = 70÷4 = 17.5",
      steps: ["Sum = 5×20 = 100", "Remove 30 → 70", "Avg = 70÷4 = 17.5 ✅"],
    },
    {
      id: "avg_2",
      q:  "Average of first 10 natural numbers?",
      options: [5, 5.5, 6, 6.5],
      answer:  5.5,
      trick:   "Sum = n(n+1)/2 = 55. Avg = 55/10 = 5.5",
      steps: ["Sum of 1 to 10 = 10×11/2 = 55", "Avg = 55÷10 = 5.5 ✅"],
    },
    {
      id: "avg_3",
      q:  "Batsman avg after 20 innings = 35. 21st inning = 56. New avg?",
      options: [36, 37, 38, 40],
      answer:  36,
      trick:   "(20×35+56)/21 = 756/21 = 36",
      steps: ["Total = 20×35+56 = 756", "New avg = 756÷21 = 36 ✅"],
    },
    {
      id: "avg_4",
      q:  "3 consecutive odd numbers. Average = 15. Largest?",
      options: [15, 17, 19, 21],
      answer:  17,
      trick:   "Middle = avg = 15 → numbers: 13,15,17. Largest = 17",
      steps: ["Middle number = average = 15", "Numbers: 13,15,17", "Largest = 17 ✅"],
    },
    {
      id: "avg_5",
      q:  "Average of 4 numbers is 25. A 5th number is added, avg becomes 27. 5th number?",
      options: [33, 35, 37, 39],
      answer:  35,
      trick:   "New sum = 5×27=135. Old sum = 4×25=100. 5th = 35",
      steps: ["Old sum = 4×25 = 100", "New sum = 5×27 = 135", "5th number = 135−100 = 35 ✅"],
    },
    // ── Dynamic ──────────────────────────────────────────────────
    dyn("avg_d1", () => {
      const n = randInt(4, 9), avg = randInt(15, 50);
      const addVal = avg + randInt(6, 20);
      const newAvg = Math.round((n * avg + addVal) / (n + 1));
      return {
        q:       `Avg of ${n} numbers is ${avg}. Add ${addVal}. New avg?`,
        options: makeOpts(newAvg, 3),
        answer:  newAvg,
        trick:   `New avg = (${n}×${avg}+${addVal})÷${n+1} = ${newAvg}`,
        steps: [
          `Old sum = ${n}×${avg} = ${n*avg}`,
          `New sum = ${n*avg}+${addVal} = ${n*avg+addVal}`,
          `New avg = ${n*avg+addVal}÷${n+1} = ${newAvg} ✅`,
        ],
      };
    }),
    dyn("avg_d2", () => {
      const n = randInt(5, 10), avg = randInt(20, 60);
      const rem = randInt(avg + 5, avg + 25);
      const newAvg = Math.round((n * avg - rem) / (n - 1));
      return {
        q:       `Avg of ${n} numbers = ${avg}. Remove ${rem}. New avg?`,
        options: makeOpts(newAvg, 4),
        answer:  newAvg,
        trick:   `New sum = ${n}×${avg}−${rem} = ${n*avg-rem}. Avg = ÷${n-1} = ${newAvg}`,
        steps: [
          `Sum = ${n}×${avg} = ${n*avg}`,
          `Remove ${rem} → ${n*avg-rem}`,
          `New avg = ${n*avg-rem}÷${n-1} = ${newAvg} ✅`,
        ],
      };
    }),
  ],
};
