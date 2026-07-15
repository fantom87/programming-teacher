import type { AssistanceLevel } from "@teacher/shared";
import { ASSISTANCE_NAMES } from "@teacher/shared";

const BLURBS: Record<AssistanceLevel, string> = {
  1: "Checks your work. Nothing else.",
  2: "Asks guiding questions. Never writes code.",
  3: "Explains and hints, but the code is yours.",
  4: "Teaches step by step with small examples.",
  5: "Dictates exactly what to type, and why.",
};

interface Props {
  level: AssistanceLevel;
  onChange: (level: AssistanceLevel) => void;
}

export default function AssistanceSlider({ level, onChange }: Props) {
  return (
    <div className="assistance-slider">
      <label htmlFor="assistance">
        AI assistance: <strong>{ASSISTANCE_NAMES[level]}</strong>
      </label>
      <input
        id="assistance"
        type="range"
        min={1}
        max={5}
        step={1}
        value={level}
        aria-valuetext={ASSISTANCE_NAMES[level]}
        onChange={(e) => onChange(Number(e.target.value) as AssistanceLevel)}
      />
      <div className="dim small">{BLURBS[level]}</div>
    </div>
  );
}
