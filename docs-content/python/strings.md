# Strings

A string is text: letters, digits, spaces, emoji — any characters, wrapped in quotes. Single or double quotes both work; just be consistent.

```python
greeting = "Hello"
name = 'Ada'
```

## Building strings with f-strings

The modern way to mix values into text is the *f-string* — put an `f` before the quote and drop expressions inside `{}`:

```python
name = "Ada"
age = 36
print(f"{name} is {age} years old")     # Ada is 36 years old
print(f"Next year: {age + 1}")          # expressions work too
print(f"Pi is roughly {3.14159:.2f}")   # Pi is roughly 3.14  (format to 2 decimals)
```

## Useful string methods

Strings come with built-in helpers called *methods*, called with a dot:

```python
s = "  Hello, World  "
s.strip()          # "Hello, World"     remove surrounding spaces
s.lower()          # "  hello, world  "
s.upper()          # "  HELLO, WORLD  "
s.replace("l", "L")# "  HeLLo, WorLd  "
"a,b,c".split(",") # ["a", "b", "c"]    string -> list
"-".join(["a", "b"])  # "a-b"           list -> string
"Hello".startswith("He")  # True
```

Important: methods *return a new string* — the original never changes. Strings are *immutable* (unchangeable), so capture the result:

```python
name = "ada"
name = name.upper()   # reassign to keep the change
```

## Indexing and slicing

Each character has a position, starting at 0:

```python
word = "python"
word[0]      # "p"
word[-1]     # "n"      negative counts from the end
word[0:3]    # "pyt"    slice: start included, end excluded
word[2:]     # "thon"
len(word)    # 6
```

## Checking contents

```python
"py" in "python"        # True
"z" not in "python"     # True
```

## Multi-line strings

Triple quotes hold text spanning multiple lines:

```python
poem = """Roses are red,
violets are blue."""
```

Strings are everywhere — user input, file contents, web pages — so these few methods will do a surprising amount of your daily work.
