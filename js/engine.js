// ─── engine.js ───────────────────────────────────────────────────
// Question generation engine. No DOM, no state — pure functions.
// Add new modes here without touching any other file.

import { randInt } from "./utils.js";

// ── Level ranges ──────────────────────────────────────────────────

function rangeLv(lv) {
  return lv === "easy" ? { min: 1, max: 50 } : lv === "medium" ? { min: 10, max: 200 } : { min: 50, max: 999 };
}

function digitsLv(lv) {
  return lv === "easy" ? { a: [2, 2], b: [1, 2] }
    : lv === "medium"  ? { a: [2, 3], b: [2, 2] }
    :                    { a: [3, 4], b: [2, 3] };
}

function nDigit(mn, mx) {
  const d = randInt(mn, mx);
  return randInt(Math.pow(10, d - 1), Math.pow(10, d) - 1);
}

// ── MCQ option builder ────────────────────────────────────────────

export function makeMcqOptions(correct) {
  const opts = new Set([correct]);
  let tries = 0;
  const spread = Math.max(5, Math.abs(Math.round(correct * 0.25)) || 10);
  while (opts.size < 4 && tries < 80) {
    const off  = randInt(1, spread);
    const sign = Math.random() < 0.5 ? 1 : -1;
    const v    = correct + sign * off;
    if (v !== correct && v >= 0) opts.add(v);
    tries++;
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

// ── Mode generators ───────────────────────────────────────────────

function genAddition(lv) {
  const count = lv === "easy" ? randInt(3, 4) : randInt(4, 5);
  const r     = rangeLv(lv);
  const nums  = Array.from({ length: count }, () => randInt(r.min, r.max));
  return { text: nums.join(" + ") + " = ?", answer: nums.reduce((a, b) => a + b, 0) };
}

function genSubtraction(lv) {
  const count = lv === "easy" ? 2 : randInt(2, 3);
  const r     = rangeLv(lv);
  let nums    = Array.from({ length: count }, () => randInt(r.min, r.max));
  nums.sort((a, b) => b - a);
  return { text: nums.join(" − ") + " = ?", answer: nums.reduce((a, b) => a - b) };
}

function genMultiplication(lv) {
  const d = digitsLv(lv);
  const a = nDigit(d.a[0], d.a[1]), b = nDigit(d.b[0], d.b[1]);
  return { text: `${a} × ${b} = ?`, answer: a * b };
}

function genDivision(lv) {
  const dv = lv === "easy" ? randInt(2, 12) : lv === "medium" ? randInt(2, 25) : randInt(2, 50);
  const qt = lv === "easy" ? randInt(2, 15) : lv === "medium" ? randInt(2, 30) : randInt(5, 50);
  return { text: `${dv * qt} ÷ ${dv} = ?`, answer: qt };
}

function genTable(cfg) {
  const tn   = Number(cfg?.number || 11);
  const from = Number(cfg?.from || 1);
  const to   = Number(cfg?.to || 20);
  const k    = randInt(Math.min(from, to), Math.max(from, to));
  return { text: `${tn} × ${k} = ?`, answer: tn * k };
}

function genSquare(cfg) {
  const from = Number(cfg?.powerFrom || 1);
  const to   = Number(cfg?.powerTo || 30);
  const n    = randInt(Math.min(from, to), Math.max(from, to));
  return { text: `${n}² = ?`, answer: n * n };
}

function genCube(cfg) {
  const from = Number(cfg?.powerFrom || 1);
  const to   = Number(cfg?.powerTo || 20);
  const n    = randInt(Math.min(from, to), Math.max(from, to));
  return { text: `${n}³ = ?`, answer: n * n * n };
}

function genPercentage(lv) {
  const types = ["ofWhat", "whatOf", "increase", "decrease"];
  const t     = types[randInt(0, 3)];
  if (t === "ofWhat") {
    const pct  = lv === "easy" ? [10, 20, 25, 50][randInt(0, 3)] : randInt(5, 75);
    const base = lv === "easy" ? randInt(2, 20) * 10 : randInt(10, 200);
    return { text: `${pct}% of ${base} = ?`, answer: Math.round(pct * base / 100) };
  }
  if (t === "whatOf") {
    const part  = randInt(5, 50);
    const whole = part * randInt(2, 10);
    return { text: `${part} is what % of ${whole}?`, answer: Math.round(part / whole * 100) };
  }
  const base = lv === "easy" ? randInt(2, 20) * 10 : randInt(50, 500);
  const pct2 = lv === "easy" ? [10, 20, 25][randInt(0, 2)] : randInt(5, 50);
  if (t === "increase") return { text: `${base} increased by ${pct2}% = ?`, answer: Math.round(base * (1 + pct2 / 100)) };
  return { text: `${base} decreased by ${pct2}% = ?`, answer: Math.round(base * (1 - pct2 / 100)) };
}

function genSimplification(lv) {
  const a = randInt(10, 99), b = randInt(10, 99), c = randInt(2, 20), d = randInt(2, 20);
  return { text: `${a} + ${b} × ${c} − ${d} = ?`, answer: a + b * c - d };
}

// ── Public API ────────────────────────────────────────────────────

const MIXED_POOL = ["addition", "subtraction", "multiplication", "division", "percentage", "simplification"];

export function generateQuestion(mode, level, cfg = {}) {
  const actualMode = mode === "mixed" ? MIXED_POOL[randInt(0, MIXED_POOL.length - 1)] : mode;

  let q;
  switch (actualMode) {
    case "addition":        q = genAddition(level);        break;
    case "subtraction":     q = genSubtraction(level);     break;
    case "multiplication":  q = genMultiplication(level);  break;
    case "division":        q = genDivision(level);        break;
    case "table":           q = genTable(cfg);             break;
    case "square":          q = genSquare(cfg);            break;
    case "cube":            q = genCube(cfg);              break;
    case "percentage":      q = genPercentage(level);      break;
    case "simplification":  q = genSimplification(level);  break;
    default:                q = { text: "—", answer: 0 };
  }
  return { ...q, actualMode };
}

// Diagnostic question set — 20 Qs covering all topics + levels
export function buildDiagnosticSet() {
  const plan = [
    { mode: "addition",       level: "medium" },
    { mode: "subtraction",    level: "medium" },
    { mode: "multiplication", level: "medium" },
    { mode: "division",       level: "medium" },
    { mode: "percentage",     level: "easy"   },
    { mode: "percentage",     level: "medium" },
    { mode: "simplification", level: "easy"   },
    { mode: "simplification", level: "medium" },
    { mode: "table",          level: "easy"   },
    { mode: "table",          level: "medium" },
    { mode: "square",         level: "easy"   },
    { mode: "cube",           level: "easy"   },
    { mode: "addition",       level: "hard"   },
    { mode: "multiplication", level: "hard"   },
    { mode: "division",       level: "hard"   },
    { mode: "percentage",     level: "hard"   },
    { mode: "simplification", level: "hard"   },
    { mode: "mixed",          level: "medium" },
    { mode: "mixed",          level: "medium" },
    { mode: "mixed",          level: "hard"   },
  ];
  return plan.map(p => ({ ...generateQuestion(p.mode, p.level), topic: p.mode, lv: p.level }));
}
