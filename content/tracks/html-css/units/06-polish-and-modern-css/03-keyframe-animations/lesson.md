---
id: 03-keyframe-animations
title: Keyframe Animations
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Put Perch Radio on air: write @keyframes pulse (opacity dips to 0.45 at the midpoint), attach it to .live-dot with the four animation longhands (pulse, 1.6s, ease-in-out, infinite), then pause it inside @media (prefers-reduced-motion: reduce)."
docs: [html-css/transitions-and-animation, html-css/accessibility-basics]
checks:
  - id: animation-attached
    type: dom
    assertions:
      - { selector: ".live-dot", cssRule: { property: "animation-name", equals: "pulse" } }
      - { selector: ".live-dot", cssRule: { property: "animation-duration", equals: "1.6s" } }
      - { selector: ".live-dot", cssRule: { property: "animation-timing-function", equals: "ease-in-out" } }
      - { selector: ".live-dot", cssRule: { property: "animation-iteration-count", equals: "infinite" } }
  - id: motion-respect
    type: dom
    assertions:
      - { selector: ".live-dot", cssRule: { property: "animation-play-state", equals: "paused" } }
  - id: keyframes-and-placement
    type: ai-judge
    rubric: "A @keyframes pulse block exists with three steps — from/0% at opacity 1, 50% at opacity 0.45, and to/100% back at opacity 1 — so the loop ends where it starts and never visibly jumps. The four animation longhands (name/duration/timing-function/iteration-count) sit on .live-dot in normal, unconditional CSS. The animation-play-state: paused rule for .live-dot lives INSIDE a @media (prefers-reduced-motion: reduce) block and nowhere else — with reduced motion off, the dot pulses; with it on, the dot is still visible but static. No motion properties beyond these were added."
hints:
  - "Two parts: define the choreography (@keyframes pulse { from { opacity: 1; } 50% { opacity: 0.45; } to { opacity: 1; } }), then attach it to .live-dot with the four animation-* longhands."
  - "On .live-dot: animation-name: pulse; animation-duration: 1.6s; animation-timing-function: ease-in-out; animation-iteration-count: infinite;"
  - "The reduced-motion override is a normal rule in a media block: @media (prefers-reduced-motion: reduce) { .live-dot { animation-play-state: paused; } } — the dot stays on screen, it just stops throbbing."
---
## Motion with no trigger

Transitions need a state change — something to hover, something to
focus. But the red **LIVE** dot on a radio site should pulse the moment
the page loads, forever, touched by no one. That's a **keyframe
animation**: you write the choreography once, then attach it.

The choreography is a `@keyframes` block — a named timeline:

```css
@keyframes pulse {
  from { opacity: 1; }
  50%  { opacity: 0.45; }
  to   { opacity: 1; }
}
```

`from`/`to` are sugar for `0%`/`100%`, and you can add stops anywhere
between. One craft rule: **loops must end where they begin.** This one
runs 1 → 0.45 → 1, so the restart is invisible. End at 0.45 and the dot
would blink hard every cycle.

Attaching it takes four decisions, one property each:

```css
.live-dot {
  animation-name: pulse;
  animation-duration: 1.6s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
```

In the wild you'll mostly see the shorthand —
`animation: pulse 1.6s ease-in-out infinite;` — same four values, one
line. Write the longhands here: every knob gets a name while you're
learning which knobs exist (there are more: `animation-delay`,
`animation-direction`, `animation-play-state`).

That last one matters. Some people get genuinely motion-sick from
pulsing, sliding interfaces, and their OS has a "reduce motion" setting
that CSS can hear — the same `@media` grammar you know, asking about a
preference instead of a width:

```css
@media (prefers-reduced-motion: reduce) {
  .live-dot {
    animation-play-state: paused;
  }
}
```

The dot stays — it's *information*, the station is live — but it holds
still. Shipping an infinite animation without this override is the kind
of thing accessibility reviews flag on day one.

### Your goal

In `styles.css`:

1. `@keyframes pulse` — `from` opacity `1`, `50%` opacity `0.45`, `to`
   opacity `1`.
2. Attach it to `.live-dot` with the four longhands: name `pulse`,
   duration `1.6s`, timing-function `ease-in-out`, iteration-count
   `infinite`.
3. Inside `@media (prefers-reduced-motion: reduce)`, set `.live-dot` to
   `animation-play-state: paused;`.
