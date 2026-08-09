# Bash essentials

Bash is the default shell of the Linux world — servers, containers, CI pipelines, and macOS terminals all speak it. Your shell instincts transfer; only the vocabulary changes.

## The mental shift: text, not objects

Bash commands pass **plain text** through pipes, not objects. There are no properties to ask for — you slice columns out of text with dedicated tools. Less structured, but the tools are sharp and everywhere.

## Files and navigation

```bash
pwd                 # where am I?
cd /var/log         # go there
ls -la              # list (long format, hidden files too)
cat notes.txt       # print a file
cp a.txt b.txt      # copy
mv old.txt new.txt  # move / rename
rm junk.txt         # delete
mkdir -p out/logs   # make folders (-p: parents as needed)
```

## Pipes and redirection

```bash
ls -la | wc -l                # count files: pipe into word-count
sort names.txt > sorted.txt   # > redirects output to a file (overwrite)
echo "done" >> log.txt        # >> appends
some-command 2>&1             # fold errors into normal output
```

## The classic toolkit

```bash
grep ERROR app.log            # lines containing ERROR
grep -c ERROR app.log         # just count them
cut -d, -f2 users.csv         # column 2 of a CSV
sort | uniq -c | sort -rn     # count occurrences, most common first
head -5 file.txt              # first 5 lines
tail -f app.log               # follow a log live
```

Chained together, these do what `Where-Object` and `Group-Object` do — by slicing text:

```bash
# top error types in a log
grep ERROR app.log | cut -d' ' -f3 | sort | uniq -c | sort -rn
```

## Variables and quoting

```bash
name="Ada"                    # NO spaces around = (a classic trap)
echo "Hello, $name"           # double quotes interpolate
echo 'Hello, $name'           # single quotes are literal
today=$(date +%F)             # command substitution: output into a variable
```

Always quote variables in real scripts — `"$file"` — or names with spaces will split into multiple arguments.

## Conditionals, loops, scripts

```bash
#!/bin/bash                   # the shebang: which interpreter runs this file
if [ -f "config.json" ]; then
    echo "found config"
fi

for f in *.log; do
    echo "processing $f"
done
```

`[ ... ]` is the test syntax (spaces required!); `-f` means "file exists", and comparisons are `-eq`/`-lt` for numbers, `=` for strings. Make a script runnable with `chmod +x script.sh`, run it as `./script.sh`. Arguments arrive as `$1`, `$2`; `$?` holds the last command's exit code — `0` means success.
