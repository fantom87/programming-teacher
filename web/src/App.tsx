import { useCallback, useEffect, useState } from "react";
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
import { api, type TrackView } from "./api/client";

export type Route =
  | { view: "home" }
  | { view: "track"; trackId: string }
  | { view: "lesson"; key: string }
  | { view: "playground" }
  | { view: "docs" }
  | { view: "stats" }
  | { view: "settings" };

export default function App() {
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDoc, setDrawerDoc] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [tracks, setTracks] = useState<TrackView[]>([]);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("route", JSON.stringify(route));
  }, [route]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s: Settings) => {
        setOnboarded(s.onboarded);
        setTheme(s.theme);
      })
      .catch(() => setOnboarded(true));
    api.curriculum().then((c) => setTracks(c.tracks)).catch(console.error);
  }, []);

  const refreshProgress = useCallback(() => {
    api
      .progress()
      .then((p) => setStreak(p.streak.current))
      .catch(() => {});
  }, []);

  useEffect(refreshProgress, [refreshProgress]);

  const celebrate = useCallback(() => {
    refreshProgress();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1600);
    }
  }, [refreshProgress]);

  // Ctrl+D opens the docs drawer anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
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
    setTheme(s.theme);
  }

  if (onboarded === false) {
    return (
      <div className="app">
        <main className="main">
          <Onboarding tracks={tracks} navigate={setRoute} onDone={() => setOnboarded(true)} />
        </main>
      </div>
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
    <div className="app">
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
        <button aria-label="Toggle color theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "☀" : "🌙"}
        </button>
        <button aria-label="Settings" onClick={() => setRoute({ view: "settings" })}>
          ⚙
        </button>
      </header>
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
  );
}
