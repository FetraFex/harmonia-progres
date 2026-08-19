"use client";

import { Logo } from "@/components/ui/Logo";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Check, Eye, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function CandidateHeader() {
  const t = useTranslations("candidate");
  const pathname = usePathname();
  const steps = t.raw("steps") as {
    number: string;
    label: string;
    href: string;
  }[];
  const currentIdx = steps.findIndex((s) => pathname.startsWith(s.href));
  const isFormStep = currentIdx >= 0;

  return (
    <header className="border-b border-glass-border bg-void/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
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
                      ? "bg-green text-on-void"
                      : isDone
                        ? "bg-green/20 text-teal"
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

        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="rounded-xl glass px-3.5 py-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition flex items-center gap-1.5 border border-glass-border"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mon espace</span>
          </Link>
          <Link
            href="/candidater/suivi"
            className="rounded-xl bg-green/10 border border-teal/30 px-3.5 py-1.5 text-xs font-semibold text-teal hover:bg-green hover:text-on-void transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t("track")}</span>
          </Link>
        </div>

        <LanguageSwitcher className="hidden sm:inline-flex" />
        <ThemeToggle className="h-9 w-9 p-2 rounded-full glass" />
      </div>
    </header>
  );
}
