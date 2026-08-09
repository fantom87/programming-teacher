import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS, type Settings } from "@teacher/shared";

/** App-wide settings, provided by App once /api/settings resolves. Lets deep
 *  components (EditorPane) read editor prefs without threading props through
 *  every view. Defaults cover the pre-fetch moment and tests. */
export const SettingsContext = createContext<Settings>(DEFAULT_SETTINGS);

export function useSettings(): Settings {
  return useContext(SettingsContext);
}
