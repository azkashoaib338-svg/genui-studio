"use server";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";

import { GENERATE_SYSTEM_PROMPT, buildGeneratePrompt } from "@/lib/prompts";
import { generateInputSchema, generatedComponentSchema } from "@/lib/schemas";
import type { ActionResult, GenerateInput, GeneratedComponent } from "@/types";

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