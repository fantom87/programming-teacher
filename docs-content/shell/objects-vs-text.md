# Objects vs text

In most shells (like bash), commands pass *text* to each other, and you spend your life slicing strings. In PowerShell, commands pass **objects** — structured data with named properties. This is the single biggest idea in PowerShell.

## What the table hides

```powershell
Get-ChildItem
```

You see a text table — Name, Length, LastWriteTime — but that's just the *display*. What actually came out of the command is a stream of FileInfo objects, each carrying dozens of properties. The table is a courtesy rendering of a few of them.

## Get-Member: X-ray any object

Pipe anything to `Get-Member` to see what it really is:

```powershell
Get-ChildItem | Get-Member
# TypeName: System.IO.FileInfo
#   Name           Property
#   Length         Property
#   LastWriteTime  Property
#   Extension      Property
#   ... dozens more
```

This is how you discover what's possible. No parsing, no guessing where a column starts — just ask for the property by name:

```powershell
(Get-Item report.txt).Length          # 48231
(Get-Item report.txt).LastWriteTime   # Tuesday, June 3, 2025 9:14:02 AM
```

That value is a real number and a real date — you can do math on them, compare them, sort by them. In a text-based shell, you'd be extracting digits from a string and hoping the format never changes.

## Calculated properties

Reshape objects mid-pipeline by defining your own columns — a hashtable with a `Name` and an `Expression`:

```powershell
Get-ChildItem *.log |
    Select-Object Name, @{ Name = "SizeMB"; Expression = { [math]::Round($_.Length / 1MB, 2) } }
```

Now the output objects have a `SizeMB` property that never existed on the original files.

## Formatting is the end of the line

`Format-Table` and `Format-List` make output pretty:

```powershell
Get-Process | Sort-Object CPU -Descending |
    Select-Object -First 5 | Format-Table Name, CPU
```

But they convert rich objects into *formatting instructions* — after a `Format-*` cmdlet, the data is gone for practical purposes. Rule: **filter and shape with objects; format only at the very end** (or not at all — PowerShell formats automatically anyway). If you catch yourself piping `Format-Table` into `Where-Object`, back up a step.
