"use client";

import React from "react";
import Link from "next/link";

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
  nextLabel = "Continuer",
  nextDisabled = false,
  loading = false,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-10 pt-6 border-t border-[var(--border)]">
      {onBack ? (
        <Link
          href={onBack}
          className="rounded-xl border border-[var(--border)] px-6 py-3 font-medium text-[var(--black)] transition hover:bg-gray-50"
        >
          Précédent
        </Link>
      ) : (
        <div />
      )}

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled || loading}
          className="rounded-xl bg-[var(--lime)] px-8 py-3 font-['Space_Grotesk'] font-bold text-[var(--black)] transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi..." : nextLabel}
        </button>
      )}
    </div>
  );
}
