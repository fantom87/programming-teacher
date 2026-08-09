letters = iter("abc")
print(next(letters))
print(next(letters))

def countdown(n):
    while n > 0:
        yield n
        n -= 1

for number in countdown(3):
    print(number)
print("Liftoff!")

print(sum(countdown(100)))
