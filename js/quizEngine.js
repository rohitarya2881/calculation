import { randInt } from "./utils.js";

function getRangeByLevel(level){
  if(level==="easy") return {min:1,max:50};
  if(level==="medium") return {min:10,max:200};
  return {min:50,max:999};
}

function getDigitsByLevel(level){
  if(level==="easy") return {a:[2,2], b:[1,2]};
  if(level==="medium") return {a:[2,3], b:[2,2]};
  return {a:[3,4], b:[2,3]};
}

function randomNDigit(minDigits,maxDigits){
  const d = randInt(minDigits,maxDigits);
  const min = Math.pow(10,d-1);
  const max = Math.pow(10,d)-1;
  return randInt(min,max);
}

export function generateQuestion(mode, level, tableConfig){
  if(mode === "mixed"){
    const pool = ["addition","subtraction","multiplication","division"];
    mode = pool[randInt(0, pool.length-1)];
  }

  if(mode === "addition"){
    const count = (level==="easy") ? randInt(3,4) : randInt(4,5);
    const range = getRangeByLevel(level);
    const nums = Array.from({length:count}, ()=> randInt(range.min, range.max));
    return { text: nums.join(" + ") + " = ?", answer: nums.reduce((a,b)=>a+b,0), actualMode:"addition" };
  }

  if(mode === "subtraction"){
    const count = (level==="easy") ? 2 : randInt(2,3);
    const range = getRangeByLevel(level);
    let nums = Array.from({length:count}, ()=> randInt(range.min, range.max));
    nums.sort((a,b)=>b-a);
    return { text: nums.join(" - ") + " = ?", answer: nums.reduce((a,b)=>a-b), actualMode:"subtraction" };
  }

  if(mode === "multiplication"){
    const d = getDigitsByLevel(level);
    const a = randomNDigit(d.a[0], d.a[1]);
    const b = randomNDigit(d.b[0], d.b[1]);
    return { text: `${a} × ${b} = ?`, answer: a*b, actualMode:"multiplication" };
  }

  if(mode === "division"){
    const divisor = (level==="easy") ? randInt(2,12) : (level==="medium") ? randInt(2,25) : randInt(2,50);
    const quotient = (level==="easy") ? randInt(2,15) : (level==="medium") ? randInt(2,30) : randInt(5,50);
    const dividend = divisor * quotient;
    return { text: `${dividend} ÷ ${divisor} = ?`, answer: quotient, actualMode:"division" };
  }

  if(mode === "table"){
    const tableNo = Number(tableConfig.number || 11);
    const from = Number(tableConfig.from || 1);
    const to = Number(tableConfig.to || 20);
    const low = Math.min(from,to), high = Math.max(from,to);
    const k = randInt(low, high);
    return { text: `${tableNo} × ${k} = ?`, answer: tableNo*k, actualMode:"table" };
  }
  if(mode === "square"){
    const from = Number(tableConfig.powerFrom || 1);
    const to = Number(tableConfig.powerTo || 30);
    const low = Math.min(from,to), high = Math.max(from,to);
    const n = randInt(low, high);
    return { text: `${n}² = ?`, answer: n*n, actualMode:"square" };
  }

  if(mode === "cube"){
    const from = Number(tableConfig.powerFrom || 1);
    const to = Number(tableConfig.powerTo || 20);
    const low = Math.min(from,to), high = Math.max(from,to);
    const n = randInt(low, high);
    return { text: `${n}³ = ?`, answer: n*n*n, actualMode:"cube" };
  }

  return { text:"No mode selected", answer:0, actualMode:mode };
}
