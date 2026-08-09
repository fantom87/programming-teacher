interface Song {
  title: string;
  artist: string;
  plays: number;
}

type Flags<T> = { [K in keyof T]: boolean };
type Editable<T> = { [K in keyof T]?: T[K] };

function pluck<T, K extends keyof T>(record: T, keys: K[]): T[K][] {
  return keys.map((key) => record[key]);
}

function remaster(song: Song, changes: Editable<Song>): Song {
  return { ...song, ...changes };
}

const ember: Song = { title: "Ember", artist: "Nova", plays: 41 };

console.log(pluck(ember, ["title", "plays"]).join(","));

const edited = remaster(ember, { title: "Ember (2026)", plays: 9000 });
console.log(`${edited.title} by ${edited.artist}: ${edited.plays} plays`);

const touched: Flags<Song> = { title: true, artist: false, plays: true };
const changedKeys = (Object.keys(touched) as (keyof Song)[]).filter((key) => touched[key]);
console.log(`changed: ${changedKeys.join(", ")}`);
