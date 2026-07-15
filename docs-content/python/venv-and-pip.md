# Virtual environments and pip

Sooner or later you'll want a package that isn't in the standard library — like `requests` for talking to websites. Two tools make that safe and tidy: `pip` installs packages, and *virtual environments* keep each project's packages separate.

## Why virtual environments?

Imagine project A needs version 1 of a package and project B needs version 2. Installed globally, they'd fight. A virtual environment (*venv*) is a private, per-project copy of Python with its own packages — each project gets its own toolbox.

## Creating and activating a venv

From your project folder:

```bash
python -m venv .venv
```

That creates a `.venv` folder. Then activate it:

```bash
# Windows (PowerShell)
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

Your prompt now shows `(.venv)` — you're inside. From here, `python` and `pip` refer to the project's private copies. Leave anytime with `deactivate`.

## Installing packages with pip

```bash
pip install requests
```

Now it imports like any module:

```python
import requests

response = requests.get("https://api.github.com")
print(response.status_code)    # 200
```

Other everyday commands:

```bash
pip list                     # what's installed here?
pip install requests==2.32.3 # a specific version
pip uninstall requests
```

## Sharing your setup: requirements.txt

Record your project's packages so others (or future-you) can recreate the environment:

```bash
pip freeze > requirements.txt
```

Then, on any machine:

```bash
pip install -r requirements.txt
```

## The routine, every new project

```bash
mkdir my-project
cd my-project
python -m venv .venv
.venv\Scripts\activate      # (or source .venv/bin/activate)
pip install <what you need>
```

Two tips: never commit the `.venv` folder to version control (add it to `.gitignore`), and if `pip` mysteriously installs things your program can't find, check which environment is active — it's the number one cause of "module not found" confusion.
