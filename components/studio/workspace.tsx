"use client";

import { useState } from "react";

import { generateComponent } from "@/app/actions/generate";
import { PromptPanel } from "@/components/studio/prompt-panel";
import type { GenerateInput, GeneratedComponent } from "@/types";
import { CodeView } from "@/components/studio/code-view";
import { PreviewFrame } from "@/components/studio/preview-frame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Workspace() {
  const [component, setComponent] = useState<GeneratedComponent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(true);

  const handleGenerate = async (input: GenerateInput) => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await generateComponent(input);

      if (res.ok) {
        setComponent(res.data);
        setDark(input.darkMode);
      } else {
        setError(res.error);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-zinc-950 text-zinc-100 lg:grid-cols-[380px_1fr]">
      <aside className="border-b border-zinc-800 lg:border-b-0 lg:border-r">
        <header className="border-b border-zinc-800 px-6 py-4">
          <h1 className="text-lg font-semibold">GenUI Studio</h1>
          <p className="text-xs text-zinc-500">AI component generator & a11y auditor</p>
        </header>
        <PromptPanel isLoading={isGenerating} onSubmit={handleGenerate} />
      </aside>

      <main className="p-6">
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {isGenerating ? (
          <div role="status" className="grid h-[60vh] place-items-center text-sm text-zinc-500">
            Generating your component…
          </div>
        ) : component ? (
          <div>
            <h2 className="text-base font-medium">{component.title}</h2>
            <p className="mb-4 text-sm text-zinc-400">{component.description}</p>
           <Tabs defaultValue="preview">
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
  </TabsList>
  <TabsContent value="preview" className="mt-4">
    <PreviewFrame code={component.code} dark={dark} />
  </TabsContent>
  <TabsContent value="code" className="mt-4">
    <CodeView code={component.code} />
  </TabsContent>
</Tabs>
          </div>
        ) : (
          <div className="grid h-[60vh] place-items-center text-sm text-zinc-500">
            Your component will appear here.
          </div>
        )}
      </main>
    </div>
  );
}