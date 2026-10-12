import type { PdfToolDef } from "@/lib/pdf/registry";
import type { ReactNode } from "react";

type Props = {
  tool: PdfToolDef;
  children: ReactNode;
};

export default function PdfToolShell({ tool, children }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--gray-border)] bg-[var(--surface)] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {tool.title}
        </h1>
        {tool.mode === "stub" && (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Coming soon
          </span>
        )}
        {tool.mode === "client" && (
          <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand-dark)]">
            In-browser
          </span>
        )}
      </div>
      <p className="mb-6 text-[var(--gray-muted)]">{tool.description}</p>
      {children}
    </div>
  );
}
