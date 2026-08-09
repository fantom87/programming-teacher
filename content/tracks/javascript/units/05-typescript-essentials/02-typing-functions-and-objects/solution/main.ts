function formatPrice(cents: number, symbol: string = "$"): string {
  return symbol + (cents / 100).toFixed(2);
}

function describeBook(book: { title: string; pages: number }): string {
  return `${book.title} (${book.pages} pages)`;
}

function tagLine(text: string, tag?: string): string {
  if (tag) return `[${tag}] ${text}`;
  return text;
}

console.log(formatPrice(1250));
console.log(formatPrice(399, "€"));
console.log(describeBook({ title: "The Mythical Man-Month", pages: 322 }));
console.log(tagLine("backup the server", "urgent"));
console.log(tagLine("backup the server"));
