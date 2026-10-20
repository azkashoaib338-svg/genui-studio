"use client";


import { useMemo, useState } from "react";
const VIEWPORTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
} as const;

type Viewport = keyof typeof VIEWPORTS;
// Generated code is UNTRUSTED, so it runs inside a sandboxed iframe.
function buildSrcDoc(code: string, dark: boolean): string {
  const cleaned = code
    .replace(/^\s*import .*$/gm, "")
    .replace(/export default function/g, "function")
    .replace(/^\s*export default \w+;?\s*$/gm, "")
    .replace(/^\s*export /gm, "");

  const source = JSON.stringify(cleaned).replace(/</g, "\\u003c");

  return `<!doctype html>
<html class="${dark ? "dark" : ""}">
<head>
<meta charset="utf-8" />
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:${dark ? "#09090b" : "#fff"}}</style>
</head>
<body>
<div id="root"></div>
<script>
try {
  const out = Babel.transform(${source}, { presets: ["typescript", "react"], filename: "c.tsx" }).code;
  const fn = new Function("React", out + "\\n;return GeneratedComponent;");
  const C = fn(React);
  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(C));
} catch (e) {
  document.getElementById("root").innerHTML =
    '<pre style="color:#f87171;font:12px monospace;white-space:pre-wrap"></pre>';
  document.querySelector("pre").textContent = "Preview error: " + e.message;
}
</script>
</body>
</html>`;
}

export function PreviewFrame({ code, dark }: { code: string; dark: boolean }) {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const srcDoc = useMemo(() => buildSrcDoc(code, dark), [code, dark]);

  return (
    <div className="space-y-3">
      <div role="group" aria-label="Preview size" className="flex gap-2">
        {(Object.keys(VIEWPORTS) as Viewport[]).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={viewport === v}
            onClick={() => setViewport(v)}
            className={`rounded-md border px-3 py-1 text-xs capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
              viewport === v
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {v} · {VIEWPORTS[v]}px
          </button>
        ))}
      </div>

      <iframe
        title="Component preview"
        sandbox="allow-scripts"
        srcDoc={srcDoc}
        style={{ width: VIEWPORTS[viewport] }}
        className="mx-auto block h-[480px] max-w-full rounded-lg border border-zinc-800 bg-zinc-950"
      />
    </div>
  );
}