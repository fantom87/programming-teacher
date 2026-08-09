# PowerShell vs bash

Two shells, one job: turn typed commands into automated work. Knowing how they differ — and where each shines — makes you effective on any machine you sit down at.

## The deep difference: objects vs text

Everything else follows from this one design choice.

**PowerShell** pipes *objects* with typed properties. You ask for `.Length` and get a number.

```powershell
Get-ChildItem | Where-Object { $_.Length -gt 1MB } | Select-Object Name
```

**Bash** pipes *text*. You carve out what you need by position, and hope the format holds.

```bash
ls -l | awk '$5 > 1048576 { print $9 }'
```

Objects are more robust — nothing breaks if a column moves. Text is more universal — every program ever written can join a bash pipeline, because text is the one format everyone agrees on.

## A phrasebook

| Task | PowerShell | Bash |
|---|---|---|
| List files | `Get-ChildItem` | `ls` |
| Read a file | `Get-Content f.txt` | `cat f.txt` |
| Search text | `Select-String ERROR *.log` | `grep ERROR *.log` |
| Count lines | `(Get-Content f).Count` | `wc -l < f` |
| Variables | `$x = "hi"` | `x="hi"` (no spaces!) |
| Equality test | `-eq` | `=` / `-eq` |
| If exists | `Test-Path f` | `[ -f f ]` |
| Command output → variable | `$d = Get-Date` | `d=$(date)` |
| Script file | `.ps1` | `.sh` + shebang |

Aliases blur the surface — `ls`, `cat`, and `cd` work in PowerShell too — but remember they're masks over Verb-Noun cmdlets, and behave differently the moment you pass Linux-style flags.

## Gotchas when switching

- Bash assignment forbids spaces (`x=5`); PowerShell doesn't care.
- Bash comparisons live in `[ ]` with mandatory spaces; PowerShell uses `( )` with dash operators.
- In bash, an unquoted `$file` splits on spaces; quote everything.
- Exit codes rule bash (`$?`, and `set -e` to stop on failure); PowerShell leans on errors and `try/catch` (check `$LASTEXITCODE` after native programs).

## Which one, when?

- **Windows automation, structured data, APIs, anything object-shaped** → PowerShell.
- **Linux servers, containers, CI scripts, quick text-slicing** → bash.
- **Both installed everywhere you work** → the real pro move. PowerShell 7 runs on Linux and macOS; bash runs on Windows via WSL and Git Bash. Pick per task, not per identity.
