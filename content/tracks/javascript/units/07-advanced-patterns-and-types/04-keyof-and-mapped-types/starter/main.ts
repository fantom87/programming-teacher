// Derive types from types: keyof, mapped types, indexed access.

// 1. interface Song — title: string, artist: string, plays: number.

// 2. Hand-rolled mapped types (no Partial/Readonly aliases):
//    type Flags<T>    = { [K in keyof T]: boolean };
//    type Editable<T> = { ...same walk, but optional, keeping T[K] };

// 3. pluck<T, K extends keyof T>(record: T, keys: K[]): T[K][]
//    — keys.map((key) => record[key]); wrong key names must not compile.

// 4. remaster(song: Song, changes: Editable<Song>): Song
//    — a new object: spread the original, then the changes.

// 5. The demo:
// const ember: Song = { title: "Ember", artist: "Nova", plays: 41 };
// console.log(pluck(ember, ["title", "plays"]).join(","));
//
// const edited = remaster(ember, { title: "Ember (2026)", plays: 9000 });
// console.log(`${edited.title} by ${edited.artist}: ${edited.plays} plays`);
//
// const touched: Flags<Song> = { title: true, artist: false, plays: true };
// ...compute the changed keys by filtering touched, then:
// console.log(`changed: ${changedKeys.join(", ")}`);
