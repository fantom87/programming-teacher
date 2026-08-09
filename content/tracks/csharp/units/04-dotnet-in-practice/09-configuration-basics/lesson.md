---
id: 09-configuration-basics
title: Configuration Basics
language: csharp
runner: local
estMinutes: 22
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
  - path: appsettings.json
    starter: starter/appsettings.json
goal: "Layer configuration the .NET way — class defaults, then appsettings.json via Deserialize, then a TEACHER_THEME environment override — printing the effective settings after every layer."
docs: [csharp/classes-and-objects, csharp/types-and-variables]
checks:
  - id: layered-settings
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Settings, layer by layer ==\nDefaults: Theme=dark FontSize=12 AutoSave=True\nFile: Theme=light FontSize=16 AutoSave=True\nEnvironment: Theme=solarized FontSize=16 AutoSave=True\n"
  - id: real-layering
    type: ai-judge
    rubric: "The defaults exist solely as property initializers on the Settings class (Theme \"dark\", FontSize 12, AutoSave true). The file layer deserializes the actual appsettings.json text (File.ReadAllText + JsonSerializer.Deserialize) behind a File.Exists guard. The env layer reads TEACHER_THEME with Environment.GetEnvironmentVariable into a string? and applies it only after a null check (is not null / != null / ??). All three stage lines print computed current state through a shared Describe() method (or equivalent interpolation of the properties) — no stage line is hardcoded. AutoSave stays True because the JSON omits it and defaults survive — not because code re-assigns it after loading."
hints:
  - "Defaults live on the class: public string Theme { get; set; } = \"dark\"; — a brand-new Settings() IS your first layer. Print it before loading anything."
  - "Layer 2: if (File.Exists(\"appsettings.json\")) { settings = JsonSerializer.Deserialize<Settings>(File.ReadAllText(\"appsettings.json\"))!; } — the file only mentions Theme and FontSize, so AutoSave keeps its default."
  - "Layer 3: string? theme = Environment.GetEnvironmentVariable(\"TEACHER_THEME\"); if (theme is not null) { settings.Theme = theme; } — and print settings.Describe() after every layer."
---
## Settings, layered

Hardcoded values are where flexibility goes to die — real apps read
**configuration**. The .NET convention is a JSON file called
`appsettings.json` plus **environment variables**, applied in layers with a
strict precedence:

```
code defaults  <  appsettings.json  <  environment variables
```

Each layer overrides only what it *mentions*. The file says nothing about
`AutoSave`? The default survives. The environment only sets a theme? Font
size flows through from the file. That's the point of the whole
arrangement: an operator can retune a deployed app — different machine,
different theme, louder logging — without touching code.

The satisfying part: you already own every tool this needs.

- **Defaults** are property initializers. `new Settings()` *is* layer one.
- **The file layer** is lesson 5: `Deserialize<Settings>` builds a fresh
  object and fills exactly the properties the JSON names — absent keys keep
  their initializer defaults. Partial overlay, free of charge. Guard it
  with `File.Exists`: a missing config file shouldn't crash an app; it
  should mean "defaults, then."
- **The env layer** is lesson 7 in miniature:
  `Environment.GetEnvironmentVariable("TEACHER_THEME")` returns `string?` —
  null when the variable isn't set — so a null check decides whether the
  layer applies at all.

One honest disclosure in the starter: a checker can't export shell
variables into your run, so its first line *plants* `TEACHER_THEME` with
`SetEnvironmentVariable` — stage dressing for what your terminal, CI
pipeline, or host would provide in real life.

Your program prints the effective settings **after each layer**, so the
output is the precedence rule made visible: watch `dark` become `light`
become `solarized` while `AutoSave` rides through untouched.

### Your goal

Print exactly:

```
== Settings, layer by layer ==
Defaults: Theme=dark FontSize=12 AutoSave=True
File: Theme=light FontSize=16 AutoSave=True
Environment: Theme=solarized FontSize=16 AutoSave=True
```

1. `Settings` class: `Theme` = `"dark"`, `FontSize` = `12`, `AutoSave` =
   `true` as property initializers, plus a `Describe()` method returning
   the `Theme=... FontSize=... AutoSave=...` string.
2. Print `Defaults:` from a fresh `Settings()`.
3. If `appsettings.json` exists, deserialize it into `settings`; print
   `File:`.
4. Read `TEACHER_THEME`; when it's not null, apply it; print
   `Environment:`.
