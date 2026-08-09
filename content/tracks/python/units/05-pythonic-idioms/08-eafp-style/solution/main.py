pantry = {"flour": 2, "eggs": 12}

def parse_age(text):
    try:
        return int(text)
    except ValueError:
        return None

def lookup(stock, item):
    try:
        return stock[item]
    except KeyError:
        return 0

print(parse_age("42"))
print(parse_age("forty-two"))
print(lookup(pantry, "flour"))
print(lookup(pantry, "saffron"))
