import { FX_TO_PKR } from "@/lib/converters/rates";

const DISPLAY = ["USD", "EUR", "GBP", "AED", "SAR"] as const;

export default function RatesStrip() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand)] text-white">
      <div className="flex min-w-max items-center gap-6 px-4 py-3 text-sm">
        <span className="font-semibold tracking-wide">Today&apos;s PKR rates</span>
        {DISPLAY.map((code) => (
          <span key={code} className="whitespace-nowrap">
            <span className="text-white/70">1 {code}</span>{" "}
            <span className="font-medium">= {FX_TO_PKR[code].toFixed(2)} PKR</span>
          </span>
        ))}
        <span className="text-xs text-white/60">Static rates · live API later</span>
      </div>
    </div>
  );
}
