// ─── stats.js ────────────────────────────────────────────────────
// Session statistics — pure functions, no side effects.

export function calcSummary(sessions) {
  if (!sessions?.length) return null;
  let bs = 0, ba = 0, bsp = 0, ss = 0, sa = 0, ssp = 0;
  sessions.forEach(s => {
    ss  += s.score;
    sa  += s.accuracy;
    ssp += s.speed;
    bs  = Math.max(bs, s.score);
    ba  = Math.max(ba, s.accuracy);
    bsp = Math.max(bsp, s.speed);
  });
  const n = sessions.length, last = sessions[n - 1];
  return {
    totalSessions: n,
    bestScore: bs,
    bestAcc: ba,
    bestSpeed: bsp,
    avgAcc: sa / n,
    avgSpeed: ssp / n,
    last,
  };
}

export function formatSummary(s, streak) {
  if (!s) return `<span class="na">No sessions yet</span>`;
  const l = s.last;
  return [
    `Sessions: ${s.totalSessions} | Last: ${l.score}✓`,
    `Acc: ${l.accuracy.toFixed(1)}% | Speed: ${l.speed.toFixed(1)} Q/m`,
    `Best: ${s.bestScore} | Best Acc: ${s.bestAcc.toFixed(1)}%`,
    `<b>🔥 Streak: ${streak}d</b>`,
  ].join("<br>");
}

// Returns per-topic accuracy map from all sessions
export function topicAccuracyMap(data) {
  const modes = ["addition","subtraction","multiplication","division","percentage","simplification","table","square","cube"];
  const map = {};
  modes.forEach(mode => {
    const s = calcSummary(data[mode]?.sessions);
    map[mode] = s ? Math.round(s.avgAcc) : null;
  });
  return map;
}

// Overall stats across all practice modes
export function overallStats(data) {
  const modes = ["addition","subtraction","multiplication","division","table","square","cube","percentage","simplification","mixed"];
  const allSess = modes.flatMap(k => data[k]?.sessions || []);
  if (!allSess.length) return { totalQ: 0, avgAcc: null, bestSpeed: null };
  return {
    totalQ:    allSess.reduce((s, x) => s + (x.attempted || 0), 0),
    avgAcc:    Math.round(allSess.reduce((s, x) => s + x.accuracy, 0) / allSess.length),
    bestSpeed: Math.max(...allSess.map(x => x.speed)).toFixed(1),
  };
}
