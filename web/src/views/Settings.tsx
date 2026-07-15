import { useEffect, useState } from "react";
import type { AssistanceLevel, Settings as SettingsType } from "@teacher/shared";
import { ASSISTANCE_NAMES } from "@teacher/shared";

interface Health {
  runtimes: { python: string | null; node: string | null; dotnet: string | null };
  sdkAuth: string;
  sdkAuthDetail?: string;
}

export default function Settings({ onSettingsChange }: { onSettingsChange: (s: SettingsType) => void }) {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [profile, setProfile] = useState("");
  const [profileDirty, setProfileDirty] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(console.error);
    fetch("/api/health").then((r) => r.json()).then(setHealth).catch(console.error);
    fetch("/api/profile").then((r) => r.json()).then((j) => setProfile(j.profile)).catch(console.error);
  }, []);

  async function save(next: SettingsType) {
    setSettings(next);
    onSettingsChange(next);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  }

  async function saveProfile() {
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    setProfileDirty(false);
  }

  async function resetProgress() {
    if (!confirm("Really reset ALL progress, streaks, and the journal? This can't be undone.")) return;
    await fetch("/api/progress/reset", { method: "POST" });
    location.reload();
  }

  if (!settings) return <div className="view-pad">Loading…</div>;

  return (
    <div className="view-pad settings-view">
      <h1>Settings</h1>

      <section>
        <h2>Appearance</h2>
        <label className="setting-row">
          Theme
          <select value={settings.theme} onChange={(e) => save({ ...settings, theme: e.target.value as "dark" | "light" })}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
        <label className="setting-row">
          Editor font size
          <input
            type="number"
            min={10}
            max={24}
            value={settings.editor.fontSize}
            onChange={(e) => save({ ...settings, editor: { ...settings.editor, fontSize: Number(e.target.value) } })}
          />
        </label>
      </section>

      <section>
        <h2>Tutor</h2>
        <label className="setting-row">
          Default assistance level
          <select
            value={settings.assistanceDefault}
            onChange={(e) => save({ ...settings, assistanceDefault: Number(e.target.value) as AssistanceLevel })}
          >
            {([1, 2, 3, 4, 5] as AssistanceLevel[]).map((l) => (
              <option key={l} value={l}>
                {l} — {ASSISTANCE_NAMES[l]}
              </option>
            ))}
          </select>
        </label>
        <label className="setting-row">
          Tutor model
          <select
            value={settings.tutorModel}
            onChange={(e) => save({ ...settings, tutorModel: e.target.value as SettingsType["tutorModel"] })}
          >
            <option value="claude-sonnet-5">Sonnet 5 (fast, recommended)</option>
            <option value="claude-opus-4-8">Opus 4.8 (deeper)</option>
            <option value="claude-fable-5">Fable 5 (deepest)</option>
          </select>
        </label>
        {health && (
          <p className={`small ${health.sdkAuth === "ok" ? "dim" : "auth-warn"}`}>
            Tutor connection: {health.sdkAuth === "ok" ? "✓ using your Claude Code login" : `✗ ${health.sdkAuth} — try running "claude setup-token" in a terminal. ${health.sdkAuthDetail ?? ""}`}
          </p>
        )}
      </section>

      <section>
        <h2>What the tutor knows about you</h2>
        <p className="dim small">
          The tutor keeps short notes to teach you better. You can edit or delete anything here — it's your file.
        </p>
        <textarea
          className="profile-editor mono"
          rows={6}
          value={profile}
          aria-label="Learner profile notes"
          onChange={(e) => {
            setProfile(e.target.value);
            setProfileDirty(true);
          }}
        />
        {profileDirty && (
          <button className="primary" onClick={saveProfile}>
            Save notes
          </button>
        )}
      </section>

      <section>
        <h2>Local runtimes</h2>
        {health && (
          <ul className="runtime-list">
            <li>Python: {health.runtimes.python ?? "not found — winget install Python.Python.3.12"}</li>
            <li>Node: {health.runtimes.node ?? "not found — winget install OpenJS.NodeJS.LTS"}</li>
            <li>.NET (for C#): {health.runtimes.dotnet ?? "not found — winget install Microsoft.DotNet.SDK.8"}</li>
          </ul>
        )}
      </section>

      <section>
        <h2>Danger zone</h2>
        <button className="danger" onClick={resetProgress}>
          Reset all progress
        </button>
      </section>
    </div>
  );
}
