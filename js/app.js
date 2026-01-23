import { updateModeStreak } from "./storage.js";

import { generateQuestion } from "./quizEngine.js";
import { loadData, saveData, updateStreak, clearAllData } from "./storage.js";
import {
  renderRecords,
  toggleTableSettings,
  setMessage,
  renderXP,
  renderCombo,
} from "./ui.js";
import { xpForAnswer, getProgress } from "./xp.js";
import { getComboMultiplier } from "./combo.js";
import { renderDaily } from "./ui.js";
import {
  getOrCreateDailyChallenge,
  markDailyCompleted,
  isDailyCompleted,
} from "./dailyChallenge.js";

const ui = {
  modeSelect: document.getElementById("modeSelect"),
  levelSelect: document.getElementById("levelSelect"),
  minutesInput: document.getElementById("minutesInput"),

  tableSettings: document.getElementById("tableSettings"),
  tableNumber: document.getElementById("tableNumber"),
  tableFrom: document.getElementById("tableFrom"),
  tableTo: document.getElementById("tableTo"),

  startBtn: document.getElementById("startBtn"),
  stopBtn: document.getElementById("stopBtn"),
  submitBtn: document.getElementById("submitBtn"),
  skipBtn: document.getElementById("skipBtn"),

  answerInput: document.getElementById("answerInput"),
  questionText: document.getElementById("questionText"),
  message: document.getElementById("message"),

  timeLeft: document.getElementById("timeLeft"),
  score: document.getElementById("score"),
  wrong: document.getElementById("wrong"),

  streakCount: document.getElementById("streakCount"),
  addStats: document.getElementById("addStats"),
  subStats: document.getElementById("subStats"),
  mulStats: document.getElementById("mulStats"),
  divStats: document.getElementById("divStats"),
  tableStats: document.getElementById("tableStats"),
  streakMsg: document.getElementById("streakMsg"),

  clearDataBtn: document.getElementById("clearDataBtn"),

  // XP UI
  levelText: document.getElementById("levelText"),
  xpText: document.getElementById("xpText"),
  xpFill: document.getElementById("xpFill"),
  xpHint: document.getElementById("xpHint"),

  // Combo UI
  comboCount: document.getElementById("comboCount"),
  comboFill: document.getElementById("comboFill"),
  comboHint: document.getElementById("comboHint"),
  dailyStatus: document.getElementById("dailyStatus"),
  dailyText: document.getElementById("dailyText"),
  startDailyBtn: document.getElementById("startDailyBtn"),
  dailyHint: document.getElementById("dailyHint"),
  powerSettings: document.getElementById("powerSettings"),
  powerFrom: document.getElementById("powerFrom"),
  powerTo: document.getElementById("powerTo"),
  squareStats: document.getElementById("squareStats"),
  cubeStats: document.getElementById("cubeStats"),
};

let timer = null;
let secondsLeft = 0;
let running = false;

let currentAnswer = 0;
let currentActualMode = "addition";

let score = 0;
let wrong = 0;
let attempted = 0;
let sessionMinutes = 5;

let combo = 0;

function pad(n) {
  return n.toString().padStart(2, "0");
}

function updateTimeUI() {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  ui.timeLeft.textContent = `${pad(m)}:${pad(s)}`;
}

function setRunningState(isRunning) {
  running = isRunning;
  ui.answerInput.disabled = !isRunning;
  ui.submitBtn.disabled = !isRunning;
  ui.skipBtn.disabled = !isRunning;
}

function newQuestion() {
  const tableConfig = {
    number: ui.tableNumber.value,
    from: ui.tableFrom.value,
    to: ui.tableTo.value,

    powerFrom: ui.powerFrom.value,
    powerTo: ui.powerTo.value,
  };

  const q = generateQuestion(
    ui.modeSelect.value,
    ui.levelSelect.value,
    tableConfig,
  );

  ui.questionText.textContent = q.text;
  currentAnswer = q.answer;
  currentActualMode = q.actualMode;

  ui.answerInput.value = "";
  ui.answerInput.focus();
  setMessage(ui.message, "");
}

function startQuiz() {
  if (running) return;

  score = 0;
  wrong = 0;
  attempted = 0;
  ui.score.textContent = score;
  ui.wrong.textContent = wrong;

  combo = 0;
  renderCombo(ui, combo);

  sessionMinutes = Number(ui.minutesInput.value || 5);
  secondsLeft = sessionMinutes * 60;
  updateTimeUI();

  setRunningState(true);
  newQuestion();

  timer = setInterval(() => {
    secondsLeft--;
    updateTimeUI();

    if (secondsLeft <= 0) {
      stopQuiz(true);
    }
  }, 1000);
}
function stopQuiz(auto = false) {
  if (!running) return;

  clearInterval(timer);
  timer = null;
  setRunningState(false);

  // save record
  const total = score + wrong;
  const accuracy = total > 0 ? (score / total) * 100 : 0;
  const speed = sessionMinutes > 0 ? attempted / sessionMinutes : 0;

  // ✅ SINGLE data object only
  const data = loadData();

  // ✅ Daily Challenge completion check
  const ch = getOrCreateDailyChallenge(data);
  const todayDone = isDailyCompleted(data);

  if (!todayDone) {
    const modeMatch = ui.modeSelect.value === ch.mode;
    const levelMatch = ui.levelSelect.value === ch.level;
    const minMatch = sessionMinutes === ch.minutes;

    if (modeMatch && levelMatch && minMatch) {
      markDailyCompleted(data);

      data.xp = (data.xp || 0) + ch.bonusXP;
      const prog2 = getProgress(data.xp);
      data.level = prog2.level;

      renderXP(ui);
      renderDaily(ui);

      setMessage(
        ui.message,
        `🎉 Daily Challenge Completed! +${ch.bonusXP} XP Bonus 🔥`,
        "green"
      );
    }
  }

  // where to store session record
  const bucket = ui.modeSelect.value === "mixed" ? "mixed" : currentActualMode;
  if (!data[bucket]) data[bucket] = { sessions: [] };

  data[bucket].sessions.push({
    date: new Date().toISOString(),
    mode: ui.modeSelect.value,
    level: ui.levelSelect.value,
    minutes: sessionMinutes,
    score,
    wrong,
    attempted,
    accuracy,
    speed,
  });

  if (data[bucket].sessions.length > 100) data[bucket].sessions.shift();

  // ✅ Mode streak update
  updateModeStreak(data, bucket);

  // ✅ Global streak update
  updateStreak(data);

  // ✅ Save everything once
  saveData(data);

  renderRecords(ui);
  renderXP(ui);

  combo = 0;
  renderCombo(ui, combo);

  if (auto) {
    ui.questionText.textContent = "✅ Time Over! Great job!";
    setMessage(
      ui.message,
      `Final Score: ${score} | Wrong: ${wrong} | Speed: ${speed.toFixed(
        2
      )} Q/min`,
      "green"
    );
  } else {
    setMessage(ui.message, "✅ Session Saved!", "green");
  }
}










function submitAnswer() {
  if (!running) return;

  const val = ui.answerInput.value.trim();
  if (val === "") {
    setMessage(ui.message, "⚠️ Answer likho bhai!", "red");
    return;
  }

  attempted++;
  const num = Number(val);

  if (num === currentAnswer) {
    score++;
    ui.score.textContent = score;

    combo++;
    renderCombo(ui, combo);

    // XP gain with combo multiplier
    const mult = getComboMultiplier(combo);
    const gained = Math.floor(xpForAnswer(true, ui.levelSelect.value) * mult);

    const data = loadData();
    data.xp = (data.xp || 0) + gained;

    const prog = getProgress(data.xp);
    data.level = prog.level;

    saveData(data);
    renderXP(ui);

    setMessage(ui.message, `✅ Correct! +${gained} XP`, "green");
    setTimeout(newQuestion, 250);
  } else {
    wrong++;
    ui.wrong.textContent = wrong;

    combo = 0;
    renderCombo(ui, combo);

    setMessage(ui.message, `❌ Wrong! Correct: ${currentAnswer}`, "red");
    setTimeout(newQuestion, 450);
  }
}

function skipQuestion() {
  if (!running) return;
  setMessage(ui.message, "⏭️ Skipped!", "red");
  setTimeout(newQuestion, 200);
}

// Events
ui.modeSelect.addEventListener("change", () => {
  toggleTableSettings(ui.modeSelect.value, ui.tableSettings, ui.powerSettings);
});
ui.startDailyBtn.addEventListener("click", () => {
  const data = loadData();
  const ch = getOrCreateDailyChallenge(data);

  // Apply challenge settings to UI automatically
  ui.modeSelect.value = ch.mode;
  ui.levelSelect.value = ch.level;
  ui.minutesInput.value = ch.minutes;

  toggleTableSettings(ui.modeSelect.value, ui.tableSettings, ui.powerSettings);

  setMessage(
    ui.message,
    "📅 Daily Challenge Started! Best of luck 🔥",
    "green",
  );

  renderDaily(ui);
});

ui.startBtn.addEventListener("click", startQuiz);
ui.stopBtn.addEventListener("click", () => stopQuiz(false));
ui.submitBtn.addEventListener("click", submitAnswer);
ui.skipBtn.addEventListener("click", skipQuestion);

ui.answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAnswer();
});

ui.clearDataBtn.addEventListener("click", () => {
  const ok = confirm("Sure bhai? Saara record reset ho jayega!");
  if (!ok) return;

  clearAllData();
  renderRecords(ui);
  renderXP(ui);
  combo = 0;
  renderCombo(ui, combo);

  alert("✅ Cleared!");
});

// Init
toggleTableSettings(ui.modeSelect.value, ui.tableSettings, ui.powerSettings);
renderRecords(ui);
renderXP(ui);
renderCombo(ui, 0);
renderDaily(ui);
