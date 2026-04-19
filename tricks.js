// ─── tricks.js ───────────────────────────────────────────────────
// Shortcut library data. Add new categories / tricks here freely.
// Each trick: { title, formula, example, tag }

export const TRICKS = {
  multiplication: [
    {
      title:   "Multiply by 11",
      formula: "AB × 11 = A (A+B) B",
      example: "35 × 11 → 3, (3+5)=8, 5 → 385\n63 × 11 → 6, (6+3)=9, 3 → 693\nIf middle digit > 9, carry over: 75×11 → 7, 12, 5 → 825",
      tag:     "Vedic Math",
    },
    {
      title:   "Multiply near 100",
      formula: "(100−a)(100−b) = 10000 − (a+b)×100 + ab",
      example: "97 × 96: diffs = 3, 4\n→ (97−4)|(3×4) = 93|12 = 9312\n98 × 95: → 93|10 = 9310",
      tag:     "Base Method",
    },
    {
      title:   "Square ending in 5",
      formula: "(n5)² = n×(n+1) followed by 25",
      example: "65² = 6×7 | 25 = 4225\n85² = 8×9 | 25 = 7225\n105² = 10×11 | 25 = 11025",
      tag:     "Speed Trick",
    },
    {
      title:   "Multiply by 9",
      formula: "n × 9 = n×10 − n",
      example: "47 × 9 = 470 − 47 = 423\n128 × 9 = 1280 − 128 = 1152",
      tag:     "Simple",
    },
    {
      title:   "Multiply by 5",
      formula: "n × 5 = n ÷ 2 × 10",
      example: "84 × 5 = 42 × 10 = 420\n136 × 5 = 68 × 10 = 680",
      tag:     "Simple",
    },
  ],

  percentage: [
    {
      title:   "x% of y = y% of x",
      formula: "x% of y ≡ y% of x  (always!)",
      example: "8% of 75 = 75% of 8 = 6  (much easier!)\n4% of 125 = 125% of 4 = 5",
      tag:     "Gold Trick",
    },
    {
      title:   "Successive percentage change",
      formula: "Net = a + b + (a×b)/100 %",
      example: "10% then 20% rise = 10+20+(200/100) = 32%\nNot 30% — SSC traps students with this!",
      tag:     "Exam Trap",
    },
    {
      title:   "Percentage increase / decrease",
      formula: "New = Old × (1 ± r/100)",
      example: "500 + 20% = 500 × 1.2 = 600\n800 − 25% = 800 × 0.75 = 600",
      tag:     "Formula",
    },
    {
      title:   "Find original before % change",
      formula: "Original = Final ÷ (1 ± r/100)",
      example: "After 20% rise final = 720 → original = 720÷1.2 = 600\nAfter 25% fall final = 600 → original = 600÷0.75 = 800",
      tag:     "Reverse Calc",
    },
  ],

  division: [
    { title: "Divisibility by 3",  formula: "Sum of digits divisible by 3",         example: "123 → 1+2+3=6 ✓\n457 → 4+5+7=16 ✗", tag: "Rule" },
    { title: "Divisibility by 9",  formula: "Sum of digits divisible by 9",         example: "729 → 7+2+9=18 ✓\n654 → 6+5+4=15 ✗", tag: "Rule" },
    { title: "Divisibility by 11", formula: "Alternating digit sum diff divisible by 11", example: "121 → (1+1)−2=0 ✓\n1364 → (1+6)−(3+4)=0 ✓", tag: "Rule" },
    { title: "Divisibility by 7",  formula: "Double last digit, subtract from rest",example: "203 → 20−(3×2)=14 ✓\n175 → 17−10=7 ✓",  tag: "Rule" },
    {
      title:   "Quick division by 5",
      formula: "n ÷ 5 = n × 2 ÷ 10",
      example: "345 ÷ 5 = 690 ÷ 10 = 69\n1235 ÷ 5 = 2470 ÷ 10 = 247",
      tag:     "Speed Trick",
    },
  ],

  squares: [
    {
      title:   "Squares 1–30 — must memorize",
      formula: "Pattern: n² grows by odd numbers",
      example: "1,4,9,16,25,36,49,64,81,100\n121,144,169,196,225,256,289,324,361,400\n441,484,529,576,625,676,729,784,841,900",
      tag:     "Must Memorize",
    },
    {
      title:   "(a+b)² and (a−b)²",
      formula: "(a±b)² = a² ± 2ab + b²",
      example: "102² = (100+2)² = 10000+400+4 = 10404\n98² = (100−2)² = 10000−400+4 = 9604",
      tag:     "Algebraic",
    },
    {
      title:   "Difference of squares",
      formula: "a² − b² = (a+b)(a−b)",
      example: "83²−17² = (100)(66) = 6600\n51²−49² = (100)(2) = 200\nSSC loves this pattern!",
      tag:     "Exam Trick",
    },
  ],

  simplification: [
    {
      title:   "BODMAS — strict order",
      formula: "Brackets → Orders → Division → Multiplication → Addition → Subtraction",
      example: "6 + 2×3 − 4÷2 = 6+6−2 = 10\n5 + (3×4) − 8÷2 = 5+12−4 = 13",
      tag:     "Fundamental",
    },
    {
      title:   "Approximation technique",
      formula: "Round smart, then adjust",
      example: "497 × 21 ≈ 500×21 − 3×21 = 10500−63 = 10437\nUse when MCQ options differ by 100+",
      tag:     "SSC Trick",
    },
    {
      title:   "LCM shortcut for fractions",
      formula: "a/b + c/d = (ad + bc) / bd",
      example: "1/3 + 1/4 → (4+3)/12 = 7/12\n1/3 + 1/4 + 1/6 → LCM=12 → 4+3+2=9 → 9/12=3/4",
      tag:     "Formula",
    },
  ],

  miscellaneous: [
    {
      title:   "Average — change shortcut",
      formula: "New avg = old avg + (new value − old avg) / new count",
      example: "5 numbers avg=10, add 15:\nnew avg = 10 + (15−10)/6 = 10.83",
      tag:     "Concept",
    },
    {
      title:   "Ratio direct calculation",
      formula: "If a:b = m:n, total=T → a = T×m/(m+n)",
      example: "Ratio 3:5, total=40 → a = 40×3/8 = 15, b=25",
      tag:     "Exam Trick",
    },
    {
      title:   "Speed · Distance · Time",
      formula: "S = D/T   D = S×T   T = D/S",
      example: "60 km/h × 2.5 h = 150 km\n90 km ÷ 45 km/h = 2 hours",
      tag:     "Formula",
    },
    {
      title:   "Compound Interest shortcut",
      formula: "CI ≈ SI + SI²/(2×P) for 2 years",
      example: "P=1000, R=10%, 2yr SI=200\nCI = 200 + 200²/(2×1000) = 200+20 = 220",
      tag:     "Banking",
    },
  ],
};

export function trickOfDay() {
  const all  = Object.values(TRICKS).flat();
  const d    = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return all[seed % all.length];
}
