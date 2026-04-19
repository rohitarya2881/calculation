// ─── badges.js ───────────────────────────────────────────────────
// Badge definitions + award logic.
// To add a new badge: add entry to BADGES, add check in checkAll().

export const BADGES = [
  { id: "first_correct", icon: "🎯", name: "First Blood",     cond: "Get your first correct answer"   },
  { id: "streak3",       icon: "🔥", name: "3-Day Warrior",   cond: "3 day streak"                    },
  { id: "streak7",       icon: "⚔️", name: "Week Champion",   cond: "7 day streak"                    },
  { id: "streak30",      icon: "👑", name: "Monthly Legend",  cond: "30 day streak"                   },
  { id: "combo10",       icon: "💥", name: "Combo King",      cond: "Reach 10× combo"                 },
  { id: "speed_ace",     icon: "⚡", name: "Speed Ace",       cond: "Complete a speed drill"          },
  { id: "mock_pass",     icon: "🏆", name: "Mock Topper",     cond: "Score 80%+ in a mock test"      },
  { id: "mock5",         icon: "📋", name: "Mock Veteran",    cond: "Complete 5 mock tests"           },
  { id: "diag_done",     icon: "🔬", name: "Self-Aware",      cond: "Complete diagnostic test"        },
  { id: "xp100",         icon: "⭐", name: "XP Rookie",       cond: "Earn 100 XP"                     },
  { id: "xp1000",        icon: "🌟", name: "XP Hunter",       cond: "Earn 1000 XP"                   },
  { id: "xp5000",        icon: "💎", name: "XP Legend",       cond: "Earn 5000 XP"                   },
  { id: "trick_fan",     icon: "💡", name: "Trick Master",    cond: "Open Tricks library"             },
  { id: "daily_done",    icon: "📅", name: "Daily Grinder",   cond: "Complete daily challenge"        },
  { id: "perfect_mock",  icon: "🎖️", name: "Perfect Score",   cond: "Score 100% in any mock test"    },
  { id: "speed_sub5",    icon: "🚀", name: "Sub-5s Machine",  cond: "Avg response time under 5s"     },
];

function award(data, id) {
  if (!data.badges) data.badges = [];
  if (!data.badges.includes(id)) data.badges.push(id);
}

export function checkAll(data) {
  if (!data.badges) data.badges = [];

  // XP milestones
  const xp = data.xp || 0;
  if (xp >= 100)  award(data, "xp100");
  if (xp >= 1000) award(data, "xp1000");
  if (xp >= 5000) award(data, "xp5000");

  // Streak
  const st = data.streak || 0;
  if (st >= 3)  award(data, "streak3");
  if (st >= 7)  award(data, "streak7");
  if (st >= 30) award(data, "streak30");

  // First correct answer
  const allSessions = ["addition","subtraction","multiplication","division","table","square","cube","percentage","simplification","mixed"]
    .flatMap(k => data[k]?.sessions || []);
  if (allSessions.some(s => s.score > 0)) award(data, "first_correct");

  // Mock tests
  const mocks = data.mock?.sessions || [];
  if (mocks.some(s => s.accuracy >= 80))  award(data, "mock_pass");
  if (mocks.some(s => s.accuracy >= 100)) award(data, "perfect_mock");
  if (mocks.length >= 5)                  award(data, "mock5");

  // Speed drill
  const speeds = data.speed?.sessions || [];
  if (speeds.length > 0) award(data, "speed_ace");
  if (speeds.some(s => s.avgTime > 0 && s.avgTime < 5)) award(data, "speed_sub5");

  // Diagnostic + Daily
  if (data.diagResult)                              award(data, "diag_done");
  if (data.daily?.completed)                        award(data, "daily_done");
}

export function awardOne(data, id) {
  award(data, id);
}
