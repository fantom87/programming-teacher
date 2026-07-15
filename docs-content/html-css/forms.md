# Forms

Forms are how users give your page information: sign-ups, searches, checkouts. The pattern is always the same — a `<form>` containing labeled inputs and a submit button.

## A minimal form

```html
<form>
  <label for="name">Your name</label>
  <input id="name" name="name" type="text" />

  <button type="submit">Send</button>
</form>
```

Two attributes to notice:

- **`id` + `for`** connect the label to the input. Clicking the label focuses the input, and screen readers announce it. Every input needs a label.
- **`name`** is the key the value is submitted under.

## Input types

Same element, different `type` — the browser adapts the keyboard and validation:

```html
<input type="text" />                      <!-- one line of text -->
<input type="email" />                     <!-- checks for a valid email shape -->
<input type="password" />                  <!-- hides what's typed -->
<input type="number" min="1" max="10" />
<input type="date" />
<input type="checkbox" />                  <!-- on/off -->
<input type="radio" name="size" value="s" />  <!-- pick ONE of a group -->
```

Radio buttons that share the same `name` form one group — selecting one deselects the others.

## Bigger inputs

```html
<label for="bio">About you</label>
<textarea id="bio" name="bio" rows="4"></textarea>

<label for="topping">Topping</label>
<select id="topping" name="topping">
  <option value="cheese">Cheese</option>
  <option value="mushroom">Mushroom</option>
</select>
```

## Helpful extras

```html
<input type="text" placeholder="e.g. Ada Lovelace" />  <!-- a hint, NOT a label -->
<input type="email" required />                         <!-- must be filled in -->
```

`required` gives you free validation: the browser blocks submission and explains why.

## Handling submission with JavaScript

By default, submitting reloads the page. To handle it yourself:

```js
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  console.log(data.get("name"));
});
```

Golden rules: every input gets a `<label>`, placeholders never replace labels, and use the most specific `type` you can — mobile users get the right keyboard for free.
