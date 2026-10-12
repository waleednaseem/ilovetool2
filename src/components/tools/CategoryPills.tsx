"use client";

type Pill = { id: string; label: string };

type Props = {
  pills: Pill[];
  active: string;
  onChange: (id: string) => void;
};

export default function CategoryPills({ pills, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((p) => {
        const isActive = p.id === active;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-[var(--brand)] text-white shadow-sm"
                : "border border-[var(--gray-border)] bg-white text-gray-700 hover:border-[var(--brand)]/40"
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
