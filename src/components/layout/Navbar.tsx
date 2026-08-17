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

        <button
          onClick={() => scrollToSection("partenaires")}
          className="px-5 py-2.5 rounded-full bg-teal text-void font-semibold text-sm hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal/20 cursor-pointer"
        >
          Devenir partenaire
        </button>
      </nav>
    </header>
  );
}
