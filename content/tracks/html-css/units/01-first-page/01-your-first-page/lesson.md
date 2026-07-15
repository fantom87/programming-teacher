---
id: 01-your-first-page
title: Your First Page
language: html-css
runner: browser
estMinutes: 10
files:
  - path: index.html
    starter: starter/index.html
goal: "Make a page with one big heading (h1) that says My First Page, and one paragraph (p) of text below it."
docs: [html-css/document-structure]
checks:
  - id: has-heading
    type: dom
    assertions:
      - { selector: "h1", exists: true }
      - { selector: "h1", textContains: "My First Page" }
  - id: has-paragraph
    type: dom
    assertions:
      - { selector: "p", exists: true }
hints:
  - "Tags wrap content: <h1>text goes here</h1>"
  - "A paragraph works the same way: <p>some text</p>"
---
## Web pages are made of tags

HTML isn't a programming language — it's a **markup** language. You wrap
pieces of text in *tags* that say what each piece **is**:

```html
<h1>I am a big heading</h1>
<p>I am a paragraph of ordinary text.</p>
```

Every tag opens (`<h1>`) and closes (`</h1>`) — the slash means "end of this".
The preview pane shows your page **live as you type**. Watch it change.

### Your goal

1. Add an `<h1>` heading that says **My First Page**.
2. Add a `<p>` paragraph below it saying anything you like.
