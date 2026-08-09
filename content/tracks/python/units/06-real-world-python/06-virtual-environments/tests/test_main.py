def t_fresh_env():
    env = create_env("demo")
    assert env["name"] == "demo", "the env should carry its name"
    assert env["packages"] == ["pip"], 'a new env starts with exactly ["pip"]'

def t_envs_are_isolated():
    a = create_env("a")
    b = create_env("b")
    assert a["packages"] is not b["packages"], "two envs SHARE one packages list — return a fresh list literal from create_env"
    install(a, "numpy==2.1.0")
    assert "numpy==2.1.0" not in b["packages"], "installing into env a leaked into env b — that's the disaster venvs prevent"

def t_install_appends():
    env = create_env("x")
    install(env, "requests==2.32.5")
    install(env, "rich==14.1.0")
    assert env["packages"] == ["pip", "requests==2.32.5", "rich==14.1.0"], "install should append in order, after pip"

def t_describe_format():
    env = create_env("api")
    install(env, "flask==3.1.2")
    assert describe(env) == "api: pip, flask==3.1.2", 'describe should be "name: pkg, pkg" — comma and space between packages'

test("create_env starts with only pip", t_fresh_env)
test("installs never leak between envs", t_envs_are_isolated)
test("install appends to the shelf", t_install_appends)
test("describe formats one readable line", t_describe_format)
