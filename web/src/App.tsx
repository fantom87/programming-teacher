import { useEffect, useState } from "react";
import LessonView from "./views/Lesson";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (document.documentElement.dataset.theme as "dark" | "light") ?? "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="app">
      <header className="topbar">
        <span className="title">Programming Teacher</span>
        <span className="spacer" />
        <button
          aria-label="Toggle color theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </header>
      <main className="main">
        <LessonView theme={theme} />
      </main>
    </div>
  );
}
