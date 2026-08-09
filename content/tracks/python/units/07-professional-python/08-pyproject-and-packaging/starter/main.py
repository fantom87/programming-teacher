import tomllib
from pathlib import Path

# name and version are the only fields PyPI truly demands. These five
# are the professional floor — a package missing any of them is one
# nobody can safely install.
REQUIRED_FIELDS = ("name", "version", "description", "requires-python", "dependencies")


# 1. load_pyproject(path) — parse THE GIVEN path with tomllib and
#    return the whole document as nested dicts. (Don't hardcode a
#    filename: the tests point this at other files.)


# 2. missing_fields(project) — the REQUIRED_FIELDS that aren't keys of
#    the [project] table, in the order REQUIRED_FIELDS lists them.


# 3. describe(path) — load, then:
#      any gaps -> print "missing: version, dependencies" and return
#      otherwise -> print the summary, every value read from the file:
#
#        slugkit 0.3.0 (python >=3.11)
#        turn any title into a URL slug
#        dependencies: click>=8.1, rich>=13.0
#        scripts: slugkit = slugkit.cli:main
#        build backend: hatchling.build
#        metadata complete
#
#    (The scripts line joins every "command = target" pair; the backend
#    comes from the [build-system] table.)


# 4. Call describe("pyproject.toml") — after you've filled it in.
