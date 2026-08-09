# Navigating the filesystem

The shell always has a *current location* — the folder your commands act on by default. Master moving around and manipulating files here, and half of daily shell life is covered.

## Where am I? Moving around

```powershell
Get-Location                 # print the current folder (alias: pwd)
Set-Location C:\Projects     # go there (alias: cd)
Set-Location ..              # up one level
Set-Location ~               # your home folder
```

An *absolute* path starts from the root (`C:\Projects\app`); a *relative* path starts from where you are (`.\app`, or `..\other`). `.` means "here", `..` means "the parent folder".

## Listing files

```powershell
Get-ChildItem                        # what's here? (aliases: dir, ls)
Get-ChildItem C:\Projects            # what's there?
Get-ChildItem -Recurse -Filter *.txt # every .txt, all subfolders deep
```

Wildcards: `*` matches anything (`*.log`, `report*`), `?` matches one character.

## Creating and reading

```powershell
New-Item -ItemType Directory reports          # make a folder
New-Item -ItemType File notes.txt             # make an empty file
Set-Content notes.txt "First line"            # write (replaces content!)
Add-Content notes.txt "Second line"           # append
Get-Content notes.txt                         # read it back
```

Watch the difference: `Set-Content` overwrites the whole file, `Add-Content` adds to the end.

## Copying, moving, renaming, deleting

```powershell
Copy-Item notes.txt notes-backup.txt
Move-Item notes.txt C:\Archive\
Rename-Item notes-backup.txt old-notes.txt
Remove-Item old-notes.txt
Remove-Item C:\Temp\junk -Recurse    # folder and everything in it
```

`Remove-Item` does not use the Recycle Bin — deleted means deleted. Point it carefully.

## Checking and building paths

`Test-Path` answers "does this exist?" — the guard clause of every good script:

```powershell
if (-not (Test-Path reports)) {
    New-Item -ItemType Directory reports
}
```

`Join-Path` glues path pieces together so you never hand-count backslashes:

```powershell
$file = Join-Path $folder "summary.txt"   # C:\Projects\summary.txt
```

Habit to build: before a destructive command, run `Get-ChildItem` with the same path or wildcard first, so you *see* what's about to be affected.
