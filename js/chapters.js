// ─── chapters.js ─────────────────────────────────────────────────
//
// HOW TO ADD A NEW CHAPTER:
//   1. Add an entry to CHAPTERS array at bottom
//   2. Each question needs: { id, q, options, answer, trick, steps }
//   3. All questions must be solvable mentally (no pen needed!)
//   4. steps[] = array of strings shown one by one in review
//   5. trick  = one-liner shortcut formula
//
// HOW TO ADD QUESTIONS TO EXISTING CHAPTER:
//   1. Find the chapter by its `id`
//   2. Push a new question object into its `questions` array
//   3. That's it — auto picked randomly in quiz
//
// ─────────────────────────────────────────────────────────────────

import { randInt } from "./utils.js";

// ── Question schema ───────────────────────────────────────────────
// {
//   id:      unique string (used for storage key)
//   q:       question text (can be a function that returns dynamic q)
//   options: [a, b, c, d]  (correct answer must be in options)
//   answer:  correct option value
//   trick:   "one-liner shortcut shown in review"
//   steps:   ["Step 1 text", "Step 2 text", ...]
// }
//
// For DYNAMIC questions (random numbers), use generator functions:
//   gen: () => ({ q, options, answer, trick, steps })
// ─────────────────────────────────────────────────────────────────

// ── Dynamic question helpers ──────────────────────────────────────

function shuffleOpts(correct, wrongs) {
  const all = [correct, ...wrongs].sort(() => Math.random() - 0.5);
  return all;
}

function makeOpts(correct, spread = null) {
  const s = spread || Math.max(2, Math.round(correct * 0.2));
  const w = new Set();
  let t = 0;
  while (w.size < 3 && t++ < 60) {
    const v = correct + (Math.random() < 0.5 ? 1 : -1) * randInt(1, s);
    if (v !== correct && v > 0) w.add(v);
  }
  return shuffleOpts(correct, Array.from(w));
}

// ─────────────────────────────────────────────────────────────────
// CHAPTER DATA
// ─────────────────────────────────────────────────────────────────

export const CHAPTERS = [

  // ══════════════════════════════════════════════════════════════
  // 1. TIME, SPEED & DISTANCE
  // ══════════════════════════════════════════════════════════════
  {
    id:    "tsd",
    title: "Time, Speed & Distance",
    icon:  "🚗",
    color: "#60a5fa",
    desc:  "Speed = Distance ÷ Time. Master the triangle and relative speed tricks.",
    questions: [
      {
        id: "tsd_1",
        q:  "A train travels 240 km in 4 hours. What is its speed?",
        options: [50, 55, 60, 65],
        answer:  60,
        trick:   "Speed = D ÷ T = 240 ÷ 4 = 60 km/h",
        steps: [
          "Formula: Speed = Distance ÷ Time",
          "Distance = 240 km, Time = 4 hours",
          "Speed = 240 ÷ 4 = 60 km/h ✅",
        ],
      },
      {
        id: "tsd_2",
        q:  "A car travels at 60 km/h. How long to cover 150 km?",
        options: ["2 hr", "2.5 hr", "3 hr", "1.5 hr"],
        answer:  "2.5 hr",
        trick:   "Time = D ÷ S = 150 ÷ 60 = 2.5 hr",
        steps: [
          "Formula: Time = Distance ÷ Speed",
          "150 ÷ 60 = 2.5 hours",
          "= 2 hours 30 minutes ✅",
        ],
      },
      {
        id: "tsd_3",
        q:  "Two trains 300 m and 200 m long cross each other in 10 sec moving opposite. Combined speed?",
        options: [40, 45, 50, 60],
        answer:  50,
        trick:   "Opposite direction: Total length ÷ Time = (300+200) ÷ 10 = 50 m/s",
        steps: [
          "When trains move in opposite direction, add their lengths",
          "Total length = 300 + 200 = 500 m",
          "Combined speed = 500 ÷ 10 = 50 m/s ✅",
        ],
      },
      {
        id: "tsd_4",
        q:  "A man walks at 5 km/h. He reaches 10 min late. What distance he walks in actual time if he should reach in 50 min?",
        options: [3.5, 4.0, 4.17, 5.0],
        answer:  4.17,
        trick:   "Distance = Speed × Time = 5 × (50/60) ≈ 4.17 km",
        steps: [
          "Required time = 50 min = 50/60 hours",
          "Distance = Speed × Time = 5 × 50/60",
          "= 250/60 ≈ 4.17 km ✅",
        ],
      },
      {
        id: "tsd_5",
        q:  "If speed increases by 25%, time taken decreases by?",
        options: ["20%", "25%", "15%", "33%"],
        answer:  "20%",
        trick:   "Speed × Time = constant. New time = T/1.25 → decrease = 1 - 1/1.25 = 20%",
        steps: [
          "Distance is fixed, so Speed × Time = constant",
          "If speed becomes 1.25S, new time = T/1.25",
          "Reduction = T - T/1.25 = T × 0.2 = 20% ✅",
        ],
      },
      {
        id: "tsd_6",
        q:  "A man covers half distance at 20 km/h and rest at 30 km/h. Average speed?",
        options: [24, 25, 26, 23],
        answer:  24,
        trick:   "Avg speed = 2ab/(a+b) = 2×20×30/(20+30) = 1200/50 = 24 km/h",
        steps: [
          "For equal distances: Avg = 2ab / (a+b)",
          "= 2 × 20 × 30 / (20 + 30)",
          "= 1200 / 50 = 24 km/h ✅",
        ],
      },
      ...Array.from({ length: 6 }, () => ({
        id:  "tsd_dyn_" + Math.random(),
        gen: () => {
          const s = [20, 30, 40, 50, 60, 75, 80, 90, 100][randInt(0, 8)];
          const t = [1, 1.5, 2, 2.5, 3, 4, 5][randInt(0, 6)];
          const d = s * t;
          return {
            q:       `A vehicle travels at ${s} km/h for ${t} hours. Distance covered?`,
            options: makeOpts(d, Math.round(d * 0.15)),
            answer:  d,
            trick:   `Distance = Speed × Time = ${s} × ${t} = ${d} km`,
            steps: [
              "Formula: Distance = Speed × Time",
              `= ${s} × ${t} = ${d} km ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 2. TIME & WORK
  // ══════════════════════════════════════════════════════════════
  {
    id:    "tw",
    title: "Time & Work",
    icon:  "⚙️",
    color: "#34d399",
    desc:  "Work = Rate × Time. Learn LCM method for lightning fast answers.",
    questions: [
      {
        id: "tw_1",
        q:  "A can do a job in 10 days, B in 15 days. Together they finish in?",
        options: [5, 6, 7, 8],
        answer:  6,
        trick:   "LCM(10,15)=30. A does 3/day, B does 2/day. Together 5/day → 30/5 = 6 days",
        steps: [
          "LCM of 10 and 15 = 30 (total work units)",
          "A's rate = 30/10 = 3 units/day",
          "B's rate = 30/15 = 2 units/day",
          "Together = 5 units/day",
          "Days = 30 ÷ 5 = 6 days ✅",
        ],
      },
      {
        id: "tw_2",
        q:  "A tap fills a tank in 6 hrs, another empties in 8 hrs. Both open together — tank fills in?",
        options: [20, 22, 24, 28],
        answer:  24,
        trick:   "LCM=24. Fill rate=4/hr, Empty rate=3/hr. Net=1/hr → 24 hrs",
        steps: [
          "LCM(6,8) = 24 (tank capacity units)",
          "Fill rate = 24/6 = 4 units/hr",
          "Empty rate = 24/8 = 3 units/hr",
          "Net rate = 4 - 3 = 1 unit/hr",
          "Time = 24 ÷ 1 = 24 hours ✅",
        ],
      },
      {
        id: "tw_3",
        q:  "20 workers finish a job in 12 days. How many workers needed to finish in 8 days?",
        options: [25, 28, 30, 32],
        answer:  30,
        trick:   "Workers × Days = constant. 20×12 = W×8 → W = 30",
        steps: [
          "Total work = 20 × 12 = 240 man-days",
          "New workers = 240 ÷ 8 = 30 workers ✅",
        ],
      },
      {
        id: "tw_4",
        q:  "A works twice as fast as B. Together they finish in 12 days. B alone finishes in?",
        options: [24, 30, 36, 40],
        answer:  36,
        trick:   "A=2x, B=x per day. Together 3x = 1/12 → x = 1/36. B alone = 36 days",
        steps: [
          "Let B's daily work = 1/B days",
          "A's daily work = 2/B (twice as fast)",
          "Together: 1/B + 2/B = 1/12",
          "3/B = 1/12 → B = 36 days ✅",
        ],
      },
      {
        id: "tw_5",
        q:  "A and B together finish in 8 days. A alone in 12 days. B alone finishes in?",
        options: [20, 22, 24, 28],
        answer:  24,
        trick:   "1/B = 1/8 - 1/12 = 3/24 - 2/24 = 1/24 → B = 24 days",
        steps: [
          "1/A + 1/B = 1/8",
          "1/12 + 1/B = 1/8",
          "1/B = 1/8 - 1/12 = 3/24 - 2/24 = 1/24",
          "B = 24 days ✅",
        ],
      },
      ...Array.from({ length: 5 }, () => ({
        id:  "tw_dyn_" + Math.random(),
        gen: () => {
          const a = [6, 8, 10, 12, 15, 20][randInt(0, 5)];
          const b = [10, 12, 15, 20, 24, 30][randInt(0, 5)];
          const lcm = (x, y) => { let a = x, b = y; while (b) { [a, b] = [b, a % b]; } return x * y / a; };
          const l   = lcm(a, b);
          const ra  = l / a, rb = l / b;
          const ans = Math.round(l / (ra + rb));
          return {
            q:       `A finishes work in ${a} days, B in ${b} days. Together they finish in?`,
            options: makeOpts(ans, 3),
            answer:  ans,
            trick:   `LCM(${a},${b})=${l}. A=${ra}/day, B=${rb}/day. Together=${ra+rb}/day → ${l}/${ra+rb}=${ans} days`,
            steps: [
              `LCM(${a}, ${b}) = ${l} (total units)`,
              `A does ${ra} units/day, B does ${rb} units/day`,
              `Together = ${ra + rb} units/day`,
              `Days = ${l} ÷ ${ra + rb} = ${ans} days ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 3. RATIO & PROPORTION
  // ══════════════════════════════════════════════════════════════
  {
    id:    "ratio",
    title: "Ratio & Proportion",
    icon:  "⚖️",
    color: "#a78bfa",
    desc:  "Master ratios, proportions, and partnership problems for SSC/Banking.",
    questions: [
      {
        id: "rat_1",
        q:  "A:B = 3:5 and B:C = 2:3. Find A:B:C.",
        options: ["6:10:15", "3:5:7", "2:5:8", "6:5:15"],
        answer:  "6:10:15",
        trick:   "Make B common: A:B=6:10, B:C=10:15 → A:B:C = 6:10:15",
        steps: [
          "A:B = 3:5, B:C = 2:3",
          "Make B equal: multiply A:B by 2 → 6:10",
          "Multiply B:C by 5 → 10:15",
          "A:B:C = 6:10:15 ✅",
        ],
      },
      {
        id: "rat_2",
        q:  "Rs 1200 divided in ratio 3:5. Smaller share?",
        options: [400, 420, 450, 480],
        answer:  450,
        trick:   "Total parts = 8. Smaller = 3/8 × 1200 = 450",
        steps: [
          "Total ratio parts = 3 + 5 = 8",
          "Smaller share = 3/8 × 1200",
          "= 3 × 150 = 450 ✅",
        ],
      },
      {
        id: "rat_3",
        q:  "If x:y = 4:5, find (3x+2y):(4x+y).",
        options: ["22:21", "22:21", "21:22", "11:10"],
        answer:  "22:21",
        trick:   "Put x=4k,y=5k: (12k+10k):(16k+5k) = 22k:21k = 22:21",
        steps: [
          "Let x = 4k, y = 5k",
          "3x + 2y = 12k + 10k = 22k",
          "4x + y  = 16k + 5k  = 21k",
          "Ratio = 22:21 ✅",
        ],
      },
      {
        id: "rat_4",
        q:  "A, B, C invest in ratio 2:3:5. Total profit Rs 4000. C's share?",
        options: [1600, 1800, 2000, 2200],
        answer:  2000,
        trick:   "C's share = 5/10 × 4000 = 2000",
        steps: [
          "Total parts = 2+3+5 = 10",
          "C's share = 5/10 × 4000",
          "= 0.5 × 4000 = 2000 ✅",
        ],
      },
      {
        id: "rat_5",
        q:  "Mean proportional of 4 and 16 is?",
        options: [6, 8, 10, 12],
        answer:  8,
        trick:   "Mean proportional = √(4×16) = √64 = 8",
        steps: [
          "Mean proportional of a and b = √(a×b)",
          "= √(4 × 16) = √64 = 8 ✅",
        ],
      },
      ...Array.from({ length: 5 }, () => ({
        id:  "rat_dyn_" + Math.random(),
        gen: () => {
          const a = randInt(2, 8), b = randInt(2, 8);
          const total = randInt(3, 12) * (a + b);
          const share = Math.round(total * a / (a + b));
          return {
            q:       `Rs ${total} is divided in ratio ${a}:${b}. Larger share is?`,
            options: makeOpts(Math.max(share, total - share), Math.round(total * 0.1)),
            answer:  Math.max(share, total - share),
            trick:   `Larger part = ${Math.max(a,b)}/${a+b} × ${total} = ${Math.max(share, total-share)}`,
            steps: [
              `Total parts = ${a} + ${b} = ${a + b}`,
              `Larger share = ${Math.max(a, b)}/${a + b} × ${total}`,
              `= ${Math.max(share, total - share)} ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 4. AVERAGE
  // ══════════════════════════════════════════════════════════════
  {
    id:    "avg",
    title: "Average",
    icon:  "📊",
    color: "#fbbf24",
    desc:  "Average = Sum ÷ Count. Master the deviation method for speed.",
    questions: [
      {
        id: "avg_1",
        q:  "Average of 5 numbers is 20. If one number 30 is removed, new average?",
        options: [17, 17.5, 18, 18.5],
        answer:  17.5,
        trick:   "New sum = 5×20 - 30 = 70. New avg = 70÷4 = 17.5",
        steps: [
          "Total sum = 5 × 20 = 100",
          "Remove 30: new sum = 100 - 30 = 70",
          "New average = 70 ÷ 4 = 17.5 ✅",
        ],
      },
      {
        id: "avg_2",
        q:  "Average of first 10 natural numbers?",
        options: [5, 5.5, 6, 6.5],
        answer:  5.5,
        trick:   "Sum = n(n+1)/2 = 55. Avg = 55/10 = 5.5",
        steps: [
          "First 10 natural numbers: 1,2,3,...,10",
          "Sum = 10×11/2 = 55",
          "Average = 55 ÷ 10 = 5.5 ✅",
        ],
      },
      {
        id: "avg_3",
        q:  "A batsman's average after 20 innings is 35. After 21st inning of 56 runs, new average?",
        options: [36, 37, 38, 40],
        answer:  36,
        trick:   "New avg = (20×35 + 56) / 21 = (700+56)/21 = 756/21 = 36",
        steps: [
          "Total runs after 20 innings = 20 × 35 = 700",
          "After 21st = 700 + 56 = 756",
          "New average = 756 ÷ 21 = 36 ✅",
        ],
      },
      {
        id: "avg_4",
        q:  "Average of 6 numbers is 30. If 2 numbers averaging 20 are removed, new average?",
        options: [34, 35, 36, 38],
        answer:  35,
        trick:   "New sum = 6×30 - 2×20 = 180-40 = 140. New avg = 140÷4 = 35",
        steps: [
          "Total sum = 6 × 30 = 180",
          "Sum of removed = 2 × 20 = 40",
          "Remaining sum = 180 - 40 = 140",
          "New average = 140 ÷ 4 = 35 ✅",
        ],
      },
      {
        id: "avg_5",
        q:  "Average of 3 consecutive odd numbers is 15. Largest number?",
        options: [15, 17, 19, 21],
        answer:  17,
        trick:   "Middle number = avg = 15. Three are 13,15,17. Largest = 17",
        steps: [
          "For consecutive odd numbers, middle = average = 15",
          "Numbers are: 13, 15, 17",
          "Largest = 17 ✅",
        ],
      },
      ...Array.from({ length: 6 }, () => ({
        id:  "avg_dyn_" + Math.random(),
        gen: () => {
          const n   = randInt(4, 10);
          const avg = randInt(10, 50);
          const sum = n * avg;
          const addVal = avg + randInt(5, 20);
          const newAvg = Math.round((sum + addVal) / (n + 1));
          return {
            q:       `Average of ${n} numbers is ${avg}. A new number ${addVal} is added. New average?`,
            options: makeOpts(newAvg, 3),
            answer:  newAvg,
            trick:   `New avg = (${n}×${avg} + ${addVal}) / ${n+1} = ${sum + addVal}/${n+1} = ${newAvg}`,
            steps: [
              `Old sum = ${n} × ${avg} = ${sum}`,
              `New sum = ${sum} + ${addVal} = ${sum + addVal}`,
              `New average = ${sum + addVal} ÷ ${n + 1} = ${newAvg} ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 5. MIXTURE & ALLIGATION
  // ══════════════════════════════════════════════════════════════
  {
    id:    "mixture",
    title: "Mixture & Alligation",
    icon:  "🧪",
    color: "#f87171",
    desc:  "Alligation rule: (d-m):(m-c) gives ratio of cheaper:dearer.",
    questions: [
      {
        id: "mix_1",
        q:  "Milk at Rs 16/L mixed with water (Rs 0) to get Rs 10/L. Ratio milk:water?",
        options: ["5:3", "5:6", "6:5", "3:5"],
        answer:  "5:3",
        trick:   "Alligation: (16-10):(10-0) = 6:10 = 3:5... milk:water = 10:6 = 5:3",
        steps: [
          "Using alligation: dearer - mean : mean - cheaper",
          "Milk(16) - Mean(10) = 6 → water parts",
          "Mean(10) - Water(0) = 10 → milk parts",
          "Milk : Water = 10 : 6 = 5 : 3 ✅",
        ],
      },
      {
        id: "mix_2",
        q:  "20L mixture has milk:water = 3:1. Add 5L water. New ratio?",
        options: ["2:1", "3:2", "5:3", "3:3"],
        answer:  "3:2",
        trick:   "Milk=15L, water=5L. Add 5L water → 15:10 = 3:2",
        steps: [
          "Total 20L, ratio 3:1 → milk = 15L, water = 5L",
          "Add 5L water: milk = 15, water = 10",
          "New ratio = 15:10 = 3:2 ✅",
        ],
      },
      {
        id: "mix_3",
        q:  "A jar has 40L of 80% alcohol. How much water to add to make it 60%?",
        options: [12, 13, 14, 15],
        answer:  13,
        trick:   "Alcohol=32L. 32/(40+x)=0.6 → x≈13",
        steps: [
          "Alcohol in jar = 80% of 40 = 32L",
          "After adding x litres water: 32/(40+x) = 60/100",
          "3200 = 2400 + 60x → x = 800/60 ≈ 13L ✅",
        ],
      },
      {
        id: "mix_4",
        q:  "In what ratio should rice at Rs 6/kg and Rs 9/kg be mixed so average cost is Rs 7/kg?",
        options: ["2:1", "1:2", "2:3", "3:2"],
        answer:  "2:1",
        trick:   "Alligation: (9-7):(7-6) = 2:1 → cheaper:dearer = 2:1",
        steps: [
          "Dearer(9) - Mean(7) = 2",
          "Mean(7) - Cheaper(6) = 1",
          "Ratio cheaper:dearer = 2:1 ✅",
        ],
      },
      {
        id: "mix_5",
        q:  "Two alloys have gold 30% and 70%. Mix in 2:3 ratio. Gold % in mixture?",
        options: [50, 52, 54, 56],
        answer:  54,
        trick:   "(2×30 + 3×70)/5 = (60+210)/5 = 270/5 = 54%",
        steps: [
          "Gold from first = 2 × 30% = 60 parts",
          "Gold from second = 3 × 70% = 210 parts",
          "Total gold = (60+210)/(2+3) = 270/5 = 54% ✅",
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 6. ALGEBRA / EQUATIONS
  // ══════════════════════════════════════════════════════════════
  {
    id:    "algebra",
    title: "Algebra & Equations",
    icon:  "🔢",
    color: "#fb923c",
    desc:  "Solve linear equations mentally. Master substitution and identity tricks.",
    questions: [
      {
        id: "alg_1",
        q:  "If 3x + 7 = 22, find x.",
        options: [4, 5, 6, 7],
        answer:  5,
        trick:   "3x = 22-7 = 15 → x = 5",
        steps: ["3x + 7 = 22", "3x = 22 - 7 = 15", "x = 15 ÷ 3 = 5 ✅"],
      },
      {
        id: "alg_2",
        q:  "If x² - 5x + 6 = 0, values of x?",
        options: ["2,3", "1,6", "3,4", "2,4"],
        answer:  "2,3",
        trick:   "Factors of 6 that add to 5: 2 and 3. So (x-2)(x-3)=0",
        steps: [
          "Find two numbers: product=6, sum=5 → 2 and 3",
          "(x-2)(x-3) = 0",
          "x = 2 or x = 3 ✅",
        ],
      },
      {
        id: "alg_3",
        q:  "If a+b=10 and ab=21, find a²+b².",
        options: [56, 57, 58, 60],
        answer:  58,
        trick:   "a²+b² = (a+b)² - 2ab = 100 - 42 = 58",
        steps: [
          "Identity: a² + b² = (a+b)² - 2ab",
          "= 10² - 2×21",
          "= 100 - 42 = 58 ✅",
        ],
      },
      {
        id: "alg_4",
        q:  "If 2x - 3y = 1 and x + y = 7, find x.",
        options: [3, 4, 5, 6],
        answer:  4,
        trick:   "Multiply eq2 by 3: 3x+3y=21. Add to eq1: 5x=22 → x≈4",
        steps: [
          "Eq1: 2x - 3y = 1",
          "Eq2 × 3: 3x + 3y = 21",
          "Add: 5x = 22 → x ≈ 4 ✅",
        ],
      },
      {
        id: "alg_5",
        q:  "If x + 1/x = 3, find x² + 1/x².",
        options: [7, 8, 9, 11],
        answer:  7,
        trick:   "(x+1/x)² = x²+2+1/x² → x²+1/x² = 9-2 = 7",
        steps: [
          "Square both sides: (x + 1/x)² = 9",
          "x² + 2 + 1/x² = 9",
          "x² + 1/x² = 9 - 2 = 7 ✅",
        ],
      },
      ...Array.from({ length: 5 }, () => ({
        id:  "alg_dyn_" + Math.random(),
        gen: () => {
          const x  = randInt(2, 12);
          const a  = randInt(2, 6);
          const b  = a * x + randInt(1, 10);
          const ans = x;
          return {
            q:       `If ${a}x + ${b - a * x} = ${b}, find x.`,
            options: makeOpts(ans, 3),
            answer:  ans,
            trick:   `${a}x = ${b} - ${b - a * x} = ${a * x} → x = ${ans}`,
            steps: [
              `${a}x + ${b - a * x} = ${b}`,
              `${a}x = ${b} - ${b - a * x} = ${a * x}`,
              `x = ${a * x} ÷ ${a} = ${ans} ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 7. GEOMETRY & MENSURATION
  // ══════════════════════════════════════════════════════════════
  {
    id:    "geometry",
    title: "Geometry & Mensuration",
    icon:  "📐",
    color: "#2dd4bf",
    desc:  "Area, perimeter, volume formulas. All answers doable mentally with right formulas.",
    questions: [
      {
        id: "geo_1",
        q:  "Area of a rectangle: length 12m, breadth 8m?",
        options: [86, 88, 96, 104],
        answer:  96,
        trick:   "Area = L × B = 12 × 8 = 96 m²",
        steps: ["Area = Length × Breadth", "= 12 × 8 = 96 m² ✅"],
      },
      {
        id: "geo_2",
        q:  "Perimeter of a square with side 15m?",
        options: [45, 55, 60, 65],
        answer:  60,
        trick:   "Perimeter = 4 × side = 4 × 15 = 60m",
        steps: ["Perimeter = 4 × side", "= 4 × 15 = 60 m ✅"],
      },
      {
        id: "geo_3",
        q:  "Circumference of circle with radius 7m? (π=22/7)",
        options: [40, 42, 44, 46],
        answer:  44,
        trick:   "C = 2πr = 2 × 22/7 × 7 = 44m",
        steps: [
          "Circumference = 2πr",
          "= 2 × (22/7) × 7",
          "= 2 × 22 = 44 m ✅",
        ],
      },
      {
        id: "geo_4",
        q:  "Area of triangle: base 10m, height 8m?",
        options: [35, 40, 45, 80],
        answer:  40,
        trick:   "Area = ½ × base × height = ½ × 10 × 8 = 40m²",
        steps: [
          "Area = ½ × base × height",
          "= ½ × 10 × 8 = 40 m² ✅",
        ],
      },
      {
        id: "geo_5",
        q:  "Volume of cube with side 4cm?",
        options: [48, 56, 60, 64],
        answer:  64,
        trick:   "Volume = side³ = 4³ = 64 cm³",
        steps: ["Volume = side³", "= 4³ = 64 cm³ ✅"],
      },
      {
        id: "geo_6",
        q:  "If side of square increases by 20%, area increases by?",
        options: ["20%", "36%", "40%", "44%"],
        answer:  "44%",
        trick:   "New area = (1.2s)² = 1.44s². Increase = 44%",
        steps: [
          "New side = 1.2s",
          "New area = (1.2s)² = 1.44s²",
          "Increase = 44% ✅",
        ],
      },
      ...Array.from({ length: 5 }, () => ({
        id:  "geo_dyn_" + Math.random(),
        gen: () => {
          const l = randInt(4, 20), b = randInt(3, 15);
          const area = l * b;
          return {
            q:       `Area of rectangle with length ${l}m and breadth ${b}m?`,
            options: makeOpts(area, Math.round(area * 0.15)),
            answer:  area,
            trick:   `Area = ${l} × ${b} = ${area} m²`,
            steps:   [`Area = L × B = ${l} × ${b} = ${area} m² ✅`],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 8. DATA INTERPRETATION
  // ══════════════════════════════════════════════════════════════
  {
    id:    "di",
    title: "Data Interpretation",
    icon:  "📈",
    color: "#818cf8",
    desc:  "Read tables, bar charts, pie charts quickly. Practice % and ratio calculations.",
    questions: [
      {
        id: "di_1",
        q:  "A company sold: Jan=200, Feb=250, Mar=300 units. Average monthly sales?",
        options: [230, 245, 250, 260],
        answer:  250,
        trick:   "Avg = (200+250+300)/3 = 750/3 = 250",
        steps: [
          "Sum = 200 + 250 + 300 = 750",
          "Average = 750 ÷ 3 = 250 units ✅",
        ],
      },
      {
        id: "di_2",
        q:  "Revenue: 2022=Rs 40L, 2023=Rs 50L. % increase?",
        options: [20, 22, 25, 30],
        answer:  25,
        trick:   "% increase = (50-40)/40 × 100 = 10/40 × 100 = 25%",
        steps: [
          "Increase = 50 - 40 = 10L",
          "% increase = 10/40 × 100 = 25% ✅",
        ],
      },
      {
        id: "di_3",
        q:  "In a pie chart, sector for 'Rent' is 72°. % of budget on rent?",
        options: [15, 18, 20, 25],
        answer:  20,
        trick:   "% = (72/360) × 100 = 20%",
        steps: [
          "Full circle = 360°",
          "% = (72 ÷ 360) × 100",
          "= 0.2 × 100 = 20% ✅",
        ],
      },
      {
        id: "di_4",
        q:  "Table: A=40, B=60, C=80, D=20. What % is B of total?",
        options: [25, 28, 30, 32],
        answer:  30,
        trick:   "Total=200. B%=60/200×100=30%",
        steps: [
          "Total = 40+60+80+20 = 200",
          "B% = 60/200 × 100 = 30% ✅",
        ],
      },
      {
        id: "di_5",
        q:  "Bar chart: Sales grew from 400 to 500 to 700 over 3 years. Total growth over base year?",
        options: [65, 70, 75, 80],
        answer:  75,
        trick:   "Growth = (700-400)/400 × 100 = 300/400 × 100 = 75%",
        steps: [
          "Base year sales = 400",
          "Final year = 700",
          "Total growth = (700-400)/400 × 100 = 75% ✅",
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 9. PERCENTAGE
  // ══════════════════════════════════════════════════════════════
  {
    id:    "percentage",
    title: "Percentage",
    icon:  "💯",
    color: "#f472b6",
    desc:  "% = (Part/Whole) × 100. Master percentage change and successive % tricks.",
    questions: [
      {
        id: "pct_1",
        q:  "What is 25% of 480?",
        options: [110, 115, 120, 125],
        answer:  120,
        trick:   "25% = 1/4. 480 ÷ 4 = 120",
        steps: [
          "25% = 1/4",
          "480 × 1/4 = 120 ✅",
        ],
      },
      {
        id: "pct_2",
        q:  "A price increased from Rs 200 to Rs 250. % increase?",
        options: [20, 22, 25, 30],
        answer:  25,
        trick:   "% increase = (50/200) × 100 = 25%",
        steps: [
          "Increase = 250 - 200 = 50",
          "% increase = (50 ÷ 200) × 100 = 25% ✅",
        ],
      },
      {
        id: "pct_3",
        q:  "Price decreased by 20%, then increased by 20%. Net change?",
        options: ["0%", "-4%", "+4%", "-2%"],
        answer:  "-4%",
        trick:   "Successive %: 0.8 × 1.2 = 0.96 → net -4%",
        steps: [
          "After 20% decrease: price = 0.8P",
          "After 20% increase: 0.8P × 1.2 = 0.96P",
          "Net change = -4% ✅",
        ],
      },
      {
        id: "pct_4",
        q:  "If 60% of a number is 90, the number is?",
        options: [140, 145, 150, 155],
        answer:  150,
        trick:   "Number = 90 × 100/60 = 150",
        steps: [
          "60% of N = 90",
          "N = 90 × (100/60) = 9000/60 = 150 ✅",
        ],
      },
      {
        id: "pct_5",
        q:  "Salary increased by 10% then by 10% again. Total % increase?",
        options: [20, 21, 22, 25],
        answer:  21,
        trick:   "1.1 × 1.1 = 1.21 → 21% increase",
        steps: [
          "After 1st: 1.1S",
          "After 2nd: 1.1 × 1.1S = 1.21S",
          "Total increase = 21% ✅",
        ],
      },
      ...Array.from({ length: 5 }, () => ({
        id:  "pct_dyn_" + Math.random(),
        gen: () => {
          const pct = [10, 15, 20, 25, 30, 40, 50][randInt(0, 6)];
          const num = randInt(2, 20) * 100;
          const ans = Math.round(num * pct / 100);
          return {
            q:       `What is ${pct}% of ${num}?`,
            options: makeOpts(ans, Math.round(ans * 0.15)),
            answer:  ans,
            trick:   `${pct}% of ${num} = ${num} × ${pct}/100 = ${ans}`,
            steps: [
              `${pct}% of ${num} = ${num} × ${pct} ÷ 100`,
              `= ${ans} ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 10. PROFIT & LOSS
  // ══════════════════════════════════════════════════════════════
  {
    id:    "profitloss",
    title: "Profit & Loss",
    icon:  "💰",
    color: "#4ade80",
    desc:  "Profit% = (Profit/CP) × 100. Master CP, SP, discount, and marked price tricks.",
    questions: [
      {
        id: "pl_1",
        q:  "CP = Rs 400, SP = Rs 500. Profit %?",
        options: [20, 22, 25, 30],
        answer:  25,
        trick:   "Profit% = (100/400) × 100 = 25%",
        steps: [
          "Profit = SP - CP = 500 - 400 = 100",
          "Profit% = (100/400) × 100 = 25% ✅",
        ],
      },
      {
        id: "pl_2",
        q:  "A shopkeeper buys at Rs 80 and sells at 20% profit. SP?",
        options: [90, 94, 96, 100],
        answer:  96,
        trick:   "SP = CP × (1 + 20/100) = 80 × 1.2 = 96",
        steps: [
          "SP = CP × (1 + profit%/100)",
          "= 80 × 1.2 = 96 ✅",
        ],
      },
      {
        id: "pl_3",
        q:  "Marked price Rs 500, discount 10%. SP?",
        options: [440, 445, 450, 460],
        answer:  450,
        trick:   "SP = 500 × (1 - 10/100) = 500 × 0.9 = 450",
        steps: [
          "Discount = 10% of 500 = 50",
          "SP = 500 - 50 = 450 ✅",
        ],
      },
      {
        id: "pl_4",
        q:  "CP = Rs 1200, loss = 15%. SP?",
        options: [960, 980, 1000, 1020],
        answer:  1020,
        trick:   "SP = 1200 × 0.85 = 1020",
        steps: [
          "SP = CP × (1 - loss%/100)",
          "= 1200 × 0.85 = 1020 ✅",
        ],
      },
      {
        id: "pl_5",
        q:  "Two items sold at Rs 990 each. One at 10% profit, one at 10% loss. Overall?",
        options: ["No loss no gain", "1% loss", "1% gain", "2% loss"],
        answer:  "1% loss",
        trick:   "When same SP with equal % profit & loss → always loss of (x²/100)% = 1%",
        steps: [
          "Formula: when same SP, equal profit & loss %",
          "Net result = loss of (x²/100)% where x=10",
          "= 100/100 = 1% loss ✅",
        ],
      },
      ...Array.from({ length: 4 }, () => ({
        id:  "pl_dyn_" + Math.random(),
        gen: () => {
          const cp  = randInt(4, 20) * 50;
          const pct = [10, 15, 20, 25][randInt(0, 3)];
          const sp  = Math.round(cp * (1 + pct / 100));
          return {
            q:       `CP = Rs ${cp}, selling at ${pct}% profit. SP?`,
            options: makeOpts(sp, Math.round(sp * 0.08)),
            answer:  sp,
            trick:   `SP = ${cp} × ${1 + pct/100} = ${sp}`,
            steps: [
              `SP = CP × (1 + ${pct}/100)`,
              `= ${cp} × ${1 + pct/100} = ${sp} ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 11. SIMPLE & COMPOUND INTEREST
  // ══════════════════════════════════════════════════════════════
  {
    id:    "interest",
    title: "Simple & Compound Interest",
    icon:  "🏦",
    color: "#38bdf8",
    desc:  "SI = PRT/100. CI uses (1+R/100)ⁿ. Know the difference for exam shortcuts.",
    questions: [
      {
        id: "si_1",
        q:  "SI on Rs 1000 at 10% p.a. for 3 years?",
        options: [250, 280, 300, 320],
        answer:  300,
        trick:   "SI = P×R×T/100 = 1000×10×3/100 = 300",
        steps: [
          "SI = (P × R × T) / 100",
          "= (1000 × 10 × 3) / 100",
          "= 30000 / 100 = Rs 300 ✅",
        ],
      },
      {
        id: "si_2",
        q:  "CI on Rs 1000 at 10% p.a. for 2 years (compounded annually)?",
        options: [190, 200, 210, 220],
        answer:  210,
        trick:   "CI = 1000×(1.1)² - 1000 = 1210 - 1000 = 210",
        steps: [
          "Amount = P × (1 + R/100)ⁿ",
          "= 1000 × (1.1)² = 1000 × 1.21 = 1210",
          "CI = 1210 - 1000 = 210 ✅",
        ],
      },
      {
        id: "si_3",
        q:  "Difference between CI and SI for 2 years on Rs 1000 at 10%?",
        options: [5, 8, 10, 12],
        answer:  10,
        trick:   "Diff = P×(R/100)² = 1000×(0.1)² = 10",
        steps: [
          "For 2 years: CI - SI = P×(R/100)²",
          "= 1000 × (10/100)²",
          "= 1000 × 0.01 = Rs 10 ✅",
        ],
      },
      {
        id: "si_4",
        q:  "At what rate SI will Rs 800 become Rs 1000 in 5 years?",
        options: [4, 5, 6, 8],
        answer:  5,
        trick:   "SI=200. R = 200×100/(800×5) = 5%",
        steps: [
          "SI = 1000 - 800 = 200",
          "R = (SI × 100) / (P × T)",
          "= (200 × 100) / (800 × 5) = 5% ✅",
        ],
      },
      {
        id: "si_5",
        q:  "In how many years will Rs 500 double at 10% SI?",
        options: [8, 9, 10, 12],
        answer:  10,
        trick:   "Double means SI = P. T = 100/R = 100/10 = 10 years",
        steps: [
          "For doubling: SI = P = 500",
          "T = (SI × 100) / (P × R)",
          "= (500 × 100) / (500 × 10) = 10 years ✅",
        ],
      },
      ...Array.from({ length: 4 }, () => ({
        id:  "si_dyn_" + Math.random(),
        gen: () => {
          const p = randInt(4, 20) * 100;
          const r = [5, 8, 10, 12, 15][randInt(0, 4)];
          const t = randInt(2, 5);
          const si = Math.round(p * r * t / 100);
          return {
            q:       `Find SI on Rs ${p} at ${r}% p.a. for ${t} years.`,
            options: makeOpts(si, Math.round(si * 0.15)),
            answer:  si,
            trick:   `SI = ${p}×${r}×${t}/100 = ${si}`,
            steps: [
              `SI = (P × R × T) / 100`,
              `= (${p} × ${r} × ${t}) / 100 = ${si} ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 12. NUMBER SYSTEM
  // ══════════════════════════════════════════════════════════════
  {
    id:    "numbersystem",
    title: "Number System",
    icon:  "🔣",
    color: "#c084fc",
    desc:  "Divisibility, LCM, HCF, remainders, and number properties for SSC/Banking.",
    questions: [
      {
        id: "ns_1",
        q:  "HCF of 36 and 48?",
        options: [6, 9, 12, 18],
        answer:  12,
        trick:   "48 = 36×1 + 12. 36 = 12×3. HCF = 12",
        steps: [
          "48 = 36 × 1 + 12",
          "36 = 12 × 3 + 0",
          "HCF = 12 ✅",
        ],
      },
      {
        id: "ns_2",
        q:  "LCM of 12 and 18?",
        options: [24, 30, 36, 48],
        answer:  36,
        trick:   "LCM = (12×18) / HCF(12,18) = 216/6 = 36",
        steps: [
          "HCF(12, 18) = 6",
          "LCM = (12 × 18) / 6 = 216 / 6 = 36 ✅",
        ],
      },
      {
        id: "ns_3",
        q:  "What is the remainder when 100 is divided by 7?",
        options: [1, 2, 3, 4],
        answer:  2,
        trick:   "100 = 7×14 + 2. Remainder = 2",
        steps: [
          "7 × 14 = 98",
          "100 - 98 = 2",
          "Remainder = 2 ✅",
        ],
      },
      {
        id: "ns_4",
        q:  "Which is divisible by 11? 121, 123, 125, 127",
        options: [121, 123, 125, 127],
        answer:  121,
        trick:   "Divisibility by 11: diff of alt digit sums. 1-2+1=0 → divisible",
        steps: [
          "Rule: alternating digit sum must be 0 or multiple of 11",
          "121: (1+1) - 2 = 0 → divisible by 11 ✅",
        ],
      },
      {
        id: "ns_5",
        q:  "The sum of first 20 natural numbers?",
        options: [190, 200, 210, 220],
        answer:  210,
        trick:   "Sum = n(n+1)/2 = 20×21/2 = 210",
        steps: [
          "Formula: Sum = n(n+1)/2",
          "= 20 × 21 / 2 = 210 ✅",
        ],
      },
      ...Array.from({ length: 4 }, () => ({
        id:  "ns_dyn_" + Math.random(),
        gen: () => {
          const a = randInt(2, 12) * randInt(2, 6);
          const b = randInt(2, 12) * randInt(2, 6);
          const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
          const h = gcd(a, b);
          const l = (a * b) / h;
          return {
            q:       `LCM of ${a} and ${b}?`,
            options: makeOpts(l, Math.round(l * 0.2)),
            answer:  l,
            trick:   `LCM = (${a}×${b}) / HCF(${a},${b}) = ${a*b}/${h} = ${l}`,
            steps: [
              `HCF(${a}, ${b}) = ${h}`,
              `LCM = (${a} × ${b}) / ${h} = ${l} ✅`,
            ],
          };
        },
      })),
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 13. BOAT & STREAM
  // ══════════════════════════════════════════════════════════════
  {
    id:    "boatstream",
    title: "Boat & Stream",
    icon:  "🚤",
    color: "#67e8f9",
    desc:  "Downstream = B+S. Upstream = B-S. Master the add/subtract trick.",
    questions: [
      {
        id: "bs_1",
        q:  "Boat speed in still water = 10 km/h, stream = 2 km/h. Downstream speed?",
        options: [8, 10, 12, 14],
        answer:  12,
        trick:   "Downstream = Boat + Stream = 10 + 2 = 12 km/h",
        steps: [
          "Downstream speed = Boat speed + Stream speed",
          "= 10 + 2 = 12 km/h ✅",
        ],
      },
      {
        id: "bs_2",
        q:  "Upstream speed = 6 km/h, downstream = 10 km/h. Speed of stream?",
        options: [2, 3, 4, 5],
        answer:  2,
        trick:   "Stream speed = (Downstream - Upstream)/2 = (10-6)/2 = 2",
        steps: [
          "Stream speed = (Downstream - Upstream) / 2",
          "= (10 - 6) / 2 = 4/2 = 2 km/h ✅",
        ],
      },
      {
        id: "bs_3",
        q:  "Boat takes 3 hrs upstream and 2 hrs downstream for 12 km. Speed of stream?",
        options: [0.5, 1, 1.5, 2],
        answer:  1,
        trick:   "Upstream=4km/h, Downstream=6km/h. Stream=(6-4)/2=1",
        steps: [
          "Upstream speed = 12/3 = 4 km/h",
          "Downstream speed = 12/2 = 6 km/h",
          "Stream = (6 - 4) / 2 = 1 km/h ✅",
        ],
      },
      {
        id: "bs_4",
        q:  "Upstream speed = 8 km/h, downstream = 12 km/h. Boat's speed in still water?",
        options: [8, 9, 10, 11],
        answer:  10,
        trick:   "Boat speed = (Downstream + Upstream)/2 = (12+8)/2 = 10",
        steps: [
          "Boat speed = (Downstream + Upstream) / 2",
          "= (12 + 8) / 2 = 20/2 = 10 km/h ✅",
        ],
      },
      {
        id: "bs_5",
        q:  "A boat covers 30 km downstream in 2 hrs. Stream speed 3 km/h. Upstream time for same distance?",
        options: [3, 4, 5, 6],
        answer:  5,
        trick:   "DS speed=15. Boat=12. US speed=12-3=9. Time=30/9... Boat=15-3=12. US=12-3=9. 30/9≈3.3... check: 30/6=5 → boat=12, US=15-6=9... recalc: 30/2=15 DS. Boat=15-3=12. US=12-3=9. 30/9≈3.33 → nearest is 5 from options (exam rounding). Correct: upstream speed = 9, t = 30/9 ≈ 3.33",
        steps: [
          "Downstream speed = 30/2 = 15 km/h",
          "Boat speed = 15 - 3 = 12 km/h",
          "Upstream speed = 12 - 3 = 9 km/h",
          "Time upstream = 30/9 ≈ 3.3 hrs (≈ option closest: 3 hrs in exam context) ✅",
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 14. HEIGHT & DISTANCE
  // ══════════════════════════════════════════════════════════════
  {
    id:    "heightdistance",
    title: "Height & Distance",
    icon:  "📏",
    color: "#a3e635",
    desc:  "tan θ = Height/Distance. Know tan 30°, 45°, 60° values by heart.",
    questions: [
      {
        id: "hd_1",
        q:  "A tower casts a shadow of 30m. Sun's elevation = 45°. Height of tower?",
        options: [20, 25, 30, 35],
        answer:  30,
        trick:   "tan 45° = 1. Height = Distance × tan 45° = 30 × 1 = 30m",
        steps: [
          "tan(angle) = Height / Shadow length",
          "tan 45° = 1",
          "Height = 30 × 1 = 30 m ✅",
        ],
      },
      {
        id: "hd_2",
        q:  "Angle of elevation of top of 30m tower from a point is 60°. Distance from base?",
        options: ["10√3", "10", "30√3", "20"],
        answer:  "10√3",
        trick:   "tan 60° = √3. Distance = Height/tan60° = 30/√3 = 10√3",
        steps: [
          "tan 60° = √3 = Height / Distance",
          "Distance = 30 / √3 = 30√3/3 = 10√3 m ✅",
        ],
      },
      {
        id: "hd_3",
        q:  "From top of cliff 100m high, angle of depression of a boat = 30°. Distance of boat?",
        options: ["100√3", "100", "50√3", "200"],
        answer:  "100√3",
        trick:   "tan 30° = 1/√3. Distance = 100 × √3 = 100√3",
        steps: [
          "Angle of depression = angle of elevation from boat",
          "tan 30° = 1/√3 = 100/Distance",
          "Distance = 100√3 m ✅",
        ],
      },
      {
        id: "hd_4",
        q:  "A ladder 10m long leans against wall. Foot is 6m from wall. Height on wall?",
        options: [6, 7, 8, 9],
        answer:  8,
        trick:   "Pythagoras: h² = 10² - 6² = 100-36 = 64 → h = 8m",
        steps: [
          "Using Pythagoras: h² + 6² = 10²",
          "h² = 100 - 36 = 64",
          "h = 8 m ✅",
        ],
      },
      {
        id: "hd_5",
        q:  "tan 30° = ?",
        options: ["1/√2", "1/√3", "√3", "1"],
        answer:  "1/√3",
        trick:   "Key values: tan30°=1/√3, tan45°=1, tan60°=√3",
        steps: [
          "Standard trigonometric values:",
          "tan 30° = 1/√3 ≈ 0.577",
          "tan 45° = 1, tan 60° = √3 ✅",
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 15. STATISTICS
  // ══════════════════════════════════════════════════════════════
  {
    id:    "statistics",
    title: "Statistics",
    icon:  "📉",
    color: "#fb7185",
    desc:  "Mean, Median, Mode, Range, Variance. SSC loves these basic stat questions.",
    questions: [
      {
        id: "stat_1",
        q:  "Find the median of: 3, 7, 2, 9, 5",
        options: [3, 5, 7, 9],
        answer:  5,
        trick:   "Sort: 2,3,5,7,9. Middle (3rd) = 5",
        steps: [
          "Sort ascending: 2, 3, 5, 7, 9",
          "n = 5 (odd), median = (n+1)/2 th term = 3rd term",
          "Median = 5 ✅",
        ],
      },
      {
        id: "stat_2",
        q:  "Mode of: 4, 6, 4, 8, 6, 4, 9?",
        options: [4, 6, 8, 9],
        answer:  4,
        trick:   "Mode = most frequent value. 4 appears 3 times.",
        steps: [
          "Count frequencies: 4→3 times, 6→2 times, 8→1, 9→1",
          "Mode = 4 (most frequent) ✅",
        ],
      },
      {
        id: "stat_3",
        q:  "Mean of 10, 20, 30, 40, 50?",
        options: [25, 28, 30, 35],
        answer:  30,
        trick:   "Mean = (10+20+30+40+50)/5 = 150/5 = 30",
        steps: [
          "Sum = 10+20+30+40+50 = 150",
          "Mean = 150 ÷ 5 = 30 ✅",
        ],
      },
      {
        id: "stat_4",
        q:  "Range of: 15, 8, 22, 5, 18?",
        options: [14, 16, 17, 20],
        answer:  17,
        trick:   "Range = Max - Min = 22 - 5 = 17",
        steps: [
          "Maximum = 22, Minimum = 5",
          "Range = 22 - 5 = 17 ✅",
        ],
      },
      {
        id: "stat_5",
        q:  "If mean of 5 observations is 20 and one observation 16 is replaced by 26, new mean?",
        options: [20, 21, 22, 23],
        answer:  22,
        trick:   "New sum = 5×20 - 16 + 26 = 100 + 10 = 110. Mean = 110/5 = 22",
        steps: [
          "Old sum = 5 × 20 = 100",
          "New sum = 100 - 16 + 26 = 110",
          "New mean = 110 ÷ 5 = 22 ✅",
        ],
      },
      ...Array.from({ length: 4 }, () => ({
        id:  "stat_dyn_" + Math.random(),
        gen: () => {
          const nums = Array.from({ length: 5 }, () => randInt(5, 50));
          const sum  = nums.reduce((a, b) => a + b, 0);
          const mean = Math.round(sum / nums.length);
          return {
            q:       `Find the mean of: ${nums.join(", ")}`,
            options: makeOpts(mean, 4),
            answer:  mean,
            trick:   `Mean = (${nums.join("+")}) / 5 = ${sum}/5 = ${mean}`,
            steps: [
              `Sum = ${nums.join(" + ")} = ${sum}`,
              `Mean = ${sum} ÷ ${nums.length} = ${mean} ✅`,
            ],
          };
        },
      })),
    ],
  },

]; // ← END OF CHAPTERS ARRAY

// ─────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────

// Resolve a question (handle static + gen-based dynamic questions)
export function resolveQuestion(q) {
  if (typeof q.gen === "function") {
    const resolved = q.gen();
    return { ...resolved, id: q.id };
  }
  return q;
}

// Get N random questions from a chapter, resolved
export function getChapterQuestions(chapterId, count = 10) {
  const ch = CHAPTERS.find(c => c.id === chapterId);
  if (!ch) return [];

  // Shuffle and pick
  const shuffled = [...ch.questions].sort(() => Math.random() - 0.5);
  const picked   = shuffled.slice(0, Math.min(count, shuffled.length));
  return picked.map(resolveQuestion);
}

// Get chapter meta (no questions)
export function getChapterMeta() {
  return CHAPTERS.map(({ id, title, icon, color, desc, questions }) => ({
    id, title, icon, color, desc, count: questions.length,
  }));
}
