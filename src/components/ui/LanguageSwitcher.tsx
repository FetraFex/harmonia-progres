"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "mg", label: "MG" },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  function handleChange(next: string) {
    if (next === locale) return;
    const query = typeof window !== "undefined" ? window.location.search : "";
    router.replace(query ? `${pathname}${query}` : pathname, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("languageSwitcher")}
      className={cn("flex items-center gap-1 rounded-full glass p-1", className)}
    >
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => handleChange(l.code)}
          aria-pressed={locale === l.code}
          title={t(`languages.${l.code}`)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer",
            locale === l.code
              ? "bg-green text-on-void"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
