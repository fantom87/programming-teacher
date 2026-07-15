age = 16
has_ticket = True

is_teen = age >= 13 and age <= 19
can_enter = age >= 18 or has_ticket
is_adult = age >= 18
still_minor = not is_adult

print(is_teen)
print(can_enter)
print(is_adult)
print(still_minor)
