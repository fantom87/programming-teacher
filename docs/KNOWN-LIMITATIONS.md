# Known limitations

Consciously deferred items from the full-codebase review (2026-08). Each was
judged either low-risk, unreachable with current content, or better solved by
a planned feature.

## Two windows share one data folder
Running the desktop app AND a browser tab (or two windows) against the same
server works, but both share drafts and tutor sessions with last-write-wins
semantics — typing in the same lesson in two windows will silently overwrite
one side's draft. Use one window per lesson. A revision-checked draft protocol
is the proper fix if this ever bites.

## Renaming or moving lessons orphans progress
Progress, drafts, and snapshots are keyed by lesson path
(`track/unit/lesson`). If content is renamed, prior completions for the old
key stop counting. Nothing breaks — the state just goes quiet. A
`formerly:`-alias in lesson frontmatter plus a one-time key migration is the
planned fix before any big content reorganization (v1.5's tutor-authored
content should avoid renames).

## No C# test harness
The `tests` check type supports Python and JavaScript. C# lessons use
`stdout` and `ai-judge` checks only (all shipped content complies; the
content lint flags dom-check misuse but not a hypothetical C# `tests`
check). Add `CS_TEST_HARNESS` alongside the others if C# unit-style checks
are ever wanted.

## HTML preview has no console pane
`console.log` inside an HTML/CSS lesson's scripts goes nowhere visible — the
preview iframe has no console capture bridge. HTML lessons in the shipped
Foundations unit don't use scripts, so nothing is currently hidden. Revisit
when the JS DOM unit (`03-the-dom-and-events`) is authored — those lessons
will need the bridge anyway.

## Content auto-commits
The plan's "auto-commit content/ changes" idea is deferred to v1.5 alongside
`author_lesson` — until the tutor writes content, every content change comes
through a human-reviewed commit anyway.

## Transcript reseeding shows tutor turns only
After a reconnect/remount, the rebuilt chat shows the tutor's replies and
tool chips (from the server's SSE replay buffer) but not your own past
message bubbles — the server buffers outbound events only. Cosmetic; the
tutor itself remembers the full conversation.
