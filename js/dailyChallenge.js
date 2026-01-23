import { todayStr } from "./utils.js";

function pickChallengeByDay(seed){
  // Deterministic challenge by day (same for user all day)
  const modes = ["addition","subtraction","multiplication","division","table","mixed"];
  const levels = ["easy","medium","hard"];
  const minutes = [3,5,7];

  const idx1 = seed % modes.length;
  const idx2 = (seed * 7) % levels.length;
  const idx3 = (seed * 11) % minutes.length;

  return {
    mode: modes[idx1],
    level: levels[idx2],
    minutes: minutes[idx3],
    bonusXP: 50
  };
}

export function getOrCreateDailyChallenge(data){
  const today = todayStr();

  // If already created today
  if(data.daily && data.daily.date === today && data.daily.challenge){
    return data.daily.challenge;
  }

  // Create new daily challenge
  const seed = Number(today.replaceAll("-","")); // e.g. 20260123
  const challenge = pickChallengeByDay(seed);

  data.daily = {
    date: today,
    completed: false,
    challenge
  };

  return challenge;
}

export function isDailyCompleted(data){
  const today = todayStr();
  return data.daily?.date === today && data.daily?.completed === true;
}

export function markDailyCompleted(data){
  const today = todayStr();
  if(!data.daily) data.daily = {};
  data.daily.date = today;
  data.daily.completed = true;
}
