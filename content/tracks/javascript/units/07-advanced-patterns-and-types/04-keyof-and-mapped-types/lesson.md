---
id: 04-keyof-and-mapped-types
title: keyof and Mapped Types
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Derive types instead of duplicating them: build Flags<T> and Editable<T> with [K in keyof T] mapped types, and a pluck function whose K extends keyof T constraint makes wrong property names a compile error."
docs: [javascript/typescript-basics, javascript/objects, javascript/arrays]
checks:
  - id: derived-types-run
    type: stdout
    entry: main.ts
    match: exact
    value: "Ember,41\nEmber (2026) by Nova: 9000 plays\nchanged: title, plays\n"
  - id: hand-rolled-mapped-types
    type: ai-judge
    rubric: "Song is an interface with title: string, artist: string, plays: number. Flags<T> and Editable<T> are HAND-WRITTEN mapped types using [K in keyof T] — Flags maps every key to boolean, Editable adds the ? modifier and keeps T[K] as the value type; neither may alias the built-ins (type Editable<T> = Partial<T> is a fail). pluck is generic over <T, K extends keyof T>, takes keys: K[], and returns T[K][] by mapping record[key] — no any anywhere. remaster takes changes: Editable<Song> and merges immutably by spreading the original then the changes. The touched object is annotated Flags<Song>, and the 'changed:' line is COMPUTED by filtering touched's keys on their boolean values — not a hardcoded list. (The runner strips types before executing; the type-level work is graded here and enforced by your editor.)"
hints:
  - "A mapped type walks another type's keys: type Flags<T> = { [K in keyof T]: boolean }; — for Editable, add ? after the bracket and keep the original value type: { [K in keyof T]?: T[K] }."
  - "pluck's constraint ties the two parameters together: function pluck<T, K extends keyof T>(record: T, keys: K[]): T[K][] { return keys.map((key) => record[key]); } — pass a key Song doesn't have and tsc refuses."
  - "Object.keys returns string[], so filtering a Flags<Song> needs one assertion: (Object.keys(touched) as (keyof Song)[]).filter((key) => touched[key]) — then join(\", \") for the changed line."
---
## Types that write themselves

Your `Song` interface has three fields today. Now you need a type for
"which fields changed" (`title: boolean, artist: boolean, ...`) and one
for "a partial edit" (`title?: string, ...`). Write them by hand and
you've created three copies of the same shape — add `album` next sprint
and two of them silently rot.

TypeScript's answer is to **compute types from types**. Step one is
`keyof`:

```ts
type SongKey = keyof Song;   // "title" | "artist" | "plays"
```

A union of the property names, kept in sync by the compiler. Step two
puts it to work in a **mapped type** — a `for...of` loop that runs at
type level:

```ts
type Flags<T> = { [K in keyof T]: boolean };
type Editable<T> = { [K in keyof T]?: T[K] };
```

Read the first one: *for each key `K` in `T`, a property `K` of type
`boolean`.* The second keeps each original value type (`T[K]` is an
**indexed access** — "the type of `T` at key `K`") and bolts on the `?`
modifier. `Flags<Song>` and `Editable<Song>` now update themselves when
`Song` grows. You've been consuming this machinery all along —
`Partial`, `Required`, `Readonly`, `Pick` are one-line mapped types in
the standard library; today you build your own.

`keyof` also earns its keep at runtime boundaries:

```ts
function pluck<T, K extends keyof T>(record: T, keys: K[]): T[K][]
```

The constraint ties `keys` to *actual properties of `T`* —
`pluck(song, ["titel"])` is a compile error, not an `undefined` in
production. (As ever in this track: the runner strips types and runs
the JavaScript; the AI reviewer and your editor grade the type-level
half.)

### Your goal

1. `interface Song` — `title: string`, `artist: string`,
   `plays: number`.
2. `Flags<T>` and `Editable<T>` as above — hand-rolled, no `Partial`.
3. `pluck<T, K extends keyof T>(record, keys)` returning `T[K][]`.
4. `remaster(song: Song, changes: Editable<Song>): Song` — spread merge.
5. The demo: pluck `["title", "plays"]` from Ember by Nova (41 plays),
   remaster it to `"Ember (2026)"` with 9000 plays, and compute the
   `changed:` line from a `Flags<Song>` object:

```
Ember,41
Ember (2026) by Nova: 9000 plays
changed: title, plays
```
