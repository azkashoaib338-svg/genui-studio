import { z } from "zod";
import { STYLE_PRESETS } from "@/types";

export const generateInputSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(10, "Describe your component in at least 10 characters.")
    .max(1000, "Prompt is too long (max 1000 characters)."),
  style: z.enum(STYLE_PRESETS),
  darkMode: z.boolean(),
});

export const generatedComponentSchema = z.object({
  title: z.string().describe("Short component name"),
  description: z.string().describe("One sentence describing the component"),
  code: z.string().describe("Complete TSX source of the component"),
});
export const a11yReportSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  issues: z.array(
    z.object({
      severity: z.enum(["critical", "serious", "moderate", "minor"]),
      category: z.enum(["aria", "contrast", "semantics", "keyboard", "other"]),
      message: z.string(),
      suggestion: z.string(),
    }),
  ),
  passed: z.array(z.string()),
});