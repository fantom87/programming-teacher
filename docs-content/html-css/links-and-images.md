# Links and images

Links connect pages together; images bring them to life. These two elements are the heart of the web.

## Links: the a element

```html
<a href="https://example.com">Visit Example</a>
```

`href` is where the link goes; the text between the tags is what people click.

### Kinds of destinations

```html
<a href="https://example.com">Another website</a>
<a href="about.html">A page in the same folder</a>
<a href="/menu.html">A page from the site root</a>
<a href="#reviews">A section on THIS page</a>       <!-- jumps to id="reviews" -->
<a href="mailto:hi@example.com">Email us</a>
```

The `#reviews` link works when some element has a matching id:

```html
<h2 id="reviews">Reviews</h2>
```

### Opening in a new tab

```html
<a href="https://example.com" target="_blank" rel="noopener">Docs</a>
```

Use sparingly — people can open new tabs themselves. Include `rel="noopener"` for safety.

### Write link text that makes sense alone

Screen reader users often jump between links, hearing only the link text. "Read our pricing guide" works; "click here" doesn't.

## Images: the img element

```html
<img src="cat.jpg" alt="A grey cat asleep on a windowsill" />
```

- **`src`** — the path or URL of the image file
- **`alt`** — text describing the image, shown if it fails to load and read aloud by screen readers

`alt` is not optional. Describe what the image *shows*: "Bar chart of monthly sales, peaking in July" — not "chart" or "image123". If an image is purely decorative, use an empty alt (`alt=""`) so screen readers skip it.

### Sizing

```html
<img src="cat.jpg" alt="A grey cat" width="600" height="400" />
```

Giving width and height prevents the page from jumping around while images load. Keep images flexible in CSS:

```css
img {
  max-width: 100%;
  height: auto;
}
```

## Combining them: an image that links

```html
<a href="gallery.html">
  <img src="thumb.jpg" alt="View the photo gallery" />
</a>
```

When an image is the whole link, its alt text should describe the *destination*.
