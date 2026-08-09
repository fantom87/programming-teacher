import functools

# 1. logged(func) — a decorator:
#      def wrapper(*args, **kwargs):  (decorated with @functools.wraps(func))
#          print "calling name(args)" — name from func.__name__,
#          args as ", ".join(repr(a) for a in args)
#          return func(*args, **kwargs)
#      return wrapper

# 2. Two decorated functions:
#      @logged
#      def add(a, b): "Add two numbers." -> a + b
#      @logged
#      def shout(word): "Uppercase with a bang." -> word.upper() + "!"

# 3. Print add(2, 3), shout("ship"), add.__name__, add.__doc__.
