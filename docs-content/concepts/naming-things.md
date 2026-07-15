# Naming things

Code is read far more often than it's written — mostly by future-you, who has forgotten everything. Good names turn code from a puzzle into a story.

## Names should say what, not how

A variable name is a label for a value. Make the label describe the *meaning*:

```python
# Hard to follow
x = 19.99
y = x * 0.08
z = x + y

# Reads like a sentence
price = 19.99
tax = price * 0.08
total = price + tax
```

Both versions run identically. Only one of them can be understood at a glance six months later.

## Practical rules of thumb

- **Be specific.** `user_count` beats `data`; `is_logged_in` beats `flag`.
- **Booleans read as questions.** `is_empty`, `has_discount`, `can_edit`.
- **Functions are verbs.** `send_email()`, `calculate_total()` — they *do* things.
- **Avoid one-letter names**, except tiny loop counters like `i` or coordinates like `x, y` where the convention is universal.
- **Don't abbreviate cleverly.** `tmp_usr_cnt` saves keystrokes once and costs confusion forever.

## Follow your language's style

Python uses `snake_case` for variables and functions, and `CapWords` for classes:

```python
max_retries = 3          # variable: snake_case

def fetch_page(url):     # function: snake_case verb
    ...

class ShoppingCart:      # class: CapWords
    ...
```

Other languages differ (JavaScript prefers `camelCase`), but every language has a convention — matching it makes your code look native.

## When naming is hard, that's a clue

If you can't name something clearly, you may not understand it yet — or it may be doing too many jobs. A function you'd have to call `process_and_save_and_email()` probably wants to be three functions. Naming difficulty is free design feedback.

Renaming is cheap. When you find a better name, take it. Your editor can rename every use in one command, and the whole file gets clearer at once.
