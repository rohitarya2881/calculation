export function calcSummary(sessions){
  if(!sessions || sessions.length === 0) return null;

  let bestScore=0, bestAcc=0, bestSpeed=0;
  let sumScore=0, sumAcc=0, sumSpeed=0;

  sessions.forEach(s=>{
    sumScore += s.score;
    sumAcc += s.accuracy;
    sumSpeed += s.speed;

    bestScore = Math.max(bestScore, s.score);
    bestAcc = Math.max(bestAcc, s.accuracy);
    bestSpeed = Math.max(bestSpeed, s.speed);
  });

  const last = sessions[sessions.length-1];
  const totalSessions = sessions.length;

  return {
    totalSessions,
    bestScore,
    bestAcc,
    bestSpeed,
    avgScore: sumScore/totalSessions,
    avgAcc: sumAcc/totalSessions,
    avgSpeed: sumSpeed/totalSessions,
    last
  };
}

export function formatSummary(summary){
  if(!summary) return "No data";

  const last = summary.last;
  return `
Sessions: ${summary.totalSessions}<br/>
Last Score: ${last.score} | Acc: ${last.accuracy.toFixed(1)}%<br/>
Speed: ${last.speed.toFixed(2)} Q/min<br/>
Best Score: ${summary.bestScore} | Best Acc: ${summary.bestAcc.toFixed(1)}%<br/>
Avg Acc: ${summary.avgAcc.toFixed(1)}% | Avg Speed: ${summary.avgSpeed.toFixed(2)} Q/min
  `.trim();
}
