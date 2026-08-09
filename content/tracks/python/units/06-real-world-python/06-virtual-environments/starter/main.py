# Model the venv guarantee: isolated package sets, one per project.

# 1. create_env(name) — return {"name": name, "packages": ["pip"]}.
#    The list must be FRESH on every call — that's the isolation.

# 2. install(env, package) — append package to THAT env's list only.

# 3. describe(env) — return "name: pkg, pkg, ..." (don't print inside).

# 4. blog = create_env("blog"), scraper = create_env("scraper");
#    install flask==3.1.2 into blog,
#    requests==2.32.5 then beautifulsoup4==4.13.5 into scraper;
#    print(describe(...)) for each.
