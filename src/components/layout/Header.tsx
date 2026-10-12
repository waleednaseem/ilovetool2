"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  sub?: string;
  children?: { label: string; href: string }[];
};

const nav: NavItem[] = [
  {
    label: "PDF",
    sub: "Tools",
    href: "/tools/pdf",
    children: [
      { label: "Merge PDF", href: "/tools/pdf/merge" },
      { label: "Split PDF", href: "/tools/pdf/split" },
      { label: "Compress PDF", href: "/tools/pdf/compress" },
      { label: "Edit PDF", href: "/tools/pdf/edit" },
      { label: "Sign PDF", href: "/tools/pdf/sign" },
      { label: "PDF to JPG", href: "/tools/pdf/pdf-to-jpg" },
      { label: "JPG to PDF", href: "/tools/pdf/jpg-to-pdf" },
      { label: "All PDF tools", href: "/tools/pdf" },
    ],
  },
  {
    label: "Image",
    sub: "Tools",
    href: "/tools/image",
    children: [
      { label: "Compress Image", href: "/tools/image/compress" },
      { label: "Resize Image", href: "/tools/image/resize" },
      { label: "Convert to JPG", href: "/tools/image/to-jpg" },
      { label: "Convert to PNG", href: "/tools/image/to-png" },
      { label: "All image tools", href: "/tools/image" },
    ],
  },
  {
    label: "Text",
    sub: "Tools",
    href: "/tools/text",
    children: [
      { label: "Text Transform", href: "/tools/text/transform" },
      { label: "Base64", href: "/tools/text/base64" },
      { label: "Lorem Ipsum", href: "/tools/text/lorem" },
    ],
  },
  {
    label: "ZIP",
    sub: "Tools",
    href: "/tools/zip",
    children: [
      { label: "ZIP Creator", href: "/tools/zip/create" },
      { label: "ZIP Extractor", href: "/tools/zip/extract" },
    ],
  },
  {
    label: "Other",
    sub: "Tools",
    href: "/tools/other",
    children: [
      { label: "QR Code", href: "/tools/other/qr" },
      { label: "Password Gen", href: "/tools/other/password" },
      { label: "Barcode", href: "/tools/other/barcode" },
      { label: "Color Extractor", href: "/tools/other/color-extractor" },
    ],
  },
  { label: "Converters", href: "/convert" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gray-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="mx-auto flex h-[var(--header-height)] max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-lg font-extrabold text-white shadow-[var(--glow-primary)]">
            C
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight">
            <span className="text-[var(--brand)]">Convert</span>
            <span className="text-[var(--foreground)]">PDF</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {nav.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setHover(item.label)}
              onMouseLeave={() => setHover(null)}
            >
              <Link
                href={item.href}
                className="flex flex-col rounded-xl px-3 py-2 text-[var(--text-secondary)] transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
              >
                <span className="text-sm font-bold leading-tight">{item.label}</span>
                {item.sub && (
                  <span className="text-[11px] font-medium leading-tight opacity-70">
                    {item.sub}
                  </span>
                )}
              </Link>
              {item.children && hover === item.label && (
                <div className="absolute left-0 top-full z-50 min-w-[220px] rounded-2xl border border-[var(--gray-border)] bg-white p-2 shadow-[var(--shadow-lg)]">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/tools/pdf"
            className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex"
          >
            Explore Tools
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--gray-border)] md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-lg">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--gray-border)] bg-white px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {nav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  {item.sub ? ` ${item.sub}` : ""}
                </Link>
                {item.children?.slice(0, 4).map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block rounded-lg px-5 py-1.5 text-sm text-[var(--gray-muted)]"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
