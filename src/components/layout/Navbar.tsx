"use client";

import React from "react";
import { PrismLogo } from "@/components/ui/Icons";

export function Navbar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-[18px] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-36px)] max-w-[1080px]">
      <nav className="glass px-5 py-3.5 flex items-center justify-between shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-teal rounded-lg"
        >
          <PrismLogo className="w-7 h-7 transition-transform group-hover:scale-110 duration-300" />
          <span className="font-display font-semibold text-lg tracking-tight text-text-primary">
            Lucide
          </span>
        </a>

        {/* Links (Hidden below 768px) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <button
            onClick={() => scrollToSection("mission")}
            className="hover:text-teal transition-colors cursor-pointer"
          >
            Mission
          </button>
          <button
            onClick={() => scrollToSection("actions")}
            className="hover:text-teal transition-colors cursor-pointer"
          >
            Actions
          </button>
          <button
            onClick={() => scrollToSection("presence")}
            className="hover:text-teal transition-colors cursor-pointer"
          >
            Impact
          </button>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="hover:text-teal transition-colors cursor-pointer"
          >
            Actualités
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollToSection("donate")}
          className="px-5 py-2.5 rounded-full bg-teal text-void font-semibold text-sm hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal/20 cursor-pointer"
        >
          Faire un don
        </button>
      </nav>
    </header>
  );
}
