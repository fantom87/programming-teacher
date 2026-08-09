import argparse

# 1. build_parser() — return an ArgumentParser with:
#      name             positional
#      --times          type=int, default=1
#      --shout          action="store_true"

# 2. run(argv) — args = build_parser().parse_args(argv), then print
#    f"Hello, {args.name}!" (uppercased if args.shout) args.times times.

# 3. Drive it with explicit argv lists:
#      run(["Ada"])
#      run(["Grace", "--times", "2"])
#      run(["Linus", "--shout"])
