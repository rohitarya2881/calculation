// ─── js/data/chapters/mixture-alligation.js ──────────────────────
import { randInt, makeOpts, dyn } from "./_helpers.js";

export default {
  id:    "mixture",
  title: "Mixture & Alligation",
  icon:  "🧪",
  color: "#f87171",
  desc:  "Alligation: (Dearer−Mean):(Mean−Cheaper) = ratio of cheaper:dearer.",

  questions: [
    {
      id: "mix_1",
      q:  "Milk Rs16/L and water Rs0 mixed to get Rs10/L. Milk:Water ratio?",
      options: ["5:3", "10:6", "3:5", "2:3"],
      answer:  "10:6",
      trick:   "Milk−Mean=6, Mean−Water=10 → Milk:Water = 10:6",
      steps: [
        "Dearer(Milk)=16, Mean=10, Cheaper(Water)=0",
        "Milk part = Mean−Cheaper = 10−0 = 10",
        "Water part = Dearer−Mean = 16−10 = 6",
        "Milk:Water = 10:6 ✅",
      ],
    },
    {
      id: "mix_2",
      q:  "20L, milk:water=3:1. Add 5L water. New ratio?",
      options: ["2:1", "3:2", "5:3", "4:3"],
      answer:  "3:2",
      trick:   "Milk=15, water=5. Add 5 → 15:10 = 3:2",
      steps: ["Milk=15L, Water=5L", "Add 5L water → 15:10 = 3:2 ✅"],
    },
    {
      id: "mix_3",
      q:  "In what ratio should Rs6/kg and Rs9/kg rice be mixed for avg Rs7/kg?",
      options: ["2:1", "1:2", "2:3", "3:2"],
      answer:  "2:1",
      trick:   "(9−7):(7−6) = 2:1 → cheaper:dearer = 2:1",
      steps: [
        "Dearer−Mean = 9−7 = 2",
        "Mean−Cheaper = 7−6 = 1",
        "Cheaper:Dearer = 2:1 ✅",
      ],
    },
    {
      id: "mix_4",
      q:  "Two alloys: 30% gold and 70% gold, mixed 2:3. Gold % in mixture?",
      options: [50, 52, 54, 56],
      answer:  54,
      trick:   "(2×30+3×70)/5 = (60+210)/5 = 54%",
      steps: [
        "Gold = 2×30% + 3×70% = 60+210 = 270",
        "Total parts = 5",
        "Gold% = 270/5 = 54% ✅",
      ],
    },
    {
      id: "mix_5",
      q:  "A vessel has 40L of 80% alcohol. Add water to make 60%. Water added?",
      options: [12, 13, 14, 15],
      answer:  13,
      trick:   "Alcohol=32L. 32/(40+x)=0.6 → x≈13L",
      steps: [
        "Alcohol = 80% of 40 = 32L",
        "32/(40+x) = 0.6 → 40+x = 53.3",
        "x ≈ 13L ✅",
      ],
    },
  ],
};
