def average(numbers):
    """The mean of a non-empty list of numbers."""
    return sum(numbers) / len(numbers)


def spread(numbers):
    """The gap between the largest and smallest number."""
    return max(numbers) - min(numbers)
