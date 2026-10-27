"use server";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";

import { AUDIT_SYSTEM_PROMPT, GENERATE_SYSTEM_PROMPT, buildGeneratePrompt } from "@/lib/prompts";
import { a11yReportSchema, generateInputSchema, generatedComponentSchema } from "@/lib/schemas";
import type { A11yReport, ActionResult, GenerateInput, GeneratedComponent } from "@/types";

const MODEL = openai(process.env.OPENAI_MODEL ?? "gpt-4o");

function toMessage(err: unknown): string {
  if (err instanceof Error) {
    if (/api key/i.test(err.message)) return "OpenAI API key is missing or invalid.";
    if (/rate limit|429/i.test(err.message)) return "Rate limit reached. Please wait a moment and retry.";
  }
  return "Something went wrong while talking to the AI. Please try again.";
}

export async function generateComponent(
  input: GenerateInput,
): Promise<ActionResult<GeneratedComponent>> {
  const parsed = generateInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

 try {
  const { output } = await generateText({
    model: MODEL,
    output: Output.object({ schema: generatedComponentSchema }),
    system: GENERATE_SYSTEM_PROMPT,
    prompt: buildGeneratePrompt(parsed.data),
    temperature: 0.4,
  });
  return { ok: true, data: output };
} catch (err) {
  console.error("[generateComponent]", err);
  return { ok: false, error: toMessage(err) };
}
}
export async function auditComponent(code: string): Promise<ActionResult<A11yReport>> {
  if (!code.trim() || code.length > 20_000) {
    return { ok: false, error: "Nothing to audit, or the code is too large." };
  }

  try {
    const { output } = await generateText({
      model: MODEL,
      output: Output.object({ schema: a11yReportSchema }),
      system: AUDIT_SYSTEM_PROMPT,
      prompt: `Audit this component:\n\n${code}`,
      temperature: 0,
    });
    return { ok: true, data: output };
  } catch (err) {
    console.error("[auditComponent]", err);
    return { ok: false, error: toMessage(err) };
  }
}