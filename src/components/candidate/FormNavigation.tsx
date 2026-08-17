"use client";

import React from "react";
import Link from "next/link";
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
  nextLabel = "Continuer",
  nextDisabled = false,
  loading = false,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between items-center mt-10 pt-6 border-t border-[var(--border)]">
      {onBack ? (
        <Link
          href={onBack}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--black)] transition hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      ) : (
        <div />
      )}

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled || loading}
          className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-6 py-2.5 font-['Space_Grotesk'] font-bold text-sm text-[var(--black)] transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi..." : nextLabel}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
