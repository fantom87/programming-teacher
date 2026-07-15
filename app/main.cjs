// Programming Teacher desktop shell: starts the local server (if it isn't
// already running) and hosts the app in its own window. The repo — server
// code, curriculum, and your data — stays where it lives; this exe is just
// the front door.
const { app, BrowserWindow, dialog } = require("electron");
const { spawn, execFile } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");

const APP_URL = "http://localhost:4517";
const DEFAULT_REPO = "B:\\Claude\\Programming Teacher";

let serverProc = null;
let win = null;

function configFile() {
  return path.join(app.getPath("userData"), "config.json");
}

function repoPath() {
  try {
    const cfg = JSON.parse(fs.readFileSync(configFile(), "utf8"));
    if (cfg.repoPath) return cfg.repoPath;
  } catch {
    try {
      fs.mkdirSync(path.dirname(configFile()), { recursive: true });
      fs.writeFileSync(configFile(), JSON.stringify({ repoPath: DEFAULT_REPO }, null, 2));
    } catch {
      // best effort
    }
  }
  return DEFAULT_REPO;
}

function ping() {
  return new Promise((resolve) => {
    const req = http.get(`${APP_URL}/api/health`, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureServer() {
  if (await ping()) return true; // reuse an already-running dev/prod server

  const repo = repoPath();
  if (!fs.existsSync(path.join(repo, "server", "src", "index.ts"))) {
    dialog.showErrorBox(
      "Programming Teacher",
      `Can't find the app files at:\n${repo}\n\nEdit repoPath in:\n${configFile()}`,
    );
    return false;
  }

  serverProc = spawn("node", ["--import", "tsx", "server/src/index.ts", "--prod"], {
    cwd: repo,
    shell: false,
    windowsHide: true,
    stdio: "ignore",
  });
  serverProc.on("error", () => {
    serverProc = null;
  });

  for (let i = 0; i < 60; i++) {
    if (await ping()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  dialog.showErrorBox(
    "Programming Teacher",
    "The local server didn't start. Make sure Node.js is installed, then try again.\n(You can also run 'npm run start' in the project folder to see the error.)",
  );
  return false;
}

function stopServer() {
  if (serverProc?.pid) {
    // Kill the whole tree — the server spawns runners of its own.
    execFile("taskkill", ["/pid", String(serverProc.pid), "/T", "/F"], () => {});
    serverProc = null;
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 950,
    autoHideMenuBar: true,
    backgroundColor: "#16181d",
    show: false,
  });
  win.once("ready-to-show", () => win.show());
  win.loadURL(APP_URL);
  win.on("closed", () => {
    win = null;
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    if (await ensureServer()) createWindow();
    else app.quit();
  });

  app.on("window-all-closed", () => {
    stopServer();
    app.quit();
  });

  app.on("before-quit", stopServer);
}
