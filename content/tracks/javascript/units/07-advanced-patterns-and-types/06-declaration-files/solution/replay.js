// replay.js — the season-replay stats module. Plain JavaScript, written
// long before this project adopted TypeScript. It works; nobody is
// rewriting it. DO NOT EDIT — describe it in replay.d.ts instead.

export function topTrack(plays) {
  return plays.reduce((best, play) => (play.minutes > best.minutes ? play : best)).title;
}

export function totalMinutes(plays) {
  return plays.reduce((sum, play) => sum + play.minutes, 0);
}
