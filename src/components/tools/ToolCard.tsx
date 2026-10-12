import type { ToolFamily } from "@/lib/tools/types";
import Link from "next/link";

type ToolCardProps = {
  href: string;
  title: string;
  description: string;
  badge?: string;
  icon?: string;
  family?: ToolFamily;
};

const iconClass: Record<ToolFamily, string> = {
  pdf: "tool-card-icon-pdf",
  image: "tool-card-icon-image",
  text: "tool-card-icon-text",
  zip: "tool-card-icon-zip",
  other: "tool-card-icon-other",
  convert: "tool-card-icon-convert",
};

export default function ToolCard({
  href,
  title,
  description,
  badge,
  icon = "PDF",
  family = "pdf",
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-[var(--gray-border)] bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[var(--brand)]/35 hover:shadow-[0_12px_28px_rgba(5,150,105,0.12)]"
    >
      <div
        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-xs font-bold tracking-wide ${iconClass[family]}`}
      >
        {icon.slice(0, 3).toUpperCase()}
      </div>
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-[var(--brand-dark)]">
          {title}
        </h3>
        {badge && (
          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-[var(--gray-muted)]">
        {description}
      </p>
    </Link>
  );
}
