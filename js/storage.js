import { todayStr, ydayStr } from "./utils.js";

const STORAGE_KEY = "math_app_v1_clean";

export function getDefaultData(){
  return {
    streak: 0,
    lastPracticeDate: null,

    xp: 0,
    level: 1,

    // ✅ mode wise streak
    modeStreaks: {
      addition: { streak: 0, lastDate: null },
      subtraction: { streak: 0, lastDate: null },
      multiplication: { streak: 0, lastDate: null },
      division: { streak: 0, lastDate: null },
      table: { streak: 0, lastDate: null },
      mixed: { streak: 0, lastDate: null },
      square: { streak: 0, lastDate: null },
      cube: { streak: 0, lastDate: null }
    },

    // daily challenge
    daily: {
      date: null,
      completed: false,
      challenge: null
    },

    addition: { sessions: [] },
    subtraction: { sessions: [] },
    multiplication: { sessions: [] },
    division: { sessions: [] },
    table: { sessions: [] },
    mixed: { sessions: [] },
    square: { sessions: [] },
    cube: { sessions: [] }
  };
}

export function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return getDefaultData();
  try { return JSON.parse(raw); }
  catch { return getDefaultData(); }
}

export function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateStreak(data){
  const today = todayStr();
  const last = data.lastPracticeDate;

  if(!last){
    data.streak = 1;
    data.lastPracticeDate = today;
    return;
  }

  if(last === today) return;

  if(last === ydayStr()){
    data.streak = (data.streak || 0) + 1;
    data.lastPracticeDate = today;
    return;
  }

  data.streak = 1;
  data.lastPracticeDate = today;
}

export function updateModeStreak(data, mode){
  const today = todayStr();

  if(!data.modeStreaks) data.modeStreaks = {};
  if(!data.modeStreaks[mode]) data.modeStreaks[mode] = { streak: 0, lastDate: null };

  const last = data.modeStreaks[mode].lastDate;

  // same day already updated
  if(last === today) return;

  // first time
  if(!last){
    data.modeStreaks[mode].streak = 1;
    data.modeStreaks[mode].lastDate = today;
    return;
  }

  // continuous
  if(last === ydayStr()){
    data.modeStreaks[mode].streak += 1;
    data.modeStreaks[mode].lastDate = today;
    return;
  }

  // break streak
  data.modeStreaks[mode].streak = 1;
  data.modeStreaks[mode].lastDate = today;
}

export function clearAllData(){
  localStorage.removeItem(STORAGE_KEY);
}
