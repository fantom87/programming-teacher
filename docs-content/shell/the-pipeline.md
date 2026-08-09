# The pipeline

The pipe symbol `|` sends one command's output into the next command as input. Small tools, chained into big answers — this is the shell's core idea.

```powershell
Get-ChildItem | Sort-Object Length -Descending | Select-Object -First 5
```

Read it left to right: list the files, sort by size (biggest first), keep five. Each stage does one job.

## The core pipeline toolkit

**Select-Object** — pick properties, or take the first/last few items:

```powershell
Get-Process | Select-Object Name, CPU
Get-ChildItem | Select-Object -First 3
```

**Where-Object** — filter with a test. `$_` means "the current item flowing through":

```powershell
Get-ChildItem | Where-Object { $_.Length -gt 1MB }
Get-Process | Where-Object { $_.CPU -gt 10 }
```

**Sort-Object** — sort by a property:

```powershell
Get-ChildItem | Sort-Object LastWriteTime -Descending
```

**Measure-Object** — count, sum, average:

```powershell
Get-ChildItem *.log | Measure-Object Length -Sum
# Count: 12   Sum: 48120394  → a dozen logs, ~48 MB total
```

**ForEach-Object** — transform each item:

```powershell
Get-ChildItem *.txt | ForEach-Object { $_.Name.ToUpper() }
```

**Group-Object** — bucket and count:

```powershell
Get-ChildItem -Recurse | Group-Object Extension | Sort-Object Count -Descending
# how many files of each type
```

## Composing them

The pattern is always: *get* things, *filter* down, *shape*, *sort*, *take*. A disk-usage report in one line:

```powershell
Get-ChildItem C:\Projects -Recurse -File |
    Where-Object { $_.Length -gt 10MB } |
    Sort-Object Length -Descending |
    Select-Object Name, Length -First 10
```

(A pipeline can wrap onto multiple lines after each `|` — much easier to read.)

## Filter early

Order matters for speed: filter as close to the source as possible, so later stages have less to chew. Better still, use the source's own parameters (`-Filter *.log` on `Get-ChildItem`) rather than piping everything to `Where-Object`.

What exactly is flowing through those pipes? Not text — *objects*, with named properties like `.Length` and `.CPU`. That difference is the next page.
