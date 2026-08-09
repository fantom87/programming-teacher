const heading = { tag: "h1", id: "", classes: [], text: "Old headline", children: [] };
const article = { tag: "article", id: "", classes: [], text: "", children: [heading] };

// 1. setText(el, text) — put text into el.text (mutate it; no return needed).

// 2. createElement(tag, text) — RETURN a brand-new element object:
//    { tag: tag, id: "", classes: [], text: text, children: [] }

// 3. append(parent, child) — push child onto parent.children, RETURN child.

// 4. Use your tools:
//    - change the heading's text to "Fresh headline"
//    - create a p element saying "It works." and append it to the article
//    - console.log(article.children.length);    // 2
//    - console.log(article.children[1].text);   // It works.
