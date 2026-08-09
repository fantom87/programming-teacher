// Programming Teacher desktop shell: starts the local server (if it isn't
// already running) and hosts the app in its own window. The repo — server
// code, curriculum, and your data — stays where it lives; this exe is just
// the front door.
const { app, BrowserWindow, dialog, shell } = require("electron");
const { spawn, execFile } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");

const APP_URL = "http://localhost:4517";
const DEV_UI_URL = "http://localhost:5173"; // Vite, when a dev session is running
const DEFAULT_REPO = "B:\\Claude\\Programming Teacher";
const KEEP_LOGS = 5;

// Where the window actually points — APP_URL normally, the Vite dev UI when a
// development server owns the API port.
let appUrl = APP_URL;

let serverProc = null;
let serverLog = null;
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

function logDir() {
  return path.join(repoPath(), "data", "logs");
}

// Everything the server prints lands in data/logs/server-<date>.log — in exe
// mode there is no terminal, and a crash without a log is undiagnosable.
// Keeps the newest KEEP_LOGS files.
function openServerLog() {
  try {
    const dir = logDir();
    fs.mkdirSync(dir, { recursive: true });
    const name = `server-${new Date().toISOString().slice(0, 10)}.log`;
    const logs = fs
      .readdirSync(dir)
      .filter((f) => /^server-\d{4}-\d{2}-\d{2}\.log$/.test(f) && f !== name)
      .sort();
    for (const stale of logs.slice(0, Math.max(0, logs.length - (KEEP_LOGS - 1)))) {
      try {
        fs.rmSync(path.join(dir, stale), { force: true });
      } catch {
        // locked/vanished — fine
      }
    }
    return fs.createWriteStream(path.join(dir, name), { flags: "a" });
  } catch {
    return null; // never let logging break the app
  }
}

function logLine(text) {
  serverLog?.write(`[shell ${new Date().toISOString()}] ${text}\n`);
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

/** True when the URL returns an HTML document — i.e. something serving the app. */
function servesHtml(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      const type = String(res.headers["content-type"] ?? "");
      res.resume();
      resolve(res.statusCode === 200 && type.includes("html"));
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function healthJson() {
  return new Promise((resolve) => {
    const req = http.get(`${APP_URL}/api/health`, (res) => {
      let body = "";
      res.on("data", (d) => (body += d));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function ensureServer() {
  serverLog = openServerLog();

  if (await ping()) {
    // Something already owns the port. Only a PRODUCTION server serves the
    // app itself — a dev server (npm run dev) answers /api/* but returns 404
    // for "/", which would open an empty window with a cryptic error.
    const health = await healthJson();
    if (health?.servesUi === false || health?.mode === "development") {
      logLine(`a development server owns ${APP_URL}; it serves the API but not the app UI.`);
      // Vite serves the UI in that setup — use it so a running dev session
      // opens the real app instead of failing.
      if (await servesHtml(DEV_UI_URL)) {
        logLine(`using the Vite dev UI at ${DEV_UI_URL} instead.`);
        appUrl = DEV_UI_URL;
        return true;
      }
      dialog.showErrorBox(
        "Programming Teacher",
        "A development server is already using port 4517, and it doesn't serve the app.\n\n" +
          "Close it (the terminal running 'npm run dev'), then start Programming Teacher again.",
      );
      return false;
    }
    logLine(
      `attached to an already-running server on ${APP_URL} (version ${health?.version ?? "unknown"}) — ` +
        "if the app looks out of date, close that server and relaunch.",
    );
    return true;
  }

  const repo = repoPath();
  if (!fs.existsSync(path.join(repo, "server", "src", "index.ts"))) {
    dialog.showErrorBox(
      "Programming Teacher",
      `Can't find the app files at:\n${repo}\n\nEdit repoPath in:\n${configFile()}`,
    );
    return false;
  }

  logLine("starting server: node --import tsx server/src/index.ts --prod");
  serverProc = spawn("node", ["--import", "tsx", "server/src/index.ts", "--prod"], {
    cwd: repo,
    shell: false,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  serverProc.stdout.on("data", (chunk) => serverLog?.write(chunk));
  serverProc.stderr.on("data", (chunk) => serverLog?.write(chunk));
  serverProc.on("exit", (code) => logLine(`server exited with code ${code}`));
  serverProc.on("error", (err) => {
    logLine(`failed to spawn server: ${err.message}`);
    serverProc = null;
  });

  for (let i = 0; i < 60; i++) {
    if (await ping()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  dialog.showErrorBox(
    "Programming Teacher",
    "The local server didn't start. Make sure Node.js is installed, then try again.\n\n" +
      `Details are in:\n${logDir()}\n\n(You can also run 'npm run start' in the project folder to see the error.)`,
  );
  return false;
}

function stopServer() {
  if (serverProc?.pid) {
    // Kill the whole tree — the server spawns runners of its own.
    execFile("taskkill", ["/pid", String(serverProc.pid), "/T", "/F"], () => {});
    serverProc = null;
  }
  serverLog?.end();
  serverLog = null;
}

function isAppUrl(url) {
  try {
    return new URL(url).origin === appUrl;
  } catch {
    return false;
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
  // External links (docs, tutor replies) open in the system browser — never
  // navigate the app window itself away from the local server, and never
  // spawn child BrowserWindows.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!isAppUrl(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, url) => {
    if (!isAppUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  win.once("ready-to-show", () => win.show());
  win.loadURL(appUrl);
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
