import type { ChatItem } from "../components/TutorChat";

// A representative exchange on javascript/01-js-first-steps/02-values-and-variables,
// lightly edited from a real session. Shown (clearly labelled as a recording)
// when the tutor can't be reached, so someone without a Claude login can still
// see what the feature does rather than an empty pane.
export const SAMPLE_TRANSCRIPT: { level: number; items: ChatItem[] }[] = [
  {
    level: 3,
    items: [
      { role: "user", text: "Hi! I'm brand new. What should I do first in this lesson?" },
      {
        role: "assistant",
        text:
          "Hey! Welcome. Let's start simple.\n\nYou need a box to hold your name — one that can change later. " +
          "Which keyword from the lesson creates a changeable box, and which one creates a permanent one?",
      },
    ],
  },
  {
    level: 5,
    items: [
      { role: "user", text: "I'm lost. Tell me exactly what to type." },
      {
        role: "assistant",
        text:
          "No worries, totally normal for a first lesson! I'll walk you through it one tiny piece at a time.\n\n" +
          "Let's do the very first line. In the editor, under that first comment, type this:\n\n" +
          '```js\nlet name = "Ada";\n```\n\n' +
          '(You can swap "Ada" for your own name in quotes if you like.)\n\n' +
          'What this does: `let` says "make a new box." `name` is the label on the box. `= "Ada"` puts the text ' +
          "inside it.\n\nType that line and press Run — tell me what you see and we'll do the next one.",
      },
    ],
  },
  {
    level: 5,
    items: [
      { role: "user", text: "I wrote my code — can you check my work?" },
      { role: "chip", text: "Ran your code" },
      { role: "chip", text: "Checked your goals" },
      {
        role: "assistant",
        text:
          'Nice work getting all the pieces in — I can see "Ada", "1815", and "Addy" all printed! ' +
          "You're right that logically it's correct.\n\nBut the automated check isn't happy yet, and I think it's " +
          "because everything got squished onto one line. Let's look at what the checker expects…",
      },
    ],
  },
];
