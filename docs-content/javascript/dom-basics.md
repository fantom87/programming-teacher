# DOM basics

The **DOM** (Document Object Model) is the browser's live, in-memory version of your HTML page. JavaScript can read it and change it — that's how pages become interactive.

Think of the HTML file as the recipe and the DOM as the actual cake: JavaScript edits the cake.

## Finding elements

`document` is your entry point. The go-to method is `querySelector`, which uses the same selectors as CSS:

```js
const heading = document.querySelector("h1");        // first <h1>
const intro = document.querySelector("#intro");      // element with id="intro"
const firstCard = document.querySelector(".card");   // first element with class="card"
const allCards = document.querySelectorAll(".card"); // ALL of them (a list)
```

If nothing matches, `querySelector` returns `null` — check before using it.

## Reading and changing content

```js
heading.textContent;                  // read the text inside
heading.textContent = "New title!";   // replace it

const box = document.querySelector("#box");
box.innerHTML = "<strong>Bold!</strong>";  // insert HTML (only with text YOU wrote,
                                           // never raw user input — that's unsafe)
```

## Changing styles and classes

```js
box.style.backgroundColor = "gold";   // inline style (note: camelCase)

box.classList.add("highlighted");     // better: toggle CSS classes
box.classList.remove("hidden");
box.classList.toggle("open");         // add if absent, remove if present
```

Prefer `classList` — keep the *look* in your CSS file and just switch classes from JavaScript.

## Creating and adding elements

```js
const item = document.createElement("li");
item.textContent = "New task";

const list = document.querySelector("ul");
list.append(item);        // add to the end
item.remove();            // take it back out
```

## Reading attributes and form values

```js
const link = document.querySelector("a");
link.getAttribute("href");            // read an attribute
link.setAttribute("target", "_blank");

const input = document.querySelector("input");
console.log(input.value);             // what the user typed
```

The DOM really clicks once elements start responding to clicks and keystrokes — head to the events page next.
