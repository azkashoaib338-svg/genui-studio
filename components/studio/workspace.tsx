export function Workspace() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-zinc-950 text-zinc-100 lg:grid-cols-[380px_1fr]">
      <aside className="border-b border-zinc-800 lg:border-b-0 lg:border-r">
        <header className="border-b border-zinc-800 px-6 py-4">
          <h1 className="text-lg font-semibold">GenUI Studio</h1>
          <p className="text-xs text-zinc-500">AI component generator & a11y auditor</p>
        </header>
        <div className="p-6 text-sm text-zinc-400">Prompt panel goes here</div>
      </aside>

      <main className="p-6">
        <div className="grid h-[60vh] place-items-center text-sm text-zinc-500">
          Your component will appear here.
        </div>
      </main>
    </div>
  );
}