from textkit import count_words, longest_word, shout

MOTTO = "small functions build big programs"

print(shout("word toolkit report", ":"))
print("Words:", count_words(MOTTO))
print("Longest:", longest_word(MOTTO))
print(shout("done"))
