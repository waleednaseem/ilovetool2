import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import { converters } from "@/lib/converters";

export const metadata: Metadata = {
  title: "Unit Converters",
  description:
    "Free unit converters: length, area, fabric, currency, weight, and temperature.",
};

const categories = [
  { id: "length", label: "Length / distance" },
  { id: "area", label: "House / area" },
  { id: "fabric", label: "Clothes / fabric" },
  { id: "currency", label: "Currency" },
  { id: "weight", label: "Weight" },
  { id: "temperature", label: "Temperature" },
] as const;

export default function ConvertIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Unit converters</h1>
      <p className="mb-8 text-zinc-600">
        Instant client-side conversions. No signup required.
      </p>
      <div className="space-y-10">
        {categories.map((cat) => {
          const items = converters.filter((c) => c.category === cat.id);
          if (!items.length) return null;
          return (
            <section key={cat.id}>
              <h2 className="mb-4 text-xl font-semibold">{cat.label}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <ToolCard
                    key={c.slug}
                    href={`/convert/${c.slug}`}
                    title={c.title}
                    description={c.description}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
