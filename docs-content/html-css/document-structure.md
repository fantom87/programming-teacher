# Document structure

Every web page is an HTML document with the same skeleton. Once you know it, every page on the internet looks familiar.

## The skeleton

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My First Page</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>This is my page.</p>
    <script src="app.js"></script>
  </body>
</html>
```

## What each part does

- **`<!DOCTYPE html>`** — tells the browser "this is modern HTML." Always the first line.
- **`<html lang="en">`** — wraps everything. The `lang` attribute helps screen readers and translators.
- **`<head>`** — information *about* the page. Nothing here is visible on the page itself.
- **`<body>`** — everything the visitor actually sees.

## Inside the head

```html
<meta charset="UTF-8" />          <!-- handle all characters, including emoji -->
<meta name="viewport"
      content="width=device-width, initial-scale=1" />  <!-- look right on phones -->
<title>My First Page</title>      <!-- browser tab text and search result title -->
<link rel="stylesheet" href="styles.css" />   <!-- attach your CSS -->
```

## Anatomy of an element

```html
<p class="intro">Welcome!</p>
```

- `<p>` is the **opening tag**, `</p>` the **closing tag**
- `class="intro"` is an **attribute** — extra information as name="value"
- `Welcome!` is the **content**

Some elements are self-contained and have no closing tag, like `<img />`, `<br />`, and `<meta />`.

## Nesting

Elements sit inside each other like boxes in boxes. Close them in the reverse order you opened them:

```html
<p>This is <strong>very important</strong> text.</p>   <!-- correct -->
<p>This is <strong>wrong.</p></strong>                 <!-- tags crossed! -->
```

Indenting nested elements isn't required, but it makes the structure obvious at a glance — a habit worth building from day one.
