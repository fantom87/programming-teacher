def t_patch_swaps_and_restores():
    original = globals()["send_email"]
    def marker(to, subject, body):
        return "marker"
    patch("send_email", marker)
    assert globals()["send_email"] is marker, "patch should put the replacement into module globals"
    unpatch_all()
    assert globals()["send_email"] is original, "unpatch_all should restore the exact original object"

def t_patches_stack():
    before = (globals()["send_email"], globals()["notify"])
    patch("send_email", lambda to, subject, body: None)
    patch("notify", lambda user, message: True)
    unpatch_all()
    assert globals()["send_email"] is before[0], "unpatch_all should restore send_email"
    assert globals()["notify"] is before[1], "unpatch_all should restore every patch, not just the last"

def t_fake_records_the_call():
    SENT.clear()
    patch("send_email", fake_send)
    try:
        result = notify({"email": "sam@example.com"}, "build finished")
    finally:
        unpatch_all()
    assert result is True, "with a fake that succeeds, notify should return True"
    assert len(SENT) == 1, f"the fake should record exactly one send, recorded {len(SENT)}"
    assert "sam@example.com" in SENT[0], f"the recorded call should carry the user's address, got {SENT[0]}"
    assert "build finished" in SENT[0], f"the recorded call should carry the message body, got {SENT[0]}"

def t_failing_fake_raises():
    raised = False
    try:
        failing_send("a@b.c", "s", "b")
    except MailError:
        raised = True
    assert raised, "failing_send should raise MailError — that's the side effect being simulated"

def t_tests_clean_up_after_themselves():
    real = globals()["send_email"]
    names = ("test_notify_sends_email", "test_notify_reports_failure", "test_patch_is_undone")
    for _ in (1, 2):
        for name in names:
            fn = globals().get(name)
            assert callable(fn), f"{name} should be a test function"
            fn()
            assert globals()["send_email"] is real, f"{name} left send_email patched — undo before returning"

def t_real_send_email_still_real():
    assert notify({"email": "a@b.c"}, "hi") is False, "with the real send_email in place notify must report failure — don't patch at module level"

test("patch swaps a global and unpatch_all restores it", t_patch_swaps_and_restores)
test("unpatch_all unwinds every patch", t_patches_stack)
test("the fake records how it was called", t_fake_records_the_call)
test("the failing fake raises MailError", t_failing_fake_raises)
test("each test undoes its own patch", t_tests_clean_up_after_themselves)
test("the real send_email is never replaced for good", t_real_send_email_still_real)
