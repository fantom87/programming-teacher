# Transitions and animation

Motion makes interfaces feel alive: buttons that ease into a hover color, panels that slide open. CSS gives you two tools — **transitions** (animate between two states) and **keyframe animations** (choreograph multiple steps).

## Transitions: smooth state changes

Without a transition, a hover change is instant. With one, it glides:

```css
button {
  background-color: steelblue;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: navy;
}
```

The pattern: put the `transition` on the element's **normal** state (so it animates in *both* directions), listing the property, duration, and easing.

Transition several properties at once:

```css
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgb(0 0 0 / 0.15);
}
```

## transform: the animator's best friend

`transform` moves, scales, and rotates without disturbing the layout around it — and it's the smoothest thing you can animate:

```css
transform: translateY(-4px);   /* nudge up */
transform: scale(1.05);        /* grow slightly */
transform: rotate(3deg);
```

Stick to animating `transform` and `opacity` when you can; they're cheap for the browser. Animating `width` or `margin` forces layout recalculations and can stutter.

## Keyframe animations: multi-step motion

For motion that runs on its own (not just between two states), define keyframes and attach them:

```css
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.badge {
  animation: pulse 1.5s ease-in-out infinite;
}
```

A one-time entrance:

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.toast {
  animation: fade-in 0.3s ease-out;
}
```

## Easing and taste

`ease` (default), `ease-in`, `ease-out`, and `linear` change the feel; `ease-out` suits most UI (fast start, gentle landing). Keep durations short — 150–300ms for hovers.

## Respect reduced motion

Some users get motion sickness from animation. Honor their setting:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Motion should whisper, not shout: small, quick, purposeful.
