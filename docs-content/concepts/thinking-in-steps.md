# Thinking in steps

The hardest part of programming isn't the language — it's breaking a fuzzy goal into tiny, precise steps. Computers can't "make a sandwich"; they can "pick up bread," "open jar," "spread with knife." Learning to think this way is the core skill.

## From goal to steps

Say you want to find the biggest number in a list. Before writing code, write the steps in plain English:

1. Remember the first number as "biggest so far."
2. Look at each remaining number.
3. If it's bigger than "biggest so far," replace it.
4. When done, "biggest so far" is the answer.

This step list is called an *algorithm* — a recipe for solving a problem. Now it translates almost word-for-word:

```python
numbers = [3, 41, 7, 19]
biggest = numbers[0]            # step 1
for n in numbers[1:]:           # step 2
    if n > biggest:             # step 3
        biggest = n
print(biggest)                  # step 4 -> 41
```

## Break big problems into small ones

Big tasks feel impossible until you split them. "Build a quiz game" becomes:

- Store questions and answers
- Show one question
- Read the user's answer
- Check if it's right
- Keep score
- Repeat

Each piece is small enough to write and test on its own. Solve one, run it, then move to the next. Programmers call this *decomposition*, and it's how every large program gets built.

## Talk it out first

Before coding, explain your plan out loud or in comments:

```python
# 1. ask the user for their name
# 2. ask three quiz questions
# 3. print their final score
```

Then fill in code under each comment. If you can't describe a step in plain words, you're not ready to code it yet — and that's useful information, not failure. Clear thinking first, typing second.
