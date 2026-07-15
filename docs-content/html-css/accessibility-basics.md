# Accessibility basics

Accessibility (often shortened to **a11y**) means building pages that everyone can use — including people who navigate by keyboard, use screen readers, see colors differently, or zoom the text way up. Most of it is just doing HTML properly.

## The big wins (in order)

### 1. Use real elements

Native elements come with keyboard support and screen reader announcements built in:

```html
<!-- Good: works with Enter, Space, Tab, and screen readers -->
<button type="button">Save</button>

<!-- Bad: looks clickable, but keyboards and screen readers can't use it -->
<div class="btn" onclick="save()">Save</div>
```

Links for going places, buttons for doing things.

### 2. Label every image and input

```html
<img src="dog.jpg" alt="A beagle catching a frisbee mid-air" />
<img src="divider.png" alt="" />   <!-- decorative: empty alt, screen readers skip it -->

<label for="email">Email address</label>
<input id="email" type="email" />
```

### 3. Use headings as an outline

Screen reader users jump between headings to skim a page. Keep them in order (`h1` → `h2` → `h3`) without skipping levels.

### 4. Make it work with a keyboard

Unplug your mouse and try your page: **Tab** moves between interactive elements, **Enter** activates them. If you can't reach something, neither can many of your users. Never remove the focus outline without replacing it:

```css
button:focus-visible {
  outline: 3px solid #4d90fe;   /* visible focus = keyboard users can see where they are */
}
```

### 5. Don't rely on color alone

"Errors are shown in red" fails for colorblind users. Pair color with text or an icon:

```html
<p class="error">⚠ Error: please enter your email.</p>
```

And keep text contrast strong — light grey on white is stylish and unreadable.

## When HTML isn't enough: ARIA

ARIA attributes add meaning where no native element exists:

```html
<button aria-label="Close dialog">✕</button>   <!-- names an icon-only button -->
```

The first rule of ARIA: **don't use ARIA if a native element already does the job.**

## Test in ten seconds

Tab through the page. Check images have alt text. Squint at the contrast. That quick habit catches most problems before any user hits them.
