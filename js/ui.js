import { loadData, saveData } from "./storage.js";
import { calcSummary, formatSummary } from "./stats.js";
import { getProgress } from "./xp.js";
import { comboProgressPercent, comboMessage, getComboMultiplier } from "./combo.js";
import { getOrCreateDailyChallenge, isDailyCompleted } from "./dailyChallenge.js";

// message helper
export function setMessage(el, text, type=""){
  el.textContent = text;
  el.style.color = type === "green" ? "#16a34a" : type === "red" ? "#dc2626" : "#111";
}

// table settings show/hide
export function toggleTableSettings(mode, tableSettingsEl, powerSettingsEl){
  // table settings
  if(mode === "table") tableSettingsEl.classList.remove("hidden");
  else tableSettingsEl.classList.add("hidden");

  // square/cube settings
  if(mode === "square" || mode === "cube") powerSettingsEl.classList.remove("hidden");
  else powerSettingsEl.classList.add("hidden");
}


// Records render
export function renderRecords(ui){
  const data = loadData();

  ui.streakCount.textContent = data.streak || 0;

  const getModeStreak = (mode) => data.modeStreaks?.[mode]?.streak || 0;

  const addSummary = formatSummary(calcSummary(data.addition.sessions));
  ui.addStats.innerHTML = `${addSummary}<br/><b>🔥 Streak:</b> ${getModeStreak("addition")} days`;

  const subSummary = formatSummary(calcSummary(data.subtraction.sessions));
  ui.subStats.innerHTML = `${subSummary}<br/><b>🔥 Streak:</b> ${getModeStreak("subtraction")} days`;

  const mulSummary = formatSummary(calcSummary(data.multiplication.sessions));
  ui.mulStats.innerHTML = `${mulSummary}<br/><b>🔥 Streak:</b> ${getModeStreak("multiplication")} days`;

  const divSummary = formatSummary(calcSummary(data.division.sessions));
  ui.divStats.innerHTML = `${divSummary}<br/><b>🔥 Streak:</b> ${getModeStreak("division")} days`;

  const tableSummary = formatSummary(calcSummary(data.table.sessions));
  ui.tableStats.innerHTML = `${tableSummary}<br/><b>🔥 Streak:</b> ${getModeStreak("table")} days`;
const squareSummary = formatSummary(calcSummary(data.square.sessions));
ui.squareStats.innerHTML = `${squareSummary}<br/><b>🔥 Streak:</b> ${getModeStreak("square")} days`;

const cubeSummary = formatSummary(calcSummary(data.cube.sessions));
ui.cubeStats.innerHTML = `${cubeSummary}<br/><b>🔥 Streak:</b> ${getModeStreak("cube")} days`;

  const st = data.streak || 0;
  if(st === 0) ui.streakMsg.textContent = "Start today bhai 💪 Streak bana!";
  else if(st < 3) ui.streakMsg.textContent = `${st} days streak ✅ good going!`;
  else if(st < 7) ui.streakMsg.textContent = `🔥 ${st} days continuous! mast consistency!`;
  else if(st < 15) ui.streakMsg.textContent = `🚀 Legend mode ON! ${st} days streak!`;
  else ui.streakMsg.textContent = `👑 Roxana comment: Yaar tum itne din se lagatar kar rahe ho… mast! 😍🔥`;
}


// XP render
export function renderXP(ui){
  const data = loadData();
  const xp = data.xp || 0;

  const prog = getProgress(xp);

  ui.levelText.textContent = prog.level;
  ui.xpText.textContent = xp;

  ui.xpFill.style.width = `${prog.percent.toFixed(0)}%`;
  ui.xpHint.textContent = `Next Level in ${prog.left} XP`;
}

// Combo render
export function renderCombo(ui, combo){
  ui.comboCount.textContent = combo;

  const percent = comboProgressPercent(combo);
  ui.comboFill.style.width = `${percent.toFixed(0)}%`;

  const mult = getComboMultiplier(combo);
  ui.comboHint.textContent = `${comboMessage(combo)} (Multiplier: x${mult})`;
}

// Daily render
export function renderDaily(ui){
  const data = loadData();

  // create daily if not exists
  const ch = getOrCreateDailyChallenge(data);
  saveData(data);

  ui.dailyText.textContent =
    `Mode: ${ch.mode.toUpperCase()} | Level: ${ch.level.toUpperCase()} | ${ch.minutes} min | Bonus: +${ch.bonusXP} XP`;

  const done = isDailyCompleted(data);

  if(done){
    ui.dailyStatus.textContent = "✅ Done";
    ui.startDailyBtn.disabled = true;
    ui.dailyHint.textContent = "Aaj ka challenge complete ✅ kal naya aayega 😄";
  } else {
    ui.dailyStatus.textContent = "Not Done";
    ui.startDailyBtn.disabled = false;
    ui.dailyHint.textContent = "Complete it to get bonus XP 🔥";
  }
}
