import { z } from "zod";

// zod schemas validate everything that enters the system as data:
// curriculum manifests, lesson frontmatter, and (later) tutor tool inputs.
// The AI tutor authors content through these same gates in v1.5.

export const tierSchema = z.enum(["foundations", "core", "intermediate", "advanced", "refresher", "custom"]);
export const languageSchema = z.enum([
  "python",
  "javascript",
  "html-css",
  "csharp",
  "sql",
  "powershell",
  "bash",
  "go",
  "rust",
]);
export const runnerSchema = z.enum(["browser", "local"]);

export const domAssertionSchema = z.union([
  z.object({ selector: z.string(), exists: z.literal(true) }),
  z.object({ selector: z.string(), textContains: z.string() }),
  z.object({ selector: z.string(), count: z.number().int().nonnegative() }),
  z.object({ selector: z.string(), attr: z.string(), equals: z.string() }),
  z.object({
    selector: z.string(),
    cssRule: z.object({ property: z.string(), equals: z.string() }),
  }),
]);

export const checkSpecSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("stdout"),
    entry: z.string(),
    match: z.enum(["exact", "contains", "regex"]),
    value: z.string(),
    stdin: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("tests"),
    entry: z.string(),
    testFile: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("dom"),
    assertions: z.array(domAssertionSchema).min(1),
  }),
  z.object({
    id: z.string(),
    type: z.literal("ai-judge"),
    rubric: z.string().min(10),
  }),
]);

export const lessonFrontmatterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "kebab-case only"),
  title: z.string().min(1),
  language: languageSchema,
  runner: runnerSchema,
  estMinutes: z.number().int().positive().default(10),
  files: z
    .array(z.object({ path: z.string(), starter: z.string() }))
    .min(1),
  goal: z.string().min(1),
  docs: z.array(z.string()).optional(),
  checks: z.array(checkSpecSchema).min(1),
  hints: z.array(z.string()).optional(),
  timeoutMs: z.number().int().positive().optional(),
});

export const unitSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  tier: tierSchema,
  summary: z.string().min(1),
  lessons: z.array(z.string()).default([]),
  planned: z.boolean().optional(),
  plannedLessons: z.array(z.string()).optional(), // ids of lessons designed but not yet authored
  topics: z.array(z.string()).optional(),
});

export const trackSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  language: languageSchema,
  philosophy: z.string().min(1),
  units: z.array(unitSchema).min(1),
});

export const tracksIndexSchema = z.object({
  order: z.array(z.string()).min(1),
});

export const settingsSchema = z.object({
  theme: z.enum(["dark", "light"]),
  assistanceDefault: z.number().int().min(1).max(5),
  tutorModel: z.enum(["claude-sonnet-5", "claude-opus-4-8", "claude-fable-5"]),
  editor: z.object({ fontSize: z.number().int().min(10).max(24), autocomplete: z.boolean() }),
  layout: z.object({ paneSizes: z.array(z.number()) }).optional(),
  onboarded: z.boolean(),
});

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;
