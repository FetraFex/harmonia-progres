"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { number: "01", label: "Informations", href: "/candidater/informations" },
  { number: "02", label: "Profil", href: "/candidater/profil" },
  { number: "03", label: "Projet", href: "/candidater/projet" },
  { number: "04", label: "Motivation", href: "/candidater/motivation" },
  { number: "05", label: "Documents", href: "/candidater/documents" },
  { number: "06", label: "Vérification", href: "/candidater/verification" },
];

export function CandidateHeader() {
  const pathname = usePathname();

  const currentIdx = steps.findIndex((s) => pathname.startsWith(s.href));
  const isFormStep = currentIdx >= 0;

  return (
    <header className="border-b border-[var(--border)] bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight">
            <span className="text-[var(--black)]">H</span>
            <span className="text-[var(--lime)]">ARMONIA</span>
          </span>
        </Link>

        {isFormStep && (
          <div className="hidden md:flex items-center gap-1">
            {steps.map((step, i) => {
              const isActive = i === currentIdx;
              const isDone = i < currentIdx;
              return (
                <Link
                  key={step.href}
                  href={step.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    isActive
                      ? "bg-[var(--lime)] text-[var(--black)]"
                      : isDone
                        ? "bg-[var(--black)] text-white"
                        : "text-[var(--text-muted)] hover:bg-gray-100"
                  }`}
                >
                  <span className="font-['JetBrains_Mono']">{step.number}</span>
                  <span className="hidden lg:inline">{step.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <Link
          href="/candidater/suivi"
          className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--black)] transition"
        >
          Suivi
        </Link>
      </div>
    </header>
  );
}
