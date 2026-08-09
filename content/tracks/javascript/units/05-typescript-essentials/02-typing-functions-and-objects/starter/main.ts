// Three signature tools: defaults, optional parameters, object shapes.

// 1. formatPrice(cents: number, symbol: string = "$"): string
//    1250 -> "$12.50" — divide by 100, .toFixed(2), symbol in front.

// 2. describeBook(book: { title: string; pages: number }): string
//    Returns `${book.title} (${book.pages} pages)`.

// 3. tagLine(text: string, tag?: string): string
//    With a tag: `[${tag}] ${text}`. Without: just the text.

// 4. Then uncomment:
// console.log(formatPrice(1250));
// console.log(formatPrice(399, "€"));
// console.log(describeBook({ title: "The Mythical Man-Month", pages: 322 }));
// console.log(tagLine("backup the server", "urgent"));
// console.log(tagLine("backup the server"));
