// ─── js/data/chapters/geometry.js ────────────────────────────────
import { randInt, makeOpts, dyn } from "./_helpers.js";

export default {
  id:    "geometry",
  title: "Geometry & Mensuration",
  icon:  "📐",
  color: "#2dd4bf",
  desc:  "Memorize: Area, Perimeter, Volume formulas. π=22/7 for quick calculations.",

  questions: [
    {
      id: "geo_1",
      q:  "Rectangle: L=12m, B=8m. Area?",
      options: [86, 88, 96, 104],
      answer:  96,
      trick:   "Area = L×B = 12×8 = 96 m²",
      steps:   ["Area = Length × Breadth = 12×8 = 96 m² ✅"],
    },
    {
      id: "geo_2",
      q:  "Square side = 15m. Perimeter?",
      options: [45, 55, 60, 65],
      answer:  60,
      trick:   "P = 4×side = 4×15 = 60m",
      steps:   ["Perimeter = 4×15 = 60 m ✅"],
    },
    {
      id: "geo_3",
      q:  "Circle radius=7m. Circumference? (π=22/7)",
      options: [40, 42, 44, 46],
      answer:  44,
      trick:   "C = 2πr = 2×22/7×7 = 44m",
      steps:   ["C = 2×(22/7)×7 = 2×22 = 44 m ✅"],
    },
    {
      id: "geo_4",
      q:  "Triangle: base=10m, height=8m. Area?",
      options: [35, 40, 45, 80],
      answer:  40,
      trick:   "Area = ½×b×h = ½×10×8 = 40 m²",
      steps:   ["Area = ½×10×8 = 40 m² ✅"],
    },
    {
      id: "geo_5",
      q:  "Cube side=4cm. Volume?",
      options: [48, 56, 60, 64],
      answer:  64,
      trick:   "V = s³ = 4³ = 64 cm³",
      steps:   ["Volume = 4³ = 64 cm³ ✅"],
    },
    {
      id: "geo_6",
      q:  "Side of square increases by 20%. Area increases by?",
      options: ["20%", "36%", "40%", "44%"],
      answer:  "44%",
      trick:   "(1.2)²=1.44 → 44% increase",
      steps: [
        "New side = 1.2s",
        "New area = (1.2s)² = 1.44s²",
        "Increase = 44% ✅",
      ],
    },
    {
      id: "geo_7",
      q:  "Circle radius=7cm. Area? (π=22/7)",
      options: [144, 148, 154, 160],
      answer:  154,
      trick:   "A = πr² = 22/7×49 = 154 cm²",
      steps:   ["Area = πr² = (22/7)×7² = (22/7)×49 = 154 cm² ✅"],
    },
    // ── Dynamic ──────────────────────────────────────────────────
    dyn("geo_d1", () => {
      const l = randInt(4, 20), b = randInt(3, 15);
      const area = l * b;
      return {
        q:       `Rectangle: L=${l}m, B=${b}m. Area?`,
        options: makeOpts(area, Math.round(area * 0.15)),
        answer:  area,
        trick:   `L×B = ${l}×${b} = ${area} m²`,
        steps:   [`Area = ${l}×${b} = ${area} m² ✅`],
      };
    }),
    dyn("geo_d2", () => {
      const s    = randInt(3, 20);
      const perim = 4 * s;
      return {
        q:       `Square side = ${s}m. Perimeter?`,
        options: makeOpts(perim, 8),
        answer:  perim,
        trick:   `4×${s} = ${perim}m`,
        steps:   [`Perimeter = 4×${s} = ${perim} m ✅`],
      };
    }),
  ],
};
