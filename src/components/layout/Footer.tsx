import React from "react";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-glass-border bg-void-2/60 relative z-10 pt-16 pb-12 px-4">
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* 5 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 inline-flex">
              <Logo
                width={160}
                height={44}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
              Organisation non gouvernementale dédiée au développement économique
              et à l&apos;accompagnement des jeunes entrepreneurs, artisans et
              pêcheurs à Manakara, Madagascar.
            </p>
          </div>

          {/* PROJET Column */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
              Projet
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#jeunes-entrepreneurs" className="hover:text-teal transition-colors">
                  Jeunes Entrepreneurs
                </a>
              </li>
              <li>
                <a href="#a-propos" className="hover:text-teal transition-colors">
                  Notre mission
                </a>
              </li>
              <li>
                <a href="#programme" className="hover:text-teal transition-colors">
                  Programme
                </a>
              </li>
              <li>
                <a href="#secteurs" className="hover:text-teal transition-colors">
                  Nos secteurs
                </a>
              </li>
            </ul>
          </div>

          {/* TERRITOIRE Column */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
              Territoire
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#territoire" className="hover:text-teal transition-colors">
                  Manakara
                </a>
              </li>
              <li>
                <a href="#territoire" className="hover:text-teal transition-colors">
                  Vohipeno
                </a>
              </li>
              <li>
                <a href="#territoire" className="hover:text-teal transition-colors">
                  Fitovinany
                </a>
              </li>
            </ul>
          </div>

          {/* PARTICIPER Column */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
              Participer
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#programme" className="hover:text-teal transition-colors">
                  Candidater
                </a>
              </li>
              <li>
                <a href="#partenaires" className="hover:text-teal transition-colors">
                  Devenir partenaire
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-teal transition-colors">
                  Nous contacter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            © 2026 HARMONIA PROGRES — MIASA Jeunes Entrepreneurs
          </div>
        </div>
      </div>
    </footer>
  );
}
