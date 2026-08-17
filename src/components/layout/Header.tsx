"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/utils/cn";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Harmonia</span>
          <span className="text-2xl font-light text-accent">Progres</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {NAV_LINKS.slice(0, 8).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary"
                  : "text-text-secondary hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <ButtonLink href="/contact" variant="outline" size="sm">
            Contact
          </ButtonLink>
          <ButtonLink href="/donate" variant="accent" size="sm">
            Donate
          </ButtonLink>
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-text hover:bg-primary/10"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-4 py-4">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-primary/5"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex space-x-2 pt-2">
              <ButtonLink href="/contact" variant="outline" size="sm" className="flex-1">
                Contact
              </ButtonLink>
              <ButtonLink href="/donate" variant="accent" size="sm" className="flex-1">
                Donate
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
