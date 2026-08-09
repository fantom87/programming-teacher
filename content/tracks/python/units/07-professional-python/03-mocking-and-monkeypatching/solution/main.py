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


_PATCHES = []


def patch(name, replacement):
    """Swap a module global, remembering what was there."""
    _PATCHES.append((name, globals()[name]))
    globals()[name] = replacement


def unpatch_all():
    """Put every patched name back, newest first."""
    while _PATCHES:
        name, original = _PATCHES.pop()
        globals()[name] = original


SENT = []


def fake_send(to, subject, body):
    """A recording stand-in: never sends, always remembers."""
    SENT.append((to, subject, body))


def failing_send(to, subject, body):
    """A stand-in with a side effect: always fails."""
    raise MailError("server down")


def test_notify_sends_email():
    SENT.clear()
    patch("send_email", fake_send)
    try:
        result = notify({"email": "sam@example.com"}, "build finished")
        assert result is True
        assert len(SENT) == 1
        to, subject, body = SENT[0]
        assert to == "sam@example.com"
        assert body == "build finished"
    finally:
        unpatch_all()


def test_notify_reports_failure():
    patch("send_email", failing_send)
    try:
        assert notify({"email": "sam@example.com"}, "build failed") is False
    finally:
        unpatch_all()


def test_patch_is_undone():
    original = send_email
    patch("send_email", fake_send)
    unpatch_all()
    assert send_email is original


run_tests()
