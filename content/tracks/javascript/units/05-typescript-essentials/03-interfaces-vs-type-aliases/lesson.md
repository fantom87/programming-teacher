---
id: 03-interfaces-vs-type-aliases
title: Interfaces vs Type Aliases
language: javascript
runner: local
estMinutes: 18
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Name your shapes: an interface Song, a type alias Playlist = Song[], a LiveSong that extends Song, and two typed functions that print the four-line setlist report."
docs: [javascript/typescript-basics, javascript/objects, javascript/arrays]
checks:
  - id: setlist-report
    type: stdout
    entry: main.ts
    match: exact
    value: "Neon Tide - The Halogens (214s)\nPaper Planets - Orbit Club (203s)\n2 songs, 417 seconds\nStatic Bloom live at The Roxy\n"
  - id: shapes-are-named
    type: ai-judge
    rubric: "Song is declared with the interface keyword (title/artist strings, seconds number); Playlist is a type alias equal to Song[]; LiveSong is an interface extending Song that adds venue: string (not a copy of all four fields). describe takes a Song and totalTime takes a Playlist and sums seconds with reduce or a loop — 417 and the \"2\" in the summary are computed (length + totalTime), never typed as literals."
hints:
  - "interface Song { title: string; artist: string; seconds: number } — then type Playlist = Song[]; on one line."
  - "totalTime: songs.reduce((sum, song) => sum + song.seconds, 0) — the summary line is `${setlist.length} songs, ${totalTime(setlist)} seconds`."
  - "interface LiveSong extends Song { venue: string } — the encore object then needs all four fields, or tsc would complain."
---
## Naming your shapes

Last lesson's inline object type worked, but imagine typing
`{ title: string; pages: number }` at five different call sites. Shapes
deserve **names**, and TypeScript gives you two ways to make one:

```ts
interface Song {
  title: string;
  artist: string;
  seconds: number;
}

type Playlist = Song[];
```

An **interface** describes an object shape. A **type alias** (`type`)
names *any* type at all — an object shape too, but also an array, a
union, even plain `string`. That's the real difference at this stage:
`type Playlist = Song[]` is something `interface` can't say directly.

Interfaces answer back with `extends` — building a bigger shape on top
of a smaller one:

```ts
interface LiveSong extends Song {
  venue: string;
}
```

A `LiveSong` has all of `Song`'s fields plus `venue`. Anywhere a `Song`
is expected, a `LiveSong` is welcome — it satisfies the contract with
room to spare. This is *structural* typing: TypeScript matches shapes,
not names.

So which do you reach for? The widely used rule of thumb, and the one
this course follows: **`interface` for object shapes, `type` for
everything else** (arrays, unions, function types). Where both work
they're nearly interchangeable — don't let anyone tell you it's a
holy war.

Both erase completely at runtime, of course. A named shape then pays
rent in every signature:

```ts
function describe(song: Song): string { ... }
function totalTime(songs: Playlist): number { ... }
```

Compare that to the inline version. This is why real codebases open with
a small block of interfaces — the vocabulary of the file.

### Your goal

1. Declare `interface Song` and `type Playlist = Song[]`; annotate the
   starter's `setlist` as `Playlist`.
2. `describe(song: Song): string` → `"Neon Tide - The Halogens (214s)"`.
3. `totalTime(songs: Playlist): number` — total seconds, via `reduce`.
4. `interface LiveSong extends Song` adding `venue: string`; make the
   `encore` from the starter comment.
5. Print each setlist song, the summary line (computed from `.length`
   and `totalTime`), then the encore line:

```
Neon Tide - The Halogens (214s)
Paper Planets - Orbit Club (203s)
2 songs, 417 seconds
Static Bloom live at The Roxy
```
