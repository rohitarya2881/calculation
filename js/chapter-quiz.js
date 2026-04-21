// ─── chapter-quiz.js ─────────────────────────────────────────────
// Handles the entire Chapter Quiz tab:
//   1. Chapter selection screen
//   2. Quiz (MCQ only, no timer distraction)
//   3. End-screen review with trick + full steps for every question
//
// To upgrade: only edit chapters.js to add questions/chapters.

import { getChapterMeta, getChapterQuestions } from "./chapters.js";
import { loadData, saveData, pushSession, updateStreak } from "./storage.js";
import { gainXP } from "./xp.js";
import { checkAll } from "./badges.js";
import { renderXP } from "./ui.js";

const $ = id => document.getElementById(id);

// ── State ─────────────────────────────────────────────────────────
let cqState = {
  chapter:    null,   // current chapter meta
  questions:  [],     // resolved question objects
  current:    0,      // current question index
  answers:    [],     // { q, given, correct, isCorrect }
  running:    false,
};

// ── Section switcher ──────────────────────────────────────────────

function showSection(name) {
  ["select", "quiz", "review"].forEach(s => {
    const el = $(`cq-${s}`);
    if (el) el.style.display = s === name ? "block" : "none";
  });
}

// ── Chapter selection screen ──────────────────────────────────────

export function initChapterQuiz() {
  renderChapterSelect();
  showSection("select");
}

function renderChapterSelect() {
  const grid = $("cqChapterGrid");
  if (!grid) return;
  const meta  = getChapterMeta();
  const data  = loadData();
  const stats = data.chapterStats || {};

  grid.innerHTML = meta.map(ch => {
    const st      = stats[ch.id] || { sessions: 0, bestAcc: 0 };
    const accText = st.sessions > 0 ? `Best: ${st.bestAcc}%` : "Not attempted";
    return `
      <div class="cq-chapter-card" data-id="${ch.id}" style="border-color:${ch.color}22;--ch-color:${ch.color}">
        <div class="cq-ch-icon" style="color:${ch.color}">${ch.icon}</div>
        <div class="cq-ch-title">${ch.title}</div>
        <div class="cq-ch-desc">${ch.desc}</div>
        <div class="cq-ch-meta">
          <span class="cq-ch-count">${ch.count} questions</span>
          <span class="cq-ch-acc" style="color:${st.sessions > 0 ? ch.color : "var(--t3)"}">${accText}</span>
        </div>
      </div>`;
  }).join("");

  // Config row
  $("cqChapterGrid").querySelectorAll(".cq-chapter-card").forEach(card => {
    card.addEventListener("click", () => startChapterConfig(card.dataset.id));
  });
}

// ── Config screen (shown inside card on click or via bottom panel) ─

function startChapterConfig(chapterId) {
  const meta  = getChapterMeta().find(c => c.id === chapterId);
  if (!meta) return;

  const panel = $("cqConfigPanel");
  panel.innerHTML = `
    <div class="cq-config-card" style="border-color:${meta.color}44">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <span style="font-size:1.6rem">${meta.icon}</span>
        <div>
          <div style="font-size:.9rem;font-weight:600;color:var(--t1)">${meta.title}</div>
          <div style="font-size:.72rem;color:var(--t3)">${meta.count} total questions available</div>
        </div>
      </div>
      <div class="g2" style="margin-bottom:12px">
        <div class="field">
          <label>Questions</label>
          <select id="cqQCount">
            <option value="5">5 (quick)</option>
            <option value="10" selected>10 (standard)</option>
            <option value="15">15</option>
            <option value="20">20 (full)</option>
          </select>
        </div>
        <div class="field">
          <label>Difficulty focus</label>
          <select id="cqDiffFocus">
            <option value="all" selected>All mixed</option>
            <option value="concept">Concept based</option>
            <option value="numerical">Numerical</option>
          </select>
        </div>
      </div>
      <button class="btn btn-accent" style="width:100%" id="cqStartBtn">
        Start ${meta.title} Quiz →
      </button>
    </div>`;

  panel.style.display = "block";
  $("cqStartBtn").addEventListener("click", () => {
    const count = Number($("cqQCount").value);
    startChapterQuiz(chapterId, count);
  });

  // Scroll to config
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── Quiz ──────────────────────────────────────────────────────────

function startChapterQuiz(chapterId, count) {
  const meta = getChapterMeta().find(c => c.id === chapterId);
  const qs   = getChapterQuestions(chapterId, count);
  if (!qs.length) return;

  cqState = { chapter: meta, questions: qs, current: 0, answers: [], running: true };

  $("cqConfigPanel").style.display = "none";
  showSection("quiz");
  renderCqQuestion();
}

function renderCqQuestion() {
  const { questions, current, chapter } = cqState;
  if (current >= questions.length) { endChapterQuiz(); return; }

  const q = questions[current];

  // Progress
  $("cqQProgress").textContent = `${current + 1} / ${questions.length}`;
  $("cqQProgFill").style.width = `${((current) / questions.length * 100).toFixed(0)}%`;
  $("cqChapterLabel").textContent = chapter.title;
  $("cqChapterLabel").style.color = chapter.color;

  // Question text
  $("cqQText").textContent = q.q;

  // Options
  const grid = $("cqOptGrid");
  grid.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className   = "mcq-opt";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleCqAnswer(opt, q));
    grid.appendChild(btn);
  });

  $("cqQMsg").innerHTML = "";
}

function handleCqAnswer(chosen, q) {
  if (!cqState.running) return;

  // Lock all buttons
  const btns = $("cqOptGrid").querySelectorAll(".mcq-opt");
  btns.forEach(b => { b.disabled = true; });

  const isCorrect = String(chosen) === String(q.answer);
  btns.forEach(b => {
    if (String(b.textContent) === String(q.answer)) b.classList.add("correct");
    else if (b.textContent == chosen && !isCorrect) b.classList.add("wrong");
  });

  // Record answer
  cqState.answers.push({ q: q.q, given: chosen, correct: q.answer, isCorrect, trick: q.trick, steps: q.steps });

  // Feedback
  $("cqQMsg").innerHTML = isCorrect
    ? `<span class="msg-g">✅ Correct!</span>`
    : `<span class="msg-r">❌ Ans: ${q.answer}</span>`;

  // XP
  if (isCorrect) {
    const data = loadData();
    gainXP(data, true, "medium", 0);
    checkAll(data); saveData(data);
    renderXP(data);
  }

  setTimeout(() => {
    cqState.current++;
    renderCqQuestion();
  }, isCorrect ? 600 : 1000);
}

// ── End & Review ──────────────────────────────────────────────────

function endChapterQuiz() {
  cqState.running = false;
  const { answers, chapter } = cqState;

  const correct = answers.filter(a => a.isCorrect).length;
  const total   = answers.length;
  const acc     = Math.round(correct / total * 100);

  // Save stats
  const data = loadData();
  if (!data.chapterStats) data.chapterStats = {};
  if (!data.chapterStats[chapter.id]) data.chapterStats[chapter.id] = { sessions: 0, bestAcc: 0 };
  data.chapterStats[chapter.id].sessions++;
  data.chapterStats[chapter.id].bestAcc = Math.max(data.chapterStats[chapter.id].bestAcc, acc);
  pushSession(data, "chapter_" + chapter.id, {
    date: new Date().toISOString(), chapter: chapter.id, total, correct, accuracy: acc,
  });
  updateStreak(data); checkAll(data); saveData(data);

  // Render review screen
  $("cqRevSummary").innerHTML = `
    <div style="text-align:center;padding:16px 0 12px">
      <div style="font-size:2rem;margin-bottom:6px">${acc >= 80 ? "🏆" : acc >= 60 ? "🎯" : "📚"}</div>
      <div style="font-family:var(--mono);font-size:1.3rem;color:var(--t1);margin-bottom:4px">${correct}/${total} Correct</div>
      <div style="font-size:.8rem;color:var(--t2)">Accuracy: ${acc}% · Chapter: ${chapter.title}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      <div class="mock-stat"><div class="mock-stat-lbl">Score</div><div class="mock-stat-val" style="color:var(--green)">${correct}/${total}</div></div>
      <div class="mock-stat"><div class="mock-stat-lbl">Accuracy</div><div class="mock-stat-val" style="color:${acc>=60?"var(--green)":"var(--red)"}">${acc}%</div></div>
      <div class="mock-stat"><div class="mock-stat-lbl">Wrong</div><div class="mock-stat-val" style="color:var(--red)">${total - correct}</div></div>
    </div>`;

  // Render each question review with trick + steps
  const list = $("cqRevList");
  list.innerHTML = "";

  answers.forEach((a, i) => {
    const div  = document.createElement("div");
    div.className = "cq-rev-item" + (a.isCorrect ? " cq-rev-correct" : " cq-rev-wrong");

    const stepsHtml = (a.steps || []).map((s, si) =>
      `<div class="cq-step"><span class="cq-step-num">${si + 1}</span><span>${s}</span></div>`
    ).join("");

    div.innerHTML = `
      <div class="cq-rev-qnum">Q${i + 1} <span class="${a.isCorrect ? "cq-badge-correct" : "cq-badge-wrong"}">${a.isCorrect ? "✓ Correct" : "✗ Wrong"}</span></div>
      <div class="cq-rev-qtxt">${a.q}</div>
      <div class="cq-rev-ans-row">
        <span class="cq-rev-correct-lbl">Answer: <b>${a.correct}</b></span>
        ${!a.isCorrect ? `<span class="cq-rev-given-lbl">Your answer: <b>${a.given}</b></span>` : ""}
      </div>
      <div class="cq-trick-box">
        <div class="cq-trick-label">⚡ Mental Trick</div>
        <div class="cq-trick-text">${a.trick}</div>
      </div>
      <div class="cq-steps-box">
        <div class="cq-trick-label">📝 Step-by-Step</div>
        ${stepsHtml}
      </div>`;

    list.appendChild(div);
  });

  showSection("review");
}

// ── Back button ───────────────────────────────────────────────────

export function bindChapterQuizEvents() {
  $("cqBackFromQuiz")?.addEventListener("click", () => {
    cqState.running = false;
    showSection("select");
    renderChapterSelect();
  });

  $("cqBackFromReview")?.addEventListener("click", () => {
    showSection("select");
    renderChapterSelect();
  });

  $("cqRetryBtn")?.addEventListener("click", () => {
    if (cqState.chapter) startChapterQuiz(cqState.chapter.id, cqState.questions.length);
  });
}
