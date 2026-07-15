# Debugging with DevTools

Every browser ships with **DevTools** — a built-in toolbox for seeing what your page is actually doing. Open it with **F12** (or right-click → *Inspect*). Debugging is detective work: gather clues, form a theory, test it.

## The Console: your first stop

The Console shows errors and everything you `console.log`. Sprinkle logs to see what your code is really doing:

```js
console.log("user is", user);          // label your logs!
console.log({ score, level, lives });  // object shorthand: names AND values
console.table(players);                // arrays of objects as a neat table
console.error("This stands out in red");
```

The Console is also a live JavaScript playground — type expressions, poke at variables, call your functions directly.

## Reading error messages

Errors are clues, not insults. Read them bottom to top of your understanding:

```text
Uncaught TypeError: Cannot read properties of null (reading 'value')
    at app.js:12
```

Translation: at line 12 of app.js, you did `something.value` but `something` was `null` — probably a `querySelector` that found nothing. Click the file:line link to jump straight there.

## Breakpoints: pause time

Logs show the past; **breakpoints** freeze the present. In the **Sources** panel, click a line number — the browser pauses there so you can inspect every variable.

While paused:

- **Hover** any variable to see its value
- **Step over** (F10): run the current line, move to the next
- **Step into** (F11): follow a function call inside
- **Resume** (F8): keep going until the next breakpoint

You can also pause from code:

```js
debugger;   // pauses here whenever DevTools is open
```

## The Elements and Network panels

- **Elements** shows the live DOM. Great for checking "did my class actually get added?" and experimenting with CSS.
- **Network** lists every request. If your `fetch` fails, look here: was the URL right? What status code came back? Click a request to see its response body.

## A simple debugging routine

1. Reproduce the bug reliably.
2. Read the exact error message and line number.
3. Log or breakpoint just *before* things go wrong.
4. Check your assumption — the bug lives where reality disagrees with what you expected.
