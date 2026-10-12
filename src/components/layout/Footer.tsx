import Link from "next/link";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/tools/pdf", label: "PDF Tools" },
      { href: "/tools/image", label: "Image Tools" },
      { href: "/tools/text", label: "Text Tools" },
      { href: "/convert", label: "Converters" },
    ],
  },
  {
    title: "More",
    links: [
      { href: "/tools/zip", label: "ZIP Tools" },
      { href: "/tools/other", label: "Other Tools" },
      { href: "/tools/other/qr", label: "QR Code" },
      { href: "/tools/other/password", label: "Password Gen" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--gray-border)] bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-gray-900">
            Convert<span className="text-[var(--brand)]">PDF</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--gray-muted)]">
            Free browser tools for PDFs, images, text, ZIP, and everyday utilities.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold text-gray-900">{col.title}</p>
            <ul className="space-y-2 text-sm text-[var(--gray-muted)]">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[var(--brand)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--gray-border)] px-4 py-4 text-center text-xs text-[var(--gray-muted)]">
        © 2026 ConvertPDF. All tools run in your browser when possible.
      </div>
    </footer>
  );
}
