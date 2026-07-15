# Debugging mindset

A *bug* is a gap between what you told the computer to do and what you meant. Debugging is closing that gap — and it's detective work, not punishment. Every programmer, at every level, debugs daily.

## The golden rule: the computer is right

The machine did exactly what the code says. So the question is never "why is it broken?" but "what did I actually write?" That shift — from frustration to curiosity — is the whole mindset.

## The loop: guess, test, learn

1. **Reproduce it.** Find a reliable way to make the bug happen. A bug you can trigger on demand is half-solved.
2. **Form a hypothesis.** "I think `total` is wrong before the loop ends."
3. **Test it.** Print the value, or step through with a debugger.
4. **Learn and repeat.** Each test eliminates suspects, like Twenty Questions.

## Print statements are legitimate

The humble `print()` is a flashlight. Show a variable's value at a suspicious moment:

```python
def apply_discount(price, percent):
    discount = price * percent      # bug: forgot / 100
    print(f"DEBUG: price={price}, discount={discount}")
    return price - discount

apply_discount(100, 20)
# DEBUG: price=100, discount=2000   <- aha, way too big!
```

The print reveals `discount` is 100x too large, pointing straight at the missing `/ 100`.

## Shrink the problem

If a 100-line program misbehaves, delete or comment out chunks until the bug disappears — the last thing you removed is involved. Or build a tiny separate file that reproduces just the broken part. Small programs are easy to reason about; big ones aren't.

## When you're stuck

- **Explain it out loud** to a person, a rubber duck, or an empty chair. Saying it forces precision, and the answer often appears mid-sentence.
- **Take a break.** Fresh eyes find in minutes what tired eyes miss for hours.
- **Check your assumptions.** The bug is usually in the code you were *sure* was fine.

Bugs aren't failures. Each one you fix teaches you exactly how the machine thinks.
