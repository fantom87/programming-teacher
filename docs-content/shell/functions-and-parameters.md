# Functions and parameters

A function wraps a chunk of work behind a name so you can run it again without retyping it. Name functions like cmdlets — `Verb-Noun` — and they'll feel native.

```powershell
function Get-Greeting {
    param($Name)
    "Hello, $Name!"
}

Get-Greeting -Name "Ada"     # Hello, Ada!
```

Note the calling style: **PowerShell functions are called like commands, not like math** — `Get-Greeting -Name "Ada"`, never `Get-Greeting("Ada")`. Parentheses there create an array argument and quiet chaos.

## The param block

`param()` declares inputs, with optional types and defaults:

```powershell
function Get-BigFiles {
    param(
        [string]$Path = ".",          # default: current folder
        [int]$MinSizeMB = 10,
        [switch]$Recurse              # on/off flag
    )
    Get-ChildItem $Path -File -Recurse:$Recurse |
        Where-Object { $_.Length -gt ($MinSizeMB * 1MB) }
}

Get-BigFiles -Path C:\Videos -MinSizeMB 100 -Recurse
```

Types catch mistakes at the door (`-MinSizeMB "ten"` fails immediately). A `[switch]` is present-or-absent, like `-Recurse` on `Get-ChildItem`. Validation attributes push checks even earlier:

```powershell
param(
    [Parameter(Mandatory)][string]$Path,
    [ValidateRange(1, 1000)][int]$MinSizeMB = 10
)
```

`Mandatory` means PowerShell prompts for it if omitted.

## Output: everything escapes

Here's PowerShell's twist. A function outputs **every value it doesn't capture**, not just what follows `return`:

```powershell
function Get-Numbers {
    "starting..."        # this is OUTPUT, not a log line!
    1 + 1
}
Get-Numbers              # returns TWO things: "starting..." and 2
```

`return $x` outputs `$x` and exits — but everything already emitted comes along too. For human-facing status messages use `Write-Host` (or better, `Write-Verbose`); let output be pure data.

## Scope

Variables created inside a function vanish when it ends, and assigning to `$total` inside a function does *not* change a `$total` outside it — you get a local copy. This is a feature: functions that only communicate through parameters in and output out are easy to test and impossible to tangle. Pass things in; send results out; avoid `$global:` except as a last resort.
