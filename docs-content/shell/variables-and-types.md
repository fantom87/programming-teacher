# Variables and types

PowerShell variables start with `$` and are created by assigning:

```powershell
$name = "Ada"
$count = 42
$files = Get-ChildItem      # command output goes in variables too
```

That last line matters: a variable can hold *anything* a command produces — a number, a string, or a hundred FileInfo objects.

## Types and casting

PowerShell figures out types automatically, but you can force one with a cast in square brackets:

```powershell
$age = [int]"30"            # the string "30" becomes the number 30
$price = [double]"3.99"
[string]42                  # "42"
```

Casting a variable's *declaration* locks the type: `[int]$score = 0` makes later `$score = "oops"` an error. Check any value's type with `.GetType().Name`.

## Strings: single vs double quotes

The quote character changes behavior:

```powershell
$name = "Ada"
"Hello, $name"       # double quotes interpolate → Hello, Ada
'Hello, $name'       # single quotes are literal → Hello, $name
```

For expressions or properties inside a string, wrap them in `$(...)`:

```powershell
"That file is $($file.Length) bytes"
```

Multi-line text uses a *here-string* — the closing marker must start at column 0:

```powershell
$report = @"
Report for $name
Generated: $(Get-Date)
"@
```

## Arrays

```powershell
$fruits = @("apple", "pear", "plum")
$fruits[0]              # apple (zero-indexed)
$fruits[-1]             # plum (last)
$fruits.Count           # 3
$fruits += "fig"        # append (builds a new array)
```

Most command output is already an array: `$logs = Get-ChildItem *.log` then `$logs[0]`.

## Hashtables

A hashtable maps keys to values — PowerShell's lookup table:

```powershell
$capitals = @{
    France = "Paris"
    Japan  = "Tokyo"
}
$capitals["Japan"]          # Tokyo
$capitals.France            # Paris (dot syntax works too)
$capitals["Peru"] = "Lima"  # add an entry
$capitals.Keys              # France, Japan, Peru
```

Arrays hold *sequences*; hashtables hold *associations*. Between them — plus objects from the pipeline — you can model nearly any data a script needs.
