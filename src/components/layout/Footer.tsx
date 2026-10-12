import Link from "next/link";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/tools/pdf", label: "PDF Tools" },
      { href: "/tools/image", label: "Image Tools" },
      { href: "/tools/text", label: "Text Tools" },
      { href: "/tools/zip", label: "ZIP Tools" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/tools/other", label: "Other Tools" },
      { href: "/convert", label: "Converters" },
      { href: "/tools/other/qr", label: "QR Code" },
      { href: "/tools/pdf/sign", label: "Sign PDF" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "Home" },
      { href: "/tools/pdf", label: "Free Tools" },
      { href: "/convert", label: "Unit Converters" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--gray-border)] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-xl font-extrabold">
            <span className="text-[var(--brand)]">Convert</span>PDF
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--gray-muted)]">
            Every tool you need, at your fingertips. 100% FREE and easy to use —
            PDF, image, text, ZIP & more.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="font-heading mb-4 text-sm font-bold text-[var(--foreground)]">
              {col.title}
            </p>
            <ul className="space-y-2.5 text-sm text-[var(--gray-muted)]">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition hover:text-[var(--brand)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--gray-border)] px-4 py-4 text-center text-xs text-[var(--gray-muted)]">
        © 2026 ConvertPDF. All rights reserved.
      </div>
    </footer>
  );
}
