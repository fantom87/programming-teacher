import { useCallback, useEffect, useRef, useState } from "react";
import type { Settings } from "@teacher/shared";
import Home from "./views/Home";
import Track from "./views/Track";
import LessonView from "./views/Lesson";
import Playground from "./views/Playground";
import Docs from "./views/Docs";
import Stats from "./views/Stats";
import SettingsView from "./views/Settings";
import Onboarding from "./views/Onboarding";
import DocsDrawer from "./components/DocsDrawer";
import { API_OFFLINE_EVENT, API_ONLINE_EVENT, api, type TrackView } from "./api/client";
import { SettingsContext } from "./settingsContext";

export type Route =
  | { view: "home" }
  | { view: "track"; trackId: string }
  | { view: "lesson"; key: string }
  | { view: "playground" }
  | { view: "docs" }
  | { view: "stats" }
  | { view: "settings" };

function focusEditor() {
  document.querySelector<HTMLElement>(".cm-content")?.focus();
}

export default function App() {
  // localStorage is only the pre-fetch paint hint — settings.json is the
  // single source of truth for the theme (the topbar toggle PUTs it below).
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("theme") as "dark" | "light") ?? "dark",
  );
  const [route, setRoute] = useState<Route>(() => {
    try {
      return JSON.parse(localStorage.getItem("route") ?? "") as Route;
    } catch {
      return { view: "home" };
    }
  });
  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDoc, setDrawerDoc] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [bootFailed, setBootFailed] = useState(false);
  const [tracks, setTracks] = useState<TrackView[]>([]);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const [offline, setOffline] = useState(false);
  const [sdkAuth, setSdkAuth] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("route", JSON.stringify(route));
  }, [route]);

  const boot = useCallback(() => {
    setBootFailed(false);
    api
      .settings()
      .then((s) => {
        setSettings(s);
        setTheme(s.theme);
      })
      .catch(() => setBootFailed(true));
    api.curriculum().then((c) => setTracks(c.tracks)).catch(console.error);
    api.health().then((h) => setSdkAuth(h.sdkAuth)).catch(() => {});
  }, []);

  useEffect(boot, [boot]);

  // The page can win the startup race against its own server (dev mode brings
  // both up together) — retry boot quietly for a few seconds before the
  // failure screen asks the human to click anything.
  useEffect(() => {
    if (!bootFailed) return;
    const timer = window.setTimeout(boot, 2000);
    return () => window.clearTimeout(timer);
  }, [bootFailed, boot]);

  // The api client fires these on network-level failures/successes.
  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener(API_OFFLINE_EVENT, onOffline);
    window.addEventListener(API_ONLINE_EVENT, onOnline);
    return () => {
      window.removeEventListener(API_OFFLINE_EVENT, onOffline);
      window.removeEventListener(API_ONLINE_EVENT, onOnline);
    };
  }, []);

  const refreshProgress = useCallback(() => {
    api
      .progress()
      .then((p) => {
        streakRef.current = p.streak.current;
        setStreak(p.streak.current);
      })
      .catch(() => {});
  }, []);

  useEffect(refreshProgress, [refreshProgress]);

  const celebrate = useCallback(() => {
    api
      .progress()
      .then((p) => {
        if (p.streak.current > streakRef.current) {
          setToast(`🔥 ${p.streak.current}-day streak — keep it going!`);
          window.clearTimeout(toastTimer.current);
          toastTimer.current = window.setTimeout(() => setToast(null), 4000);
        }
        streakRef.current = p.streak.current;
        setStreak(p.streak.current);
      })
      .catch(() => {});
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1600);
    }
  }, []);

  // Global shortcuts: Ctrl+D toggles docs (except inside the editor, where
  // CodeMirror's select-next-occurrence owns it), F1 opens docs, Alt+E jumps
  // to the editor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        setDrawerOpen(true);
        return;
      }
      if (e.altKey && !e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        focusEditor();
        return;
      }
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        if (e.defaultPrevented) return;
        if (e.target instanceof Element && e.target.closest(".cm-editor")) return;
        e.preventDefault();
        setDrawerOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openDoc = useCallback((slug: string) => {
    setDrawerDoc(slug);
    setDrawerOpen(true);
  }, []);

  function applySettings(s: Settings) {
    setSettings(s);
    setTheme(s.theme);
  }

  function toggleTheme() {
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (settings) {
      const updated = { ...settings, theme: next };
      setSettings(updated);
      // Persist so the toggle survives a restart; failure surfaces via the
      // offline banner rather than blocking the visual switch.
      api.saveSettings(updated).catch(() => {});
    }
  }

  const banners = (
    <>
      {offline && (
        <div className="app-banner" role="alert">
          <span>
            ⚠ Can't reach the local server — it may have stopped. If the problem persists, restart the app (or run{" "}
            <code>npm run start</code> in the project folder).
          </span>
          <button onClick={() => api.health().then(() => setOffline(false)).catch(() => {})}>Retry</button>
          <button aria-label="Dismiss server warning" onClick={() => setOffline(false)}>
            ✕
          </button>
        </div>
      )}
      {sdkAuth === "failed" && (
        <div className="app-banner" role="alert">
          <span>
            ⚠ The AI tutor can't sign in to Claude. Run <code>claude setup-token</code> in a terminal, then restart the
            app. Lessons, runs, and checks still work without it.
          </span>
        </div>
      )}
    </>
  );

  if (bootFailed && !settings) {
    return (
      <div className="app">
        <main className="main">
          <div className="view-pad">
            <h1>Can't reach the local server</h1>
            <p className="dim">
              The app's local server isn't answering. If you launched the desktop app, try closing and reopening it;
              otherwise run <code>npm run start</code> in the project folder and check its output.
            </p>
            <button className="primary" onClick={boot}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Nothing renders until settings resolve — prevents the full app flashing
  // (clickable, even) before first-run onboarding appears.
  if (!settings) return null;

  if (!settings.onboarded) {
    return (
      <SettingsContext.Provider value={settings}>
        <div className="app">
          {banners}
          <main className="main">
            <Onboarding
              tracks={tracks}
              navigate={setRoute}
              onDone={() => setSettings((s) => (s ? { ...s, onboarded: true } : s))}
            />
          </main>
        </div>
      </SettingsContext.Provider>
    );
  }

  const navBtn = (r: Route, label: string) => (
    <button
      className={`nav-btn ${route.view === r.view ? "active" : ""}`}
      onClick={() => setRoute(r)}
    >
      {label}
    </button>
  );

  return (
    <SettingsContext.Provider value={settings}>
      <div className="app">
        <a
          href="#editor"
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            focusEditor();
          }}
        >
          Skip to editor (Alt+E)
        </a>
        <header className="topbar">
          <button className="title-btn" onClick={() => setRoute({ view: "home" })}>
            <span className="title">Programming Teacher</span>
          </button>
          {navBtn({ view: "playground" }, "Playground")}
          {navBtn({ view: "docs" }, "Docs")}
          {navBtn({ view: "stats" }, "Stats")}
          <span className="spacer" />
          {streak > 0 && (
            <span className="streak-chip" title={`${streak}-day streak`}>
              🔥 {streak}
            </span>
          )}
          <button aria-label="Open documentation drawer (Ctrl+D)" title="Docs drawer (Ctrl+D)" onClick={() => setDrawerOpen(true)}>
            📖
          </button>
          <button aria-label="Toggle color theme" onClick={toggleTheme}>
            {theme === "dark" ? "☀" : "🌙"}
          </button>
          <button aria-label="Settings" onClick={() => setRoute({ view: "settings" })}>
            ⚙
          </button>
        </header>
        {banners}
        <main className="main">
          {route.view === "home" && <Home navigate={setRoute} />}
          {route.view === "track" && <Track trackId={route.trackId} navigate={setRoute} />}
          {route.view === "lesson" && (
            <LessonView
              lessonKey={route.key}
              theme={theme}
              navigate={setRoute}
              onProgressChange={celebrate}
              onOpenDoc={openDoc}
            />
          )}
          {route.view === "playground" && <Playground theme={theme} />}
          {route.view === "docs" && (
            <div className="view-pad docs-fullpage">
              <Docs />
            </div>
          )}
          {route.view === "stats" && <Stats />}
          {route.view === "settings" && <SettingsView onSettingsChange={applySettings} />}
        </main>
        <DocsDrawer open={drawerOpen} initial={drawerDoc} onClose={() => setDrawerOpen(false)} />
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
        {confetti && (
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 41) % 100}%`, animationDelay: `${(i % 8) * 0.08}s` }}>
                {["🎉", "⭐", "✨", "🎊"][i % 4]}
              </span>
            ))}
          </div>
        )}
      </div>
    </SettingsContext.Provider>
  );
}
