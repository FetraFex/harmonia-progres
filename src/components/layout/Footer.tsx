import React from "react";
import { PrismLogo } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="border-t border-glass-border bg-void-2/60 relative z-10 pt-16 pb-12 px-4">
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column (Spans 2 on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3 inline-flex">
              <PrismLogo className="w-7 h-7" />
              <span className="font-display font-semibold text-xl tracking-tight text-text-primary">
                Fondation Lucide
              </span>
            </a>
            <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
              Organisation non gouvernementale dédiée à l&apos;accès à l&apos;eau potable, à
              la résilience climatique et à l&apos;éducation avec une transparence financière
              et géographique intégrale.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#mission" className="hover:text-teal transition-colors">
                  Mission
                </a>
              </li>
              <li>
                <a href="#actions" className="hover:text-teal transition-colors">
                  Actions
                </a>
              </li>
              <li>
                <a href="#presence" className="hover:text-teal transition-colors">
                  Impact
                </a>
              </li>
              <li>
                <a href="#newsletter" className="hover:text-teal transition-colors">
                  Actualités
                </a>
              </li>
            </ul>
          </div>

          {/* Ressources Column */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
              Ressources
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#" className="hover:text-teal transition-colors">
                  Rapports annuels
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors">
                  Espace Presse
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors">
                  Carrières & Bénévolat
                </a>
              </li>
            </ul>
          </div>

          {/* Légal Column */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
              Légal
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#" className="hover:text-teal transition-colors">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors">
                  Gestion des cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            © 2026 Fondation Lucide. Tous droits réservés.
          </div>
          {/* Text-only social links per brief */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-teal transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-teal transition-colors">
              X (Twitter)
            </a>
            <a href="#" className="hover:text-teal transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-teal transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
