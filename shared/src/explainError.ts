import type { Language } from "./types.js";

// Plain-English explanations for the errors beginners actually hit — pattern
// matched, no AI, no network, instant. This is deliberately NOT a replacement
// for the tutor: it explains what an error *means* and where to look, never
// what to write. It works offline, when the tutor is unreachable, and while
// the learner is waiting for a reply.

export interface ErrorExplanation {
  /** short headline, e.g. "A name Python doesn't recognize" */
  title: string;
  /** 1-3 sentences in plain language */
  explanation: string;
  /** concrete next move, phrased as a place to look rather than a fix */
  lookFor: string;
  /** the identifier/token pulled out of the message, when there is one */
  subject?: string;
}

interface Rule {
  languages?: Language[]; // undefined = any language
  match: RegExp;
  build: (m: RegExpMatchArray) => ErrorExplanation;
}

const RULES: Rule[] = [
  // ---------- Python ----------
  {
    languages: ["python"],
    match: /NameError: name '([^']+)' is not defined/,
    build: (m) => ({
      title: `Python doesn't recognize the name “${m[1]}”`,
      explanation:
        "Python reads your file top to bottom, and by the time it reached this line, nothing called " +
        `“${m[1]}” existed yet. Almost always this is a typo, or a variable used before it is created.`,
      lookFor: `Check the spelling of “${m[1]}” — and make sure the line that creates it runs before the line that uses it.`,
      subject: m[1],
    }),
  },
  {
    languages: ["python"],
    match: /IndentationError: (?:expected an indented block|unindent does not match)/,
    build: () => ({
      title: "The indentation isn't lining up",
      explanation:
        "Python uses indentation to decide what belongs inside an if, a loop, or a function. " +
        "This block is indented differently than Python expected.",
      lookFor: "Check that every line inside the block is indented the same amount — and don't mix tabs with spaces.",
    }),
  },
  {
    languages: ["python"],
    match: /SyntaxError: (.+)/,
    build: (m) => ({
      title: "Python couldn't parse the code",
      explanation: `Something is malformed, so Python stopped before running anything. It reported: ${m[1].trim()}.`,
      lookFor:
        "Look at the line in the error and the line just above it — a missing closing bracket or quote is usually reported on the line after the real mistake.",
    }),
  },
  {
    languages: ["python"],
    match: /TypeError: (?:can only concatenate str|unsupported operand type\(s\) for [^:]+: '([^']+)' and '([^']+)')/,
    build: (m) => ({
      title: "Mixing two kinds of value that don't combine",
      explanation: m[1]
        ? `You asked Python to combine a ${m[1]} with a ${m[2]}, and it has no rule for that pairing — text and numbers are the usual culprits.`
        : "You tried to join text with something that isn't text. Python won't guess how to combine them.",
      lookFor: "Convert one side first — str(...) turns a number into text, int(...) or float(...) turns text into a number.",
    }),
  },
  {
    languages: ["python"],
    match: /IndexError: list index out of range/,
    build: () => ({
      title: "Asked for an item past the end of the list",
      explanation:
        "List positions start at 0, so a list of 3 items has positions 0, 1, and 2 — asking for position 3 goes off the end.",
      lookFor: "Check the number in the square brackets, and remember the last position is len(list) - 1.",
    }),
  },
  {
    languages: ["python"],
    match: /KeyError: '?([^'\n]+)'?/,
    build: (m) => ({
      title: `That dictionary has no key “${m[1]}”`,
      explanation:
        "You asked a dictionary for a key it doesn't contain. Keys are exact — capitalisation and spaces count.",
      lookFor: `Print the dictionary to see its real keys, or use .get("${m[1]}") to get None instead of an error.`,
      subject: m[1],
    }),
  },
  {
    languages: ["python"],
    match: /AttributeError: '([^']+)' object has no attribute '([^']+)'/,
    build: (m) => ({
      title: `A ${m[1]} has no “${m[2]}”`,
      explanation: `You called .${m[2]} on a ${m[1]}, which doesn't have that. Often the value isn't the type you expected it to be.`,
      lookFor: `Print the value just before this line to check what it actually is — and check the spelling of “${m[2]}”.`,
      subject: m[2],
    }),
  },
  {
    languages: ["python"],
    match: /ZeroDivisionError/,
    build: () => ({
      title: "Divided by zero",
      explanation: "Division by zero has no answer, so Python stops rather than inventing one.",
      lookFor: "Check the value on the right of the / — it became 0 somewhere. Guard it with an if before dividing.",
    }),
  },
  {
    languages: ["python"],
    match: /ModuleNotFoundError: No module named '([^']+)'/,
    build: (m) => ({
      title: `No module named “${m[1]}”`,
      explanation:
        `Python couldn't find “${m[1]}”. Either the name is misspelled, or it's a package that isn't available in this lesson's environment.`,
      lookFor: "Check the spelling first. Lessons only import from the standard library unless they say otherwise.",
      subject: m[1],
    }),
  },

  // ---------- JavaScript / TypeScript ----------
  {
    languages: ["javascript"],
    match: /ReferenceError: (\w+) is not defined/,
    build: (m) => ({
      title: `JavaScript doesn't recognize “${m[1]}”`,
      explanation:
        `Nothing named “${m[1]}” exists at the point where you used it. Usually a typo, or a variable used before its let/const line runs.`,
      lookFor: `Check the spelling of “${m[1]}”, and make sure it's declared above the line that uses it.`,
      subject: m[1],
    }),
  },
  {
    languages: ["javascript"],
    // Two message shapes for property access — Node ≥16 says "Cannot read
    // properties of undefined (reading 'x')", older engines and some browsers
    // say "Cannot read property 'x' of undefined" — plus the not-a-function case.
    match:
      /TypeError: (?:Cannot read properties of (undefined|null) \(reading '([^']+)'\)|Cannot read property '([^']+)' of (undefined|null)|([\w$.]+) is not a function)/,
    build: (m) => {
      const fn = m[5];
      if (fn) {
        return {
          title: `“${fn}” isn't a function`,
          explanation:
            "You called it with parentheses, but the value isn't something that can be called — often a misspelled method name, or a variable holding something other than you expect.",
          lookFor: `Check the spelling of “${fn}” and log the value just before the call to see what it really is.`,
          subject: fn,
        };
      }
      const kind = m[1] ?? m[4]; // undefined | null
      const prop = m[2] ?? m[3];
      return {
        title: `Reached into something that is ${kind}`,
        explanation:
          `You asked for .${prop} on a value that is ${kind} — the thing you expected to be there wasn't. ` +
          "This is the single most common JavaScript error.",
        lookFor: `Work backwards: log the value you're calling .${prop} on. Something upstream returned ${kind} instead of a real value.`,
        subject: prop,
      };
    },
  },
  {
    languages: ["javascript"],
    match: /SyntaxError: (.+)/,
    build: (m) => ({
      title: "JavaScript couldn't parse the code",
      explanation: `Something is malformed, so nothing ran. It reported: ${m[1].trim()}.`,
      lookFor: "Check the reported line and the one above it — unbalanced brackets, braces, or quotes are the usual cause.",
    }),
  },

  // ---------- C# ----------
  {
    languages: ["csharp"],
    match: /error CS0103: The name '([^']+)' does not exist/,
    build: (m) => ({
      title: `The compiler doesn't know “${m[1]}”`,
      explanation:
        `Nothing named “${m[1]}” is visible here. C# checks this before running anything, so the program never started.`,
      lookFor: `Check the spelling and capitalisation of “${m[1]}” — C# is case-sensitive — and that it's declared in this scope.`,
      subject: m[1],
    }),
  },
  {
    languages: ["csharp"],
    match: /error CS1002: ; expected/,
    build: () => ({
      title: "A missing semicolon",
      explanation: "Every statement in C# ends with a semicolon, and one is missing at the reported position.",
      lookFor: "Look at the end of the line named in the error — and the line just before it.",
    }),
  },
  {
    languages: ["csharp"],
    match: /error CS0029: Cannot implicitly convert type '([^']+)' to '([^']+)'/,
    build: (m) => ({
      title: `A ${m[1]} won't fit in a ${m[2]}`,
      explanation:
        `C# checks types before running. You gave it a ${m[1]} where a ${m[2]} was required, and it refuses to guess a conversion that might lose information.`,
      lookFor: `Either change the declared type, or convert explicitly — e.g. int.Parse(...) or .ToString().`,
    }),
  },
  {
    languages: ["csharp"],
    match: /NullReferenceException/,
    build: () => ({
      title: "Used something that was null",
      explanation:
        "A variable that should have held an object held nothing at all, and the program tried to use it anyway.",
      lookFor: "Find the variable on the reported line and trace back to where it was assigned — something returned null.",
    }),
  },

  // ---------- SQL ----------
  {
    languages: ["sql"],
    match: /no such table: (\w+)/,
    build: (m) => ({
      title: `There's no table called “${m[1]}”`,
      explanation:
        `The database has no table by that name. In these lessons the tables are created by the schema file that runs before your query.`,
      lookFor: `Check the spelling of “${m[1]}” against the schema tab — table names are exact.`,
      subject: m[1],
    }),
  },
  {
    languages: ["sql"],
    match: /no such column: ([\w.]+)/,
    build: (m) => ({
      title: `There's no column called “${m[1]}”`,
      explanation:
        "The column doesn't exist on the tables in this query. A common cause is quoting: single quotes mean text, so a misquoted value is read as a column name.",
      lookFor: `Check “${m[1]}” against the schema — and if you meant it as text, use single quotes around the value.`,
      subject: m[1],
    }),
  },
  {
    languages: ["sql"],
    match: /(?:near "([^"]+)": )?syntax error/,
    build: (m) => ({
      title: "The database couldn't parse this SQL",
      explanation: m[1]
        ? `Something is wrong at or just before “${m[1]}”. SQLite reports where it gave up, which is usually one token after the real mistake.`
        : "Something is malformed in the statement.",
      lookFor: "Read the clause order out loud: SELECT … FROM … WHERE … GROUP BY … ORDER BY. A missing comma or keyword is the usual cause.",
    }),
  },

  // ---------- Go ----------
  {
    languages: ["go"],
    match: /undefined: (\w+)/,
    build: (m) => ({
      title: `Go doesn't recognize “${m[1]}”`,
      explanation: `Nothing named “${m[1]}” is defined or imported. Go checks this at compile time, so nothing ran.`,
      lookFor: `Check the spelling, and whether it needs an import. Remember Go exports only capitalised names from a package.`,
      subject: m[1],
    }),
  },
  {
    languages: ["go"],
    match: /declared and not used: (\w+)/,
    build: (m) => ({
      title: `“${m[1]}” is declared but never used`,
      explanation:
        "Go treats an unused variable as an error, not a warning — it's usually a sign of a half-finished edit.",
      lookFor: `Either use ${m[1]}, delete it, or assign to _ if you genuinely mean to discard it.`,
      subject: m[1],
    }),
  },

  // ---------- Rust ----------
  {
    languages: ["rust"],
    match: /error\[E0382\]: (?:borrow|use) of moved value: `([^`]+)`/,
    build: (m) => ({
      title: `“${m[1]}” was moved, and then used again`,
      explanation:
        "In Rust, assigning or passing a value can *move* ownership of it. After a move, the original name is no longer usable — this is the borrow checker doing its job, not a bug in your logic.",
      lookFor: `Decide what you want: borrow with &${m[1]} to lend it, or .clone() to make a second copy.`,
      subject: m[1],
    }),
  },
  {
    languages: ["rust"],
    match: /error\[E0502\]|error\[E0499\]/,
    build: () => ({
      title: "Two borrows that can't coexist",
      explanation:
        "Rust allows either many readers or one writer, never both at once. Two overlapping borrows of the same value broke that rule.",
      lookFor: "Narrow the lifetime of the first borrow — often finishing with it (or ending its scope) before the second begins.",
    }),
  },
  {
    languages: ["rust"],
    match: /error\[E0308\]: mismatched types/,
    build: () => ({
      title: "The types don't line up",
      explanation: "Rust expected one type and found another. It won't convert silently.",
      lookFor: "Read the 'expected … found …' lines in the error — they name both sides precisely.",
    }),
  },

  // ---------- Any language ----------
  {
    match: /Timed out after ([\d.]+)s/,
    build: (m) => ({
      title: "The program never finished",
      explanation:
        `It was still running after ${m[1]} seconds, so it was stopped. Almost always this is a loop whose exit condition never becomes true.`,
      lookFor:
        "Check your loop: does the value it tests actually change inside the loop, and does it move toward the stopping condition?",
    }),
  },
];

/**
 * Best-effort plain-English reading of an error. Returns null when nothing
 * matches — callers should stay silent rather than guess.
 */
export function explainError(stderr: string, language: Language): ErrorExplanation | null {
  if (!stderr.trim()) return null;
  for (const rule of RULES) {
    if (rule.languages && !rule.languages.includes(language)) continue;
    const m = stderr.match(rule.match);
    if (m) return rule.build(m);
  }
  return null;
}

/**
 * Where two outputs first diverge, described for a human. Whitespace is made
 * visible because "trailing space" is invisible and costs beginners hours.
 */
export function describeOutputDifference(expected: string, actual: string): string | null {
  const e = expected.replace(/\r\n/g, "\n");
  const a = actual.replace(/\r\n/g, "\n");
  if (e === a) return null;

  // Drop the empty element a trailing newline leaves behind, so "a\nb\n" vs
  // "a\n" reads as a missing line rather than a mismatch against "".
  const eLines = dropTrailingBlank(e.split("\n"));
  const aLines = dropTrailingBlank(a.split("\n"));
  for (let i = 0; i < Math.max(eLines.length, aLines.length); i++) {
    if (eLines[i] === aLines[i]) continue;
    if (aLines[i] === undefined) return `Line ${i + 1} is missing — expected ${visible(eLines[i])}.`;
    if (eLines[i] === undefined) return `Line ${i + 1} is extra — got ${visible(aLines[i])} but nothing was expected.`;
    const col = firstDifferingColumn(eLines[i], aLines[i]);
    return (
      `Line ${i + 1} differs at character ${col + 1}: expected ${visible(eLines[i])}, got ${visible(aLines[i])}.`
    );
  }
  return "The output differs only in trailing blank lines.";
}

function dropTrailingBlank(lines: string[]): string[] {
  return lines.length > 1 && lines.at(-1) === "" ? lines.slice(0, -1) : lines;
}

function firstDifferingColumn(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  return n;
}

/** Quote a line with spaces and tabs made visible. */
function visible(line: string): string {
  return `"${line.replaceAll("\t", "→").replace(/ (?= |$)/g, "·")}"`;
}
