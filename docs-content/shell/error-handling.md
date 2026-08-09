# Error handling

Scripts meet reality: files go missing, networks drop, APIs return 500s. Error handling is the difference between a script that dies mysteriously at 3 AM and one that logs the problem and carries on.

## Two kinds of errors

PowerShell errors come in two flavors:

- **Terminating** — stops execution. Can be caught by `try/catch`.
- **Non-terminating** — prints red text and *keeps going*. Most cmdlet errors (file not found, access denied) are this kind, which means `try/catch` ignores them by default!

## -ErrorAction: choosing the behavior

The `-ErrorAction` parameter (on every cmdlet) upgrades or downgrades errors:

```powershell
Get-Item "missing.txt" -ErrorAction Stop            # now it terminates → catchable
Get-Item "missing.txt" -ErrorAction SilentlyContinue # suppress, keep going
```

The essential recipe: **`-ErrorAction Stop` inside `try`** — otherwise the catch block never fires:

```powershell
try {
    $data = Get-Content "config.json" -Raw -ErrorAction Stop
} catch {
    Write-Warning "Couldn't read config: $_"
    $data = "{}"     # sensible fallback
}
```

`$ErrorActionPreference = "Stop"` at the top of a script makes *all* errors terminating — a good default for scripts that shouldn't limp along after a failure.

## try / catch / finally

```powershell
try {
    Invoke-RestMethod $url -ErrorAction Stop
} catch {
    Write-Warning "API call failed: $($_.Exception.Message)"
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue   # runs either way
}
```

Inside `catch`, `$_` is the error record: `$_.Exception.Message` is the human-readable reason. `finally` runs whether or not anything failed — cleanup lives there.

## Throwing your own errors

When *your* code detects a problem, refuse loudly:

```powershell
if (-not (Test-Path $Path)) {
    throw "Input folder not found: $Path"
}
```

`throw` creates a terminating error that callers can catch. Failing fast with a clear message beats mysterious wrong output every time.

## Warnings and verbosity

Not everything is an error. `Write-Warning` flags concerns without stopping; `Write-Verbose` narrates progress, visible only with `-Verbose`:

```powershell
Write-Warning "Skipping locked file: $name"
Write-Verbose "Processed $count records"
```

The habit that matters most: decide *per operation* what failure should mean — stop, skip, retry, or fall back — and write it down in code instead of hoping.
