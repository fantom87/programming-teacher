# What is a shell?

A shell is a program that takes typed commands and runs them. The window you type into is the *terminal*; the shell is the interpreter living inside it, waiting at a *prompt* like `PS C:\Users\you>` for your next instruction.

Why bother, when clicking works? Because commands can be **repeated, combined, and saved**. Anything you can type, you can script — and anything you can script, you can automate.

## PowerShell's Verb-Noun grammar

PowerShell commands are called *cmdlets*, and they all follow one pattern: `Verb-Noun`.

```powershell
Get-Process        # list running processes
Get-ChildItem      # list files in a folder
Stop-Process       # stop a process
New-Item           # create a file or folder
```

This is the superpower: commands are *guessable*. Want to read a file? Probably `Get-Content`. Start a service? `Start-Service`. A small set of approved verbs (`Get`, `Set`, `New`, `Remove`, `Start`, `Stop`...) combines with nouns for the thing being acted on.

## Parameters

Cmdlets take parameters, named with a dash:

```powershell
Get-ChildItem -Path C:\Projects -Recurse
```

`-Path` says where; `-Recurse` is a *switch* — present or absent, no value needed.

## Discovering commands

You never need to memorize much, because the shell can describe itself:

```powershell
Get-Command *service*        # find commands mentioning "service"
Get-Help Get-ChildItem       # what does it do, what parameters?
Get-Help Get-ChildItem -Examples   # show me real usage
```

`Get-Command`, `Get-Help`, and `Get-Member` (you'll meet it soon) are the three flashlights — with them you can explore anything.

## Aliases

PowerShell ships shortcuts: `dir`, `ls`, and `gci` all mean `Get-ChildItem`; `cd` means `Set-Location`. Handy for typing interactively — but in scripts, always use full cmdlet names. `ls` saves you a second today; `Get-ChildItem` saves the next reader a Google search.

## Which PowerShell?

Windows ships *Windows PowerShell 5.1* (`powershell.exe`); the newer cross-platform *PowerShell 7* (`pwsh.exe`) runs on Windows, macOS, and Linux. Everything in these docs works in both unless flagged. There's also *bash*, the standard shell of the Linux world — it gets its own page later.
