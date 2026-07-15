# What is a program?

A program is a list of instructions that a computer follows, one step at a time. That's it. Everything from a calculator app to a video game is, underneath, a very long, very precise to-do list.

## A recipe for machines

Think of a recipe: "crack two eggs, whisk, pour into pan." A program is the same idea, except the reader (the computer) is extremely fast, never gets bored, and takes *everything* literally. If your recipe says "crack eggs" but never says how many, a human guesses — a computer stops and complains.

Here's a tiny real program in Python:

```python
name = "Ada"
print("Hello, " + name + "!")
```

Line 1 stores the text `"Ada"` under the label `name`. Line 2 prints a greeting to the screen. Two instructions, done in order.

## Code is just text

Programs are written in plain text files. The text follows the rules of a *programming language* — a vocabulary and grammar the computer can be made to understand. Python, JavaScript, and C are all programming languages, the way English and Spanish are human languages.

```python
# This file could be saved as hello.py and run.
age = 30
print(age + 1)  # prints 31
```

The lines starting with `#` are *comments* — notes for humans that the computer ignores.

## Why this matters

Once you see programs as ordinary instructions, programming stops being magic and becomes writing: you describe what you want, precisely, in a language the machine knows. Bugs are just places where your instructions said something you didn't mean.

Every skill you'll learn — variables, loops, functions — is a tool for writing clearer, shorter, more reusable instructions. Start small: a program that prints your name is a real program, and you're already a programmer the moment you run it.
