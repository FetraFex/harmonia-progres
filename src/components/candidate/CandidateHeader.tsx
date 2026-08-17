"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Check, Eye } from "lucide-react";

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
    <header className="border-b border-glass-border bg-void/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo-transparent-dark.png"
            alt="Harmonia Progrès"
            width={140}
            height={36}
            className="h-7 w-auto object-contain"
          />
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? "bg-teal text-void"
                      : isDone
                        ? "bg-teal/20 text-teal"
                        : "text-text-muted hover:bg-glass-bg"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="font-['JetBrains_Mono'] text-[10px]">{step.number}</span>
                  )}
                  <span className="hidden lg:inline">{step.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <Link
          href="/candidater/suivi"
          className="rounded-xl bg-teal/10 border border-teal/30 px-3.5 py-1.5 text-xs font-semibold text-teal hover:bg-teal hover:text-void transition flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Suivi</span>
        </Link>
      </div>
    </header>
  );
}
