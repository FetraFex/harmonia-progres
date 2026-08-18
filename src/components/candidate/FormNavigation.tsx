"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FormNavigationProps {
  onBack?: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
}

export function FormNavigation({
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
  loading = false,
}: FormNavigationProps) {
  const t = useTranslations("candidate");
  const continueLabel = nextLabel || t("continue");

  return (
    <div className="flex justify-between items-center mt-10 pt-6 border-t border-glass-border">
      {onBack ? (
        <Link
          href={onBack}
          className="flex items-center gap-2 rounded-xl glass px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-glass-bg-strong"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </Link>
      ) : (
        <div />
      )}

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled || loading}
          className="flex items-center gap-2 rounded-xl bg-teal px-6 py-2.5 font-['Space_Grotesk'] font-bold text-sm text-on-void transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? t("sending") : continueLabel}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
