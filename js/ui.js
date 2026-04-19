// ─── ui.js ───────────────────────────────────────────────────────
// Shared DOM render helpers.
// Every function takes explicit data/values — no globals here.

import { getProgress, comboPct, comboMessage, comboMultiplier } from "./xp.js";
import { BADGES } from "./badges.js";
import { topicAccuracyMap, overallStats, calcSummary, formatSummary } from "./stats.js";
import { daysUntil } from "./utils.js";

// ── Generic ───────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

export function setMsg(elId, text, type = "") {
  const el = $(elId);
  if (!el) return;
  el.innerHTML = text;
  el.className = "msg" + (type === "g" ? " msg-g" : type === "r" ? " msg-r" : type === "y" ? " msg-y" : "");
}

export function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

export function setWidth(id, pct) {
  const el = $(id);
  if (el) el.style.width = `${pct.toFixed(0)}%`;
}

// ── XP bar (renders all XP bars at once) ─────────────────────────

export function renderXP(data) {
  const p  = getProgress(data.xp || 0);
  const xp = data.xp || 0;

  [
    ["idleLv",  "idleXp",  "idleXpFill",  "idleXpHint"],
    ["qLv",     "qXp",     "qXpFill",     "qXpHint"],
    ["resLv",   "resXp",   "resXpFill",   "resXpHint"],
  ].forEach(([lvId, xpId, fillId, hintId]) => {
    setText(lvId,  p.level);
    setText(xpId,  xp);
    setWidth(fillId, p.pct);
    setText(hintId, `Next level in ${p.left} XP`);
  });

  setText("topLevel", p.level);
}

// ── Combo bar ─────────────────────────────────────────────────────

export function renderCombo(combo) {
  setText("comboVal", combo);
  setWidth("comboFill", comboPct(combo));
  setText("comboHint", `${comboMessage(combo)} (×${comboMultiplier(combo)})`);
}

// ── Daily preview (practice tab + daily tab) ──────────────────────

export function renderDailyAll(data, ch, done) {
  const info = `${ch.mode.toUpperCase()} · ${ch.level.toUpperCase()} · ${ch.minutes} min`;

  // Practice tab preview
  setText("dText", info + ` · +${ch.bonusXP} XP`);
  setText("dBadge", done ? "✅ Done" : "Not Done");
  const badge = $("dBadge");
  if (badge) badge.className = "d-badge" + (done ? " done" : "");
  const btn = $("startDailyBtn");
  if (btn) btn.disabled = done;
  setText("dHint", done ? "Done ✅ kal naya aayega" : "Complete to earn bonus XP 🔥");

  // Daily tab
  setText("dPageEmoji", done ? "✅" : "📅");
  const pills = $("dPagePills");
  if (pills) pills.innerHTML = [ch.mode, ch.level, ch.minutes + " min"]
    .map(t => `<span class="d-pill">${t}</span>`).join("");
  const btn2 = $("startDailyBtn2");
  if (btn2) btn2.disabled = done;
  setText("dPageHint", done ? "Done for today! Come back tomorrow 😄" : "Complete to earn +50 XP 🔥");
}

// ── Records page ──────────────────────────────────────────────────

const REC_MODES = [
  { key: "addition",        lbl: "➕ Addition"        },
  { key: "subtraction",     lbl: "➖ Subtraction"      },
  { key: "multiplication",  lbl: "✖️ Multiplication"  },
  { key: "division",        lbl: "➗ Division"         },
  { key: "table",           lbl: "📌 Tables"           },
  { key: "square",          lbl: "🟦 Squares"          },
  { key: "cube",            lbl: "🟪 Cubes"            },
  { key: "percentage",      lbl: "💯 Percentage"       },
  { key: "simplification",  lbl: "🔢 Simplification"  },
];

export function renderRecords(data) {
  setText("streakCount", data.streak || 0);

  const ms    = m => data.modeStreaks?.[m]?.streak || 0;
  const grid  = $("recordGrid");
  if (grid) {
    grid.innerHTML = "";
    REC_MODES.forEach(({ key, lbl }) => {
      const box = document.createElement("div");
      box.className = "rec-box";
      box.innerHTML = `<div class="rec-title">${lbl}</div><div class="rec-val">${formatSummary(calcSummary(data[key]?.sessions), ms(key))}</div>`;
      grid.appendChild(box);
    });
  }

  const st = data.streak || 0;
  setText("streakMsg",
    st === 0  ? "Start today bhai 💪 Streak bana!" :
    st < 3    ? `${st} days streak ✅ good going!` :
    st < 7    ? `🔥 ${st} days! mast consistency!` :
    st < 15   ? `🚀 Legend mode ON! ${st} days streak!` :
                `👑 Itne din lagatar! 😍🔥`
  );
}

// ── Heatmap ───────────────────────────────────────────────────────

export function renderHeatmap(data, onCellClick) {
  const map  = topicAccuracyMap(data);
  const grid = $("heatmapGrid");
  if (!grid) return;
  grid.innerHTML = "";

  Object.entries(map).forEach(([mode, acc]) => {
    const color = acc === null ? "var(--t3)" : acc < 50 ? "var(--red)"    : acc < 75 ? "var(--yellow)"    : "var(--green)";
    const bg    = acc === null ? "var(--s2)" : acc < 50 ? "var(--red-dim)": acc < 75 ? "var(--yellow-dim)": "var(--green-dim)";
    const cell  = document.createElement("div");
    cell.className       = "hmap-cell";
    cell.style.background = bg;
    cell.style.borderColor = acc === null ? "var(--br)" : color;
    cell.innerHTML = `<div class="hmap-name">${mode}</div><div class="hmap-pct" style="color:${color}">${acc !== null ? acc + "%" : "—"}</div><div class="hmap-bar" style="background:var(--s4)"><div style="height:100%;border-radius:99px;width:${acc || 0}%;background:${color}"></div></div>`;
    if (acc !== null && onCellClick) cell.onclick = () => onCellClick(mode);
    grid.appendChild(cell);
  });
}

// ── Badges ────────────────────────────────────────────────────────

export function renderBadges(data) {
  const grid   = $("badgesGrid");
  if (!grid) return;
  const earned = new Set(data.badges || []);
  grid.innerHTML = "";
  BADGES.forEach(b => {
    const el = document.createElement("div");
    el.className   = "badge-box" + (earned.has(b.id) ? " earned" : "");
    el.style.opacity = earned.has(b.id) ? "1" : "0.4";
    el.innerHTML   = `<div class="badge-icon">${b.icon}</div><div class="badge-name">${b.name}</div><div class="badge-cond">${b.cond}</div>`;
    grid.appendChild(el);
  });
}

// ── Target tracker ────────────────────────────────────────────────

export function renderTarget(data) {
  const days = daysUntil(data.examDate);
  setText("targetDays", days !== null && days > 0 ? days : days === 0 ? "🎯" : "—");
  setText("targetSub",  days !== null && days > 0 ? `${days} days to exam` : days === 0 ? "Exam day! All the best! 🎯" : "Set your exam date →");
  setText("daysLeft",   days !== null && days > 0 ? days : "—");

  const ov = overallStats(data);
  setText("tpTotalQ",    ov.totalQ);
  setText("tpAvgAcc",    ov.avgAcc !== null ? ov.avgAcc + "%" : "—");
  setText("tpBestSpeed", ov.bestSpeed ? ov.bestSpeed + " Q/m" : "—");
}

// ── MCQ grid builder (shared by all quiz modes) ───────────────────

export function buildMcqGrid(gridId, correct, makeFn, onAnswer) {
  const opts = makeFn(correct);
  const grid = $(gridId);
  if (!grid) return;
  grid.innerHTML = "";
  opts.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "mcq-opt";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".mcq-opt").forEach(b => { b.disabled = true; });
      if (opt === correct) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
        grid.querySelectorAll(".mcq-opt").forEach(b => {
          if (Number(b.textContent) === correct) b.classList.add("show-correct");
        });
      }
      onAnswer(opt === correct, opt, correct);
    });
    grid.appendChild(btn);
  });
}

// ── Speed drill history ───────────────────────────────────────────

export function renderSpeedHistory(data) {
  const el   = $("sdBestTimes");
  if (!el) return;
  const sess = data.speed?.sessions || [];
  el.innerHTML = sess.length
    ? sess.slice(-5).reverse().map(s =>
        `<span style="color:var(--t1)">${s.mode}</span> · ${s.score}/${s.total}✓ · avg <span style="color:var(--yellow);font-family:var(--mono)">${(s.avgTime || 0).toFixed(1)}s</span>`
      ).join("<br>")
    : "No drill completed yet.";
}

// ── Mock history ──────────────────────────────────────────────────

export function renderMockHistory(data) {
  const el   = $("mockHistory");
  if (!el) return;
  const sess = data.mock?.sessions || [];
  el.innerHTML = sess.length
    ? sess.slice(-5).reverse().map(s =>
        `<span style="color:var(--t1)">${s.total}Q</span> · Net: <span style="color:${s.accuracy >= 60 ? "var(--green)" : "var(--red)"}; font-family:var(--mono)">${s.netScore.toFixed(1)}</span> · Acc: ${s.accuracy.toFixed(1)}%`
      ).join("<br>")
    : "No mocks completed yet.";
}

// ── Wrong history ─────────────────────────────────────────────────

export function renderWrongHistory(data) {
  const el = $("wrongHistoryList");
  if (!el) return;
  const hist = data.wrongHistory || [];
  if (!hist.length) { el.innerHTML = `<div class="na-msg">No wrong answers recorded yet. Keep practicing!</div>`; return; }

  // Group by mode
  const byMode = {};
  hist.forEach(h => {
    if (!byMode[h.mode]) byMode[h.mode] = [];
    byMode[h.mode].push(h);
  });

  el.innerHTML = Object.entries(byMode).map(([mode, items]) =>
    `<div class="wh-mode-label">${mode.toUpperCase()}</div>` +
    items.slice(0, 10).map(h =>
      `<div class="wh-row">
        <span class="wh-q">${h.question}</span>
        <span class="wh-correct">Ans: ${h.correct}</span>
        <span class="wh-given">You: ${h.given}</span>
      </div>`
    ).join("")
  ).join("");
}

// ── Tricks library ────────────────────────────────────────────────

export function renderTricksList(tricks) {
  const el = $("tricksContent");
  if (!el) return;
  el.innerHTML = "";
  tricks.forEach(t => {
    const div = document.createElement("div");
    div.className = "trick-card";
    div.innerHTML = `<div class="trick-tag">${t.tag}</div><div class="trick-title">${t.title}</div><div class="trick-formula">${t.formula}</div><div class="trick-example">${t.example}</div>`;
    el.appendChild(div);
  });
}

export function renderTrickOfDay(trick) {
  const el = $("trickOfDay");
  if (!el || !trick) return;
  el.innerHTML = `<div class="trick-tag">${trick.tag}</div><div class="trick-title">${trick.title}</div><div class="trick-formula">${trick.formula}</div><div class="trick-example">${trick.example}</div>`;
}

// ── Diagnostic previous result ────────────────────────────────────

export function renderPrevDiag(data) {
  const el = $("diagPrevResult");
  const ct = $("diagPrevContent");
  if (!el || !ct) return;
  const dr = data.diagResult;
  if (!dr) { el.style.display = "none"; return; }
  el.style.display = "block";
  ct.innerHTML = `Level: <b style="color:var(--accent)">${dr.level}</b> · Score: <b style="color:var(--yellow)">${dr.pct}%</b> · Date: ${dr.date}`;
}
