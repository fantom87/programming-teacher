# Scripts and execution

A script is just shell code saved in a `.ps1` file. Everything you can type at the prompt, you can save — and then it runs the same way every time, on a schedule, or on someone else's machine.

## From console to .ps1

Save this as `cleanup.ps1`:

```powershell
param(
    [string]$Path = "$HOME\Downloads",
    [int]$DaysOld = 30
)

$cutoff = (Get-Date).AddDays(-$DaysOld)
Get-ChildItem $Path -File |
    Where-Object { $_.LastWriteTime -lt $cutoff } |
    Move-Item -Destination "$Path\old"
```

Run it with a path (the `.\` prefix is required for the current folder — a security feature):

```powershell
.\cleanup.ps1
.\cleanup.ps1 -Path C:\Temp -DaysOld 7
```

A `param()` block at the top of a *file* works exactly like one in a function — the whole script becomes a command with arguments.

## Execution policy

The first time you run a script, Windows may refuse: "running scripts is disabled on this system." That's the *execution policy*, a safety default. The standard fix for your own machine:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

`RemoteSigned` means: local scripts run freely; scripts downloaded from the internet must be signed. Check the current setting with `Get-ExecutionPolicy`.

## Comment-based help

Add a special comment block and your script gets real `Get-Help` support:

```powershell
<#
.SYNOPSIS
Moves old files out of a folder.
.EXAMPLE
.\cleanup.ps1 -Path C:\Temp -DaysOld 7
#>
param(...)
```

Now `Get-Help .\cleanup.ps1 -Examples` works, just like for built-in cmdlets. Your future self is the audience.

## $PROFILE: your personal toolkit

`$PROFILE` holds the path to a script that runs every time you open PowerShell. Put your favorite functions and aliases there and they're always loaded:

```powershell
notepad $PROFILE     # create/edit it (New-Item $PROFILE -Force first if missing)
```

Anything defined there — a `Get-BigFiles` function, a shortcut alias — becomes part of *your* shell.

## Splatting

When a command call grows too many parameters, put them in a hashtable and pass it with `@`:

```powershell
$options = @{
    Path        = "C:\Logs"
    Filter      = "*.log"
    Recurse     = $true
}
Get-ChildItem @options
```

Cleaner to read, easy to build conditionally, and reusable across calls.
