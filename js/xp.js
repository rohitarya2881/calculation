// XP / Level System

export function getLevelFromXP(xp){
  // Simple level design:
  // Level 1: 0-199
  // Level 2: 200-499
  // Level 3: 500-899
  // Level 4: 900-1399 ...
  // formula: requiredXP = 200 + (level-1)*100

  let level = 1;
  let totalRequired = 0;

  while(true){
    const need = 200 + (level - 1) * 100;
    if(xp < totalRequired + need) break;
    totalRequired += need;
    level++;
  }

  return { level, totalRequired };
}

export function getProgress(xp){
  const { level, totalRequired } = getLevelFromXP(xp);

  const currentNeed = 200 + (level - 1) * 100;
  const currentXP = xp - totalRequired;

  const percent = Math.min(100, (currentXP / currentNeed) * 100);
  const left = Math.max(0, currentNeed - currentXP);

  return {
    level,
    currentXP,
    currentNeed,
    percent,
    left
  };
}

export function xpForAnswer(isCorrect, level){
  if(!isCorrect) return 0;

  // base XP (difficulty ke hisaab se we can upgrade later)
  // easy: +8, medium: +10, hard: +12
  if(level === "easy") return 8;
  if(level === "medium") return 10;
  return 12;
}
