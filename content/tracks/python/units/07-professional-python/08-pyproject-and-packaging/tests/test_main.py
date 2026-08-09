def t_manifest_declares_a_build_backend():
    build = load_pyproject("pyproject.toml").get("build-system", {})
    assert build.get("build-backend") == "hatchling.build", f"the brief asks for hatchling; got {build.get('build-backend')!r}"
    requires = build.get("requires", [])
    assert any("hatchling" in item for item in requires), f"[build-system] requires should list hatchling, got {requires!r}"

def t_project_metadata_matches_the_brief():
    project = load_pyproject("pyproject.toml").get("project", {})
    assert project.get("name") == "slugkit", f"name should be slugkit, got {project.get('name')!r}"
    assert project.get("version") == "0.3.0", f"version should be 0.3.0, got {project.get('version')!r}"
    assert project.get("description") == "turn any title into a URL slug", f"description doesn't match the brief: {project.get('description')!r}"
    assert project.get("requires-python") == ">=3.11", f"requires-python should be >=3.11, got {project.get('requires-python')!r}"
    assert project.get("dependencies") == ["click>=8.1", "rich>=13.0"], f"dependencies should be a TOML array of two lower-bound strings, got {project.get('dependencies')!r}"

def t_console_script_is_wired():
    scripts = load_pyproject("pyproject.toml").get("project", {}).get("scripts", {})
    assert scripts.get("slugkit") == "slugkit.cli:main", f"typing 'slugkit' should call main() in slugkit/cli.py — expected 'slugkit.cli:main', got {scripts!r}"

def t_loader_reads_any_path():
    from pathlib import Path
    Path("other.toml").write_text('[project]\nname = "other"\n', encoding="utf-8")
    data = load_pyproject("other.toml")
    assert data["project"]["name"] == "other", "load_pyproject should parse whatever path it's given, not a hardcoded filename"

def t_missing_fields_lists_gaps_in_order():
    complete = {"name": "x", "version": "1", "description": "d", "requires-python": ">=3.11", "dependencies": []}
    assert missing_fields(complete) == [], "a complete table has no gaps"
    gaps = missing_fields({"name": "x"})
    assert gaps == ["version", "description", "requires-python", "dependencies"], f"gaps should follow REQUIRED_FIELDS order, got {gaps}"

def t_describe_summarises_the_manifest():
    import contextlib, io
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        describe("pyproject.toml")
    lines = buf.getvalue().strip().splitlines()
    assert lines[0] == "slugkit 0.3.0 (python >=3.11)", f"first line wrong: {lines[0]!r}"
    assert lines[2] == "dependencies: click>=8.1, rich>=13.0", f"dependency line wrong: {lines[2]!r}"
    assert lines[3] == "scripts: slugkit = slugkit.cli:main", f"scripts line wrong: {lines[3]!r}"
    assert lines[-1] == "metadata complete", f"a complete manifest should end with 'metadata complete', got {lines[-1]!r}"

def t_describe_reports_incomplete_metadata():
    import contextlib, io
    from pathlib import Path
    Path("half.toml").write_text(
        '[build-system]\nrequires = ["hatchling"]\nbuild-backend = "hatchling.build"\n\n[project]\nname = "half"\n',
        encoding="utf-8",
    )
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        describe("half.toml")
    out = buf.getvalue().strip()
    assert out == "missing: version, description, requires-python, dependencies", f"describe should name the gaps and stop, got {out!r}"

test("the build backend is declared", t_manifest_declares_a_build_backend)
test("the metadata matches the brief", t_project_metadata_matches_the_brief)
test("the console script is wired up", t_console_script_is_wired)
test("load_pyproject reads the path it's given", t_loader_reads_any_path)
test("missing_fields lists gaps in order", t_missing_fields_lists_gaps_in_order)
test("describe summarises a complete manifest", t_describe_summarises_the_manifest)
test("describe reports an incomplete one", t_describe_reports_incomplete_metadata)
