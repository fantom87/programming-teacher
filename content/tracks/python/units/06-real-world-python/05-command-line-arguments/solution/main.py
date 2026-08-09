import argparse


def build_parser():
    """Declare the greeter's command-line interface."""
    parser = argparse.ArgumentParser(description="greeting tool")
    parser.add_argument("name")
    parser.add_argument("--times", type=int, default=1)
    parser.add_argument("--shout", action="store_true")
    return parser


def run(argv):
    """Parse an argv list and print the greeting it asks for."""
    args = build_parser().parse_args(argv)
    greeting = f"Hello, {args.name}!"
    if args.shout:
        greeting = greeting.upper()
    for _ in range(args.times):
        print(greeting)


run(["Ada"])
run(["Grace", "--times", "2"])
run(["Linus", "--shout"])
