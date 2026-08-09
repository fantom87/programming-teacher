def count_words(text):
    """Return how many words the text contains."""
    return len(text.split())

def longest_word(text):
    """Return the longest word in the text (first one wins a tie)."""
    longest = ""
    for word in text.split():
        if len(word) > len(longest):
            longest = word
    return longest

def shout(text, punctuation="!"):
    """Return the text uppercased with punctuation stuck on the end."""
    return text.upper() + punctuation

if __name__ == "__main__":
    print("textkit demo")
    print(shout("it works"))
