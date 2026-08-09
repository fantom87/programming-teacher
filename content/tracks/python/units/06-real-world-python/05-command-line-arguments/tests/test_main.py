def t_positional_name():
    args = build_parser().parse_args(["Sam"])
    assert args.name == "Sam", "the positional argument should land in args.name"

def t_defaults():
    args = build_parser().parse_args(["Sam"])
    assert args.times == 1, "with no --times, args.times should default to 1"
    assert args.shout is False, "with no --shout, args.shout should be False"

def t_times_is_int():
    args = build_parser().parse_args(["Sam", "--times", "3"])
    assert args.times == 3, "--times 3 should parse to 3"
    assert isinstance(args.times, int), 'args.times is a string — pass type=int so "3" becomes 3'

def t_shout_flag():
    args = build_parser().parse_args(["Sam", "--shout"])
    assert args.shout is True, '--shout takes no value — action="store_true" makes it a flag'

test("name is a positional argument", t_positional_name)
test("--times defaults to 1 and --shout to False", t_defaults)
test("--times arrives as a real int", t_times_is_int)
test("--shout works as an on/off flag", t_shout_flag)
