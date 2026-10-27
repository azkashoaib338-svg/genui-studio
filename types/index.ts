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
  export type A11ySeverity = "critical" | "serious" | "moderate" | "minor";
export type A11yCategory = "aria" | "contrast" | "semantics" | "keyboard" | "other";

export interface A11yIssue {
  severity: A11ySeverity;
  category: A11yCategory;
  message: string;
  suggestion: string;
}

export interface A11yReport {
  score: number; // 0-100
  summary: string;
  issues: A11yIssue[];
  passed: string[];
}