# npm basics

**npm** (Node Package Manager) is how JavaScript developers share and reuse code. A **package** is a folder of code someone published; npm downloads packages and keeps track of which ones your project uses.

It comes bundled with Node.js, so if you've installed Node, you already have npm. Check with:

```bash
node --version
npm --version
```

## Starting a project

In your project folder, run:

```bash
npm init -y
```

This creates **package.json** — your project's ID card. It records the name, version, scripts, and (most importantly) your dependencies:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.0"
  }
}
```

## Installing packages

```bash
npm install canvas-confetti        # add a package your app needs
npm install --save-dev vitest     # add a tool only used during development
```

Installing does three things: downloads the code into **node_modules/**, adds an entry to `package.json`, and pins exact versions in **package-lock.json**.

Then use it in your code:

```js
import confetti from "canvas-confetti";
confetti();
```

## The three files/folders, at a glance

- **package.json** — the list of what you need (commit this)
- **package-lock.json** — the exact versions you got (commit this too)
- **node_modules/** — the downloaded code itself (never commit; it's huge and rebuildable)

Cloned someone's project and it won't run? It's missing `node_modules`. Just run:

```bash
npm install
```

## Scripts: project shortcuts

The `"scripts"` section defines commands you run with `npm run`:

```bash
npm run dev     # runs whatever "dev" maps to
npm test        # "test" is special — no "run" needed
```

## Other useful commands

```bash
npm uninstall canvas-confetti   # remove a package
npm outdated                    # what has newer versions?
npm update                      # update within allowed ranges
```

That's the core loop: `init` once, `install` what you need, `run` your scripts.
