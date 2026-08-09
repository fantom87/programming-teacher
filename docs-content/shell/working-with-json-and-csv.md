# Working with JSON and CSV

CSV and JSON are the two file formats you'll meet constantly — spreadsheets export CSV, web APIs speak JSON. PowerShell converts both into objects, so the pipeline skills you already have apply directly.

## CSV: files become object pipelines

Given `users.csv`:

```
name,email,age
Ada,ada@example.com,36
Grace,grace@example.com,45
```

`Import-Csv` turns each row into an object with properties from the header:

```powershell
$users = Import-Csv users.csv
$users[0].name              # Ada
$users | Where-Object { [int]$_.age -gt 40 }
```

One catch: CSV values are always *strings*, so cast (`[int]$_.age`) before numeric comparisons. Going the other way, `Export-Csv` writes any objects to a file:

```powershell
Get-ChildItem *.log |
    Select-Object Name, Length, LastWriteTime |
    Export-Csv report.csv -NoTypeInformation
```

(`-NoTypeInformation` skips a header comment line nobody wants. PowerShell 7 omits it by default.)

## PSCustomObject: build your own rows

To make structured data from scratch — for a report, an export, a merged dataset — use `[PSCustomObject]`:

```powershell
$row = [PSCustomObject]@{
    Server = "web01"
    Status = "up"
    Checked = Get-Date
}
```

It looks like a hashtable, but it's a real object: it displays as a table row, exports cleanly to CSV, and pipes anywhere. Build one per item inside `ForEach-Object` and you've made your own object pipeline.

## JSON: nested data

`ConvertFrom-Json` parses JSON text into objects:

```powershell
$config = Get-Content settings.json -Raw | ConvertFrom-Json
$config.database.host          # walk nested properties with dots
$config.users[0].name          # arrays index like arrays
```

(`-Raw` makes `Get-Content` return one string instead of an array of lines — `ConvertFrom-Json` wants the whole text.)

`ConvertTo-Json` goes the other way:

```powershell
$settings = @{ theme = "dark"; retries = @{ max = 5; delay = 2 } }
$settings | ConvertTo-Json -Depth 5 | Set-Content settings.json
```

**Always pass `-Depth`** for nested data: the default depth is 2, and anything deeper gets silently flattened into ugly type names. It's the classic JSON gotcha.

The shape to remember: *file → objects → pipeline → objects → file*. CSV for flat tables, JSON for anything nested.
