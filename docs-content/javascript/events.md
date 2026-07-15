# Events

An **event** is something that happens on the page: a click, a keypress, a form being submitted. You attach a function (a *listener* or *handler*) that runs whenever the event fires.

## addEventListener

```js
const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("Button clicked!");
});
```

Pattern: `element.addEventListener("event name", functionToRun)`. The function runs every time the event happens — once per click, forever.

## The event object

Your handler receives an object full of details about what happened:

```js
button.addEventListener("click", (event) => {
  console.log(event.target);   // the element that was clicked
});

const input = document.querySelector("#name");
input.addEventListener("keydown", (event) => {
  console.log(`You pressed: ${event.key}`);
});
```

## Common events

| Event | Fires when... |
| --- | --- |
| `click` | an element is clicked |
| `input` | a field's value changes (every keystroke) |
| `change` | a field's value is committed (checkbox, select, blur) |
| `submit` | a form is submitted |
| `keydown` | a key is pressed |
| `mouseover` | the pointer enters an element |

## Forms: preventDefault

Browsers reload the page when a form submits. To handle it yourself, stop the default behavior:

```js
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();   // no page reload
  const name = document.querySelector("#name").value;
  console.log(`Hello, ${name}!`);
});
```

## Event delegation

Events *bubble* up from the clicked element to its ancestors. So one listener on a parent can handle clicks for many children — even ones added later:

```js
const list = document.querySelector("ul");

list.addEventListener("click", (event) => {
  if (event.target.matches("li")) {
    event.target.classList.toggle("done");
  }
});
```

## Removing a listener

```js
function onClick() { console.log("hi"); }

button.addEventListener("click", onClick);
button.removeEventListener("click", onClick);  // must be the same function
```

Events are the heartbeat of interactive pages: find an element, listen, react.
