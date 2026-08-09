def create_env(name):
    """Return a brand-new environment with only pip on its shelf."""
    return {"name": name, "packages": ["pip"]}


def install(env, package):
    """Install a package into this one environment only."""
    env["packages"].append(package)


def describe(env):
    """One line: the env's name and everything installed in it."""
    return f"{env['name']}: " + ", ".join(env["packages"])


blog = create_env("blog")
scraper = create_env("scraper")

install(blog, "flask==3.1.2")
install(scraper, "requests==2.32.5")
install(scraper, "beautifulsoup4==4.13.5")

print(describe(blog))
print(describe(scraper))
