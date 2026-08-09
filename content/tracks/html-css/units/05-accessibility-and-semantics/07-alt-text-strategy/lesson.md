---
id: 07-alt-text-strategy
title: Alt-Text Strategy
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Give all four studio images the right alt text for their role: vivid descriptions for the two real photos, exactly alt=\"\" for the decorative divider, and a destination-naming alt for the linked enroll badge."
docs: [html-css/links-and-images, html-css/accessibility-basics]
checks:
  - id: every-img-decided
    type: dom
    assertions:
      - { selector: "img", count: 4 }
      - { selector: "img[alt]", count: 4 }
  - id: decorative-is-silent
    type: dom
    assertions:
      - { selector: "img.divider", attr: "alt", equals: "" }
  - id: alt-quality
    type: ai-judge
    rubric: "Each image's alt matches its role: the .hero and .work images have genuinely descriptive alt text a listener could picture (not a filename, not starting with 'image of' or 'photo of'), the purely decorative .divider has exactly alt=\"\" so screen readers skip it, and the linked .badge image's alt names where the link goes or what it does (enrolling in a class) rather than describing the artwork of the badge. No alt anywhere is a filename or filler."
hints:
  - "Sort the four images first: two informative (.hero, .work), one decorative (.divider), one functional (.badge, inside the enroll link)."
  - "Missing alt and empty alt are opposites. The bare .work img needs a real description; the .divider needs exactly alt=\"\" so screen readers skip it."
  - "For the linked badge, describe the trip, not the sticker: alt=\"Enroll in a class\" — a screen reader reads it as the link's name."
---
## Alt text is a decision, not a caption

Every `img` forces a choice, and it isn't "what words describe this
picture?" It's "what *job* is this picture doing?" Three jobs, three
strategies:

**Informative** — the image carries content. Describe it the way you'd
describe it over the phone: specific, sensory, brief. Never start with
"image of" (the screen reader already announced it's an image), and
never paste the filename — `alt="studio-morning.jpg"` reads aloud as
robot poetry.

**Decorative** — the image is visual seasoning; a divider, a flourish.
The right alt is *empty*: `alt=""`. That's not laziness — it's an
explicit instruction to skip. And note the trap: `alt=""` and a
*missing* alt are opposites. Empty means "nothing to say here, move
along." Missing means the screen reader improvises, often by reading
the filename. Describing the decoration is wrong too:
"decorative glaze swirl divider graphic" is nine syllables of nothing.

**Functional** — the image *is* a control. When an `img` is the entire
content of a link, its alt becomes the link's name. Describe the
destination, not the pixels: a badge that links to class signups should
say `alt="Enroll in a class"`, not "orange circular badge with serif
lettering." Leaving it `alt=""` is the worst case — a screen reader
announces "link" with no name at all. Mystery meat.

The starter is a pottery studio's page committing all three sins: a
hero alt'd with its filename, a decorative divider with a chatty
description, a work photo with no alt, and an enroll badge silenced by
an empty alt. One more thing worth noticing: images in this course
never actually load, so the preview *shows your alt text in place of
every image* — you're seeing the page exactly as a screen reader would
present it.

### Your goal

In `index.html`:

1. `.hero` and `.work`: real descriptions someone could picture.
2. `.divider`: exactly `alt=""`.
3. `.badge`: an alt that names the destination — enrolling in a class.
