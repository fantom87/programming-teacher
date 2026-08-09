def to_fahrenheit(temps):
    return [t * 9 / 5 + 32 for t in temps]

def long_words(words, n):
    return [w for w in words if len(w) > n]

temps_c = [0, 10, 22, 31, 17]
words = ["idiom", "loop", "comprehension", "list", "pythonic"]

print(to_fahrenheit(temps_c))
print(long_words(words, 6))
