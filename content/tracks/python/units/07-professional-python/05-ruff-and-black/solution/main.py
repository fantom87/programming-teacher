from pathlib import Path

MAX_LINE = 88  # black's default, and ruff's


def imported_name(line):
    """The name an import line binds, or None if it isn't an import."""
    stripped = line.strip()
    if stripped.startswith("import "):
        return stripped[len("import "):].strip()
    if stripped.startswith("from ") and " import " in stripped:
        return stripped.split(" import ")[1].strip()
    return None


def check_source(filename, source):
    """Three of ruff's rules, applied line by line."""
    lines = source.splitlines()
    findings = []
    for number, line in enumerate(lines, start=1):
        if len(line) > MAX_LINE:
            findings.append(f"{filename}:{number}: E501 line too long ({len(line)} > {MAX_LINE})")
        if line != line.rstrip():
            findings.append(f"{filename}:{number}: W291 trailing whitespace")
        name = imported_name(line)
        if name and not any(name in other for i, other in enumerate(lines, 1) if i != number):
            findings.append(f"{filename}:{number}: F401 '{name}' imported but unused")
    return findings


def main():
    """Lint messy.py and report the way ruff does."""
    source = Path("messy.py").read_text(encoding="utf-8")
    findings = check_source("messy.py", source)
    for finding in findings:
        print(finding)
    if findings:
        print(f"Found {len(findings)} error(s).")
    else:
        print("All checks passed!")


main()
