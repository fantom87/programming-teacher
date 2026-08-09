---
id: 03-mocking-and-monkeypatching
title: Mocking and Monkeypatching
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Build a monkeypatch of your own — patch(name, replacement) and unpatch_all() over module globals — plus a recording fake and a failing fake, then test notify() twice without ever touching the real mail server."
docs: [python/functions, python/dicts, python/errors-and-exceptions]
checks:
  - id: patching-and-tests-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: suite-is-green
    type: stdout
    entry: main.py
    match: exact
    value: "...\n3 passed\n"
  - id: real-mocking-discipline
    type: ai-judge
    rubric: "patch(name, replacement) saves the current globals()[name] onto a module-level stack before overwriting it, and unpatch_all() restores every saved original and empties the stack — nothing is restored by re-typing the original function or by re-defining send_email. Both fakes match send_email's (to, subject, body) signature; fake_send records the call arguments into SENT and failing_send raises MailError, the stand-in for a mock side_effect. Every test undoes its patch before returning (try/finally or an unpatch_all at the end) and clears SENT before recording, so tests cannot leak into each other. test_notify_sends_email asserts on the recorded call's arguments, not merely that nothing crashed. send_email and notify are unmodified, and no test calls the real send_email."
hints:
  - "patch is three lines: _PATCHES.append((name, globals()[name])) then globals()[name] = replacement. unpatch_all pops the stack in reverse — while _PATCHES: name, original = _PATCHES.pop(); globals()[name] = original."
  - "It works because notify looks send_email up in module globals every time it's called — that's exactly why real patching targets the module where the name is USED."
  - "Shape each test the same way: SENT.clear(); patch(\"send_email\", fake_send); try: ... assert ... finally: unpatch_all(). The finally is what a real fixture would do for you."
---
## Cutting the wire

Some code you cannot call in a test. `send_email` opens a socket;
`charge_card` moves money. You still need to test the function *around*
it — so you replace the dangerous dependency with a stand-in and check
how it was used. That's **mocking**.

Python's `unittest.mock` does it out of the box:

```python
from unittest.mock import patch

@patch("mailer.send_email")
def test_notify(fake_send):
    notify({"email": "sam@example.com"}, "build finished")
    fake_send.assert_called_once_with("sam@example.com", "Notification", "build finished")
```

A `Mock` accepts any call, records every one, and hands back whatever
you set: `fake.return_value = 200`, or `fake.side_effect = MailError`
to make it *raise* on demand. Afterwards you interrogate it —
`assert_called_once_with(...)`, `fake.call_args`, `fake.call_count`.

The rule people get wrong: **patch where the name is used, not where it
was defined.** If `mailer.py` does `from email_api import send_email`,
you patch `"mailer.send_email"` — the reference `mailer` actually looks
up. pytest's built-in `monkeypatch` fixture is the same idea with
automatic cleanup: `monkeypatch.setattr("mailer.send_email", fake)`
undoes itself when the test ends, along with `monkeypatch.setenv` and
`monkeypatch.chdir`.

That undo is the part beginners skip and regret. A patch that outlives
its test poisons every test after it.

You'll build that machinery today: a `patch` that saves the original
before overwriting the module global, and an `unpatch_all` that puts
everything back. It works for the same reason real patching works —
`notify` resolves `send_email` at call time, so swapping the global
swaps what `notify` calls.

### Your goal

`send_email` raises on purpose: there's no mail server here.

1. `patch(name, replacement)` and `unpatch_all()` over `globals()`,
   using the `_PATCHES` stack.
2. `fake_send(to, subject, body)` — records the call in `SENT`.
   `failing_send(to, subject, body)` — raises `MailError`.
3. Three tests: `test_notify_sends_email` (patched fake, assert
   `notify` returned `True` *and* the recorded call carries the right
   address and body), `test_notify_reports_failure` (failing fake,
   `notify` returns `False`), `test_patch_is_undone`. Every test undoes
   its patch.

```
...
3 passed
```
