"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { STYLE_PRESETS, type GenerateInput, type StylePreset } from "@/types";

interface PromptPanelProps {
  isLoading: boolean;
  onSubmit: (input: GenerateInput) => void;
}

const EXAMPLE = "Create a modern dark-mode pricing card with badges";

export function PromptPanel({ isLoading, onSubmit }: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<StylePreset>("minimal");
const [darkMode, setDarkMode] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   onSubmit({ prompt, style, darkMode });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
      <label htmlFor="prompt" className="text-sm font-medium text-zinc-200">
        Describe your component
      </label>

      <Textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={EXAMPLE}
        rows={7}
        maxLength={1000}
        disabled={isLoading}
        className="resize-none border-zinc-800 bg-zinc-900 text-zinc-100"
      />

      <div className="flex justify-between text-xs text-zinc-500">
        <button type="button" className="underline" onClick={() => setPrompt(EXAMPLE)}>
          Use example
        </button>
        <span>{prompt.length}/1000</span>
      </div>
<fieldset className="space-y-2">
  <legend className="text-sm font-medium text-zinc-200">Style</legend>
  <div className="flex flex-wrap gap-2">
    {STYLE_PRESETS.map((s) => (
      <button
        key={s}
        type="button"
        aria-pressed={style === s}
        onClick={() => setStyle(s)}
        className={`rounded-full border px-3 py-1 text-xs capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
          style === s
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
        }`}
      >
        {s}
      </button>
    ))}
  </div>
</fieldset>

<label className="flex items-center gap-2 text-sm text-zinc-300">
  <input
    type="checkbox"
    checked={darkMode}
    onChange={(e) => setDarkMode(e.target.checked)}
    className="h-4 w-4 accent-emerald-500"
  />
  Dark-mode component
</label>
      <Button type="submit" disabled={isLoading || prompt.trim().length < 10}>
        <Sparkles className="mr-2 h-4 w-4" aria-hidden />
        Generate Component
      </Button>
    </form>
  );
}