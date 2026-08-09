from contextlib import contextmanager


class Section:
    def __init__(self, title):
        self.title = title

    def __enter__(self):
        print(f"== {self.title} ==")
        return self

    def __exit__(self, exc_type, exc, tb):
        print(f"== end {self.title} ==")


@contextmanager
def muted(errors):
    try:
        yield
    except errors:
        print("recovered")


with Section("deploy"):
    print("pushing code")

with Section("cleanup"):
    with muted(ValueError):
        int("nope")
    print("still standing")
