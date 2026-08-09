# Operators and comparisons

Here's the PowerShell surprise: comparison operators are *words with dashes*, not symbols. `>` doesn't mean "greater than" — it means "redirect output to a file"! Using `if ($x > 5)` silently creates a file named `5`. Every PowerShell programmer does this exactly once.

## Comparison operators

```powershell
5 -eq 5        # True   (equals)
5 -ne 3        # True   (not equals)
5 -gt 3        # True   (greater than)
5 -ge 5        # True   (greater or equal)
3 -lt 5        # True   (less than)
3 -le 2        # False  (less or equal)
```

They work on strings too, and string comparisons are **case-insensitive by default**:

```powershell
"Hello" -eq "hello"     # True
"Hello" -ceq "hello"    # False (the c- prefix forces case-sensitive)
```

## Pattern operators

`-like` uses filename-style wildcards; `-match` uses regular expressions:

```powershell
"report-2024.txt" -like "report*"     # True
"report-2024.txt" -match "\d{4}"      # True (contains 4 digits)
```

`-contains` asks whether an *array* holds a value; `-in` is the same question flipped:

```powershell
@("red", "green") -contains "red"     # True
"red" -in @("red", "green")           # True
```

## Logical operators

```powershell
($age -ge 18) -and ($country -eq "Canada")
($day -eq "Sat") -or ($day -eq "Sun")
-not (Test-Path "backup.zip")
```

## Comparing against arrays: the filter trick

When the left side is an array, comparison operators *filter* instead of returning True/False:

```powershell
@(1, 5, 10, 3) -gt 4       # 5, 10  — the elements that pass
```

Surprising at first, handy forever.

## Arithmetic

Math uses the familiar symbols: `+ - * / %`. And PowerShell has readable size units built in:

```powershell
10 / 3          # 3.3333... (real division)
10 % 3          # 1 (remainder)
1MB             # 1048576
$file.Length -gt 5MB    # is it bigger than 5 megabytes?
```

`+` also concatenates strings and arrays: `"power" + "shell"`.

The rules to tattoo somewhere: **`-eq` not `==`, `-gt` not `>`** — and when a condition misbehaves, check whether you've fallen back on the symbols your last language used.
