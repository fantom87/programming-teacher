def make_greeting(name):
    return f"Hello, {name}!"

# Handy while working on THIS file — but right now it also runs
# whenever main.py imports us. Wrap it in the guard:
#   if __name__ == "__main__":
print("Demo:", make_greeting("tester"))
