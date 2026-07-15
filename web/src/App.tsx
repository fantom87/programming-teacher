import { useCallback, useEffect, useState } from "react";
import Home from "./views/Home";
import Track from "./views/Track";
import LessonView from "./views/Lesson";
import { api } from "./api/client";

export type Route =
  | { view: "home" }
  | { view: "track"; trackId: string }
  | { view: "lesson"; key: string };

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("route", JSON.stringify(route));
  }, [route]);

  const refreshProgress = useCallback(() => {
    api
      .progress()
      .then((p) => setStreak(p.streak.current))
      .catch(() => {});
  }, []);

  useEffect(refreshProgress, [refreshProgress]);

  return (
    <div className="app">
      <header className="topbar">
        <button className="title-btn" onClick={() => setRoute({ view: "home" })}>
          <span className="title">Programming Teacher</span>
        </button>
        <span className="spacer" />
        {streak > 0 && (
          <span className="streak-chip" title={`${streak}-day streak`}>
            🔥 {streak}
          </span>
        )}
        <button aria-label="Toggle color theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
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
            onProgressChange={refreshProgress}
          />
        )}
      </main>
    </div>
  );
}
