import { topTrack, totalMinutes } from "./replay.js";
import type { Play } from "./replay.js";

const rotation: Play[] = [
  { title: "Ember", minutes: 4 },
  { title: "Aurora", minutes: 6 },
  { title: "Jade River", minutes: 5 },
];

console.log(`top track: ${topTrack(rotation)}`);
console.log(`total: ${totalMinutes(rotation)} minutes`);
