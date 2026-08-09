def word_lengths(words):
    return {w: len(w) for w in words}

def unique_initials(names):
    return {name[0] for name in names}

tools = ["idiom", "generator", "zip"]
crew = ["ada", "alan", "grace", "guido", "linus"]

print(word_lengths(tools))
print(sorted(unique_initials(crew)))
