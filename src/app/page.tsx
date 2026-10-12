import HomeCatalog from "@/components/home/HomeCatalog";
import RatesStrip from "@/components/home/RatesStrip";
import Link from "next/link";

const pillars = [
  { title: "Fast", body: "Quick results in your browser" },
  { title: "Secure", body: "Files stay on your device" },
  { title: "Free", body: "Everyday tools, no paywall" },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-[var(--gray-border)] bg-white/70">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--brand-light)] opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[var(--brand-soft)] opacity-90 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
            ConvertPDF
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Free online tools for everyday tasks
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--gray-muted)] sm:text-lg">
            PDF, image, text, ZIP, and utility tools — fast, simple, and private in
            your browser.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/tools/pdf"
              className="rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-dark)]"
            >
              Explore tools
            </Link>
            <Link
              href="/convert"
              className="rounded-full border border-[var(--gray-border)] bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:border-[var(--brand)]"
            >
              Converters
            </Link>
          </div>
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3 text-left sm:gap-4">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-[var(--gray-border)] bg-white/90 px-3 py-3 shadow-sm"
              >
                <p className="text-sm font-bold text-[var(--brand-dark)]">{p.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-[var(--gray-muted)] sm:text-xs">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pt-8">
        <RatesStrip />
      </div>

      <HomeCatalog />
    </main>
  );
}
