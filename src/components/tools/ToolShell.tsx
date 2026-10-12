import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
};

export default function ToolShell({
  title,
  description,
  badge = "In-browser",
  children,
}: Props) {
  return (
    <div className="rounded-2xl border border-[var(--gray-border)] bg-[var(--surface)] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand-dark)]">
          {badge}
        </span>
      </div>
      <p className="mb-6 text-[var(--gray-muted)]">{description}</p>
      {children}
    </div>
  );
}
