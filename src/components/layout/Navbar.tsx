"use client";

import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Projet", href: "#opportunite" },
  { label: "Secteurs", href: "#secteurs" },
  { label: "Programme", href: "#programme" },
  { label: "Territoire", href: "#territoire" },
  { label: "À propos", href: "#vision" },
];

export function Navbar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-[18px] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-7xl">
      <nav className="py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-teal rounded-lg shrink-0"
        >
          <Image
            src="/images/logo/logo-transparent-dark.png"
            alt="Harmonia Progrès"
            width={160}
            height={44}
            priority
            className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href.replace("#", ""))}
              className="hover:text-teal transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-5 py-2.5 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
            Rejoindre le programme
          </Link>
          <Link
            href="/candidater"
            className="px-5 py-2.5 rounded-full bg-teal text-on-void font-semibold text-sm hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Candidater
          </Link>
        </div>
      </nav>
    </header>
  );
}
