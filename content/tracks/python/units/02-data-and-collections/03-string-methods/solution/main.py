raw = "   learn python every day   "

clean = raw.strip()
loud = clean.upper()
swapped = clean.replace("day", "morning")
words = clean.split()
print(clean)
print(loud)
print(swapped)
print(f"{len(words)} words")
