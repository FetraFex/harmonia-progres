"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function NewsletterFooter() {
  const t = useTranslations("footer");
  const footerColumns = t.raw("columns") as {
    title: string;
    links: { label: string; href: string }[];
  }[];

  return (
    <>
      {/* Footer */}
      <footer className="border-t border-glass-border bg-void-2 relative z-10 pt-16 pb-12 px-32">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/images/logo/logo-transparent-dark.png"
                  alt="Harmonia Progrès"
                  width={160}
                  height={44}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                {t("description")}
              </p>
            </div>

            {/* Columns */}
            {footerColumns.map((col) => (
              <div key={col.title} className="space-y-3">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
                  {col.title}
                </h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="hover:text-teal transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-glass-border text-xs text-text-muted">
            {t("copyright")}
          </div>
        </div>
      </footer>
    </>
  );
}
