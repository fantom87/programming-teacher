# Regex and matching

A *regular expression* (regex) is a pattern that describes text: "three digits", "starts with ERROR", "an email-shaped thing". PowerShell has regex built into its operators, so pattern-matching power is always one dash away.

## Regex in 60 seconds

```
\d      any digit          a*     zero or more a's
\w      letter/digit/_     a+     one or more a's
\s      whitespace         a?     optional a
.       any character      a{3}   exactly three a's
[abc]   a, b, or c         ^      start of string
[^abc]  anything else      $      end of string
cat|dog  cat OR dog        ( )    group / capture
```

So `\d{4}-\d{2}-\d{2}` matches a date like `2024-06-01`, and `^ERROR` matches lines that *start* with ERROR. To match a literal dot or backslash, escape it: `\.`, `\\`.

## -match and $Matches

`-match` tests a string against a pattern — and stores what it found in the automatic `$Matches` variable:

```powershell
"Order #4521 shipped" -match "#(\d+)"    # True
$Matches[0]      # "#4521"  (the whole match)
$Matches[1]      # "4521"   (capture group 1 — the parentheses)
```

Named captures make this readable:

```powershell
$line = "2024-06-01 ERROR Disk full"
if ($line -match "^(?<date>\S+) (?<level>\w+) (?<msg>.+)$") {
    $Matches.level    # ERROR
    $Matches.msg      # Disk full
}
```

This is the heart of log parsing: a regex with named groups turns a raw line into structured data.

## -replace and -split

`-replace` swaps pattern matches for new text, with `$1` referencing capture groups:

```powershell
"report_final_v2.txt" -replace "_v\d+", ""        # report_final.txt
"2024-06-01" -replace "(\d+)-(\d+)-(\d+)", '$3/$2/$1'   # 01/06/2024
```

(Use single quotes around the replacement so PowerShell doesn't eat the `$1`.) `-split` breaks a string on a pattern:

```powershell
"one,  two,three" -split ",\s*"    # one | two | three
```

## Select-String: grep for files

`Select-String` searches files (or pipeline text) for a pattern:

```powershell
Select-String -Path *.log -Pattern "ERROR"
Get-ChildItem -Recurse -Filter *.ps1 | Select-String "TODO"
```

Each result is an object with `.Path`, `.LineNumber`, and `.Line` — pipeline-ready, like everything else.

Build patterns incrementally: match something small, confirm, extend. Regex written all-at-once is regex debugged all-night.
