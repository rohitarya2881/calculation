export function getComboMultiplier(combo){
  // combo = consecutive correct answers
  // 0-2 => 1x
  // 3-4 => 1.2x
  // 5-9 => 1.5x
  // 10+ => 2x
  if(combo >= 10) return 2.0;
  if(combo >= 5) return 1.5;
  if(combo >= 3) return 1.2;
  return 1.0;
}

export function comboProgressPercent(combo){
  // UI bar will fill up till 10
  // 0..10 -> 0..100%
  const capped = Math.min(10, combo);
  return (capped / 10) * 100;
}

export function comboMessage(combo){
  const mult = getComboMultiplier(combo);

  if(combo === 0) return "Get 3 correct in a row to boost XP!";
  if(combo < 3) return `Nice! ${3 - combo} more for XP boost 🚀`;
  if(mult === 1.2) return "🔥 Combo active! XP x1.2";
  if(mult === 1.5) return "🚀 Super Combo! XP x1.5";
  return "👑 GOD MODE! XP x2.0";
}
