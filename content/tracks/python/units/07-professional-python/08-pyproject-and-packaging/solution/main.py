import tomllib
from pathlib import Path

# name and version are the only fields PyPI truly demands. These five
# are the professional floor — a package missing any of them is one
# nobody can safely install.
REQUIRED_FIELDS = ("name", "version", "description", "requires-python", "dependencies")


def load_pyproject(path):
    """Parse a pyproject.toml into nested dicts."""
    return tomllib.loads(Path(path).read_text(encoding="utf-8"))


def missing_fields(project):
    """Which of the required [project] fields aren't declared?"""
    return [field for field in REQUIRED_FIELDS if field not in project]


def describe(path):
    """Summarise a manifest — or say what it's still missing."""
    data = load_pyproject(path)
    project = data.get("project", {})

    missing = missing_fields(project)
    if missing:
        print(f"missing: {', '.join(missing)}")
        return

    print(f"{project['name']} {project['version']} (python {project['requires-python']})")
    print(project["description"])
    print(f"dependencies: {', '.join(project['dependencies'])}")

    scripts = project.get("scripts", {})
    print(f"scripts: {', '.join(f'{command} = {target}' for command, target in scripts.items())}")
    print(f"build backend: {data['build-system']['build-backend']}")
    print("metadata complete")


describe("pyproject.toml")
