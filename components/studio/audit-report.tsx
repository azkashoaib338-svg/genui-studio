import { CheckCircle2, Loader2 } from "lucide-react";

import type { A11ySeverity, A11yReport } from "@/types";

const SEVERITY_STYLES: Record<A11ySeverity, string> = {
  critical: "bg-red-500/15 text-red-300",
  serious: "bg-orange-500/15 text-orange-300",
  moderate: "bg-yellow-500/15 text-yellow-300",
  minor: "bg-zinc-500/15 text-zinc-300",
};

function scoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
}

interface AuditReportProps {
  report: A11yReport | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function AuditReport({ report, isLoading, error, onRetry }: AuditReportProps) {
  if (isLoading) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-zinc-400">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Auditing accessibility…
      </p>
    );
  }

  if (error) {
    return (
      <div role="alert" className="space-y-2 text-sm text-red-300">
        <p>{error}</p>
        <button onClick={onRetry} className="underline">
          Retry audit
        </button>
      </div>
    );
  }

  if (!report) {
    return <p className="text-sm text-zinc-500">Generate a component to see its audit.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <p className={`text-5xl font-semibold tabular-nums ${scoreColor(report.score)}`}>
          {report.score}
          <span className="text-lg text-zinc-500">/100</span>
        </p>
        <p className="text-sm text-zinc-300">{report.summary}</p>
      </div>

      <section aria-labelledby="issues-h">
        <h3 id="issues-h" className="mb-2 text-sm font-medium text-zinc-200">
          Issues ({report.issues.length})
        </h3>
        <ul className="space-y-2">
          {report.issues.map((issue, i) => (
            <li key={i} className="rounded-lg border border-zinc-800 p-3 text-sm">
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs capitalize ${SEVERITY_STYLES[issue.severity]}`}>
                  {issue.severity}
                </span>
                <span className="text-xs uppercase text-zinc-500">{issue.category}</span>
              </div>
              <p className="text-zinc-200">{issue.message}</p>
              <p className="mt-1 text-zinc-400">Fix: {issue.suggestion}</p>
            </li>
          ))}
        </ul>
      </section>

      {report.passed.length > 0 && (
        <section aria-labelledby="passed-h">
          <h3 id="passed-h" className="mb-2 text-sm font-medium text-zinc-200">
            Passed
          </h3>
          <ul className="space-y-1 text-sm text-zinc-400">
            {report.passed.map((p) => (
              <li key={p} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}