// ─── app.js ──────────────────────────────────────────────────────
// Main entry point. Imports all modules, wires events, boots app.
// Each tab's quiz logic is self-contained below.

import { pad, formatTime } from "./utils.js";
import { loadData, saveData, clearAllData, updateStreak, updateModeStreak, pushSession, recordWrong } from "./storage.js";
import { getOrCreateDaily, isDailyDone, markDailyDone } from "./daily.js";
import { generateQuestion, buildDiagnosticSet, makeMcqOptions } from "./engine.js";
import { gainXP, comboMultiplier } from "./xp.js";
import { checkAll, awardOne } from "./badges.js";
import { TRICKS, trickOfDay } from "./tricks.js";
import {
  setMsg, setText, renderXP, renderCombo, renderDailyAll,
  renderRecords, renderHeatmap, renderBadges, renderTarget,
  buildMcqGrid, renderSpeedHistory, renderMockHistory,
  renderWrongHistory, renderTricksList, renderTrickOfDay, renderPrevDiag,
} from "./ui.js";

const $ = id => document.getElementById(id);

// ── Tab router ────────────────────────────────────────────────────

export function switchTab(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const tab  = document.querySelector(`[data-page="${name}"]`);
  const page = $(`page-${name}`);
  if (tab)  tab.classList.add("active");
  if (page) page.classList.add("active");
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => switchTab(tab.dataset.page));
});

// ── Shared helpers ────────────────────────────────────────────────

function refreshAll() {
  const data = loadData();
  renderXP(data);
  renderRecords(data);
  renderHeatmap(data, mode => { $("modeSelect").value = mode; switchTab("practice"); });
  renderBadges(data);
  renderTarget(data);
  renderSpeedHistory(data);
  renderMockHistory(data);
  renderWrongHistory(data);
  renderPrevDiag(data);
  const ch   = getOrCreateDaily(data);
  const done = isDailyDone(data);
  saveData(data);
  renderDailyAll(data, ch, done);
}

function applyDailyChallenge() {
  const data = loadData();
  const ch   = getOrCreateDaily(data);
  $("modeSelect").value       = ch.mode;
  $("levelSelect").value      = ch.level;
  $("minutesInput").value     = ch.minutes;
  toggleExtraSettings();
  switchTab("practice");
}

function toggleExtraSettings() {
  const m = $("modeSelect").value;
  $("tableSettings").classList.toggle("show", m === "table");
  $("powerSettings").classList.toggle("show",  m === "square" || m === "cube");
}

// ── Section switcher (practice tab) ──────────────────────────────

function showPracticeSection(name) {
  ["setup", "quiz", "result"].forEach(s => {
    $(`practice${s.charAt(0).toUpperCase() + s.slice(1)}`).style.display = s === name ? "block" : "none";
  });
}

// ═══════════════════════════════════════════════════════════════════
//  PRACTICE QUIZ
// ═══════════════════════════════════════════════════════════════════

let pTimer = null, pSecs = 0, pRunning = false;
let pAnswer = 0, pActualMode = "addition", pScore = 0, pWrong = 0, pAttempted = 0, pMinutes = 5, pCombo = 0;

function pCfg() {
  return { number: $("tableNumber")?.value, from: $("tableFrom")?.value, to: $("tableTo")?.value, powerFrom: $("powerFrom")?.value, powerTo: $("powerTo")?.value };
}

function pNewQ() {
  if (!pRunning) return;
  const q = generateQuestion($("modeSelect").value, $("levelSelect").value, pCfg());
  $("questionText").textContent = q.text;
  pAnswer = q.answer; pActualMode = q.actualMode;
  setMsg("pMsg", "");
  if ($("answerModeSelect").value === "fill") {
    $("pFillMode").style.display = "block"; $("pMcqMode").style.display = "none";
    $("answerInput").value = "";
    setTimeout(() => $("answerInput").focus(), 50);
  } else {
    $("pFillMode").style.display = "none"; $("pMcqMode").style.display = "block";
    buildMcqGrid("pMcqGrid", q.answer, makeMcqOptions, (correct, chosen, ans) => {
      pAttempted++;
      if (correct) {
        pScore++; setText("scoreVal", pScore); pCombo++;
        renderCombo(pCombo);
        const data = loadData(); gainXP(data, true, $("levelSelect").value, pCombo);
        checkAll(data); saveData(data); renderXP(data);
        setMsg("pMsg", "✅ Correct!", "g"); setTimeout(pNewQ, 650);
      } else {
        pWrong++; setText("wrongVal", pWrong); pCombo = 0; renderCombo(0);
        const data = loadData(); recordWrong(data, { mode: pActualMode, question: q.text, correct: q.answer, given: ans }); saveData(data);
        setMsg("pMsg", "❌ Ans: " + ans, "r"); setTimeout(pNewQ, 950);
      }
    });
  }
}

function pSubmitFill() {
  if (!pRunning) return;
  const val = $("answerInput").value.trim();
  if (!val) { setMsg("pMsg", "⚠️ Answer likho!", "r"); return; }
  pAttempted++;
  const num = Number(val);
  const q   = { text: $("questionText").textContent };
  if (num === pAnswer) {
    pScore++; setText("scoreVal", pScore); pCombo++;
    renderCombo(pCombo);
    const data = loadData(); gainXP(data, true, $("levelSelect").value, pCombo);
    checkAll(data); saveData(data); renderXP(data);
    setMsg("pMsg", "✅ Correct!", "g"); setTimeout(pNewQ, 250);
  } else {
    pWrong++; setText("wrongVal", pWrong); pCombo = 0; renderCombo(0);
    const data = loadData(); recordWrong(data, { mode: pActualMode, question: q.text, correct: pAnswer, given: num }); saveData(data);
    setMsg("pMsg", "❌ Ans: " + pAnswer, "r"); setTimeout(pNewQ, 450);
  }
  $("answerInput").focus();
}

function startPractice() {
  if (pRunning) return;
  pScore = 0; pWrong = 0; pAttempted = 0; pCombo = 0;
  setText("scoreVal", 0); setText("wrongVal", 0); renderCombo(0);
  pMinutes = Number($("minutesInput").value || 5);
  pSecs    = pMinutes * 60;
  setText("timeLeft", formatTime(pSecs));
  pRunning = true;
  showPracticeSection("quiz");
  pNewQ();
  pTimer = setInterval(() => {
    pSecs--;
    setText("timeLeft", formatTime(pSecs));
    if (pSecs <= 0) stopPractice(true);
  }, 1000);
}

function stopPractice(auto = false) {
  if (!pRunning) return;
  clearInterval(pTimer); pTimer = null; pRunning = false;
  const total = pScore + pWrong, acc = total > 0 ? (pScore / total) * 100 : 0, speed = pMinutes > 0 ? pAttempted / pMinutes : 0;
  const data  = loadData();
  const ch    = getOrCreateDaily(data);
  if (!isDailyDone(data) && $("modeSelect").value === ch.mode && $("levelSelect").value === ch.level && pMinutes === ch.minutes) {
    markDailyDone(data); data.xp = (data.xp || 0) + ch.bonusXP; awardOne(data, "daily_done");
  }
  const bucket = $("modeSelect").value === "mixed" ? "mixed" : pActualMode;
  pushSession(data, bucket, { date: new Date().toISOString(), mode: $("modeSelect").value, level: $("levelSelect").value, minutes: pMinutes, score: pScore, wrong: pWrong, attempted: pAttempted, accuracy: acc, speed });
  updateModeStreak(data, bucket); updateStreak(data); checkAll(data); saveData(data);
  setText("pResEmoji",  auto ? "⏰" : "✅");
  setText("pResScore",  `${pScore} correct, ${pWrong} wrong`);
  setText("pResSub",    `Speed: ${speed.toFixed(2)} Q/min · Accuracy: ${acc.toFixed(1)}%`);
  showPracticeSection("result");
  refreshAll();
}

// ═══════════════════════════════════════════════════════════════════
//  SPEED DRILL
// ═══════════════════════════════════════════════════════════════════

let sdRunning = false, sdQTimer = null, sdQLeft = 0;
let sdTotal = 20, sdCurrent = 0, sdScore = 0, sdWrong = 0;
let sdAnswer = 0, sdTimeSec = 10, sdTimes = [];

function sdStart() {
  sdTotal = Number($("sdTotal").value); sdTimeSec = Number($("sdTimerSec").value);
  sdCurrent = 0; sdScore = 0; sdWrong = 0; sdTimes = [];
  setText("sdScore", 0); setText("sdWrong", 0); sdRunning = true;
  $("sdSetup").style.display = "none"; $("sdResult").style.display = "none"; $("sdQuiz").style.display = "block";
  sdNewQ();
}

function sdNewQ() {
  if (!sdRunning) return;
  if (sdCurrent >= sdTotal) { sdStop(); return; }
  const q = generateQuestion($("sdMode").value, $("sdLevel").value);
  $("sdQText").textContent = q.text; sdAnswer = q.answer;
  setText("sdQNum", `${sdCurrent + 1}/${sdTotal}`);
  $("sdAnswerInput").value = ""; setMsg("sdMsg", "");
  const avg = sdTimes.length ? (sdTimes.reduce((a, b) => a + b, 0) / sdTimes.length).toFixed(1) + "s" : "—";
  setText("sdAvgTime", avg);
  sdQLeft = sdTimeSec; clearInterval(sdQTimer); sdUpdateBar();
  sdQTimer = setInterval(() => {
    sdQLeft--; sdUpdateBar();
    if (sdQLeft <= 0) {
      clearInterval(sdQTimer); sdTimes.push(sdTimeSec);
      sdWrong++; setText("sdWrong", sdWrong);
      setMsg("sdMsg", "⏰ Time up! Ans: " + sdAnswer, "r");
      sdCurrent++; setTimeout(sdNewQ, 600);
    }
  }, 1000);
  setTimeout(() => $("sdAnswerInput").focus(), 50);
}

function sdUpdateBar() {
  setText("sdTimerNum", sdQLeft);
  const pct  = (sdQLeft / sdTimeSec) * 100;
  const fill = $("sdTimerFill");
  if (fill) {
    fill.style.width      = pct + "%";
    fill.style.background = pct > 60 ? "var(--green)" : pct > 30 ? "var(--yellow)" : "var(--red)";
  }
}

function sdSubmit() {
  if (!sdRunning) return;
  const val = $("sdAnswerInput").value.trim(); if (!val) return;
  const elapsed = sdTimeSec - sdQLeft; clearInterval(sdQTimer); sdTimes.push(elapsed);
  if (Number(val) === sdAnswer) { sdScore++; setText("sdScore", sdScore); setMsg("sdMsg", "✅ Correct!", "g"); }
  else { sdWrong++; setText("sdWrong", sdWrong); setMsg("sdMsg", "❌ Ans: " + sdAnswer, "r"); }
  sdCurrent++; setTimeout(sdNewQ, 400);
}

function sdStop() {
  clearInterval(sdQTimer); sdRunning = false; $("sdQuiz").style.display = "none";
  const avg = sdTimes.length ? (sdTimes.reduce((a, b) => a + b, 0) / sdTimes.length).toFixed(1) : 0;
  const acc = sdTotal > 0 ? Math.round(sdScore / sdTotal * 100) : 0;
  setText("sdResScore", `${sdScore}/${sdTotal} correct`);
  setText("sdResSub",   `Accuracy: ${acc}% · Wrong: ${sdWrong}`);
  setText("sdResAvg",   `⚡ Avg response time: ${avg}s`);
  $("sdResult").style.display = "block";
  const data = loadData();
  pushSession(data, "speed", { date: new Date().toISOString(), mode: $("sdMode").value, level: $("sdLevel").value, total: sdTotal, score: sdScore, wrong: sdWrong, accuracy: acc, avgTime: Number(avg) });
  awardOne(data, "speed_ace");
  if (Number(avg) > 0 && Number(avg) < 5) awardOne(data, "speed_sub5");
  checkAll(data); updateStreak(data); saveData(data); refreshAll();
}

// ═══════════════════════════════════════════════════════════════════
//  MOCK TEST
// ═══════════════════════════════════════════════════════════════════

let mockRunning = false, mockTimer = null, mockSecs = 0;
let mockQs = [], mockCurrent = 0, mockScore = 0, mockWrong = 0, mockSkippedCount = 0, mockNetScore = 0, mockAnswered = 0, mockTotalQ = 25, mockNegVal = 0.5;

function mockStart() {
  mockTotalQ   = Number($("mockTotal").value);
  mockNegVal   = Number($("mockNeg").value);
  mockSecs     = Number($("mockTime").value) * 60;
  mockScore    = 0; mockWrong = 0; mockSkippedCount = 0; mockNetScore = 0; mockAnswered = 0; mockCurrent = 0;
  const level  = $("mockLevel").value;
  const modes  = ["addition","subtraction","multiplication","division","percentage","simplification","table","square"];
  mockQs = Array.from({ length: mockTotalQ }, () => {
    const m = modes[Math.floor(Math.random() * modes.length)];
    return generateQuestion(m, level);
  });
  setText("mockTotalDisp", mockTotalQ); setText("mockScore", "0"); setText("mockWrong", "0");
  const negBadge = $("mockNegBadge");
  if (negBadge) { negBadge.textContent = mockNegVal > 0 ? `−${mockNegVal} per wrong` : "No negative"; negBadge.style.display = mockNegVal > 0 ? "flex" : "none"; }
  mockRunning = true;
  $("mockSetup").style.display = "none"; $("mockResult").style.display = "none"; $("mockQuiz").style.display = "block";
  setText("mockTimeLeft", formatTime(mockSecs));
  mockTimer = setInterval(() => { mockSecs--; setText("mockTimeLeft", formatTime(mockSecs)); if (mockSecs <= 0) mockStop(); }, 1000);
  mockShowQ();
}

function mockShowQ() {
  if (mockCurrent >= mockTotalQ) { mockStop(); return; }
  const q = mockQs[mockCurrent];
  $("mockQText").textContent = q.text;
  setText("mockQNum", `Question ${mockCurrent + 1} of ${mockTotalQ}`);
  setText("mockAnswered", mockAnswered); setText("mockSkipped", mockSkippedCount);
  setMsg("mockMsg", "");
  buildMcqGrid("mockMcqGrid", q.answer, makeMcqOptions, (correct, chosen) => {
    if (!mockRunning) return;
    mockAnswered++;
    if (correct) { mockScore++; mockNetScore += 1; setText("mockScore", mockScore); setMsg("mockMsg", "✅ Correct!", "g"); }
    else         { mockWrong++; mockNetScore -= mockNegVal; setText("mockWrong", mockWrong); setMsg("mockMsg", "❌ Ans: " + q.answer, "r"); }
  });
}

function mockStop() {
  clearInterval(mockTimer); mockRunning = false; $("mockQuiz").style.display = "none";
  const total = mockScore + mockWrong + mockSkippedCount;
  const acc   = total > 0 ? Math.round(mockScore / total * 100) : 0;
  const emoji = acc >= 80 ? "🏆" : acc >= 60 ? "🎯" : "📝";
  setText("mockResEmoji", emoji); setText("mockResScore", `Net Score: ${mockNetScore.toFixed(1)} / ${mockTotalQ}`);
  setText("mockResSub", `Correct: ${mockScore} · Wrong: ${mockWrong} · Skipped: ${mockSkippedCount}`);
  const rg = $("mockResGrid");
  if (rg) rg.innerHTML = [
    { lbl: "Accuracy", val: acc + "%",               color: acc >= 60 ? "var(--green)" : "var(--red)"  },
    { lbl: "Correct",  val: mockScore,                color: "var(--green)"                             },
    { lbl: "Net Score",val: mockNetScore.toFixed(1),  color: "var(--yellow)"                            },
  ].map(s => `<div class="mock-stat"><div class="mock-stat-lbl">${s.lbl}</div><div class="mock-stat-val" style="color:${s.color}">${s.val}</div></div>`).join("");
  $("mockResult").style.display = "block";
  const data = loadData();
  pushSession(data, "mock", { date: new Date().toISOString(), total: mockTotalQ, score: mockScore, wrong: mockWrong, skipped: mockSkippedCount, netScore: mockNetScore, accuracy: acc });
  if (acc >= 80)  awardOne(data, "mock_pass");
  if (acc >= 100) awardOne(data, "perfect_mock");
  const mocks = data.mock?.sessions || [];
  if (mocks.length >= 5) awardOne(data, "mock5");
  checkAll(data); updateStreak(data); saveData(data); refreshAll();
}

// ═══════════════════════════════════════════════════════════════════
//  DIAGNOSTIC TEST
// ═══════════════════════════════════════════════════════════════════

let diagQs = [], diagCurrent = 0, diagScores = {};

function diagStart() {
  diagQs = buildDiagnosticSet(); diagScores = {}; diagCurrent = 0;
  $("diagIntro").style.display = "none"; $("diagResult").style.display = "none"; $("diagQuiz").style.display = "block";
  diagShowQ();
}

function diagShowQ() {
  if (diagCurrent >= diagQs.length) { diagFinish(); return; }
  const q    = diagQs[diagCurrent];
  $("diagQText").textContent = q.text;
  setText("diagTopicLbl", q.topic.toUpperCase() + " · " + q.lv.toUpperCase());
  setText("diagQNum", diagCurrent + 1);
  $("diagProgFill").style.width = `${((diagCurrent / diagQs.length) * 100).toFixed(0)}%`;
  setMsg("diagMsg", "");
  buildMcqGrid("diagMcqGrid", q.answer, makeMcqOptions, (correct) => {
    if (!diagScores[q.topic]) diagScores[q.topic] = { correct: 0, total: 0 };
    diagScores[q.topic].total++;
    if (correct) { diagScores[q.topic].correct++; setMsg("diagMsg", "✅ Correct!", "g"); }
    else         {                                 setMsg("diagMsg", "❌ Wrong!", "r"); }
    diagCurrent++;
    setTimeout(diagShowQ, 700);
  });
}

function diagFinish() {
  $("diagQuiz").style.display = "none"; $("diagResult").style.display = "block";
  const total = Object.values(diagScores).reduce((s, v) => s + v.correct, 0);
  const pct   = Math.round(total / diagQs.length * 100);
  const [level, emoji, desc] =
    pct < 40 ? ["Beginner",     "🥉", "Focus on basics — addition, subtraction, tables first."] :
    pct < 65 ? ["Intermediate", "🥈", "Good base! Work on percentage & simplification for SSC."] :
    pct < 85 ? ["Advanced",     "🥇", "Strong! Focus on speed drills and hard mocks now."] :
               ["Expert",       "🏆", "Exam-ready! Practice full mock tests and beat your speed."];
  setText("diagLevelEmoji", emoji); setText("diagLevelName", level); setText("diagLevelDesc", desc);
  const tsEl = $("diagTopicScores");
  if (tsEl) {
    tsEl.innerHTML = "";
    Object.entries(diagScores).forEach(([topic, s]) => {
      const p     = Math.round(s.correct / s.total * 100);
      const color = p < 50 ? "var(--red)" : p < 75 ? "var(--yellow)" : "var(--green)";
      const box   = document.createElement("div"); box.className = "topic-score-box";
      box.innerHTML = `<div class="ts-name">${topic}</div><div class="ts-bar"><div class="ts-fill" style="width:${p}%;background:${color}"></div></div><div class="ts-val" style="color:${color}">${p}%</div>`;
      tsEl.appendChild(box);
    });
  }
  const weaks = Object.entries(diagScores).filter(([, s]) => s.correct / s.total < 0.5).map(([t]) => t);
  setText("diagWeakList", weaks.length ? weaks.map(w => "⚠️ " + w).join(" · ") : "✅ No major weak areas!");
  const data = loadData();
  data.diagResult = { level, pct, scores: diagScores, date: new Date().toLocaleDateString("en-IN") };
  awardOne(data, "diag_done"); checkAll(data); saveData(data); refreshAll();
}

// ═══════════════════════════════════════════════════════════════════
//  TRICKS LIBRARY
// ═══════════════════════════════════════════════════════════════════

function initTricks() {
  const cats  = Object.keys(TRICKS);
  const catsEl = $("tricksCats");
  if (!catsEl) return;
  catsEl.innerHTML = "";
  cats.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "trick-cat-btn" + (i === 0 ? " active" : "");
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.onclick = () => {
      catsEl.querySelectorAll(".trick-cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTricksList(TRICKS[cat]);
      const data = loadData(); awardOne(data, "trick_fan"); saveData(data);
    };
    catsEl.appendChild(btn);
  });
  renderTricksList(TRICKS[cats[0]]);
}

// ═══════════════════════════════════════════════════════════════════
//  EVENT WIRING
// ═══════════════════════════════════════════════════════════════════

$("modeSelect")?.addEventListener("change", toggleExtraSettings);
$("startBtn")?.addEventListener("click", startPractice);
$("endBtn")?.addEventListener("click", () => stopPractice(false));
$("submitBtn")?.addEventListener("click", pSubmitFill);
$("skipBtn")?.addEventListener("click", () => { if (!pRunning) return; setMsg("pMsg", "⏭️ Skipped!", "r"); setTimeout(pNewQ, 200); });
$("skipMcqBtn")?.addEventListener("click", () => { if (!pRunning) return; setMsg("pMsg", "⏭️ Skipped!", "r"); setTimeout(pNewQ, 200); });
$("answerInput")?.addEventListener("keydown", e => { if (e.key === "Enter") pSubmitFill(); });
$("pBackBtn")?.addEventListener("click", () => { showPracticeSection("setup"); refreshAll(); });

$("sdStartBtn")?.addEventListener("click", sdStart);
$("sdSubmitBtn")?.addEventListener("click", sdSubmit);
$("sdAnswerInput")?.addEventListener("keydown", e => { if (e.key === "Enter") sdSubmit(); });
$("sdEndBtn")?.addEventListener("click", sdStop);
$("sdBackBtn")?.addEventListener("click", () => { $("sdResult").style.display = "none"; $("sdSetup").style.display = "block"; });

$("mockStartBtn")?.addEventListener("click", mockStart);
$("mockSkipBtn")?.addEventListener("click", () => { if (!mockRunning) return; mockSkippedCount++; mockCurrent++; setText("mockSkipped", mockSkippedCount); mockShowQ(); });
$("mockSubmitBtn")?.addEventListener("click", () => { if (!mockRunning) return; mockCurrent++; mockShowQ(); });
$("mockBackBtn")?.addEventListener("click", () => { $("mockResult").style.display = "none"; $("mockSetup").style.display = "block"; renderMockHistory(loadData()); });

$("diagStartBtn")?.addEventListener("click", diagStart);
$("diagRetakeBtn")?.addEventListener("click", () => { $("diagResult").style.display = "none"; $("diagIntro").style.display = "block"; });

$("startDailyBtn")?.addEventListener("click", applyDailyChallenge);
$("startDailyBtn2")?.addEventListener("click", applyDailyChallenge);

$("examDateInput")?.addEventListener("change", () => {
  const data = loadData(); data.examDate = $("examDateInput").value; saveData(data); renderTarget(data);
});

$("clearDataBtn")?.addEventListener("click", () => {
  if (!confirm("Sure bhai? Saara data delete ho jayega!")) return;
  clearAllData(); location.reload();
});

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════

(function init() {
  const data = loadData();
  if (data.examDate) { const el = $("examDateInput"); if (el) el.value = data.examDate; }
  toggleExtraSettings();
  showPracticeSection("setup");
  initTricks();
  renderTrickOfDay(trickOfDay());
  refreshAll();
  renderCombo(0);
})();
