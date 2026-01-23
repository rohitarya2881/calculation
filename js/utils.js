export function pad(n){ return n.toString().padStart(2,"0"); }

export function randInt(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

export function todayStr(){
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

export function ydayStr(){
  const d = new Date();
  d.setDate(d.getDate()-1);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
