// ─── xp.js ───────────────────────────────────────────────────────
// XP / Level system + Combo multiplier

// ── Level formula ─────────────────────────────────────────────────
// Level 1: 0–199 XP
// Level 2: 200–499 XP
// Level N: needs 200 + (N-1)×100 XP

export function getLevelFromXP(xp) {
  let level = 1, totalRequired = 0;
  while (true) {
    const need = 200 + (level - 1) * 100;
    if (xp < totalRequired + need) break;
    totalRequired += need;
    level++;
  }
  return { level, totalRequired };
}

export function getProgress(xp) {
  const { level, totalRequired } = getLevelFromXP(xp);
  const currentNeed = 200 + (level - 1) * 100;
  const currentXP   = xp - totalRequired;
  return {
    level,
    currentXP,
    currentNeed,
    pct:  Math.min(100, (currentXP / currentNeed) * 100),
    left: Math.max(0, currentNeed - currentXP),
  };
}

// Base XP per correct answer by difficulty
export function xpForAnswer(level) {
  return level === "easy" ? 8 : level === "medium" ? 10 : 12;
}

// ── Combo system ──────────────────────────────────────────────────

export function comboMultiplier(combo) {
  if (combo >= 10) return 2.0;
  if (combo >= 5)  return 1.5;
  if (combo >= 3)  return 1.2;
  return 1.0;
}

export function comboPct(combo) {
  return (Math.min(10, combo) / 10) * 100;
}

export function comboMessage(combo) {
  const m = comboMultiplier(combo);
  if (combo === 0) return "Get 3 correct in a row to boost XP!";
  if (combo < 3)   return `${3 - combo} more for XP boost 🚀`;
  if (m === 1.2)   return "🔥 Combo active! XP ×1.2";
  if (m === 1.5)   return "🚀 Super Combo! XP ×1.5";
  return "👑 GOD MODE! XP ×2.0";
}

// Gain XP — mutates data, returns amount gained
export function gainXP(data, isCorrect, level, combo) {
  if (!isCorrect) return 0;
  const gained = Math.floor(xpForAnswer(level) * comboMultiplier(combo));
  data.xp     = (data.xp || 0) + gained;
  data.level  = getLevelFromXP(data.xp).level;
  return gained;
}
