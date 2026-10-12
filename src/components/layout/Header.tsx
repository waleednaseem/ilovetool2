import Link from "next/link";

const links = [
  { href: "/tools/pdf", label: "PDF" },
  { href: "/tools/image", label: "Image" },
  { href: "/tools/text", label: "Text" },
  { href: "/tools/zip", label: "ZIP" },
  { href: "/tools/other", label: "Other" },
  { href: "/convert", label: "Converters" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--gray-border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          Convert<span className="text-[var(--brand)]">PDF</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-medium text-gray-600 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-1.5 transition-colors hover:bg-[var(--brand-soft)] hover:text-[var(--brand-dark)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/tools/pdf"
          className="rounded-full bg-[var(--brand)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--brand-dark)] md:hidden"
        >
          Tools
        </Link>
      </div>
    </header>
  );
}
