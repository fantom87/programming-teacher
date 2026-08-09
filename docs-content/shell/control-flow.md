# Control flow

Control flow lets a script make decisions and repeat work. PowerShell's structures will look familiar from other languages — conditions in parentheses, bodies in braces.

## if / elseif / else

```powershell
$size = (Get-Item "data.csv").Length

if ($size -gt 10MB) {
    Write-Output "Big file"
} elseif ($size -gt 1MB) {
    Write-Output "Medium file"
} else {
    Write-Output "Small file"
}
```

Conditions use the dash operators (`-eq`, `-gt`, `-and`...) — see the operators page for why `>` will betray you.

## switch

When you're comparing one value against many candidates, `switch` beats an `elseif` ladder:

```powershell
switch ($extension) {
    ".jpg"  { "image" }
    ".png"  { "image" }
    ".mp3"  { "audio" }
    default { "other" }
}
```

`switch` has tricks: `-Wildcard` matches patterns (`"*.log"`), `-Regex` matches regexes, and switching on an array processes every element.

## foreach: once per item

```powershell
$files = Get-ChildItem *.txt
foreach ($file in $files) {
    Write-Output "$($file.Name) is $($file.Length) bytes"
}
```

`foreach` is the workhorse for "do this to each thing". (Note: `ForEach-Object` is the *pipeline* version — same idea, different position. `foreach` statements are faster and clearer for stored collections; `ForEach-Object` streams mid-pipeline.)

## while and do

`while` repeats as long as a condition holds — checked *before* each pass:

```powershell
$tries = 0
while (-not (Test-Path "ready.flag") -and $tries -lt 10) {
    Start-Sleep -Seconds 1
    $tries++
}
```

`do/while` checks *after*, guaranteeing at least one pass; `do/until` flips the logic:

```powershell
do {
    $answer = Read-Host "Type 'quit' to stop"
} until ($answer -eq "quit")
```

## break and continue

`break` exits a loop immediately; `continue` skips to the next pass:

```powershell
foreach ($file in $files) {
    if ($file.Length -eq 0) { continue }   # skip empties
    if ($file.Name -eq "STOP.txt") { break }
    Process-File $file
}
```

Rule of thumb: reach for a loop when steps depend on each other or you need fine control; reach for the pipeline when you're transforming a collection start to finish.
