export const STYLE_PRESETS = [
  "minimal",
  "glassmorphism",
  "brutalist",
  "playful",
  "corporate",
] as const;

export type StylePreset = (typeof STYLE_PRESETS)[number];

export interface GenerateInput {
  prompt: string;
  style: StylePreset;
  darkMode: boolean;
}

export interface GeneratedComponent {
  title: string;
  description: string;
  code: string;
}
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };