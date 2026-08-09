class MailError(Exception):
    """The mail server said no."""


def send_email(to, subject, body):
    """The real thing. There is no mail server here — it always raises."""
    raise MailError("no network in the test environment")


def notify(user, message):
    """Email one user; report whether it went out. Don't change this."""
    try:
        send_email(user["email"], "Notification", message)
        return True
    except MailError:
        return False


def run_tests():
    """The collector from lesson 1 — collect test_ functions, run, report."""
    collected = [fn for name, fn in list(globals().items())
                 if name.startswith("test_") and callable(fn)]
    passed = failed = 0
    for fn in collected:
        try:
            fn()
            print(".", end="")
            passed += 1
        except AssertionError:
            print("F", end="")
            failed += 1
    print()
    print(f"{failed} failed, {passed} passed" if failed else f"{passed} passed")


# 1. Your monkeypatch.
_PATCHES = []

#    patch(name, replacement) — push (name, current value) onto _PATCHES,
#    then set globals()[name] = replacement.
#    unpatch_all() — pop the stack in reverse, restoring each original.


# 2. The stand-ins, both with send_email's (to, subject, body) signature.
SENT = []

#    fake_send  — append (to, subject, body) to SENT.
#    failing_send — raise MailError("server down"). (A mock side_effect.)


# 3. Three tests. Each one patches, asserts, and undoes its patch:
#      test_notify_sends_email    — clear SENT, patch fake_send, call
#                                   notify, assert it returned True and
#                                   that the one recorded call carries
#                                   the address and the message.
#      test_notify_reports_failure — patch failing_send, assert notify
#                                   returned False.
#      test_patch_is_undone       — grab send_email, patch, unpatch_all,
#                                   assert the original is back (is).


run_tests()
