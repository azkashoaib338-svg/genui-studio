"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CodeView({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <Button size="sm" variant="secondary" onClick={copy} className="absolute right-3 top-3">
        {copied ? (
          <Check className="mr-1 h-3 w-3" aria-hidden />
        ) : (
          <Copy className="mr-1 h-3 w-3" aria-hidden />
        )}
        {copied ? "Copied" : "Copy"}
      </Button>
      <pre className="max-h-[70vh] overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}